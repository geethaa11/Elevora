from pydantic import BaseModel
from typing import List, Optional

class MentorSchema(BaseModel):
    mentor_id: str
    name: str
    title: str
    organization: str
    skills: List[str]
    bio: str
    availability: str

class MentorListResponse(BaseModel):
    items: List[MentorSchema]
    count: int

class MentorshipRequestCreate(BaseModel):
    mentor_id: str
    message: str

class MentorshipRequestResponse(BaseModel):
    request_id: str
    mentor_id: str
    user_id: str
    message: str
    status: str = "pending"
    created_at: str
