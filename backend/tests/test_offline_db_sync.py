import json
import os
import sqlite3


DB_TEST_PATH = os.path.join(os.path.dirname(__file__), "test_mace_telemetry.db")


def run_test():
    if os.path.exists(DB_TEST_PATH):
        os.remove(DB_TEST_PATH)

    conn = sqlite3.connect(DB_TEST_PATH)
    cur = conn.cursor()
    cur.executescript("""
        CREATE TABLE sessions (
            session_id TEXT PRIMARY KEY, patient_id TEXT NOT NULL, module_id TEXT NOT NULL,
            start_time DATETIME DEFAULT CURRENT_TIMESTAMP, starting_level INTEGER NOT NULL,
            final_level INTEGER NOT NULL, avg_drift REAL NOT NULL, avg_valence REAL NOT NULL,
            reminiscence_triggered INTEGER NOT NULL, xai_factor TEXT NOT NULL,
            xai_summary TEXT NOT NULL, sync_status INTEGER DEFAULT 0
        );
        CREATE TABLE telemetry_ticks (
            tick_id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT NOT NULL,
            timestamp_ms INTEGER NOT NULL, level REAL NOT NULL, error_rate REAL NOT NULL,
            latency_ms REAL NOT NULL, valence REAL NOT NULL, drift REAL NOT NULL,
            action INTEGER NOT NULL
        );
    """)

    session_data = (
        "sess_ner_001", "patient_guwahati_42", "muga_silk_weaving", 2, 1,
        0.74, -0.48, 1, "verbal_hesitation_latency",
        "Pronounced word-finding latency observed (3.1s mean pause). Therapeutic reminiscence engaged.", 0,
    )
    cur.execute("INSERT INTO sessions VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?);", session_data)

    ticks = [
        ("sess_ner_001", 1000, 0.4, 0.1, 1400.0, 0.2, 0.3, 1),
        ("sess_ner_001", 2000, 0.4, 0.4, 3200.0, -0.2, 0.6, 0),
        ("sess_ner_001", 3000, 0.2, 0.6, 4500.0, -0.6, 0.8, 3),
    ]
    cur.executemany("""
        INSERT INTO telemetry_ticks
        (session_id, timestamp_ms, level, error_rate, latency_ms, valence, drift, action)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, ticks)
    conn.commit()

    cur.execute("""
        SELECT session_id, patient_id, module_id, starting_level, final_level,
               avg_drift, avg_valence, reminiscence_triggered, xai_factor, xai_summary
        FROM sessions WHERE sync_status = 0;
    """)
    rows = cur.fetchall()
    payload = [{
        "session_id": row[0], "patient_id": row[1], "module_id": row[2],
        "starting_level": row[3], "final_level": row[4], "avg_drift": row[5],
        "avg_valence": row[6], "reminiscence_triggered": bool(row[7]),
        "xai_factor": row[8], "xai_summary": row[9],
    } for row in rows]
    json.dumps(payload, indent=2)

    assert len(payload) == 1, "Export must contain exactly 1 unsynced session"
    assert payload[0]["reminiscence_triggered"] is True
    assert "word-finding latency" in payload[0]["xai_summary"]

    cur.execute("UPDATE sessions SET sync_status = 1 WHERE session_id = 'sess_ner_001';")
    conn.commit()
    cur.execute("SELECT COUNT(*) FROM sessions WHERE sync_status = 0;")
    assert cur.fetchone()[0] == 0, "All sessions must be marked synced"

    conn.close()
    os.remove(DB_TEST_PATH)
    print("Offline SQLite & ASHA Sync Validation: PASSED")


if __name__ == "__main__":
    run_test()