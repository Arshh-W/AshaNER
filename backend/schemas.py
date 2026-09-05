from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from enum import Enum


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    role: str = Field(default="caregiver")

    # Patient registration fields. They are validated as required by the
    # registration endpoint when role == "patient".
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    region: Optional[str] = None
    preferred_language: Optional[str] = "en-IN"
    caregiver_relationship: Optional[str] = None
    caregiver_code: Optional[str] = None


class PatientCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    date_of_birth: str
    gender: str
    phone: str
    address: str
    city: str
    district: str
    state: str
    region: Optional[str] = None
    preferred_language: str = "en-IN"
    caregiver_relationship: Optional[str] = None
    caregiver_code: Optional[str] = None


class PatientUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    region: Optional[str] = None
    preferred_language: Optional[str] = None
    caregiver_relationship: Optional[str] = None


class PatientResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    caregiver_id: Optional[int] = None
    patient_code: str
    full_name: str
    date_of_birth: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    region: Optional[str] = None
    preferred_language: Optional[str] = None
    caregiver_relationship: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class CaregiverConnectRequest(BaseModel):
    patient_code: str = Field(..., min_length=6, max_length=32)


class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    role: str
    patient_id: Optional[int] = None
    patient_name: Optional[str] = None


class GameTypeEnum(str, Enum):
    MEMORY_VILLAGE = "memory_village"
    MEMORY_DETECTIVE = "memory_detective"
    ROUTINE_RESCUE = "routine_rescue"
    SOUND_OBJECT_MATCH = "sound_object"
    MEMORY_MOSAIC = "memory_mosaic"


class GameSessionSyncPayload(BaseModel):
    local_session_id: str
    # Kept for frontend compatibility, but the backend ignores this value
    # for patient ownership and derives the patient from the authenticated user.
    patient_id: Optional[int] = None
    game_type: GameTypeEnum
    score: int = Field(..., ge=0)
    duration_seconds: float = Field(..., ge=0)
    total_errors: int = Field(..., ge=0)
    level_achieved: int = Field(default=1, ge=1, le=5)
    reaction_times_ms: List[float] = Field(default_factory=list)
    created_at_offline: str
    avg_cdi: Optional[float] = None
    avg_valence: Optional[float] = None
    triggered_reminiscence: Optional[bool] = False
    xai_reason: Optional[str] = None


class SyncBatchRequest(BaseModel):
    sessions: List[GameSessionSyncPayload]


class SyncBatchResponse(BaseModel):
    status: str
    synced_count: int
    synced_session_ids: List[str]


class GameHistoryItem(BaseModel):
    id: int
    local_session_id: str
    patient_id: int
    game_type: str
    score: int
    duration_seconds: float
    total_errors: int
    level_achieved: int
    reaction_times_ms: List[float] = []
    average_reaction_time_ms: Optional[float] = None
    created_at: str
    avg_cdi: Optional[float] = None
    avg_valence: Optional[float] = None
    triggered_reminiscence: bool = False
    xai_reason: Optional[str] = None


class PatientGameStatsResponse(BaseModel):
    patient_id: int
    patient_name: str
    total_sessions_completed: int
    metrics: dict
    games: List[dict] = []
    recent_sessions: List[dict] = []
    history: List[dict] = []


class ReminderConfirmation(BaseModel):
    action: str = Field(..., pattern="^(taken|dismissed)$")


class VoiceCheckInRequest(BaseModel):
    transcript: str = ""
    locale: str = "en-IN"
    audio_samples: Optional[List[float]] = None
    sample_rate: int = 16000


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
    severity: str
    title: str
    detail: str
    created_at: str


class PatientSummaryResponse(BaseModel):
    patient: PatientResponse
    session_count: int
    latest_cdi: Optional[float] = None
    latest_valence: Optional[float] = None
    cdi_trend: List[float] = []
    cdi_trend_dates: List[str] = []
    avg_valence_7d: Optional[float] = None
    reminiscence_triggers_7d: int = 0
    alerts: List[PatientAlert] = []


class RoutineCreate(BaseModel):
    title: str = Field(..., example="BP Medicine")
    category: str = Field(..., example="medicine")
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
    audio_prompt_key: Optional[str] = None
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
    agitation_risk: str


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
    severity: str
    title: str
    plain_language_summary: str
    clinical_recommendation: str
    detected_at: str
