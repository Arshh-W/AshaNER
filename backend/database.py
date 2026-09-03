import sqlite3

DB_NAME = "dementia_care.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # users table for authentication
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'caregiver' -- 'caregiver' or 'patient'
        )
    """)

    # patients table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        caregiver_id INTEGER,
        full_name TEXT NOT NULL,
        preferred_language TEXT DEFAULT 'as-IN',
        FOREIGN KEY (caregiver_id) REFERENCES users(id)
    )
    """)

    # game sessions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS game_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        local_session_id TEXT UNIQUE NOT NULL,
        patient_id INTEGER,
        game_type TEXT NOT NULL,
        score INTEGER NOT NULL,
        duration_seconds REAL NOT NULL,
        total_errors INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("database initialized successfully!!")