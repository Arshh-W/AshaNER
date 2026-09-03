from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Dementia care platform",
    version="1.0.0",
    description="Backend for cognitive games, offline sync and caregiver analytics"
)

origins = [
    "http://localhost:5173",  
    "http://localhost:3000", 
    "*"           
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Dementia Care Backend API is running smoothly."
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}