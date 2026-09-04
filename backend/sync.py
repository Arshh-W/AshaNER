import sqlite3
import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from auth import get_current_user

router = APIRouter(prefix="/sync", tags=["Offline Sync"])
DB_NAME = "dementia_care.db"

class SyncEventItem(BaseModel):
    client_event_id: str
    event_type: str  # 'MEDICATION', 'HYDRATION', 'GAME'
    patient_id: int
    timestamp_utc: str
    data: Dict[str, Any]

class BatchSyncPayload(BaseModel):
    device_id: Optional[str] = "unknown_device"
    synced_at: str
    events: List[SyncEventItem]

class SyncResponseItem(BaseModel):
    client_event_id: str
    status: str  # 'SUCCESS', 'SKIPPED_DUPLICATE', 'FAILED'
    message: Optional[str] = None

class BatchSyncResponse(BaseModel):
    processed: int
    skipped_duplicates: int
    failed: int
    details: List[SyncResponseItem]


@router.post("/batch", response_model=BatchSyncResponse, status_code=status.HTTP_207_MULTI_STATUS)
def batch_sync_offline_data(
    payload: BatchSyncPayload,
    # current_user: dict = Depends(get_current_user)
):
    """
    Ingests batched events logged by the frontend while offline.
    Idempotent: Uses client_event_id to skip duplicate submissions.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    processed = 0
    skipped = 0
    failed = 0
    details = []

    for event in payload.events:
        # 1. Idempotency Check
        cursor.execute(
            "SELECT 1 FROM processed_sync_events WHERE client_event_id = ?",
            (event.client_event_id,)
        )
        if cursor.fetchone():
            skipped += 1
            details.append(SyncResponseItem(
                client_event_id=event.client_event_id,
                status="SKIPPED_DUPLICATE",
                message="Event already processed."
            ))
            continue

        try:
            # 2. Process according to event type
            if event.event_type == "MEDICATION":
                taken = 1 if event.data.get("taken", True) else 0
                log_date = event.timestamp_utc[:10]  # Extracts YYYY-MM-DD
                cursor.execute(
                    """
                    INSERT INTO daily_adherence (patient_id, medication_taken, log_date, client_event_id)
                    VALUES (?, ?, ?, ?)
                    """,
                    (event.patient_id, taken, log_date, event.client_event_id)
                )

            elif event.event_type == "HYDRATION":
                amount = event.data.get("amount_ml", 250)
                log_date = event.timestamp_utc[:10]
                cursor.execute(
                    """
                    INSERT INTO daily_adherence (patient_id, hydration_ml, log_date, client_event_id)
                    VALUES (?, ?, ?, ?)
                    """,
                    (event.patient_id, amount, log_date, event.client_event_id)
                )

            elif event.event_type == "GAME":
                local_session_id = event.data.get("local_session_id", f"sess_{event.client_event_id}")
                game_type = event.data.get("game_type", "memory_village")
                score = event.data.get("score", 0)
                duration = event.data.get("duration_seconds", 60.0)
                errors = event.data.get("total_errors", 0)

                cursor.execute(
                    """
                    INSERT INTO game_sessions 
                    (local_session_id, patient_id, game_type, score, duration_seconds, total_errors, created_at, client_event_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (local_session_id, event.patient_id, game_type, score, duration, errors, event.timestamp_utc, event.client_event_id)
                )

            else:
                failed += 1
                details.append(SyncResponseItem(
                    client_event_id=event.client_event_id,
                    status="FAILED",
                    message=f"Unsupported event_type: {event.event_type}"
                ))
                continue

            # 3. Log event into processed_sync_events
            cursor.execute(
                """
                INSERT INTO processed_sync_events (client_event_id, event_type, patient_id)
                VALUES (?, ?, ?)
                """,
                (event.client_event_id, event.event_type, event.patient_id)
            )

            conn.commit()
            processed += 1
            details.append(SyncResponseItem(
                client_event_id=event.client_event_id,
                status="SUCCESS"
            ))

        except Exception as e:
            conn.rollback()
            failed += 1
            details.append(SyncResponseItem(
                client_event_id=event.client_event_id,
                status="FAILED",
                message=str(e)
            ))

    conn.close()

    return BatchSyncResponse(
        processed=processed,
        skipped_duplicates=skipped,
        failed=failed,
        details=details
    )