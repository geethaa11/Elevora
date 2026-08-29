from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from backend.database import get_db
from backend.models.db_models import Team, TeamMember, User
from backend.schemas.team_schemas import TeamCreate, TeamJoinRequest, TeamResponse
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/api/v1/teams", tags=["teams"])

def format_team_response(team):
    members = []
    for member in team.members:
        members.append({
            "user_id": member.user_id,
            "role_in_team": member.role_in_team,
            "joined_at": member.joined_at
        })
    return {
        "id": team.id,
        "name": team.name,
        "description": team.description,
        "hackathon_id": team.hackathon_id,
        "created_by": team.created_by,
        "max_members": team.max_members,
        "created_at": team.created_at,
        "members": members
    }

@router.post("", response_model=dict)
def create_team(request: TeamCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id != request.created_by:
        raise HTTPException(status_code=403, detail="Not authorized to create team for another user")
        
    team = Team(
        name=request.name,
        description=request.description,
        hackathon_id=request.hackathon_id,
        created_by=request.created_by
    )
    db.add(team)
    db.commit()
    db.refresh(team)
    
    leader = TeamMember(
        team_id=team.id,
        user_id=request.created_by,
        role_in_team="leader"
    )
    db.add(leader)
    db.commit()
    
    return {"team_id": team.id}

@router.post("/{team_id}/join")
def join_team(team_id: int, request: TeamJoinRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id != request.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to join team for another user")
        
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    if len(team.members) >= team.max_members:
        raise HTTPException(status_code=400, detail="Team is full")
        
    try:
        member = TeamMember(
            team_id=team_id,
            user_id=request.user_id,
            role_in_team="member"
        )
        db.add(member)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User is already in this team")
        
    return {"success": True}

@router.get("/{team_id}", response_model=TeamResponse)
def get_team(team_id: int, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return format_team_response(team)

@router.get("", response_model=List[TeamResponse])
def list_teams(db: Session = Depends(get_db)):
    teams = db.query(Team).all()
    return [format_team_response(team) for team in teams]
