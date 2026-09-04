# database.py
import sqlite3

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

    # Game Sessions Table (Updated for 5 Games)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS game_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        local_session_id TEXT UNIQUE NOT NULL,
        patient_id INTEGER NOT NULL,
        game_type TEXT NOT NULL, -- memory_village, memory_detective, routine_rescue, sound_object, memory_mosaic
        score INTEGER NOT NULL,
        duration_seconds REAL NOT NULL,
        total_errors INTEGER NOT NULL,
        level_achieved INTEGER DEFAULT 1,
        reaction_times_json TEXT, -- Serialized JSON array of click latencies
        created_at TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()