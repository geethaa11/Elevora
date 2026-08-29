from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from pydantic import BaseModel

from app.database import get_session
from app.models import User, UserProfile, Team, TeamMemberLink
from app.utils.auth import get_current_user
from app.utils.response import send_success, send_error

router = APIRouter(tags=["Student Teaming"])

class CreateTeamInput(BaseModel):
    name: str

@router.get("/team-matches/me")
def get_team_matches(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Retrieve recommended teammate matches based on skills and interest alignment."""
    # Fetch current user's profile
    stmt_my_profile = select(UserProfile).where(UserProfile.user_id == current_user.id)
    my_profile = session.exec(stmt_my_profile).first()
    
    if not my_profile:
        return send_error(
            code="PROFILE_REQUIRED",
            message="Please create a developer profile first before matching.",
            status_code=400
        )
        
    my_skills = set(s.lower() for s in my_profile.skills)
    my_interests = set(i.lower() for i in my_profile.interests)
    
    # Fetch all other profiles
    stmt_others = select(UserProfile).where(UserProfile.user_id != current_user.id)
    other_profiles = session.exec(stmt_others).all()
    
    matches = []
    for other in other_profiles:
        other_user = session.get(User, other.user_id)
        if not other_user:
            continue
            
        other_skills = set(s.lower() for s in other.skills)
        other_interests = set(i.lower() for i in other.interests)
        
        # Scoring logic
        skills_overlap = len(my_skills.intersection(other_skills))
        interests_overlap = len(my_interests.intersection(other_interests))
        
        # Calculate matching score: base 50 + 15 per skill + 10 per interest
        score = 50 + (skills_overlap * 15) + (interests_overlap * 10)
        score = min(score, 99) # Cap match score at 99
        
        matches.append({
            "userId": other.user_id,
            "name": other_user.name,
            "skills": other.skills,
            "matchScore": score
        })
        
    # Sort matches by score descending
    matches.sort(key=lambda x: x["matchScore"], reverse=True)
    
    return send_success(data={"matches": matches})

@router.post("/teams")
def create_team(
    data: CreateTeamInput,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new team. The creator automatically joins as owner and first member."""
    # Create the team
    team = Team(name=data.name, owner_id=current_user.id)
    session.add(team)
    session.commit()
    session.refresh(team)
    
    # Add owner to team members list
    link = TeamMemberLink(team_id=team.id, user_id=current_user.id)
    session.add(link)
    session.commit()
    
    # Fetch team again to load members
    session.refresh(team)
    
    # Format member output
    members_data = [{"id": u.id, "name": u.name, "email": u.email} for u in team.members]
    
    return send_success(
        data={
            "id": team.id,
            "name": team.name,
            "owner_id": team.owner_id,
            "members": members_data
        },
        status_code=201
    )

@router.post("/teams/{team_id}/join")
def join_team(
    team_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Join an existing team. Checks for existence, duplicate memberships, and appends."""
    # Verify team exists
    team = session.get(Team, team_id)
    if not team:
        return send_error(
            code="TEAM_NOT_FOUND",
            message=f"Team with ID {team_id} does not exist.",
            status_code=404
        )
        
    # Check if already a member
    stmt_member = select(TeamMemberLink).where(
        TeamMemberLink.team_id == team_id,
        TeamMemberLink.user_id == current_user.id
    )
    existing_member = session.exec(stmt_member).first()
    if existing_member:
        return send_error(
            code="ALREADY_MEMBER",
            message="You are already a member of this team.",
            status_code=400
        )
        
    # Join team
    link = TeamMemberLink(team_id=team_id, user_id=current_user.id)
    session.add(link)
    session.commit()
    
    # Reload team members
    session.refresh(team)
    members_data = [{"id": u.id, "name": u.name, "email": u.email} for u in team.members]
    
    return send_success(
        data={
            "id": team.id,
            "name": team.name,
            "owner_id": team.owner_id,
            "members": members_data
        },
        status_code=200
    )

@router.get("/teams/{team_id}")
def get_team_detail(
    team_id: int,
    session: Session = Depends(get_session)
):
    """Retrieve details and member list of a team by ID."""
    team = session.get(Team, team_id)
    if not team:
        return send_error(
            code="TEAM_NOT_FOUND",
            message=f"Team with ID {team_id} does not exist.",
            status_code=404
        )
        
    members_data = [{"id": u.id, "name": u.name, "email": u.email} for u in team.members]
    
    return send_success(
        data={
            "id": team.id,
            "name": team.name,
            "owner_id": team.owner_id,
            "members": members_data
        },
        status_code=200
    )
