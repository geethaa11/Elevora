from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.models import db_models, trust_models
from backend.routers import auth, users, teams, matches, verification

# Ensure DB tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Elevora API",
    description="Backend for Elevora - Student Teaming & Mentorship",
    version="1.0.0",
)

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:3000", # React
    "http://localhost:5173", # Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(teams.router)
app.include_router(matches.router)
app.include_router(verification.router)

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}
