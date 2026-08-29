from typing import Optional
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, col

from app.database import get_session
from app.models import Hackathon
from app.utils.response import send_success, send_error

router = APIRouter(prefix="/hackathons", tags=["Hackathons"])

@router.get("")
def get_hackathons(
    search: Optional[str] = None,
    domain: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """Retrieve all hackathons, optionally filtered by name/org search keyword and domain."""
    statement = select(Hackathon)
    
    # Apply search filter (case-insensitive check on name and organization)
    if search:
        search_lower = f"%{search.lower()}%"
        # Using col() to bypass type-checking constraints on custom fields
        statement = statement.where(
            (col(Hackathon.name).ilike(search_lower)) | 
            (col(Hackathon.organization).ilike(search_lower))
        )
        
    # Apply domain filter
    if domain:
        statement = statement.where(col(Hackathon.domain).ilike(domain))
        
    hackathons = session.exec(statement).all()
    
    # Serialize results to match JSON contract
    result_list = []
    for h in hackathons:
        result_list.append({
            "id": h.id,
            "name": h.name,
            "organization": h.organization,
            "deadline": h.deadline,
            "domain": h.domain,
            "eligibility": h.eligibility,
            "registration_url": h.registration_url
        })
        
    return send_success(data={"hackathons": result_list})

@router.get("/{hackathon_id}")
def get_hackathon(
    hackathon_id: int,
    session: Session = Depends(get_session)
):
    """Retrieve detail of a specific hackathon by ID."""
    hackathon = session.get(Hackathon, hackathon_id)
    
    if not hackathon:
        return send_error(
            code="HACKATHON_NOT_FOUND",
            message=f"Hackathon with ID {hackathon_id} was not found.",
            status_code=404
        )
        
    return send_success(
        data={
            "id": hackathon.id,
            "name": hackathon.name,
            "organization": hackathon.organization,
            "deadline": hackathon.deadline,
            "domain": hackathon.domain,
            "eligibility": hackathon.eligibility,
            "registration_url": hackathon.registration_url
        }
    )
