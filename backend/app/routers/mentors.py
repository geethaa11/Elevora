from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from pydantic import BaseModel

from app.database import get_session
from app.models import Mentor, MentorRequest, User
from app.utils.auth import get_current_user
from app.utils.response import send_success, send_error

router = APIRouter(prefix="/mentors", tags=["Mentor Marketplace"])

class MentorRequestInput(BaseModel):
    mentorId: int
    message: str

@router.get("")
def get_mentors(session: Session = Depends(get_session)):
    """Retrieve list of all mentors."""
    statement = select(Mentor)
    mentors = session.exec(statement).all()
    
    result = []
    for m in mentors:
        result.append({
            "id": m.id,
            "name": m.name,
            "expertise": m.expertise,
            "rating": m.rating
        })
        
    return send_success(data={"mentors": result})

@router.get("/{mentor_id}")
def get_mentor_detail(mentor_id: int, session: Session = Depends(get_session)):
    """Retrieve details for a single mentor."""
    mentor = session.get(Mentor, mentor_id)
    if not mentor:
        return send_error(
            code="MENTOR_NOT_FOUND",
            message=f"Mentor with ID {mentor_id} was not found.",
            status_code=404
        )
        
    return send_success(
        data={
            "id": mentor.id,
            "name": mentor.name,
            "expertise": mentor.expertise,
            "rating": mentor.rating
        }
    )

@router.post("/request")
def request_mentor(
    data: MentorRequestInput,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Submit a request to connect with a mentor. Requires authentication."""
    # Verify mentor exists
    mentor = session.get(Mentor, data.mentorId)
    if not mentor:
        return send_error(
            code="MENTOR_NOT_FOUND",
            message=f"Mentor with ID {data.mentorId} does not exist.",
            status_code=404
        )
        
    # Create request
    request_record = MentorRequest(
        mentor_id=data.mentorId,
        user_id=current_user.id,
        message=data.message,
        status="pending"
    )
    session.add(request_record)
    session.commit()
    session.refresh(request_record)
    
    return send_success(
        data={
            "requestId": request_record.id,
            "status": request_record.status
        },
        status_code=201
    )
