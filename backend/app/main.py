import os
import json
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Ensure environment variables are loaded immediately, before other imports
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlmodel import Session, select

from app.database import create_db_and_tables, engine
from app.models import Hackathon, Mentor
from app.utils.response import (
    send_success,
    http_exception_handler,
    validation_exception_handler
)

# Import all core feature routers
from app.routers import auth, users, hackathons, ai, mentors, teaming

def seed_database():
    """Seed the SQLite database with mock JSON data if tables are empty."""
    app_dir = os.path.dirname(os.path.abspath(__file__))
    mocks_dir = os.path.join(app_dir, "..", "mocks")

    with Session(engine) as session:
        # Seed Hackathons only if Hackathons table is empty
        statement_hackathons = select(Hackathon)
        if not session.exec(statement_hackathons).first():
            hackathons_file = os.path.join(mocks_dir, "hackathons.json")
            if os.path.exists(hackathons_file):
                with open(hackathons_file, "r") as f:
                    hackathons_data = json.load(f)
                    for h in hackathons_data:
                        # Explicitly map keys to SQLModel schema fields
                        hackathon = Hackathon(
                            id=h.get("id"),
                            name=h.get("name"),
                            organization=h.get("organization"),
                            deadline=h.get("deadline"),
                            domain=h.get("domain"),
                            eligibility=h.get("eligibility"),
                            registration_url=h.get("registration_url")
                        )
                        session.add(hackathon)
                session.commit()
                print("Database seeded with mock hackathons.")
            else:
                print(f"Warning: Mock hackathons file not found at {hackathons_file}")
                
        # Seed Mentors only if Mentors table is empty
        statement_mentors = select(Mentor)
        if not session.exec(statement_mentors).first():
            mentors_file = os.path.join(mocks_dir, "mentors.json")
            if os.path.exists(mentors_file):
                with open(mentors_file, "r") as f:
                    mentors_data = json.load(f)
                    for m in mentors_data:
                        # Explicitly map keys to SQLModel schema fields
                        mentor = Mentor(
                            id=m.get("id"),
                            name=m.get("name"),
                            expertise=m.get("expertise"),
                            rating=m.get("rating")
                        )
                        session.add(mentor)
                session.commit()
                print("Database seeded with mock mentors.")
            else:
                print(f"Warning: Mock mentors file not found at {mentors_file}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI Lifespan events manager for DB initialization and seeding."""
    # Run startup logic
    create_db_and_tables()
    seed_database()
    yield
    # Run shutdown logic (if any) here

app = FastAPI(
    title="Elevora API",
    description="API backend for the Elevora Hackathon Companion Platform.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [FRONTEND_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers for contract envelope compliance
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Include all core feature routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(hackathons.router)
app.include_router(ai.router)
app.include_router(mentors.router)
app.include_router(teaming.router)

@app.get("/health")
def health_check():
    """Diagnostic health check endpoint returning standard envelope."""
    return send_success(data={"status": "ok"})

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
