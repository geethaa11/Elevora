from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from pydantic import BaseModel

from app.database import get_session
from app.models import User
from app.utils.auth import hash_password, verify_password, create_access_token
from app.utils.response import send_success, send_error

router = APIRouter(prefix="/auth", tags=["Authentication"])

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(data: SignupRequest, session: Session = Depends(get_session)):
    """Register a new user account."""
    # Check if user email already exists
    statement = select(User).where(User.email == data.email)
    existing_user = session.exec(statement).first()
    
    if existing_user:
        return send_error(
            code="EMAIL_ALREADY_EXISTS", 
            message="A user with this email already exists.",
            status_code=400
        )
    
    # Hash password and save new user
    new_user = User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password)
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # Generate token
    token = create_access_token(user_id=new_user.id)
    
    return send_success(
        data={
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email
            },
            "token": token
        },
        status_code=201
    )

@router.post("/login")
def login(data: LoginRequest, session: Session = Depends(get_session)):
    """Authenticate an existing user account and return a token."""
    statement = select(User).where(User.email == data.email)
    user = session.exec(statement).first()
    
    if not user or not verify_password(data.password, user.hashed_password):
        return send_error(
            code="INVALID_CREDENTIALS",
            message="Invalid email or password.",
            status_code=401
        )
    
    token = create_access_token(user_id=user.id)
    
    return send_success(
        data={
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            },
            "token": token
        },
        status_code=200
    )
