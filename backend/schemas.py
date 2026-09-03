from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

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