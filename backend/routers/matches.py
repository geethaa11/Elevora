from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from backend.database import get_db
from backend.models.db_models import User, SwipeAction
from backend.schemas.user_schemas import MatchResponse, SwipeRequest
from backend.services.matching_service import get_matches_for_user
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/api/v1/team-matches", tags=["matches"])

@router.get("/{user_id}", response_model=List[MatchResponse])
def get_team_matches(
    user_id: int, 
    limit: Optional[int] = 10,
    offset: Optional[int] = 0,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to get matches for another user")
    return get_matches_for_user(db, user_id, limit, offset)

@router.post("/interested")
def mark_interested(
    request: SwipeRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if request.action != "interested":
        raise HTTPException(status_code=400, detail="Invalid action for this endpoint")
        
    if current_user.id == request.swiped_id:
        raise HTTPException(status_code=400, detail="Cannot swipe on yourself")

    # Prevent duplicates (since SQLite raises IntegrityError on UNIQUE constraints)
    try:
        swipe = SwipeAction(swiper_id=current_user.id, swiped_id=request.swiped_id, action="interested")
        db.add(swipe)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Action already recorded")

    return {"success": True, "message": "Interest recorded"}

@router.post("/pass")
def mark_pass(
    request: SwipeRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if request.action != "pass":
        raise HTTPException(status_code=400, detail="Invalid action for this endpoint")
        
    if current_user.id == request.swiped_id:
        raise HTTPException(status_code=400, detail="Cannot swipe on yourself")

    try:
        swipe = SwipeAction(swiper_id=current_user.id, swiped_id=request.swiped_id, action="pass")
        db.add(swipe)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Action already recorded")

    return {"success": True, "message": "Pass recorded"}
