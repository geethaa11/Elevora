from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.db_models import User
from backend.schemas.auth_schemas import SignupRequest, LoginRequest, AuthResponse
from backend.services.auth_service import get_password_hash, verify_password, create_access_token
from datetime import timedelta

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/signup", response_model=AuthResponse)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    if request.role not in ["student", "mentor"]:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    db_user = db.query(User).filter(User.email == request.email).first()
    if db_user:
        raise HTTPException(status_code=409, detail="Email already registered")
        
    hashed_pwd = get_password_hash(request.password)
    new_user = User(
        name=request.name,
        email=request.email,
        password_hash=hashed_pwd,
        role=request.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": str(new_user.id)})
    return {"token": access_token, "user_id": new_user.id, "role": new_user.role}

@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"token": access_token, "user_id": user.id, "role": user.role}
