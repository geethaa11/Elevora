from fastapi import APIRouter, Depends, HTTPException, status
from app.auth_utils import get_current_user_id
from app.schemas.teaming import (
    StudentProfileCreate,
    StudentProfileResponse,
    TeamCreate,
    TeamResponse,
    TeamMatchResponse
)
from app.services.teaming_service import (
    upsert_profile,
    get_profile_by_user_id,
    get_teammate_matches,
    create_team,
    get_team_by_id,
    join_team
)

router = APIRouter(prefix="/api/v1", tags=["Teaming"])

@router.post("/teaming/profile", response_model=StudentProfileResponse)
def post_student_profile(
    req: StudentProfileCreate,
    user_id: str = Depends(get_current_user_id)
):
    """
    Create or update the authenticated student's teaming profile.
    Requires Bearer JWT authentication.
    """
    return upsert_profile(user_id=user_id, data=req)

@router.get("/teaming/profile/{user_id}", response_model=StudentProfileResponse)
def get_student_profile(user_id: str):
    """
    Get a student's teaming profile by user_id.
    """
    profile = get_profile_by_user_id(user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "not_found",
                "message": f"Student profile for user '{user_id}' not found",
                "details": {}
            }
        )
    return profile

@router.get("/teaming/matches", response_model=TeamMatchResponse)
def get_matches(user_id: str = Depends(get_current_user_id)):
    """
    Return potential teammate matches with compatibility scores for the authenticated student.
    Requires Bearer JWT authentication.
    """
    return get_teammate_matches(current_user_id=user_id)

@router.post("/teams", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def post_create_team(
    req: TeamCreate,
    user_id: str = Depends(get_current_user_id)
):
    """
    Create a new team. The authenticated student becomes the creator and first member.
    Requires Bearer JWT authentication.
    """
    if not req.name or not req.name.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": "missing_field",
                "message": "Field 'name' is required",
                "details": {"field": "name"}
            }
        )
    return create_team(creator_user_id=user_id, data=req)

@router.get("/teams/{team_id}", response_model=TeamResponse)
def get_team(team_id: str):
    """
    Get team details and member list.
    """
    team = get_team_by_id(team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "not_found",
                "message": f"Team with id '{team_id}' not found",
                "details": {}
            }
        )
    return team

@router.post("/teams/{team_id}/join", response_model=TeamResponse)
def post_join_team(
    team_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Authenticated student joins an existing team.
    Requires Bearer JWT authentication.
    Returns 404 if team doesn't exist, 409 if user is already a member.
    """
    return join_team(team_id=team_id, user_id=user_id)
