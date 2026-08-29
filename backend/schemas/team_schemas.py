from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TeamCreate(BaseModel):
    name: str
    description: Optional[str] = None
    hackathon_id: Optional[int] = None
    created_by: int

class TeamJoinRequest(BaseModel):
    user_id: int

class TeamMemberResponse(BaseModel):
    user_id: int
    role_in_team: str
    joined_at: datetime

class TeamResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    hackathon_id: Optional[int]
    created_by: int
    max_members: int
    created_at: datetime
    members: List[TeamMemberResponse] = []
