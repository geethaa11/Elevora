import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.db_models import User, StudentProfile
from backend.schemas.user_schemas import StudentProfileBase, UserResponse, MatchResponse
from typing import List
from backend.services.matching_service import get_matches_for_user
from backend.services.auth_service import get_current_user
from backend.services.neo4j_service import sync_student_profile

router = APIRouter(prefix="/api/v1/users", tags=["users"])

def parse_profile(profile):
    if not profile:
        return None
    return {
        "purpose": profile.purpose,
        "education": profile.education,
        "college_name": profile.college_name,
        "preferred_role": profile.preferred_role,
        "teaming_preference": profile.teaming_preference,
        "interests": json.loads(profile.interests) if profile.interests else [],
        "skills": json.loads(profile.skills) if profile.skills else [],
        "hackathon_interests": json.loads(profile.hackathon_interests) if profile.hackathon_interests else []
    }

def format_user_response(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "contact": user.contact,
        "profile": parse_profile(user.profile)
    }

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return format_user_response(user)

@router.post("/{user_id}/onboarding")
def onboarding(user_id: int, request: StudentProfileBase, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this user")
        
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = StudentProfile(user_id=user_id)
        db.add(profile)
        
    profile.purpose = request.purpose
    profile.education = request.education
    profile.college_name = request.college_name
    profile.preferred_role = request.preferred_role
    profile.teaming_preference = request.teaming_preference
    profile.interests = json.dumps(request.interests)
    profile.skills = json.dumps(request.skills)
    profile.hackathon_interests = json.dumps(request.hackathon_interests)
    
    db.commit()
    db.refresh(profile)
    
    background_tasks.add_task(sync_student_profile, user_id, request.skills or [], request.interests or [])
    
    user = db.query(User).filter(User.id == user_id).first()
    return {"success": True, "profile": format_user_response(user)["profile"]}

@router.put("/{user_id}", response_model=StudentProfileBase)
def update_profile(user_id: int, request: StudentProfileBase, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this user")
        
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Complete onboarding first.")
        
    # Partial update logic
    update_data = request.dict(exclude_unset=True)
    if 'purpose' in update_data: profile.purpose = update_data['purpose']
    if 'education' in update_data: profile.education = update_data['education']
    if 'college_name' in update_data: profile.college_name = update_data['college_name']
    if 'preferred_role' in update_data: profile.preferred_role = update_data['preferred_role']
    if 'teaming_preference' in update_data: profile.teaming_preference = update_data['teaming_preference']
    
    if 'interests' in update_data: profile.interests = json.dumps(update_data['interests'])
    if 'skills' in update_data: profile.skills = json.dumps(update_data['skills'])
    if 'hackathon_interests' in update_data: profile.hackathon_interests = json.dumps(update_data['hackathon_interests'])
    
    db.commit()
    db.refresh(profile)
    
    # Send current skills/interests from request if present, else load from db
    current_skills = update_data.get('skills', json.loads(profile.skills) if profile.skills else [])
    current_interests = update_data.get('interests', json.loads(profile.interests) if profile.interests else [])
    background_tasks.add_task(sync_student_profile, user_id, current_skills, current_interests)
    
    user = db.query(User).filter(User.id == user_id).first()
    return format_user_response(user)["profile"]
