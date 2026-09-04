# main.py
import sqlite3
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from datetime import datetime, timedelta

from auth import hash_password, verify_password, create_access_token, get_current_user
from database import init_db, DB_NAME
from schemas import (
    UserRegister, PatientCreate, PatientResponse, SyncBatchRequest, SyncBatchResponse,
    GameSessionResponse, PatientSummaryResponse, PatientAlert,
    RoutineCreate, RoutineUpdate, RoutineResponse,
)

app = FastAPI(title="Dementia Care Platform API")

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to get current user ID from DB
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

# --- Auth Routes ---
@app.post("/api/v1/auth/register")
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

@app.post("/api/v1/auth/login")
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


@app.post("/api/v1/patients", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
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

# Get All Patients Managed by Caregiver
@app.get("/api/v1/patients", response_model=List[PatientResponse])
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

@app.post("/api/v1/sync", response_model=SyncBatchResponse)
def sync_offline_game_sessions(
    batch: SyncBatchRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    synced_ids = []

    for session in batch.sessions:
        # Check if session was already synced (Idempotency)
        cursor.execute(
            "SELECT id FROM game_sessions WHERE local_session_id = ?",
            (session.local_session_id,)
        )
        if cursor.fetchone():
            synced_ids.append(session.local_session_id)
            continue

        # Insert into SQLite
        cursor.execute(
            """
            INSERT INTO game_sessions 
            (local_session_id, patient_id, game_type, score, duration_seconds, total_errors, created_at,
             avg_cdi, avg_valence, triggered_reminiscence, xai_reason)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                session.local_session_id,
                session.patient_id,
                session.game_type,
                session.score,
                session.duration_seconds,
                session.total_errors,
                session.created_at_offline,
                session.avg_cdi,
                session.avg_valence,
                1 if session.triggered_reminiscence else 0,
                session.xai_reason,
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


# --- Caregiver Dashboard Routes ---

def _row_to_session(row) -> GameSessionResponse:
    return GameSessionResponse(
        id=row[0], local_session_id=row[1], patient_id=row[2], game_type=row[3],
        score=row[4], duration_seconds=row[5], total_errors=row[6], created_at=row[7],
        avg_cdi=row[8], avg_valence=row[9], triggered_reminiscence=bool(row[10]), xai_reason=row[11],
    )

SESSION_COLUMNS = """id, local_session_id, patient_id, game_type, score, duration_seconds,
                     total_errors, created_at, avg_cdi, avg_valence, triggered_reminiscence, xai_reason"""

@app.get("/api/v1/patients/{patient_id}/sessions", response_model=List[GameSessionResponse])
def get_patient_sessions(patient_id: int, caregiver_id: int = Depends(get_current_user_id)):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    get_owned_patient(patient_id, caregiver_id, cursor)

    cursor.execute(
        f"SELECT {SESSION_COLUMNS} FROM game_sessions WHERE patient_id = ? ORDER BY created_at ASC",
        (patient_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [_row_to_session(row) for row in rows]


@app.get("/api/v1/patients/{patient_id}/summary", response_model=PatientSummaryResponse)
def get_patient_summary(patient_id: int, caregiver_id: int = Depends(get_current_user_id)):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    patient_row = get_owned_patient(patient_id, caregiver_id, cursor)

    cursor.execute(
        f"SELECT {SESSION_COLUMNS} FROM game_sessions WHERE patient_id = ? ORDER BY created_at ASC",
        (patient_id,)
    )
    sessions = [_row_to_session(row) for row in cursor.fetchall()]
    conn.close()

    patient = PatientResponse(
        id=patient_row[0], caregiver_id=patient_row[1], full_name=patient_row[2],
        age=patient_row[3], region=patient_row[4], preferred_language=patient_row[5]
    )

    if not sessions:
        return PatientSummaryResponse(patient=patient, session_count=0, alerts=[
            PatientAlert(
                severity="info",
                title="No sessions yet",
                detail=f"{patient.full_name} hasn't played any cognitive game sessions yet.",
                created_at=datetime.utcnow().isoformat(),
            )
        ])

    cdi_scored = [s for s in sessions if s.avg_cdi is not None]
    valence_scored = [s for s in sessions if s.avg_valence is not None]

    cutoff = (datetime.utcnow() - timedelta(days=7)).isoformat()
    recent_valence = [s.avg_valence for s in valence_scored if s.created_at >= cutoff]
    recent_reminiscence = sum(1 for s in sessions if s.triggered_reminiscence and s.created_at >= cutoff)

    alerts: List[PatientAlert] = []

    # Rising Cognitive Drift Index across the last few sessions -> possible decline
    if len(cdi_scored) >= 3:
        recent_cdi = [s.avg_cdi for s in cdi_scored[-3:]]
        if recent_cdi[-1] - recent_cdi[0] > 0.15:
            alerts.append(PatientAlert(
                severity="warning",
                title="Rising Cognitive Drift Index",
                detail=(
                    f"CDI moved from {recent_cdi[0]:.2f} to {recent_cdi[-1]:.2f} over the last "
                    f"{len(recent_cdi)} sessions. Consider a check-in call."
                ),
                created_at=cdi_scored[-1].created_at,
            ))

    # Low emotional valence -> possible sundowning / distress
    low_valence_recent = [s for s in valence_scored if s.created_at >= cutoff and s.avg_valence is not None and s.avg_valence < -0.3]
    if low_valence_recent:
        alerts.append(PatientAlert(
            severity="critical" if len(low_valence_recent) >= 3 else "warning",
            title="Low emotional valence detected",
            detail=(
                f"{len(low_valence_recent)} session(s) in the last 7 days showed notably low mood/valence "
                "scores, which can indicate sundowning or distress."
            ),
            created_at=low_valence_recent[-1].created_at,
        ))

    # XAI-flagged reminiscence therapy triggers
    if recent_reminiscence > 0:
        last_reason = next((s.xai_reason for s in reversed(sessions) if s.triggered_reminiscence and s.xai_reason), None)
        alerts.append(PatientAlert(
            severity="info",
            title="Reminiscence therapy triggered",
            detail=last_reason or f"Reminiscence Art Therapy activated {recent_reminiscence} time(s) in the last 7 days.",
            created_at=sessions[-1].created_at,
        ))

    if not alerts:
        alerts.append(PatientAlert(
            severity="info",
            title="All steady",
            detail="No concerning patterns detected in recent sessions.",
            created_at=sessions[-1].created_at,
        ))

    return PatientSummaryResponse(
        patient=patient,
        session_count=len(sessions),
        latest_cdi=cdi_scored[-1].avg_cdi if cdi_scored else None,
        latest_valence=valence_scored[-1].avg_valence if valence_scored else None,
        cdi_trend=[s.avg_cdi for s in cdi_scored],
        cdi_trend_dates=[s.created_at for s in cdi_scored],
        avg_valence_7d=(sum(recent_valence) / len(recent_valence)) if recent_valence else None,
        reminiscence_triggers_7d=recent_reminiscence,
        alerts=alerts,
    )


# --- Routine Management Routes ---

def _row_to_routine(row) -> RoutineResponse:
    return RoutineResponse(
        id=row[0], patient_id=row[1], title=row[2], category=row[3],
        scheduled_time=row[4], notes=row[5], active=bool(row[6]), created_at=row[7],
    )

ROUTINE_COLUMNS = "id, patient_id, title, category, scheduled_time, notes, active, created_at"

@app.get("/api/v1/patients/{patient_id}/routines", response_model=List[RoutineResponse])
def list_routines(patient_id: int, caregiver_id: int = Depends(get_current_user_id)):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    get_owned_patient(patient_id, caregiver_id, cursor)

    cursor.execute(
        f"SELECT {ROUTINE_COLUMNS} FROM routines WHERE patient_id = ? ORDER BY scheduled_time ASC",
        (patient_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [_row_to_routine(row) for row in rows]


@app.post("/api/v1/patients/{patient_id}/routines", response_model=RoutineResponse, status_code=status.HTTP_201_CREATED)
def create_routine(patient_id: int, routine: RoutineCreate, caregiver_id: int = Depends(get_current_user_id)):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    get_owned_patient(patient_id, caregiver_id, cursor)

    created_at = datetime.utcnow().isoformat()
    cursor.execute(
        """
        INSERT INTO routines (patient_id, title, category, scheduled_time, notes, active, created_at)
        VALUES (?, ?, ?, ?, ?, 1, ?)
        """,
        (patient_id, routine.title, routine.category, routine.scheduled_time, routine.notes, created_at)
    )
    conn.commit()
    routine_id = cursor.lastrowid

    cursor.execute(f"SELECT {ROUTINE_COLUMNS} FROM routines WHERE id = ?", (routine_id,))
    row = cursor.fetchone()
    conn.close()
    return _row_to_routine(row)


@app.patch("/api/v1/patients/{patient_id}/routines/{routine_id}", response_model=RoutineResponse)
def update_routine(patient_id: int, routine_id: int, routine: RoutineUpdate, caregiver_id: int = Depends(get_current_user_id)):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    get_owned_patient(patient_id, caregiver_id, cursor)

    cursor.execute("SELECT id FROM routines WHERE id = ? AND patient_id = ?", (routine_id, patient_id))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Routine not found")

    updates = routine.model_dump(exclude_unset=True)
    if updates:
        if "active" in updates:
            updates["active"] = 1 if updates["active"] else 0
        set_clause = ", ".join(f"{key} = ?" for key in updates)
        cursor.execute(
            f"UPDATE routines SET {set_clause} WHERE id = ?",
            (*updates.values(), routine_id)
        )
        conn.commit()

    cursor.execute(f"SELECT {ROUTINE_COLUMNS} FROM routines WHERE id = ?", (routine_id,))
    row = cursor.fetchone()
    conn.close()
    return _row_to_routine(row)


@app.delete("/api/v1/patients/{patient_id}/routines/{routine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_routine(patient_id: int, routine_id: int, caregiver_id: int = Depends(get_current_user_id)):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    get_owned_patient(patient_id, caregiver_id, cursor)

    cursor.execute("DELETE FROM routines WHERE id = ? AND patient_id = ?", (routine_id, patient_id))
    conn.commit()
    conn.close()