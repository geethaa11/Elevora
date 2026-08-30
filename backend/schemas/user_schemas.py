from pydantic import BaseModel
from typing import List, Optional, Any

class StudentProfileBase(BaseModel):
    purpose: Optional[str] = None
    education: Optional[str] = None
    college_name: Optional[str] = None
    preferred_role: Optional[str] = None
    teaming_preference: Optional[str] = None
    interests: Optional[List[str]] = []
    skills: Optional[List[str]] = []
    hackathon_interests: Optional[List[str]] = []

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    contact: Optional[str] = None
    profile: Optional[StudentProfileBase] = None

class MatchResponse(BaseModel):
    user_id: int
    name: str
    match_score: float
    shared_skills: List[str]
    shared_interests: List[str]
    complementary_skills: List[str] = []
    complementary_role: bool = False
    match_reasons: List[str] = []

class SwipeRequest(BaseModel):
    swiped_id: int
    action: str
