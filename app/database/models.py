from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class MentorModel:
    mentor_id: str
    name: str
    title: str
    organization: str
    bio: str
    availability: str
    domain: str
    skills: List[str] = field(default_factory=list)

@dataclass
class MentorshipRequestModel:
    request_id: str
    mentor_id: str
    user_id: str
    message: str
    status: str
    created_at: str

@dataclass
class StudentProfileModel:
    user_id: str
    name: str
    college: Optional[str]
    qualification: Optional[str]
    skills: List[str]
    interests: List[str]
    preferred_role: Optional[str]
    team_preference: Optional[str]
    availability_time: Optional[str] = "Flexible"
    hackathons_participated: int = 0
    hackathons_won: int = 0

@dataclass
class TeamMemberModel:
    user_id: str
    role: str

@dataclass
class TeamModel:
    team_id: str
    name: str
    creator_user_id: str
    hackathon_id: Optional[str]
    created_at: str
    members: List[TeamMemberModel] = field(default_factory=list)
