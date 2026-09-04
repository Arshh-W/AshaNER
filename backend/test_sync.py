import json
import sqlite3
import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"
DB_NAME = "dementia_care.db"

def run_sync_tests():
    print("🧪 Starting Offline Sync Batch Verification Tests...\n")

    # Sample batch sync payload containing 3 unique events
    payload = {
        "device_id": "test_device_chrome_v128",
        "synced_at": "2026-09-04T13:45:00Z",
        "events": [
            {
                "client_event_id": "evt-med-001",
                "event_type": "MEDICATION",
                "patient_id": 1,
                "timestamp_utc": "2026-09-04T08:00:00Z",
                "data": {"taken": True}
            },
            {
                "client_event_id": "evt-hyd-002",
                "event_type": "HYDRATION",
                "patient_id": 1,
                "timestamp_utc": "2026-09-04T10:30:00Z",
                "data": {"amount_ml": 500}
            },
            {
                "client_event_id": "evt-game-003",
                "event_type": "GAME",
                "patient_id": 1,
                "timestamp_utc": "2026-09-04T12:00:00Z",
                "data": {
                    "local_session_id": "sess_test_99",
                    "game_type": "memory_village",
                    "score": 85,
                    "duration_seconds": 120.5,
                    "total_errors": 2
                }
            }
        ]
    }

    # -------------------------------------------------------------
    # Test 1: Initial Batch Sync (Expected: 3 Processed)
    # -------------------------------------------------------------
    print("▶️ TEST 1: Sending initial batch payload...")
    response = requests.post(f"{BASE_URL}/sync/batch", json=payload)
    
    assert response.status_code in [200, 207], f"Failed with status {response.status_code}: {response.text}"
    res_data = response.json()
    
    print(f"   Status Code: {response.status_code}")
    print(f"   Processed: {res_data['processed']}, Skipped: {res_data['skipped_duplicates']}, Failed: {res_data['failed']}")
    assert res_data['processed'] == 3, f"Expected 3 processed, got {res_data['processed']}"
    assert res_data['skipped_duplicates'] == 0
    print("   ✅ Test 1 Passed: All 3 events processed successfully.\n")

    # -------------------------------------------------------------
    # Test 2: Duplicate Prevention / Idempotency Check
    # -------------------------------------------------------------
    print("▶️ TEST 2: Re-sending exact same payload (Duplicate Check)...")
    response_dup = requests.post(f"{BASE_URL}/sync/batch", json=payload)
    
    res_dup_data = response_dup.json()
    print(f"   Status Code: {response_dup.status_code}")
    print(f"   Processed: {res_dup_data['processed']}, Skipped: {res_dup_data['skipped_duplicates']}, Failed: {res_dup_data['failed']}")
    
    assert res_dup_data['processed'] == 0, f"Expected 0 processed, got {res_dup_data['processed']}"
    assert res_dup_data['skipped_duplicates'] == 3, f"Expected 3 skipped, got {res_dup_data['skipped_duplicates']}"
    print("   ✅ Test 2 Passed: Duplicate client_event_ids correctly skipped.\n")

    # -------------------------------------------------------------
    # Test 3: Database Verification
    # -------------------------------------------------------------
    print("▶️ TEST 3: Verifying SQLite Database Records...")
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Verify processed_sync_events
    cursor.execute("SELECT COUNT(*) FROM processed_sync_events WHERE client_event_id IN ('evt-med-001', 'evt-hyd-002', 'evt-game-003')")
    processed_count = cursor.fetchone()[0]
    assert processed_count == 3, f"Expected 3 records in processed_sync_events, found {processed_count}"

    # Verify daily_adherence
    cursor.execute("SELECT medication_taken, hydration_ml FROM daily_adherence WHERE client_event_id = 'evt-med-001'")
    med_row = cursor.fetchone()
    assert med_row is not None and med_row[0] == 1, "Medication record not matching in daily_adherence"

    # Verify game_sessions
    cursor.execute("SELECT game_type, score FROM game_sessions WHERE client_event_id = 'evt-game-003'")
    game_row = cursor.fetchone()
    assert game_row is not None and game_row[0] == "memory_village" and game_row[1] == 85, "Game session record not matching"

    conn.close()
    print("   ✅ Test 3 Passed: All database entries verified directly in SQLite.\n")

    print("🎉 All Sync API Tests Passed Successfully!")

if __name__ == "__main__":
    try:
        run_sync_tests()
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to FastAPI server at http://127.0.0.1:8000. Ensure uvicorn is running.")