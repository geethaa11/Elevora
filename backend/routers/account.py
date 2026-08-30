from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.db_models import User, StudentProfile, UserSettings, TeamMember, Team
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/api/v1/account", tags=["account"])

@router.delete("")
def delete_account(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Find all dependencies and delete them appropriately
    # 1. Profile
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if profile:
        db.delete(profile)
    
    # 2. Settings
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if settings:
        db.delete(settings)
        
    # 3. Team Member associations
    team_memberships = db.query(TeamMember).filter(TeamMember.user_id == current_user.id).all()
    for tm in team_memberships:
        db.delete(tm)
        
    # 4. Teams created by this user
    # If the user created teams, either reassign or delete them. For simplicity, delete them.
    teams_created = db.query(Team).filter(Team.created_by == current_user.id).all()
    for team in teams_created:
        # delete members first
        team_members = db.query(TeamMember).filter(TeamMember.team_id == team.id).all()
        for member in team_members:
            db.delete(member)
        db.delete(team)
        
    # Finally, delete user
    db.delete(current_user)
    db.commit()
    
    return {"message": "Account deleted successfully"}
