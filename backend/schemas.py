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

class SyncBatchRequest(BaseModel):
    sessions: List[GameSessionSyncPayload]

class SyncBatchResponse(BaseModel):
    status: str
    synced_count: int
    synced_session_ids: List[str]