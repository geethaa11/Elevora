import pytest
from unittest.mock import MagicMock
from backend.services.verification_service import get_or_create_verification, submit_evidence, verify_email
from backend.models.trust_models import UserVerification

def test_unverified_to_email_verified():
    mock_db = MagicMock()
    # Mock finding nothing initially, creating new verification
    mock_db.query().filter().first.return_value = None
    
    # We can mock get_or_create_verification behavior directly since it creates an object
    verif = UserVerification(user_id=1, trust_status="Unverified", email_verified=False)
    
    def mock_get(*args):
        return verif
        
    import backend.services.verification_service as vs
    vs.get_or_create_verification = mock_get
    
    result = vs.verify_email(mock_db, 1)
    
    assert result.email_verified == True
    assert result.trust_status == "Email Verified"

def test_student_verification_success():
    mock_db = MagicMock()
    verif = UserVerification(user_id=1, trust_status="Email Verified", email_verified=True)
    
    def mock_get(*args):
        return verif
        
    import backend.services.verification_service as vs
    vs.get_or_create_verification = mock_get
    
    mock_user = MagicMock()
    mock_user.email = "test@uni.edu"
    mock_db.query().filter().first.return_value = mock_user
    
    success, result = vs.submit_evidence(mock_db, 1, "test@university.edu")
    
    assert success == True
    assert result.student_verified == True
    assert result.trust_status == "Student Verified"

def test_cannot_skip_email_verification():
    mock_db = MagicMock()
    verif = UserVerification(user_id=1, trust_status="Unverified", email_verified=False)
    
    def mock_get(*args):
        return verif
        
    import backend.services.verification_service as vs
    vs.get_or_create_verification = mock_get
    
    with pytest.raises(ValueError):
        vs.submit_evidence(mock_db, 1, "test@university.edu")
