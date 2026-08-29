from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.database import get_db
from backend.models.db_models import User
from backend.services.auth_service import get_current_user
from backend.services.verification_service import get_or_create_verification, submit_evidence, verify_email

router = APIRouter(prefix="/api/v1/verification", tags=["verification"])

class EvidenceRequest(BaseModel):
    evidence_text: str

class VerificationStatusResponse(BaseModel):
    user_id: int
    email_verified: bool
    student_verified: bool
    trust_status: str

@router.get("/status/{user_id}", response_model=VerificationStatusResponse)
def get_status(user_id: int, db: Session = Depends(get_db)):
    verification = get_or_create_verification(db, user_id)
    return {
        "user_id": verification.user_id,
        "email_verified": verification.email_verified,
        "student_verified": verification.student_verified,
        "trust_status": verification.trust_status
    }

@router.post("/submit-evidence")
def submit_student_evidence(
    request: EvidenceRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    try:
        success, verification = submit_evidence(db, current_user.id, request.evidence_text)
        if success:
            return {"success": True, "message": "Student verified successfully", "trust_status": verification.trust_status}
        else:
            raise HTTPException(status_code=400, detail="Invalid evidence. Ensure it is a valid .edu email.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Added a helper endpoint to simulate email verification since Firebase wasn't added
@router.post("/verify-email-mock")
def mock_verify_email(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    verification = verify_email(db, current_user.id)
    return {"success": True, "trust_status": verification.trust_status}
