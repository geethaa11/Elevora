from pydantic import BaseModel, Field
from typing import List, Optional

class StudentProfileCreate(BaseModel):
    name: Optional[str] = "Student User"
    college: Optional[str] = None
    qualification: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    preferred_role: Optional[str] = None
    team_preference: Optional[str] = None

class StudentProfileResponse(BaseModel):
    user_id: str
    name: str
    college: Optional[str] = None
    qualification: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    preferred_role: Optional[str] = None
    team_preference: Optional[str] = None

class TeamCreate(BaseModel):
    name: str
    hackathon_id: Optional[str] = None

class TeamMember(BaseModel):
    user_id: str
    role: str = "Member"

class TeamResponse(BaseModel):
    team_id: str
    name: str
    creator_user_id: str
    hackathon_id: Optional[str] = None
    members: List[TeamMember] = Field(default_factory=list)
    created_at: str

class TeamMatch(BaseModel):
    user_id: str
    name: str
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    preferred_role: Optional[str] = None
    match_score: int

class TeamMatchResponse(BaseModel):
    items: List[TeamMatch]
    count: int
