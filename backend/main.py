# main.py
import sqlite3
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from auth import hash_password, verify_password, create_access_token, get_current_user
from database import init_db, DB_NAME
from schemas import UserRegister, PatientCreate, PatientResponse, SyncBatchRequest, SyncBatchResponse

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
            (local_session_id, patient_id, game_type, score, duration_seconds, total_errors, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                session.local_session_id,
                session.patient_id,
                session.game_type,
                session.score,
                session.duration_seconds,
                session.total_errors,
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