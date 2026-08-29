from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from pydantic import BaseModel

from app.database import get_session
from app.models import User, UserProfile
from app.utils.auth import get_current_user
from app.utils.response import send_success, send_error

router = APIRouter(prefix="/users", tags=["User Profiles"])

class ProfileRequest(BaseModel):
    skills: List[str]
    interests: List[str]
    bio: str

@router.post("")
def create_or_update_profile(
    data: ProfileRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create or update the profile of the currently authenticated user."""
    statement = select(UserProfile).where(UserProfile.user_id == current_user.id)
    profile = session.exec(statement).first()
    
    if profile:
        # Update existing profile
        profile.skills = data.skills
        profile.interests = data.interests
        profile.bio = data.bio
    else:
        # Create new profile
        profile = UserProfile(
            user_id=current_user.id,
            skills=data.skills,
            interests=data.interests,
            bio=data.bio
        )
        session.add(profile)
        
    session.commit()
    session.refresh(profile)
    
    return send_success(
        data={
            "id": profile.id,
            "user_id": profile.user_id,
            "skills": profile.skills,
            "interests": profile.interests,
            "bio": profile.bio
        },
        status_code=200
    )

@router.get("/{user_id}")
def get_profile(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Retrieve the profile details of any user by their user ID. Requires authentication."""
    statement = select(UserProfile).where(UserProfile.user_id == user_id)
    profile = session.exec(statement).first()
    
    if not profile:
        return send_error(
            code="PROFILE_NOT_FOUND",
            message=f"Profile for user ID {user_id} was not found.",
            status_code=404
        )
        
    return send_success(
        data={
            "id": profile.id,
            "user_id": profile.user_id,
            "skills": profile.skills,
            "interests": profile.interests,
            "bio": profile.bio
        },
        status_code=200
    )
