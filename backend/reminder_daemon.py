"""Offline routine reminder scheduler and adherence logger."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from threading import Event, Lock, Thread
from typing import Callable, Dict, Optional

try:
    from .database import DB_NAME, record_telemetry_tick
except ImportError:
    from database import DB_NAME, record_telemetry_tick


PROMPTS: Dict[str, Dict[str, str]] = {
    "en-IN": {
        "medicine": "It is time for your medicine.",
        "hydration": "Please drink some water.",
        "walk": "It is time for your daily walk.",
        "general": "It is time for your routine.",
    },
    "as-IN": {
        "medicine": "এতিয়া আপোনাৰ ঔষধ লোৱাৰ সময় হৈছে।",
        "hydration": "অনুগ্ৰহ কৰি অলপ পানী খাওক।",
        "walk": "এতিয়া আপোনাৰ দৈনিক খোজ কঢ়াৰ সময় হৈছে।",
        "general": "এতিয়া আপোনাৰ দৈনন্দিন কামৰ সময় হৈছে।",
    },
    "bn-IN": {
        "medicine": "এখন আপনার ওষুধ খাওয়ার সময়।",
        "hydration": "দয়া করে একটু জল পান করুন।",
        "walk": "এখন আপনার প্রতিদিনের হাঁটার সময়।",
        "general": "এখন আপনার দৈনন্দিন কাজের সময়।",
    },
}


@dataclass(frozen=True)
class Reminder:
    reminder_id: int
    patient_id: int
    title: str
    category: str
    scheduled_time: str
    notes: Optional[str]
    locale: str
    prompt: str


class OfflinePromptPlayer:
    """Resolve localized prompts without requiring a network TTS service."""

    def __init__(self, audio_root: Optional[str] = None):
        self.audio_root = Path(audio_root) if audio_root else None

    def resolve(self, reminder: Reminder) -> dict:
        audio_path = None
        if self.audio_root:
            candidate = self.audio_root / reminder.locale / f"{reminder.category}.wav"
            if candidate.is_file():
                audio_path = str(candidate)
        return {"text": reminder.prompt, "audio_path": audio_path, "locale": reminder.locale}


class RoutineReminderDaemon:
    """Poll local routines and notify a caller from a background thread."""

    def __init__(
        self,
        db_path: str = DB_NAME,
        on_reminder: Optional[Callable[[Reminder], None]] = None,
        prompt_player: Optional[OfflinePromptPlayer] = None,
        poll_seconds: float = 30.0,
    ):
        self.db_path = db_path
        self.on_reminder = on_reminder
        self.prompt_player = prompt_player or OfflinePromptPlayer()
        self.poll_seconds = poll_seconds
        self._stop_event = Event()
        self._thread: Optional[Thread] = None
        self._notified: set[tuple[int, str]] = set()
        self._lock = Lock()

    def due_reminders(self, at: Optional[datetime] = None) -> list[Reminder]:
        now = at or datetime.now()
        scheduled_time = now.strftime("%H:%M")
        import sqlite3

        conn = sqlite3.connect(self.db_path)
        rows = conn.execute(
            """
            SELECT id, patient_id, title, category, scheduled_time, notes,
                   COALESCE((SELECT preferred_language FROM patients WHERE patients.id = routines.patient_id), 'en-IN')
            FROM routines
            WHERE active = 1 AND scheduled_time = ?
            """,
            (scheduled_time,),
        ).fetchall()
        conn.close()
        reminders = []
        for row in rows:
            locale = row[6] if row[6] in PROMPTS else "en-IN"
            prompt = PROMPTS[locale].get(row[3], PROMPTS[locale]["general"])
            reminders.append(Reminder(*row[:6], locale, prompt))
        return reminders

    def poll_once(self, at: Optional[datetime] = None) -> list[Reminder]:
        now = at or datetime.now()
        day_key = now.strftime("%Y-%m-%d")
        emitted = []
        with self._lock:
            for reminder in self.due_reminders(now):
                key = (reminder.reminder_id, day_key)
                if key in self._notified:
                    continue
                self._notified.add(key)
                emitted.append(reminder)
                if self.on_reminder:
                    self.on_reminder(reminder)
        return emitted

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._stop_event.clear()
        self._thread = Thread(target=self._run, name="offline-reminder-daemon", daemon=True)
        self._thread.start()

    def stop(self, timeout: float = 2.0) -> None:
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout)
            self._thread = None

    def confirm(self, reminder_id: int, patient_id: int, action: str, locale: str = "en-IN") -> int:
        if action not in {"taken", "dismissed"}:
            raise ValueError("action must be 'taken' or 'dismissed'")
        event_action = 10 if action == "taken" else 11
        event_type = "reminder_ack" if action == "taken" else "reminder_dismiss"
        return record_telemetry_tick(
            f"routine-{patient_id}-{reminder_id}",
            event_action,
            event_type=event_type,
            reminder_id=reminder_id,
            patient_id=patient_id,
            locale=locale,
            detail="Medicine taken" if action == "taken" else "Reminder dismissed",
            db_path=self.db_path,
        )

    def _run(self) -> None:
        while not self._stop_event.is_set():
            self.poll_once()
            self._stop_event.wait(self.poll_seconds)
