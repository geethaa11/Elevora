import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecretjwtkey123_elevora_2026")
DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./elevora.db")
DB_PATH: str = os.getenv("DB_PATH", "elevora.db")
