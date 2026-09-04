"""Offline voice check-in and keyword intent parsing."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Sequence

try:
    from .database import DB_NAME, record_telemetry_tick
except ImportError:
    from database import DB_NAME, record_telemetry_tick


DIALOG_PROMPTS = {
    "en-IN": "Did you have your morning tea?",
    "as-IN": "আপুনি ৰাতিপুৱা চাহ খাইছিলনে?",
    "bn-IN": "আপনি কি সকালে চা খেয়েছেন?",
}


@dataclass(frozen=True)
class VoiceIntent:
    name: str
    confidence: float
    matched_phrase: str


class KeywordSpotter:
    """Small deterministic fallback for offline speech recognizer output."""

    PHRASES = {
        "affirmative": {
            "en-IN": ("yes", "yeah", "had it", "done", "taken"),
            "as-IN": ("হয়", "খাইছিলোঁ", "লৈছোঁ"),
            "bn-IN": ("হ্যাঁ", "খেয়েছি", "নিয়েছি"),
        },
        "negative": {
            "en-IN": ("no", "not yet", "did not", "haven't"),
            "as-IN": ("নাই", "খোৱা নাই"),
            "bn-IN": ("না", "এখনও নয়", "খাইনি"),
        },
        "medicine_taken": {
            "en-IN": ("medicine taken", "took my medicine", "tablet taken"),
            "as-IN": ("ঔষধ খালোঁ",),
            "bn-IN": ("ওষুধ খেয়েছি",),
        },
        "dismiss": {
            "en-IN": ("dismiss", "later", "skip"),
            "as-IN": ("পিছত",),
            "bn-IN": ("পরে", "বন্ধ করুন"),
        },
    }

    def detect(self, transcript: str, locale: str = "en-IN") -> Optional[VoiceIntent]:
        normalized = transcript.strip().lower()
        phrases = self.PHRASES.get("affirmative", {}).get(locale, ())
        candidates = []
        for intent_name, by_locale in self.PHRASES.items():
            for phrase in by_locale.get(locale, ()):
                if phrase.lower() in normalized:
                    candidates.append((len(phrase), intent_name, phrase))
        if not candidates:
            return None
        _, name, phrase = max(candidates)
        confidence = min(0.99, 0.65 + len(phrase) / max(len(normalized), 1) * 0.35)
        return VoiceIntent(name, round(confidence, 3), phrase)


def extract_acoustic_features(audio_samples: Sequence[float], sample_rate: int = 16000):
    """Forward PCM samples to the existing 32-dimensional acoustic extractor."""
    try:
        import numpy as np
        from .ml_pipeline.features.acoustic import AcousticBiomarkerExtractor
    except ImportError:
        import numpy as np
        from ml_pipeline.features.acoustic import AcousticBiomarkerExtractor

    return AcousticBiomarkerExtractor(sample_rate).extract_features(np.asarray(audio_samples, dtype=np.float32))


def process_check_in(
    transcript: str,
    *,
    patient_id: Optional[int] = None,
    session_id: str = "voice-check-in",
    locale: str = "en-IN",
    audio_samples: Optional[Sequence[float]] = None,
    sample_rate: int = 16000,
    db_path: str = DB_NAME,
) -> dict:
    """Parse an offline transcript and optionally extract prosody features."""
    locale = locale if locale in DIALOG_PROMPTS else "en-IN"
    intent = KeywordSpotter().detect(transcript, locale)
    features = None
    if audio_samples is not None:
        features = extract_acoustic_features(audio_samples, sample_rate).tolist()
    if patient_id is not None:
        record_telemetry_tick(
            session_id,
            20 if intent else 21,
            latency_ms=0.0,
            valence=0.2 if intent and intent.name == "affirmative" else 0.0,
            event_type="voice_checkin",
            patient_id=patient_id,
            locale=locale,
            detail=intent.name if intent else "unknown",
            db_path=db_path,
        )
    return {
        "intent": intent.name if intent else "unknown",
        "confidence": intent.confidence if intent else 0.0,
        "matched_phrase": intent.matched_phrase if intent else None,
        "prompt": DIALOG_PROMPTS[locale],
        "locale": locale,
        "acoustic_features": features,
    }
