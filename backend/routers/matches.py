from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.schemas.user_schemas import MatchResponse
from backend.services.matching_service import get_matches_for_user

router = APIRouter(prefix="/api/v1/team-matches", tags=["matches"])

@router.get("/{user_id}", response_model=List[MatchResponse])
def get_team_matches(user_id: int, db: Session = Depends(get_db)):
    return get_matches_for_user(db, user_id)
