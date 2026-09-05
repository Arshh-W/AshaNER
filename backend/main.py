import json
import secrets
import sqlite3
from datetime import date, datetime
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from auth import hash_password, verify_password, create_access_token, get_current_user
from database import init_db, DB_NAME
from schemas import (
    UserRegister,
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    UserProfile,
    CaregiverConnectRequest,
    SyncBatchRequest,
    SyncBatchResponse,
    DDAEngineRequest,
    DDAEngineResponse,
    GameTypeEnum,
    ReminderConfirmation,
    VoiceCheckInRequest,
)
from reminder_daemon import RoutineReminderDaemon
from voice_checkin import process_check_in
from analytics import router as analytics_router
from ml_inference import router as ml_router
import sync


app = FastAPI(
    title="AshaNER Care Platform API",
    version="2.0.0",
    description="Role-separated backend for patients, caregivers, cognitive games, analytics and reports.",
)

app.include_router(analytics_router)
app.include_router(ml_router)
app.include_router(sync.router, prefix="/api/v1")

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


# ============================================================
# DATABASE / AUTH HELPERS
# ============================================================

def db_connection():
    conn = sqlite3.connect(DB_NAME, timeout=30)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA busy_timeout = 30000")
    return conn


def get_current_user_record(current_user: dict = Depends(get_current_user)) -> sqlite3.Row:
    conn = db_connection()
    try:
        row = conn.execute(
            "SELECT id, name, email, role FROM users WHERE email = ?",
            (current_user["email"],),
        ).fetchone()
    finally:
        conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="User not found")

    return row


def get_current_user_id(current_user: dict = Depends(get_current_user)) -> int:
    conn = db_connection()
    try:
        row = conn.execute(
            "SELECT id FROM users WHERE email = ?",
            (current_user["email"],),
        ).fetchone()
    finally:
        conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="User not found")

    return int(row[0])


def require_role(required_role: str):
    def dependency(current_user: dict = Depends(get_current_user)) -> dict:
        role = current_user.get("role")
        if role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This endpoint is only available to {required_role}s.",
            )
        return current_user

    return dependency


def get_caregiver_id(current_user: dict = Depends(require_role("caregiver"))) -> int:
    return get_current_user_id(current_user)


def get_patient_for_user(current_user: dict = Depends(require_role("patient"))) -> sqlite3.Row:
    conn = db_connection()
    try:
        row = conn.execute(
            """
            SELECT
                p.*
            FROM patients p
            JOIN users u ON u.id = p.user_id
            WHERE u.email = ?
            LIMIT 1
            """,
            (current_user["email"],),
        ).fetchone()
    finally:
        conn.close()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found for this account.",
        )

    return row


def patient_row_to_dict(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "user_id": row["user_id"],
        "caregiver_id": row["caregiver_id"],
        "patient_code": row["patient_code"],
        "full_name": row["full_name"],
        "date_of_birth": row["date_of_birth"],
        "age": row["age"],
        "gender": row["gender"],
        "phone": row["phone"],
        "address": row["address"],
        "city": row["city"],
        "district": row["district"],
        "state": row["state"],
        "region": row["region"],
        "preferred_language": row["preferred_language"],
        "caregiver_relationship": row["caregiver_relationship"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def get_owned_patient(patient_id: int, caregiver_id: int, cursor) -> sqlite3.Row:
    row = cursor.execute(
        "SELECT * FROM patients WHERE id = ?",
        (patient_id,),
    ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Patient not found")

    if row["caregiver_id"] != caregiver_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized for this patient.",
        )

    return row


def assert_owned_patient(patient_id: int, caregiver_id: int) -> sqlite3.Row:
    conn = db_connection()
    try:
        return get_owned_patient(patient_id, caregiver_id, conn)
    finally:
        conn.close()


def calculate_age(date_of_birth: str) -> int:
    try:
        dob = date.fromisoformat(date_of_birth)
    except ValueError:
        raise HTTPException(
            status_code=422,
            detail="date_of_birth must use YYYY-MM-DD format.",
        )

    today = date.today()
    if dob > today:
        raise HTTPException(status_code=422, detail="Date of birth cannot be in the future.")

    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


def generate_patient_code(conn: sqlite3.Connection) -> str:
    for _ in range(20):
        code = f"ASH-{secrets.token_hex(3).upper()}"
        if not conn.execute("SELECT 1 FROM patients WHERE patient_code = ?", (code,)).fetchone():
            return code
    raise HTTPException(status_code=500, detail="Could not generate a patient code.")


def generate_caregiver_code(conn: sqlite3.Connection) -> str:
    for _ in range(20):
        code = f"CG-{secrets.token_hex(3).upper()}"
        if not conn.execute("SELECT 1 FROM users WHERE caregiver_code = ?", (code,)).fetchone():
            return code
    raise HTTPException(status_code=500, detail="Could not generate a caregiver code.")


def backfill_patient_codes(conn: sqlite3.Connection):
    rows = conn.execute(
        "SELECT id FROM patients WHERE patient_code IS NULL OR patient_code = ''"
    ).fetchall()
    for row in rows:
        conn.execute(
            "UPDATE patients SET patient_code = ? WHERE id = ?",
            (generate_patient_code(conn), row["id"]),
        )


# ============================================================
# AUTHENTICATION
# ============================================================

@app.post("/api/v1/auth/register", tags=["Authentication"])
def register_user(user: UserRegister):
    role = user.role.strip().lower()
    if role not in {"patient", "caregiver"}:
        raise HTTPException(status_code=400, detail="Role must be patient or caregiver.")

    name = user.name.strip()
    email = str(user.email).strip().lower()

    conn = db_connection()
    try:
        if conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")

        if role == "patient":
            required = {
                "date_of_birth": user.date_of_birth,
                "gender": user.gender,
                "phone": user.phone,
                "address": user.address,
                "city": user.city,
                "district": user.district,
                "state": user.state,
                "preferred_language": user.preferred_language,
            }
            missing = [key for key, value in required.items() if not value or not str(value).strip()]
            if missing:
                raise HTTPException(
                    status_code=422,
                    detail=f"Missing patient registration fields: {', '.join(missing)}",
                )

            age = calculate_age(user.date_of_birth)
            caregiver_id = None

            if user.caregiver_code:
                caregiver = conn.execute(
                    "SELECT id FROM users WHERE role = 'caregiver' AND caregiver_code = ?",
                    (user.caregiver_code.strip().upper(),),
                ).fetchone()
                if not caregiver:
                    raise HTTPException(status_code=404, detail="Invalid caregiver code.")
                caregiver_id = caregiver["id"]

            hashed_pwd = hash_password(user.password)
            cursor = conn.execute(
                "INSERT INTO users (email, hashed_password, role, name) VALUES (?, ?, ?, ?)",
                (email, hashed_pwd, role, name),
            )
            user_id = cursor.lastrowid
            patient_code = generate_patient_code(conn)

            # If the supplied caregiver code belongs to an existing patient record,
            # we cannot reuse that patient's code. A fresh patient receives a new code.
            conn.execute(
                """
                INSERT INTO patients (
                    user_id, caregiver_id, patient_code, full_name, date_of_birth, age,
                    gender, phone, address, city, district, state, region,
                    preferred_language, caregiver_relationship, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """,
                (
                    user_id,
                    caregiver_id,
                    patient_code,
                    name,
                    user.date_of_birth,
                    age,
                    user.gender.strip(),
                    user.phone.strip(),
                    user.address.strip(),
                    user.city.strip(),
                    user.district.strip(),
                    user.state.strip(),
                    (user.region or user.state).strip(),
                    (user.preferred_language or "en-IN").strip(),
                    user.caregiver_relationship.strip() if user.caregiver_relationship else None,
                ),
            )
            conn.commit()

            return {
                "message": "Patient account created successfully",
                "role": "patient",
                "patient_id": conn.execute(
                    "SELECT id FROM patients WHERE user_id = ?", (user_id,)
                ).fetchone()[0],
                "patient_code": patient_code,
            }

        hashed_pwd = hash_password(user.password)
        caregiver_code = generate_caregiver_code(conn)
        cursor = conn.execute(
            "INSERT INTO users (email, hashed_password, role, name, caregiver_code) VALUES (?, ?, ?, ?, ?)",
            (email, hashed_pwd, role, name, caregiver_code),
        )
        conn.commit()

        return {
            "message": "Caregiver account created successfully",
            "role": "caregiver",
            "user_id": cursor.lastrowid,
            "caregiver_code": caregiver_code,
        }
    finally:
        conn.close()


@app.post("/api/v1/auth/login", tags=["Authentication"])
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    email = form_data.username.strip().lower()
    conn = db_connection()
    try:
        row = conn.execute(
            "SELECT id, hashed_password, role, name, caregiver_code FROM users WHERE email = ?",
            (email,),
        ).fetchone()

        if not row or not verify_password(form_data.password, row["hashed_password"]):
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        patient = None
        if row["role"] == "patient":
            patient = conn.execute(
                "SELECT id, full_name, patient_code FROM patients WHERE user_id = ? LIMIT 1",
                (row["id"],),
            ).fetchone()

        access_token = create_access_token(
            data={"sub": email, "role": row["role"]}
        )

        return {
            "access_token": access_token,
            "token": access_token,
            "token_type": "bearer",
            "id": row["id"],
            "name": row["name"] or email.split("@", 1)[0],
            "email": email,
            "role": row["role"],
            "patient_id": patient["id"] if patient else None,
            "patient_name": patient["full_name"] if patient else None,
            "patient_code": patient["patient_code"] if patient else None,
            "caregiver_code": row["caregiver_code"],
        }
    finally:
        conn.close()


@app.get("/api/v1/auth/me", response_model=UserProfile, tags=["Authentication"])
def current_user_profile(current_user: dict = Depends(get_current_user)):
    conn = db_connection()
    try:
        row = conn.execute(
            "SELECT id, name, email, role FROM users WHERE email = ?",
            (current_user["email"],),
        ).fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="User not found")

        patient = conn.execute(
            "SELECT id, full_name FROM patients WHERE user_id = ? LIMIT 1",
            (row["id"],),
        ).fetchone()

        return UserProfile(
            id=row["id"],
            name=row["name"] or row["email"].split("@", 1)[0],
            email=row["email"],
            role=row["role"],
            patient_id=patient["id"] if patient else None,
            patient_name=patient["full_name"] if patient else None,
        )
    finally:
        conn.close()


# ============================================================
# PATIENT SELF-SERVICE
# ============================================================

@app.get("/api/v1/patients/me", response_model=PatientResponse, tags=["Patient"])
def get_my_patient_profile(patient: sqlite3.Row = Depends(get_patient_for_user)):
    return patient_row_to_dict(patient)


@app.put("/api/v1/patients/me", response_model=PatientResponse, tags=["Patient"])
def update_my_patient_profile(
    updates: PatientUpdate,
    patient: sqlite3.Row = Depends(get_patient_for_user),
):
    fields = updates.model_dump(exclude_unset=True)
    if not fields:
        return patient_row_to_dict(patient)

    if "date_of_birth" in fields and fields["date_of_birth"]:
        fields["age"] = calculate_age(fields["date_of_birth"])

    allowed = {
        "full_name", "date_of_birth", "age", "gender", "phone", "address",
        "city", "district", "state", "region", "preferred_language",
        "caregiver_relationship",
    }
    fields = {key: value for key, value in fields.items() if key in allowed}

    assignments = ", ".join(f"{key} = ?" for key in fields)
    values = list(fields.values())
    values.extend([datetime.utcnow().isoformat(), patient["id"]])

    conn = db_connection()
    try:
        conn.execute(
            f"UPDATE patients SET {assignments}, updated_at = ? WHERE id = ?",
            values,
        )
        conn.commit()
        updated = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient["id"],)
        ).fetchone()
        return patient_row_to_dict(updated)
    finally:
        conn.close()


@app.post("/api/v1/patients/me/connect-caregiver", response_model=PatientResponse, tags=["Patient"])
def connect_my_caregiver(
    request: CaregiverConnectRequest,
    patient: sqlite3.Row = Depends(get_patient_for_user),
):
    # A patient may use the code of a caregiver-created patient invitation.
    code = request.patient_code.strip().upper()
    conn = db_connection()
    try:
        invitation = conn.execute(
            "SELECT caregiver_id FROM patients WHERE patient_code = ?",
            (code,),
        ).fetchone()
        if not invitation or invitation["caregiver_id"] is None:
            raise HTTPException(status_code=404, detail="Invalid caregiver code.")

        conn.execute(
            "UPDATE patients SET caregiver_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            (invitation["caregiver_id"], patient["id"]),
        )
        conn.commit()
        updated = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (patient["id"],)
        ).fetchone()
        return patient_row_to_dict(updated)
    finally:
        conn.close()


# ============================================================
# CAREGIVER PATIENT MANAGEMENT
# ============================================================

@app.post(
    "/api/v1/patients",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Caregiver"],
)
def create_patient(
    patient: PatientCreate,
    caregiver_id: int = Depends(get_caregiver_id),
):
    age = calculate_age(patient.date_of_birth)
    conn = db_connection()
    try:
        patient_code = generate_patient_code(conn)
        conn.execute(
            """
            INSERT INTO patients (
                caregiver_id, patient_code, full_name, date_of_birth, age, gender,
                phone, address, city, district, state, region, preferred_language,
                caregiver_relationship, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """,
            (
                caregiver_id,
                patient_code,
                patient.full_name.strip(),
                patient.date_of_birth,
                age,
                patient.gender.strip(),
                patient.phone.strip(),
                patient.address.strip(),
                patient.city.strip(),
                patient.district.strip(),
                patient.state.strip(),
                (patient.region or patient.state).strip(),
                patient.preferred_language.strip(),
                patient.caregiver_relationship.strip() if patient.caregiver_relationship else None,
            ),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM patients WHERE patient_code = ?", (patient_code,)
        ).fetchone()
        return patient_row_to_dict(row)
    finally:
        conn.close()


@app.get("/api/v1/patients", response_model=List[PatientResponse], tags=["Caregiver"])
def get_caregiver_patients(caregiver_id: int = Depends(get_caregiver_id)):
    conn = db_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM patients WHERE caregiver_id = ? ORDER BY full_name COLLATE NOCASE",
            (caregiver_id,),
        ).fetchall()
        return [patient_row_to_dict(row) for row in rows]
    finally:
        conn.close()


@app.get("/api/v1/caregiver/patients/{patient_id}", response_model=PatientResponse, tags=["Caregiver"])
def get_caregiver_patient(
    patient_id: int,
    caregiver_id: int = Depends(get_caregiver_id),
):
    return patient_row_to_dict(assert_owned_patient(patient_id, caregiver_id))


@app.post("/api/v1/caregiver/patients/connect", response_model=PatientResponse, tags=["Caregiver"])
def connect_existing_patient(
    request: CaregiverConnectRequest,
    caregiver_id: int = Depends(get_caregiver_id),
):
    code = request.patient_code.strip().upper()
    conn = db_connection()
    try:
        row = conn.execute(
            "SELECT * FROM patients WHERE patient_code = ?",
            (code,),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Patient code not found.")

        if row["caregiver_id"] not in (None, caregiver_id):
            raise HTTPException(status_code=409, detail="This patient is already connected to another caregiver.")

        conn.execute(
            "UPDATE patients SET caregiver_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            (caregiver_id, row["id"]),
        )
        conn.commit()
        updated = conn.execute(
            "SELECT * FROM patients WHERE id = ?", (row["id"],)
        ).fetchone()
        return patient_row_to_dict(updated)
    finally:
        conn.close()


# ============================================================
# PATIENT GAME HISTORY / STATS
# ============================================================

def build_game_stats(patient_id: int) -> dict:
    conn = db_connection()
    try:
        patient = conn.execute(
            "SELECT full_name FROM patients WHERE id = ?", (patient_id,)
        ).fetchone()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        overall = conn.execute(
            """
            SELECT COUNT(*) AS total_sessions,
                   COALESCE(AVG(score), 0) AS avg_score,
                   COALESCE(AVG(total_errors), 0) AS avg_errors,
                   COALESCE(AVG(duration_seconds), 0) AS avg_duration,
                   COALESCE(MAX(level_achieved), 1) AS best_level
            FROM game_sessions
            WHERE patient_id = ?
            """,
            (patient_id,),
        ).fetchone()

        game_rows = conn.execute(
            """
            SELECT game_type,
                   COUNT(*) AS sessions,
                   COALESCE(AVG(score), 0) AS average_score,
                   COALESCE(AVG(total_errors), 0) AS average_errors,
                   COALESCE(AVG(duration_seconds), 0) AS average_duration,
                   COALESCE(MAX(level_achieved), 1) AS best_level
            FROM game_sessions
            WHERE patient_id = ?
            GROUP BY game_type
            ORDER BY sessions DESC
            """,
            (patient_id,),
        ).fetchall()

        history_rows = conn.execute(
            """
            SELECT id, local_session_id, patient_id, game_type, score,
                   duration_seconds, total_errors, level_achieved,
                   reaction_times_json, created_at, avg_cdi, avg_valence,
                   triggered_reminiscence, xai_reason
            FROM game_sessions
            WHERE patient_id = ?
            ORDER BY datetime(created_at) DESC, id DESC
            """,
            (patient_id,),
        ).fetchall()

        def history_item(row):
            try:
                reaction_times = json.loads(row["reaction_times_json"] or "[]")
                if not isinstance(reaction_times, list):
                    reaction_times = []
            except (TypeError, ValueError, json.JSONDecodeError):
                reaction_times = []

            numeric_times = [float(value) for value in reaction_times if isinstance(value, (int, float))]
            average_reaction = round(sum(numeric_times) / len(numeric_times), 1) if numeric_times else None

            return {
                "id": row["id"],
                "local_session_id": row["local_session_id"],
                "patient_id": row["patient_id"],
                "game_type": row["game_type"],
                "score": row["score"],
                "duration_seconds": row["duration_seconds"],
                "total_errors": row["total_errors"],
                "level_achieved": row["level_achieved"] or 1,
                "reaction_times_ms": numeric_times,
                "average_reaction_time_ms": average_reaction,
                "created_at": row["created_at"],
                "avg_cdi": row["avg_cdi"],
                "avg_valence": row["avg_valence"],
                "triggered_reminiscence": bool(row["triggered_reminiscence"]),
                "xai_reason": row["xai_reason"],
            }

        history = [history_item(row) for row in history_rows]

        return {
            "patient_id": patient_id,
            "patient_name": patient["full_name"],
            "total_sessions_completed": overall["total_sessions"],
            "metrics": {
                "average_score": round(overall["avg_score"], 1),
                "average_errors_per_session": round(overall["avg_errors"], 1),
                "average_duration_seconds": round(overall["avg_duration"], 1),
                "best_level": int(overall["best_level"] or 1),
            },
            "games": [
                {
                    "game_type": row["game_type"],
                    "sessions": row["sessions"],
                    "average_score": round(row["average_score"], 1),
                    "average_errors": round(row["average_errors"], 1),
                    "average_duration": round(row["average_duration"], 1),
                    "best_level": int(row["best_level"] or 1),
                }
                for row in game_rows
            ],
            "recent_sessions": history[:20],
            "history": history,
        }
    finally:
        conn.close()


@app.get("/api/v1/patients/me/game-stats", tags=["Patient"])
def get_my_game_stats(patient: sqlite3.Row = Depends(get_patient_for_user)):
    return build_game_stats(patient["id"])


@app.get("/api/v1/patients/me/game-history", tags=["Patient"])
def get_my_game_history(patient: sqlite3.Row = Depends(get_patient_for_user)):
    return build_game_stats(patient["id"])["history"]


@app.get("/api/v1/caregiver/patients/{patient_id}/stats", tags=["Caregiver Analytics"])
def get_patient_analytics(
    patient_id: int,
    caregiver_id: int = Depends(get_caregiver_id),
):
    assert_owned_patient(patient_id, caregiver_id)
    return build_game_stats(patient_id)


@app.get("/api/v1/caregiver/patients/{patient_id}/history", tags=["Caregiver Analytics"])
def get_patient_history(
    patient_id: int,
    caregiver_id: int = Depends(get_caregiver_id),
):
    assert_owned_patient(patient_id, caregiver_id)
    return build_game_stats(patient_id)["history"]


@app.get("/api/v1/caregiver/patients/{patient_id}/report", tags=["Caregiver Reports"])
def get_patient_report_data(
    patient_id: int,
    caregiver_id: int = Depends(get_caregiver_id),
):
    patient = assert_owned_patient(patient_id, caregiver_id)
    stats = build_game_stats(patient_id)
    return {
        "generated_at": datetime.utcnow().isoformat(),
        "patient": patient_row_to_dict(patient),
        "statistics": stats,
    }


# ============================================================
# REMINDERS / VOICE - CAREGIVER ONLY
# ============================================================

@app.get("/api/v1/patients/{patient_id}/reminders/due")
def get_due_reminders(
    patient_id: int,
    caregiver_id: int = Depends(get_caregiver_id),
):
    assert_owned_patient(patient_id, caregiver_id)
    reminders = [
        reminder
        for reminder in reminder_daemon.due_reminders()
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
    caregiver_id: int = Depends(get_caregiver_id),
):
    assert_owned_patient(patient_id, caregiver_id)
    conn = db_connection()
    try:
        reminder = conn.execute(
            "SELECT 1 FROM routines WHERE id = ? AND patient_id = ? AND active = 1",
            (reminder_id, patient_id),
        ).fetchone()
    finally:
        conn.close()

    if not reminder:
        raise HTTPException(status_code=404, detail="Active reminder not found")

    tick_id = reminder_daemon.confirm(reminder_id, patient_id, confirmation.action)
    return {"status": "recorded", "tick_id": tick_id, "action": confirmation.action}


@app.post("/api/v1/patients/{patient_id}/voice/check-in")
def voice_check_in(
    patient_id: int,
    request: VoiceCheckInRequest,
    caregiver_id: int = Depends(get_caregiver_id),
):
    assert_owned_patient(patient_id, caregiver_id)
    return process_check_in(
        request.transcript,
        patient_id=patient_id,
        locale=request.locale,
        audio_samples=request.audio_samples,
        sample_rate=request.sample_rate,
    )


# ============================================================
# OFFLINE GAME SYNC
# ============================================================

@app.post("/api/v1/sync", response_model=SyncBatchResponse, tags=["Game Processing"])
def sync_offline_game_sessions(
    batch: SyncBatchRequest,
    current_user: dict = Depends(get_current_user),
):
    # Game sessions belong to patients only. Caregivers are never allowed to
    # submit game activity, and patient_id from the browser is not trusted.
    if current_user.get("role") != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patient accounts can submit game sessions.",
        )

    patient = get_patient_for_user(current_user)
    patient_id = patient["id"]

    conn = db_connection()
    synced_ids = []
    try:
        for session in batch.sessions:
            existing = conn.execute(
                "SELECT id FROM game_sessions WHERE local_session_id = ?",
                (session.local_session_id,),
            ).fetchone()
            if existing:
                synced_ids.append(session.local_session_id)
                continue

            conn.execute(
                """
                INSERT INTO game_sessions
                (
                    local_session_id, patient_id, game_type, score,
                    duration_seconds, total_errors, level_achieved,
                    reaction_times_json, created_at, avg_cdi, avg_valence,
                    triggered_reminiscence, xai_reason
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    session.local_session_id,
                    patient_id,
                    session.game_type.value,
                    session.score,
                    session.duration_seconds,
                    session.total_errors,
                    session.level_achieved,
                    json.dumps(session.reaction_times_ms),
                    session.created_at_offline,
                    session.avg_cdi,
                    session.avg_valence,
                    int(session.triggered_reminiscence or False),
                    session.xai_reason,
                ),
            )
            synced_ids.append(session.local_session_id)

        conn.commit()
        return SyncBatchResponse(
            status="success",
            synced_count=len(synced_ids),
            synced_session_ids=synced_ids,
        )
    finally:
        conn.close()


# ============================================================
# DYNAMIC DIFFICULTY ENGINE
# ============================================================

@app.post("/api/v1/ml/adapt", response_model=DDAEngineResponse, tags=["ML Engine"])
def adapt_game_difficulty(data: DDAEngineRequest):
    next_level = data.current_level
    expand_touch = False
    trigger_voice = False
    hint = None
    audio_key = None

    if data.consecutive_errors >= 2 or data.last_action_latency_ms > 4500.0 or data.is_stalled:
        expand_touch = True
        trigger_voice = True
        next_level = max(1, data.current_level - 1)

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
        hint_message=hint,
    )


# ============================================================
# STARTUP MIGRATION
# ============================================================

try:
    _conn = db_connection()
    backfill_patient_codes(_conn)
    _conn.commit()
    _conn.close()
except Exception as migration_error:
    print(f"Patient-code migration warning: {migration_error}")
