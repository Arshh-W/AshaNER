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
    UserRegister, PatientCreate, PatientResponse, ReminderConfirmation,
    VoiceCheckInRequest,
)
from reminder_daemon import RoutineReminderDaemon
from voice_checkin import process_check_in

app = FastAPI(title="Dementia Care Platform API")

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


def assert_owned_patient(patient_id: int, caregiver_id: int) -> tuple:
    conn = sqlite3.connect(DB_NAME)
    try:
        return get_owned_patient(patient_id, caregiver_id, conn.cursor())
    finally:
        conn.close()

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