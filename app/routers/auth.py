import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.auth_utils import create_access_token, get_current_user_id

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    user_id: str
    email: str
    name: str
    token: str

class UserMeResponse(BaseModel):
    user_id: str
    email: str
    role: str = "student"

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(req: SignupRequest):
    if not req.email or not req.email.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": "missing_field", "message": "Field 'email' is required", "details": {"field": "email"}}
        )
    if not req.password or len(req.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "invalid_input", "message": "Password must be at least 8 characters long", "details": {}}
        )
    if not req.name or not req.name.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": "missing_field", "message": "Field 'name' is required", "details": {"field": "name"}}
        )

    user_id = f"user_{uuid.uuid4().hex[:10]}"
    token = create_access_token(user_id=user_id, email=req.email)

    return AuthResponse(
        user_id=user_id,
        email=req.email,
        name=req.name,
        token=token
    )

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest):
    if not req.email or not req.email.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": "missing_field", "message": "Field 'email' is required", "details": {"field": "email"}}
        )
    if not req.password or not req.password.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": "missing_field", "message": "Field 'password' is required", "details": {"field": "password"}}
        )

    # Simple mock user resolution for login testing
    user_id = "user_123"
    token = create_access_token(user_id=user_id, email=req.email)

    return AuthResponse(
        user_id=user_id,
        email=req.email,
        name="Student User",
        token=token
    )

@router.get("/me", response_model=UserMeResponse)
def get_me(user_id: str = Depends(get_current_user_id)):
    return UserMeResponse(
        user_id=user_id,
        email="student@elevora.edu",
        role="student"
    )
