from sqlalchemy.orm import Session
from backend.models.trust_models import UserVerification
from backend.models.db_models import User

def get_or_create_verification(db: Session, user_id: int) -> UserVerification:
    verification = db.query(UserVerification).filter(UserVerification.user_id == user_id).first()
    if not verification:
        verification = UserVerification(user_id=user_id)
        db.add(verification)
        db.commit()
        db.refresh(verification)
    return verification

def verify_email(db: Session, user_id: int):
    verification = get_or_create_verification(db, user_id)
    if not verification.email_verified:
        verification.email_verified = True
        if verification.trust_status == "Unverified":
            verification.trust_status = "Email Verified"
        db.commit()
        db.refresh(verification)
    return verification

def submit_evidence(db: Session, user_id: int, evidence_text: str):
    """
    Evidence could be a domain check. 
    In a real app, this might accept an institution email for checking.
    """
    verification = get_or_create_verification(db, user_id)
    
    if verification.trust_status == "Unverified" or not verification.email_verified:
        raise ValueError("Must verify email before student verification")
        
    user = db.query(User).filter(User.id == user_id).first()
    
    # Simple check for demo: If evidence text is an email ending in .edu, or matches user email ending in .edu
    is_valid_student = evidence_text.strip().lower().endswith(".edu") or (user.email and user.email.lower().endswith(".edu"))
    
    if is_valid_student:
        verification.student_verified = True
        verification.trust_status = "Student Verified"
        db.commit()
        db.refresh(verification)
        return True, verification
        
    return False, verification
