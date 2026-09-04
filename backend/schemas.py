from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: str = "caregiver"

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

class GameSessionSyncPayload(BaseModel):
    local_session_id: str  # Generated in IndexedDB (UUID)
    patient_id: int
    game_type: str         # 'reminiscence_audio' or 'virtual_tea'
    score: int
    duration_seconds: float
    total_errors: int
    reaction_times_ms: List[float] # e.g. [1200.5, 2300.0, 1800.2]
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

class GameSessionSyncPayload(BaseModel):
    local_session_id: str  # Generated in IndexedDB (UUID)
    patient_id: int
    game_type: str         # 'reminiscence_audio' or 'virtual_tea'
    score: int
    duration_seconds: float
    total_errors: int
    reaction_times_ms: List[float] # e.g. [1200.5, 2300.0, 1800.2]
    created_at_offline: str

class SyncBatchRequest(BaseModel):
    sessions: List[GameSessionSyncPayload]

class SyncBatchResponse(BaseModel):
    status: str
    synced_count: int
    synced_session_ids: List[str]