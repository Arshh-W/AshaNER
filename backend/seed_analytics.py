# seed_analytics.py
import sqlite3
import random
import json
from datetime import datetime, timedelta, timezone
from database import init_db, DB_NAME
from auth import hash_password

def seed_database():
    # Ensure database schema is initialized
    init_db()
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    print("🌱 Seeding dementia_care.db with clinical analytics data...")

    # 1. Ensure a caregiver user exists
    cursor.execute("SELECT id FROM users WHERE email = 'caregiver@example.com'")
    user = cursor.fetchone()
    if not user:
        hashed_pwd = hash_password("password123")
        cursor.execute(
            "INSERT INTO users (email, hashed_password, role) VALUES (?, ?, ?)",
            ("caregiver@example.com", hashed_pwd, "caregiver")
        )
        caregiver_id = cursor.lastrowid
        print(f"  └─ Created caregiver user (ID: {caregiver_id})")
    else:
        caregiver_id = user[0]

    # 2. Ensure a patient profile exists
    cursor.execute("SELECT id FROM patients WHERE caregiver_id = ?", (caregiver_id,))
    patient = cursor.fetchone()
    if not patient:
        cursor.execute(
            """
            INSERT INTO patients (caregiver_id, full_name, age, region, preferred_language)
            VALUES (?, ?, ?, ?, ?)
            """,
            (caregiver_id, "Demo_Patient", 74, "Assam", "as-IN")
        )
        patient_id = cursor.lastrowid
        print(f"  └─ Created patient profile: Aarav Sharma (ID: {patient_id})")
    else:
        patient_id = patient[0]
        cursor.execute(
            "UPDATE patients SET full_name = ? WHERE id = ?",
            ("Demo_Patient", patient_id),
        )

    now = datetime.now(timezone.utc)

    # Clear existing analytics mock data for this patient to prevent duplication
    cursor.execute("DELETE FROM clinical_audio_logs WHERE patient_id = ?", (patient_id,))
    cursor.execute("DELETE FROM facial_agitation_logs WHERE patient_id = ?", (patient_id,))
    cursor.execute("DELETE FROM daily_adherence WHERE patient_id = ?", (patient_id,))
    cursor.execute("DELETE FROM game_sessions WHERE patient_id = ?", (patient_id,))

    # 3. Seed 21 days: 14-day baseline followed by a 7-day clinical spike.
    game_types = ["memory_village", "memory_detective", "routine_rescue", "sound_object", "memory_mosaic"]

    for day_offset in range(20, -1, -1):
        target_date = now - timedelta(days=day_offset)
        date_str = target_date.strftime("%Y-%m-%d")
        is_spike = day_offset <= 6

        # --- A. Daily Adherence Metrics ---
        # Missed medication on day 1 ago to trigger XAI critical card rule
        medication_taken = 0 if is_spike and day_offset % 2 == 0 else 1
        hydration_ml = random.randint(1200, 1650) if is_spike else random.randint(1800, 2150)
        
        cursor.execute(
            """
            INSERT INTO daily_adherence (patient_id, medication_taken, hydration_ml, target_hydration_ml, log_date)
            VALUES (?, ?, ?, ?, ?)
            """,
            (patient_id, medication_taken, hydration_ml, 2000, date_str)
        )

        # --- B. Clinical Audio Logs (Trajectory Trends over 7 Days) ---
        if is_spike:
            drift_score = round(0.9 + (7 - day_offset) * 0.18 + random.uniform(-0.08, 0.08), 2)
            pause_sec = round(2.4 + (7 - day_offset) * 0.22 + random.uniform(-0.15, 0.2), 2)
            shimmer_pct = round(6.5 + random.uniform(-0.4, 0.8), 2)
        else:
            drift_score = round(0.28 + random.uniform(-0.05, 0.05), 2)
            pause_sec = round(0.65 + random.uniform(-0.12, 0.12), 2)
            shimmer_pct = round(3.8 + random.uniform(-0.3, 0.3), 2)
        recorded_at_str = target_date.replace(hour=10, minute=30).strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute(
            """
            INSERT INTO clinical_audio_logs (patient_id, speech_pause_duration_sec, vocal_shimmer_percentage, cognitive_drift_score, recorded_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (patient_id, pause_sec, shimmer_pct, drift_score, recorded_at_str)
        )

        # --- C. Hourly Facial Agitation Logs (24 Hours per Day) ---
        for hour in range(24):
            # Model Sundowning Syndrome: High arousal + negative valence between 16:00 and 20:00
            if is_spike and 16 <= hour <= 20:
                valence = round(random.uniform(-0.75, -0.35), 2)
                arousal = round(random.uniform(0.72, 0.96), 2)
            # Daytime (Calm / Mildly Active)
            elif 8 <= hour < 16:
                valence = round(random.uniform(0.1, 0.6), 2)
                arousal = round(random.uniform(0.2, 0.5), 2)
            # Nighttime (Resting / Sleep)
            else:
                valence = round(random.uniform(-0.1, 0.2), 2)
                arousal = round(random.uniform(0.05, 0.25), 2)

            log_timestamp = target_date.replace(hour=hour, minute=15).strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute(
                """
                INSERT INTO facial_agitation_logs (patient_id, valence, arousal, hour_of_day, recorded_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (patient_id, valence, arousal, hour, log_timestamp)
            )

        # --- D. Game Sessions (2-3 sessions per day) ---
        num_sessions = random.choice([2, 3])
        for s in range(num_sessions):
            session_id = f"mock-session-{date_str}-{s}"
            
            # Skip if local_session_id exists
            cursor.execute("SELECT id FROM game_sessions WHERE local_session_id = ?", (session_id,))
            if not cursor.fetchone():
                game = random.choice(game_types)
                score = random.randint(65, 95)
                duration = random.uniform(120.0, 300.0)
                errors = random.randint(0, 4)
                level = random.randint(1, 3)
                reaction_times = json.dumps([random.randint(800, 2500) for _ in range(5)])
                session_time = target_date.replace(hour=11 + (s * 3)).strftime("%Y-%m-%d %H:%M:%S")

                cursor.execute(
                    """
                    INSERT INTO game_sessions 
                    (local_session_id, patient_id, game_type, score, duration_seconds, total_errors, level_achieved, reaction_times_json, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (session_id, patient_id, game, score, duration, errors, level, reaction_times, session_time)
                )

    conn.commit()
    conn.close()
    print("✅ Successfully seeded 21-day baseline/spike trajectories, agitation heatmaps, adherence records, and game sessions!")

if __name__ == "__main__":
    seed_database()