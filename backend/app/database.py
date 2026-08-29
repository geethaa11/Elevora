import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session

# Load environment variables from backend/.env if available
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./elevora.db")

# SQLite check_same_thread workaround for FastAPI multi-threading
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)

def create_db_and_tables():
    """Create all SQLModel database tables if they do not exist."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency generator for database sessions."""
    with Session(engine) as session:
        yield session
