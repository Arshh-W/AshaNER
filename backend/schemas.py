from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

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

class SyncBatchRequest(BaseModel):
    sessions: List[GameSessionSyncPayload]

class SyncBatchResponse(BaseModel):
    status: str
    synced_count: int
    synced_session_ids: List[str]

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