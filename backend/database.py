import sqlite3
import time
from typing import Optional

DB_NAME = "dementia_care.db"


def _ensure_columns(cursor, table: str, columns: dict):
    cursor.execute(f"PRAGMA table_info({table})")
    existing = {row[1] for row in cursor.fetchall()}
    for name, col_type in columns.items():
        if name not in existing:
            cursor.execute(f"ALTER TABLE {table} ADD COLUMN {name} {col_type}")


def init_db():
    conn = sqlite3.connect(DB_NAME, timeout=30)
    cursor = conn.cursor()

    cursor.execute("PRAGMA foreign_keys = ON")
    cursor.execute("PRAGMA journal_mode = WAL")
    cursor.execute("PRAGMA busy_timeout = 30000")

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'caregiver',
        name TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        caregiver_id INTEGER,
        patient_code TEXT UNIQUE,
        full_name TEXT NOT NULL,
        date_of_birth TEXT,
        age INTEGER,
        gender TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        district TEXT,
        state TEXT,
        region TEXT,
        preferred_language TEXT DEFAULT 'en-IN',
        caregiver_relationship TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (caregiver_id) REFERENCES users(id)
    )
    """)

    # Existing AshaNER databases used caregiver_id NOT NULL. Patients who
    # register themselves must be allowed to exist before a caregiver is
    # connected, so migrate that legacy table to a nullable caregiver_id.
    patient_columns = cursor.execute("PRAGMA table_info(patients)").fetchall()
    caregiver_column = next((row for row in patient_columns if row[1] == "caregiver_id"), None)
    if caregiver_column and caregiver_column[3] == 1:
        cursor.execute("PRAGMA foreign_keys = OFF")
        cursor.execute("ALTER TABLE patients RENAME TO patients_legacy")
        cursor.execute("""
        CREATE TABLE patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            caregiver_id INTEGER,
            patient_code TEXT UNIQUE,
            full_name TEXT NOT NULL,
            date_of_birth TEXT,
            age INTEGER,
            gender TEXT,
            phone TEXT,
            address TEXT,
            city TEXT,
            district TEXT,
            state TEXT,
            region TEXT,
            preferred_language TEXT DEFAULT 'en-IN',
            caregiver_relationship TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (caregiver_id) REFERENCES users(id)
        )
        """)
        legacy_columns = {row[1] for row in cursor.execute("PRAGMA table_info(patients_legacy)").fetchall()}
        def legacy_expr(name, fallback="NULL"):
            return name if name in legacy_columns else fallback
        cursor.execute(f"""
            INSERT INTO patients (
                id, caregiver_id, full_name, age, region, preferred_language,
                user_id, patient_code, date_of_birth, gender, phone, address,
                city, district, state, caregiver_relationship, created_at, updated_at
            )
            SELECT id, caregiver_id, full_name, age, region, preferred_language,
                   {legacy_expr('user_id')}, {legacy_expr('patient_code')},
                   {legacy_expr('date_of_birth')}, {legacy_expr('gender')},
                   {legacy_expr('phone')}, {legacy_expr('address')},
                   {legacy_expr('city')}, {legacy_expr('district')},
                   {legacy_expr('state')}, {legacy_expr('caregiver_relationship')},
                   COALESCE({legacy_expr('created_at')}, CURRENT_TIMESTAMP),
                   COALESCE({legacy_expr('updated_at')}, CURRENT_TIMESTAMP)
            FROM patients_legacy
        """)
        cursor.execute("DROP TABLE patients_legacy")
        cursor.execute("PRAGMA foreign_keys = ON")

    # Upgrade existing databases without deleting existing records.
    _ensure_columns(cursor, "users", {
        "name": "TEXT",
        "caregiver_code": "TEXT",
    })

    _ensure_columns(cursor, "patients", {
        "user_id": "INTEGER",
        "patient_code": "TEXT",
        "date_of_birth": "TEXT",
        "gender": "TEXT",
        "phone": "TEXT",
        "address": "TEXT",
        "city": "TEXT",
        "district": "TEXT",
        "state": "TEXT",
        "region": "TEXT",
        "caregiver_relationship": "TEXT",
        "created_at": "TEXT",
        "updated_at": "TEXT",
    })

    cursor.execute("UPDATE patients SET created_at = COALESCE(created_at, CURRENT_TIMESTAMP)")
    cursor.execute("UPDATE patients SET updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP)")
    cursor.execute("UPDATE patients SET region = COALESCE(region, state, 'Unknown')")
    cursor.execute("UPDATE patients SET preferred_language = COALESCE(preferred_language, 'en-IN')")

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS game_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        local_session_id TEXT UNIQUE NOT NULL,
        patient_id INTEGER NOT NULL,
        game_type TEXT NOT NULL,
        score INTEGER NOT NULL,
        duration_seconds REAL NOT NULL,
        total_errors INTEGER NOT NULL,
        level_achieved INTEGER DEFAULT 1,
        reaction_times_json TEXT,
        created_at TEXT NOT NULL,
        avg_cdi REAL,
        avg_valence REAL,
        triggered_reminiscence INTEGER DEFAULT 0,
        xai_reason TEXT,
        client_event_id TEXT UNIQUE,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS routines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'general',
        scheduled_time TEXT NOT NULL,
        notes TEXT,
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS telemetry_ticks (
        tick_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        timestamp_ms INTEGER NOT NULL,
        level REAL NOT NULL DEFAULT 0,
        error_rate REAL NOT NULL DEFAULT 0,
        latency_ms REAL NOT NULL DEFAULT 0,
        valence REAL NOT NULL DEFAULT 0,
        drift REAL NOT NULL DEFAULT 0,
        action INTEGER NOT NULL DEFAULT 0,
        event_type TEXT,
        reminder_id INTEGER,
        patient_id INTEGER,
        locale TEXT,
        detail TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS processed_sync_events (
        client_event_id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        patient_id INTEGER NOT NULL,
        processed_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS clinical_audio_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        speech_pause_duration_sec REAL NOT NULL,
        vocal_shimmer_percentage REAL NOT NULL,
        cognitive_drift_score REAL NOT NULL,
        recorded_at TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS facial_agitation_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        valence REAL NOT NULL,
        arousal REAL NOT NULL,
        hour_of_day INTEGER NOT NULL,
        recorded_at TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS daily_adherence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        medication_taken INTEGER DEFAULT 0,
        hydration_ml INTEGER DEFAULT 0,
        target_hydration_ml INTEGER DEFAULT 2000,
        log_date TEXT NOT NULL,
        client_event_id TEXT UNIQUE,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
    """)

    _ensure_columns(cursor, "game_sessions", {
        "level_achieved": "INTEGER DEFAULT 1",
        "reaction_times_json": "TEXT",
        "avg_cdi": "REAL",
        "avg_valence": "REAL",
        "triggered_reminiscence": "INTEGER DEFAULT 0",
        "xai_reason": "TEXT",
        "client_event_id": "TEXT",
    })
    _ensure_columns(cursor, "telemetry_ticks", {
        "event_type": "TEXT",
        "reminder_id": "INTEGER",
        "patient_id": "INTEGER",
        "locale": "TEXT",
        "detail": "TEXT",
    })
    _ensure_columns(cursor, "daily_adherence", {
        "client_event_id": "TEXT",
    })

    # Backfill unique caregiver invitation codes for existing caregiver accounts.
    import secrets
    caregivers = cursor.execute("SELECT id FROM users WHERE role = 'caregiver' AND (caregiver_code IS NULL OR caregiver_code = '')").fetchall()
    for caregiver in caregivers:
        for _ in range(20):
            code = f"CG-{secrets.token_hex(3).upper()}"
            if not cursor.execute("SELECT 1 FROM users WHERE caregiver_code = ?", (code,)).fetchone():
                cursor.execute("UPDATE users SET caregiver_code = ? WHERE id = ?", (code, caregiver[0]))
                break

    cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_caregiver_code ON users(caregiver_code)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_patients_caregiver ON patients(caregiver_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_patients_user ON patients(user_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_game_sessions_patient ON game_sessions(patient_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_game_sessions_created ON game_sessions(created_at)")

    conn.commit()
    conn.close()


def record_telemetry_tick(
    session_id: str,
    action: int,
    *,
    level: float = 0.0,
    error_rate: float = 0.0,
    latency_ms: float = 0.0,
    valence: float = 0.0,
    drift: float = 0.0,
    event_type: str = "telemetry",
    reminder_id: Optional[int] = None,
    patient_id: Optional[int] = None,
    locale: Optional[str] = None,
    detail: Optional[str] = None,
    db_path: Optional[str] = None,
) -> int:
    conn = sqlite3.connect(db_path or DB_NAME, timeout=30)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO telemetry_ticks
        (session_id, timestamp_ms, level, error_rate, latency_ms, valence,
         drift, action, event_type, reminder_id, patient_id, locale, detail)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (session_id, int(time.time() * 1000), level, error_rate, latency_ms,
         valence, drift, action, event_type, reminder_id, patient_id, locale,
         detail),
    )
    tick_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return int(tick_id)


if __name__ == "__main__":
    init_db()
    print("database updated!!")
