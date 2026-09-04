# database.py
import sqlite3
import time
from typing import Optional

DB_NAME = "dementia_care.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'caregiver'
    )
    """)

    # Patients Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        caregiver_id INTEGER NOT NULL,
        full_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        region TEXT NOT NULL,
        preferred_language TEXT DEFAULT 'as-IN',
        FOREIGN KEY (caregiver_id) REFERENCES users(id)
    )
    """)

    # Game Sessions Table
    # Note: avg_cdi / avg_valence / xai_reason / triggered_reminiscence mirror the
    # fields the offline C++ engine (DatabaseManager::LogSession) captures locally.
    # They are nullable here because older/offline clients may sync sessions
    # without cognitive-biomarker data (e.g. pure score/duration telemetry).
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS game_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        local_session_id TEXT UNIQUE NOT NULL,
        patient_id INTEGER NOT NULL,
        game_type TEXT NOT NULL,
        score INTEGER NOT NULL,
        duration_seconds REAL NOT NULL,
        total_errors INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        avg_cdi REAL,
        avg_valence REAL,
        triggered_reminiscence INTEGER DEFAULT 0,
        xai_reason TEXT,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
    """)

    # Routines Table (medicine / hydration / appointment / walk reminders
    # managed by the caregiver and consumed by the offline reminder daemon)
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

    # Shared offline event log. The first eight fields are intentionally aligned
    # with the native engine and the offline sync fixture.
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

    _ensure_columns(cursor, "game_sessions", {
        "avg_cdi": "REAL",
        "avg_valence": "REAL",
        "triggered_reminiscence": "INTEGER DEFAULT 0",
        "xai_reason": "TEXT",
    })
    _ensure_columns(cursor, "telemetry_ticks", {
        "event_type": "TEXT",
        "reminder_id": "INTEGER",
        "patient_id": "INTEGER",
        "locale": "TEXT",
        "detail": "TEXT",
    })

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
    """Persist one offline event and return its local tick id."""
    conn = sqlite3.connect(db_path or DB_NAME)
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


def _ensure_columns(cursor, table: str, columns: dict):
    """Add any missing columns to `table`. Lets existing DB files (created
    before these fields existed) upgrade in place instead of requiring a
    fresh dementia_care.db."""
    cursor.execute(f"PRAGMA table_info({table})")
    existing = {row[1] for row in cursor.fetchall()}
    for name, col_type in columns.items():
        if name not in existing:
            cursor.execute(f"ALTER TABLE {table} ADD COLUMN {name} {col_type}")


if __name__ == "__main__":
    init_db()