import json
import sqlite3
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from auth import hash_password, verify_password, create_access_token, get_current_user
from database import init_db, DB_NAME
from schemas import (
    UserRegister, PatientCreate, PatientResponse,
    SyncBatchRequest, SyncBatchResponse,
    DDAEngineRequest, DDAEngineResponse, GameTypeEnum,
    ReminderConfirmation, VoiceCheckInRequest,
)
from reminder_daemon import RoutineReminderDaemon
from voice_checkin import process_check_in

app = FastAPI(
    title="Dementia Care Platform API",
    version="1.0.0",
    description="Backend API for Cognitive Games, Offline Sync, DDA Engine, and Caregiver Analytics"
)

init_db()
reminder_daemon = RoutineReminderDaemon()
reminder_daemon.start()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_user_id(current_user: dict = Depends(get_current_user)) -> int:
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (current_user["email"],))
    user = cursor.fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user[0]

# Helper to ensure the requested patient actually belongs to the caller,
# so one caregiver can never read another caregiver's patient data.
def get_owned_patient(patient_id: int, caregiver_id: int, cursor) -> tuple:
    cursor.execute(
        "SELECT id, caregiver_id, full_name, age, region, preferred_language FROM patients WHERE id = ?",
        (patient_id,)
    )
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Patient not found")
    if row[1] != caregiver_id:
        raise HTTPException(status_code=403, detail="Not authorized for this patient")
    return row


def assert_owned_patient(patient_id: int, caregiver_id: int) -> tuple:
    conn = sqlite3.connect(DB_NAME)
    try:
        return get_owned_patient(patient_id, caregiver_id, conn.cursor())
    finally:
        conn.close()

# --- Auth Routes ---
@app.post("/api/v1/auth/register", tags=["Authentication"])
def register_user(user: UserRegister):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (user.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = hash_password(user.password)
    cursor.execute(
        "INSERT INTO users (email, hashed_password, role) VALUES (?, ?, ?)",
        (user.email, hashed_pwd, user.role)
    )
    conn.commit()
    conn.close()
    return {"message": "User created successfully"}

@app.post("/api/v1/auth/login", tags=["Authentication"])
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT hashed_password, role FROM users WHERE email = ?", (form_data.username,))
    row = cursor.fetchone()
    conn.close()

    if not row or not verify_password(form_data.password, row[0]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": form_data.username, "role": row[1]})
    return {"access_token": access_token, "token_type": "bearer"}

# --- Patient Management Routes ---
@app.post("/api/v1/patients", response_model=PatientResponse, status_code=status.HTTP_201_CREATED, tags=["Patients"])
def create_patient(
    patient: PatientCreate,
    caregiver_id: int = Depends(get_current_user_id)
):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute(
        """
        INSERT INTO patients (caregiver_id, full_name, age, region, preferred_language)
        VALUES (?, ?, ?, ?, ?)
        """,
        (caregiver_id, patient.full_name, patient.age, patient.region, patient.preferred_language)
    )
    conn.commit()
    patient_id = cursor.lastrowid
    
    cursor.execute("SELECT id, caregiver_id, full_name, age, region, preferred_language FROM patients WHERE id = ?", (patient_id,))
    row = cursor.fetchone()
    conn.close()

    return PatientResponse(
        id=row[0], caregiver_id=row[1], full_name=row[2],
        age=row[3], region=row[4], preferred_language=row[5]
    )

@app.get("/api/v1/patients/{patient_id}/reminders/due")
def get_due_reminders(
    patient_id: int,
    caregiver_id: int = Depends(get_current_user_id),
):
    assert_owned_patient(patient_id, caregiver_id)
    reminders = [
        reminder for reminder in reminder_daemon.due_reminders()
        if reminder.patient_id == patient_id
    ]
    return [
        {
            "id": reminder.reminder_id,
            "patient_id": reminder.patient_id,
            "title": reminder.title,
            "category": reminder.category,
            "scheduled_time": reminder.scheduled_time,
            "prompt": reminder.prompt,
            "locale": reminder.locale,
            "audio": reminder_daemon.prompt_player.resolve(reminder),
        }
        for reminder in reminders
    ]


@app.post("/api/v1/patients/{patient_id}/reminders/{reminder_id}/confirm")
def confirm_reminder(
    patient_id: int,
    reminder_id: int,
    confirmation: ReminderConfirmation,
    caregiver_id: int = Depends(get_current_user_id),
):
    assert_owned_patient(patient_id, caregiver_id)
    conn = sqlite3.connect(DB_NAME)
    reminder = conn.execute(
        "SELECT 1 FROM routines WHERE id = ? AND patient_id = ? AND active = 1",
        (reminder_id, patient_id),
    ).fetchone()
    conn.close()
    if not reminder:
        raise HTTPException(status_code=404, detail="Active reminder not found")
    tick_id = reminder_daemon.confirm(reminder_id, patient_id, confirmation.action)
    return {"status": "recorded", "tick_id": tick_id, "action": confirmation.action}


@app.post("/api/v1/patients/{patient_id}/voice/check-in")
def voice_check_in(
    patient_id: int,
    request: VoiceCheckInRequest,
    caregiver_id: int = Depends(get_current_user_id),
):
    assert_owned_patient(patient_id, caregiver_id)
    return process_check_in(
        request.transcript,
        patient_id=patient_id,
        locale=request.locale,
        audio_samples=request.audio_samples,
        sample_rate=request.sample_rate,
    )

# Get All Patients Managed by Caregiver
@app.get("/api/v1/patients", response_model=List[PatientResponse], tags=["Patients"])
def get_caregiver_patients(caregiver_id: int = Depends(get_current_user_id)):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, caregiver_id, full_name, age, region, preferred_language FROM patients WHERE caregiver_id = ?",
        (caregiver_id,)
    )
    rows = cursor.fetchall()
    conn.close()

    return [
        PatientResponse(
            id=row[0], caregiver_id=row[1], full_name=row[2],
            age=row[3], region=row[4], preferred_language=row[5]
        )
        for row in rows
    ]

# --- Offline Game Sync Route ---
@app.post("/api/v1/sync", response_model=SyncBatchResponse, tags=["Game Processing"])
def sync_offline_game_sessions(
    batch: SyncBatchRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    synced_ids = []

    for session in batch.sessions:
        # Idempotency check
        cursor.execute(
            "SELECT id FROM game_sessions WHERE local_session_id = ?",
            (session.local_session_id,)
        )
        if cursor.fetchone():
            synced_ids.append(session.local_session_id)
            continue

        # Insert session into SQLite
        cursor.execute(
            """
            INSERT INTO game_sessions 
            (local_session_id, patient_id, game_type, score, duration_seconds, total_errors, level_achieved, reaction_times_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                session.local_session_id,
                session.patient_id,
                session.game_type.value if hasattr(session.game_type, 'value') else session.game_type,
                session.score,
                session.duration_seconds,
                session.total_errors,
                session.level_achieved,
                json.dumps(session.reaction_times_ms),
                session.created_at_offline
            )
        )
        synced_ids.append(session.local_session_id)

    conn.commit()
    conn.close()

    return SyncBatchResponse(
        status="success",
        synced_count=len(synced_ids),
        synced_session_ids=synced_ids
    )

# --- Dynamic Difficulty Engine (DDA) Route ---
@app.post("/api/v1/ml/adapt", response_model=DDAEngineResponse, tags=["ML Engine"])
def adapt_game_difficulty(data: DDAEngineRequest):
    next_level = data.current_level
    expand_touch = False
    trigger_voice = False
    hint = None
    audio_key = None

    # Frustration Detection Rules (High latency or repeated errors)
    if data.consecutive_errors >= 2 or data.last_action_latency_ms > 4500.0 or data.is_stalled:
        expand_touch = True
        trigger_voice = True
        next_level = max(1, data.current_level - 1)

        # Context-aware prompts for the 5 games
        if data.game_type == GameTypeEnum.MEMORY_VILLAGE:
            hint = "Look for the familiar blue house near the garden."
            audio_key = "hint_village_blue_house"
        elif data.game_type == GameTypeEnum.MEMORY_DETECTIVE:
            hint = "Focus on the left table. An item seems missing."
            audio_key = "hint_detective_left_table"
        elif data.game_type == GameTypeEnum.ROUTINE_RESCUE:
            hint = "First, let's pour water into the kettle."
            audio_key = "hint_routine_kettle"
        elif data.game_type == GameTypeEnum.SOUND_OBJECT_MATCH:
            hint = "Tap the speaker to replay the rainfall sound."
            audio_key = "hint_sound_replay"
        elif data.game_type == GameTypeEnum.MEMORY_MOSAIC:
            hint = "Try placing the corner piece showing the sky."
            audio_key = "hint_mosaic_corner"

    elif data.consecutive_errors == 0 and data.last_action_latency_ms < 1800.0:
        next_level = min(5, data.current_level + 1)

    return DDAEngineResponse(
        next_level=next_level,
        expand_touch_targets=expand_touch,
        show_voice_hint=trigger_voice,
        audio_prompt_key=audio_key,
        hint_message=hint
    )

# --- Caregiver Analytics Route ---
@app.get("/api/v1/caregiver/patient/{patient_id}/stats", tags=["Analytics"])
def get_patient_analytics(
    patient_id: int,
    current_user_id: int = Depends(get_current_user_id)
):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Verify patient belongs to current caregiver
    cursor.execute("SELECT full_name FROM patients WHERE id = ? AND caregiver_id = ?", (patient_id, current_user_id))
    patient = cursor.fetchone()
    if not patient:
        conn.close()
        raise HTTPException(status_code=404, detail="Patient profile not found")

    # Fetch total sessions and average scores
    cursor.execute(
        """
        SELECT 
            COUNT(id), 
            AVG(score), 
            AVG(total_errors), 
            AVG(duration_seconds) 
        FROM game_sessions 
        WHERE patient_id = ?
        """,
        (patient_id,)
    )
    stats = cursor.fetchone()
    conn.close()

    total_sessions = stats[0] or 0
    avg_score = round(stats[1], 1) if stats[1] else 0.0
    avg_errors = round(stats[2], 1) if stats[2] else 0.0
    avg_duration = round(stats[3], 1) if stats[3] else 0.0

    return {
        "patient_id": patient_id,
        "patient_name": patient[0],
        "total_sessions_completed": total_sessions,
        "metrics": {
            "average_score": avg_score,
            "average_errors_per_session": avg_errors,
            "average_duration_seconds": avg_duration
        }
    }
