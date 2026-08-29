import os
from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from sqlmodel import Session
from dotenv import load_dotenv

from app.database import get_session
from app.models import User

# Load environment variables
load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "super_secret_local_dev_token_2026_elevora")
ALGORITHM = "HS256"

# Password CryptContext utilizing bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTPBearer security scheme
security = HTTPBearer()

def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password matches the hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user_id: int, expires_delta: Optional[timedelta] = None) -> str:
    """Generate a JWT access token for a given user ID."""
    to_encode = {"sub": str(user_id)}
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7) # Default token duration is 7 days
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """Dependency that extracts the current user from a JWT Bearer token."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(status_code=401, detail="Invalid token details.")
        user_id = int(user_id_str)
    except (jwt.PyJWTError, ValueError):
        raise HTTPException(status_code=401, detail="Could not validate credentials.")
    
    user = session.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User account not found.")
    return user
