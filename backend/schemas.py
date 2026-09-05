from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: str = "caregiver"
    name: Optional[str] = None

class UserProfile(BaseModel):
    id: int
    name: Optional[str] = None
    email: EmailStr
    role: str
    patient_id: Optional[int] = None
    patient_name: Optional[str] = None

# Patient Schemas
class PatientCreate(BaseModel):
    full_name: str = Field(..., example="Amit Das")
    age: int = Field(..., example=72)
    region: str = Field(..., example="Assam")
    preferred_language: str = Field(..., example="as-IN") # Assamese default

class PatientResponse(BaseModel):
    id: int
    caregiver_id: int
    full_name: str
    age: int
    region: str
    preferred_language: str

    class Config:
        from_attributes = True


class GameTypeEnum(str, Enum):
    MEMORY_VILLAGE = "memory_village"
    MEMORY_DETECTIVE = "memory_detective"
    ROUTINE_RESCUE = "routine_rescue"
    SOUND_OBJECT_MATCH = "sound_object"
    MEMORY_MOSAIC = "memory_mosaic"

class GameSessionSyncPayload(BaseModel):
    local_session_id: str
    patient_id: int
    game_type: GameTypeEnum
    score: int
    duration_seconds: float
    total_errors: int
    level_achieved: int = 1
    reaction_times_ms: List[float]
    created_at_offline: str
    avg_cdi: Optional[float] = None            # Cognitive Drift Index (0-1)
    avg_valence: Optional[float] = None        # Emotional valence (-1 to 1)
    triggered_reminiscence: Optional[bool] = False
    xai_reason: Optional[str] = None           # Plain-language XAI attribution

class SyncBatchRequest(BaseModel):
    sessions: List[GameSessionSyncPayload]

class SyncBatchResponse(BaseModel):
    status: str
    synced_count: int
    synced_session_ids: List[str]

class ReminderConfirmation(BaseModel):
    action: str = Field(..., pattern="^(taken|dismissed)$")

class VoiceCheckInRequest(BaseModel):
    transcript: str = ""
    locale: str = "en-IN"
    audio_samples: Optional[List[float]] = None
    sample_rate: int = 16000

# --- Caregiver Dashboard Schemas ---

class GameSessionResponse(BaseModel):
    id: int
    local_session_id: str
    patient_id: int
    game_type: str
    score: int
    duration_seconds: float
    total_errors: int
    created_at: str
    avg_cdi: Optional[float] = None
    avg_valence: Optional[float] = None
    triggered_reminiscence: bool = False
    xai_reason: Optional[str] = None

class PatientAlert(BaseModel):
    severity: str   # 'info' | 'warning' | 'critical'
    title: str
    detail: str
    created_at: str

class PatientSummaryResponse(BaseModel):
    patient: PatientResponse
    session_count: int
    latest_cdi: Optional[float] = None
    latest_valence: Optional[float] = None
    cdi_trend: List[float] = []          # oldest -> newest, for charting
    cdi_trend_dates: List[str] = []
    avg_valence_7d: Optional[float] = None
    reminiscence_triggers_7d: int = 0
    alerts: List[PatientAlert] = []

# --- Routine Schemas ---

class RoutineCreate(BaseModel):
    title: str = Field(..., example="BP Medicine")
    category: str = Field(..., example="medicine")  # medicine | hydration | appointment | walk | general
    scheduled_time: str = Field(..., example="10:00")
    notes: Optional[str] = None

class RoutineUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    scheduled_time: Optional[str] = None
    notes: Optional[str] = None
    active: Optional[bool] = None

class RoutineResponse(BaseModel):
    id: int
    patient_id: int
    title: str
    category: str
    scheduled_time: str
    notes: Optional[str] = None
    active: bool
    created_at: str

    class Config:
        from_attributes = True

# DDA Rules Engine Schema
class DDAEngineRequest(BaseModel):
    game_type: GameTypeEnum
    current_level: int = 1
    consecutive_errors: int
    last_action_latency_ms: float
    is_stalled: bool = False

class DDAEngineResponse(BaseModel):
    next_level: int
    expand_touch_targets: bool
    show_voice_hint: bool
    audio_prompt_key: Optional[str] = None # e.g., 'hint_water_plants' or 'hint_find_uncle'
    hint_message: Optional[str] = None


class TrajectoryPoint(BaseModel):
    date: str
    cognitive_drift: float
    speech_pause_sec: float
    vocal_shimmer: float

class TrajectoryResponse(BaseModel):
    patient_id: int
    timeframe_days: int
    trajectory: List[TrajectoryPoint]

class HeatmapCell(BaseModel):
    hour: int
    avg_valence: float
    avg_arousal: float
    agitation_risk: str # 'LOW', 'MODERATE', 'HIGH'

class SundowningHeatmapResponse(BaseModel):
    patient_id: int
    hourly_heatmap: List[HeatmapCell]

class AdherenceResponse(BaseModel):
    patient_id: int
    log_date: str
    medication_adherence_percentage: float
    hydration_percentage: float
    game_completion_rate: float

class XAIClinicalCard(BaseModel):
    event_id: str
    severity: str # 'INFO', 'WARNING', 'CRITICAL'
    title: str
    plain_language_summary: str # Targeted for ASHA/Community Workers
    clinical_recommendation: str
    detected_at: str