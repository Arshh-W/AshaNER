# analytics.py
import sqlite3
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query

from auth import get_current_user
from database import DB_NAME
from schemas import (
    AdherenceResponse,
    SundowningHeatmapResponse,
    HeatmapCell,
    TrajectoryPoint,
    TrajectoryResponse,
    XAIClinicalCard,
)

router = APIRouter(prefix="/api/v1/analytics", tags=["Clinician & Caregiver Analytics"])


def get_current_user_id(current_user: dict = Depends(get_current_user)) -> int:
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (current_user["email"],))
    user = cursor.fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user[0]


def _verify_patient_access(patient_id: int, caregiver_id: int) -> str:
    """Verifies that the patient belongs to the logged-in caregiver and returns patient name."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT full_name FROM patients WHERE id = ? AND caregiver_id = ?",
        (patient_id, caregiver_id),
    )
    patient = cursor.fetchone()
    conn.close()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found or unauthorized")
    return patient[0]


# --- 1. Cognitive Drift, Pause & Vocal Shimmer Trajectories ---
@router.get("/patient/{patient_id}/trajectory", response_model=TrajectoryResponse)
def get_clinical_trajectories(
    patient_id: int,
    days: int = Query(7, enum=[7, 30]),
    caregiver_id: int = Depends(get_current_user_id),
):
    _verify_patient_access(patient_id, caregiver_id)

    cutoff_date = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT 
            DATE(recorded_at) as log_date,
            AVG(cognitive_drift_score) as avg_drift,
            AVG(speech_pause_duration_sec) as avg_pause,
            AVG(vocal_shimmer_percentage) as avg_shimmer
        FROM clinical_audio_logs
        WHERE patient_id = ? AND DATE(recorded_at) >= ?
        GROUP BY DATE(recorded_at)
        ORDER BY log_date ASC
        """,
        (patient_id, cutoff_date),
    )
    rows = cursor.fetchall()
    conn.close()

    trajectory = [
        TrajectoryPoint(
            date=row[0],
            cognitive_drift=round(row[1] or 0.0, 2),
            speech_pause_sec=round(row[2] or 0.0, 2),
            vocal_shimmer=round(row[3] or 0.0, 2),
        )
        for row in rows
    ]

    return TrajectoryResponse(
        patient_id=patient_id,
        timeframe_days=days,
        trajectory=trajectory,
    )


# --- 2. Sundowning Agitation Heatmap (Facial Valence & Arousal Aggregation) ---
@router.get("/patient/{patient_id}/sundowning-heatmap", response_model=SundowningHeatmapResponse)
def get_sundowning_heatmap(
    patient_id: int,
    caregiver_id: int = Depends(get_current_user_id),
):
    _verify_patient_access(patient_id, caregiver_id)

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT 
            hour_of_day,
            AVG(valence) as avg_val,
            AVG(arousal) as avg_arousal
        FROM facial_agitation_logs
        WHERE patient_id = ?
        GROUP BY hour_of_day
        ORDER BY hour_of_day ASC
        """,
        (patient_id,),
    )
    rows = cursor.fetchall()
    conn.close()

    # Pre-populate 24 hours (0-23) with defaults, then map real DB records
    hourly_dict = {
        h: {"valence": 0.0, "arousal": 0.0, "has_data": False} for h in range(24)
    }
    for row in rows:
        h, val, ar = row[0], row[1] or 0.0, row[2] or 0.0
        hourly_dict[h] = {"valence": val, "arousal": ar, "has_data": True}

    heatmap_cells = []
    for h in range(24):
        item = hourly_dict[h]
        val, ar = item["valence"], item["arousal"]

        # Sundowning Agitation Logic: High Arousal + Negative Valence
        if ar > 0.65 and val < -0.2:
            risk = "HIGH"
        elif ar > 0.45 or val < -0.1:
            risk = "MODERATE"
        else:
            risk = "LOW"

        heatmap_cells.append(
            HeatmapCell(
                hour=h,
                avg_valence=round(val, 2),
                avg_arousal=round(ar, 2),
                agitation_risk=risk,
            )
        )

    return SundowningHeatmapResponse(patient_id=patient_id, hourly_heatmap=heatmap_cells)


# --- 3. Daily Medication/Hydration Adherence & Game Completion Rates ---
@router.get("/patient/{patient_id}/adherence", response_model=AdherenceResponse)
def get_daily_adherence(
    patient_id: int,
    log_date: Optional[str] = None,
    caregiver_id: int = Depends(get_current_user_id),
):
    _verify_patient_access(patient_id, caregiver_id)

    target_date = log_date or datetime.now(timezone.utc).strftime("%Y-%m-%d")

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # 1. Medication & Hydration Adherence
    cursor.execute(
        "SELECT medication_taken, hydration_ml, target_hydration_ml FROM daily_adherence WHERE patient_id = ? AND log_date = ?",
        (patient_id, target_date),
    )
    adh_row = cursor.fetchone()

    # 2. Cognitive Game Completion (Target: 3 games/day)
    cursor.execute(
        "SELECT COUNT(id) FROM game_sessions WHERE patient_id = ? AND DATE(created_at) = ?",
        (patient_id, target_date),
    )
    games_count = cursor.fetchone()[0] or 0
    conn.close()

    med_pct = 100.0 if (adh_row and adh_row[0] == 1) else 0.0
    hyd_pct = (
        min(100.0, round((adh_row[1] / adh_row[2]) * 100.0, 1))
        if (adh_row and adh_row[2] > 0)
        else 0.0
    )
    game_pct = min(100.0, round((games_count / 3.0) * 100.0, 1))

    return AdherenceResponse(
        patient_id=patient_id,
        log_date=target_date,
        medication_adherence_percentage=med_pct,
        hydration_percentage=hyd_pct,
        game_completion_rate=game_pct,
    )


# --- 4. Explainable AI (XAI) Clinical Event Cards for ASHA Workers ---
@router.get("/patient/{patient_id}/xai-cards", response_model=List[XAIClinicalCard])
def get_xai_clinical_cards(
    patient_id: int,
    caregiver_id: int = Depends(get_current_user_id),
):
    patient_name = _verify_patient_access(patient_id, caregiver_id)
    cards: List[XAIClinicalCard] = []

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Dynamic Rule 1: High Evening Agitation (Sundowning Spike)
    cursor.execute(
        """
        SELECT AVG(valence), AVG(arousal) 
        FROM facial_agitation_logs 
        WHERE patient_id = ? AND hour_of_day BETWEEN 16 AND 20
        """,
        (patient_id,),
    )
    agitation_data = cursor.fetchone()
    if agitation_data and agitation_data[1] and agitation_data[1] > 0.6:
        cards.append(
            XAIClinicalCard(
                event_id=f"XAI-SND-{patient_id}",
                severity="WARNING",
                title="Evening Agitation Spike (Sundowning)",
                plain_language_summary=f"{patient_name} showed high physical restlessness and facial tension between 4:00 PM and 8:00 PM.",
                clinical_recommendation="Turn on bright warm lights by 4:30 PM, minimize background noise, and engage the patient in familiar regional music or a light walk.",
                detected_at=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
            )
        )

    # Dynamic Rule 2: Speech Pause Duration Drift
    cursor.execute(
        """
        SELECT speech_pause_duration_sec, cognitive_drift_score 
        FROM clinical_audio_logs 
        WHERE patient_id = ? 
        ORDER BY recorded_at DESC LIMIT 1
        """,
        (patient_id,),
    )
    audio_data = cursor.fetchone()
    if audio_data and audio_data[0] > 3.0:
        cards.append(
            XAIClinicalCard(
                event_id=f"XAI-AUD-{patient_id}",
                severity="INFO",
                title="Increased Speech Hesitation",
                plain_language_summary=f"{patient_name} paused for more than 3 seconds between words during recent voice activities.",
                clinical_recommendation="Allow extra time for responses during routine care. Do not interrupt or finish sentences prematurely.",
                detected_at=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
            )
        )

    # Dynamic Rule 3: Medication & Hydration Adherence Warning
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    cursor.execute(
        "SELECT medication_taken, hydration_ml FROM daily_adherence WHERE patient_id = ? AND log_date = ?",
        (patient_id, today),
    )
    adh_data = cursor.fetchone()
    if not adh_data or adh_data[0] == 0:
        cards.append(
            XAIClinicalCard(
                event_id=f"XAI-ADH-{patient_id}",
                severity="CRITICAL",
                title="Missed Daily Medication",
                plain_language_summary=f"No medication confirmation recorded for {patient_name} today.",
                clinical_recommendation="Conduct an immediate home visit or call the caregiver to verify prescription compliance.",
                detected_at=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
            )
        )

    conn.close()

    # Fallback informational card if no anomalies are flagged
    if not cards:
        cards.append(
            XAIClinicalCard(
                event_id=f"XAI-OK-{patient_id}",
                severity="INFO",
                title="Stable Behavioral Trajectory",
                plain_language_summary=f"All monitored cognitive, vocal, and daily routine metrics for {patient_name} remain within normal ranges.",
                clinical_recommendation="Continue current daily routine and game sessions as scheduled.",
                detected_at=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
            )
        )

    return cards