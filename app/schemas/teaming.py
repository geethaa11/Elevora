from pydantic import BaseModel, Field, model_validator
from typing import List, Optional

class StudentProfileCreate(BaseModel):
    name: Optional[str] = "Student User"
    college: Optional[str] = None
    qualification: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    preferred_role: Optional[str] = None
    team_preference: Optional[str] = None
    availability_time: str = Field(default="Flexible")
    hackathons_participated: int = Field(default=0, ge=0)
    hackathons_won: int = Field(default=0, ge=0)

    @model_validator(mode="after")
    def validate_fields(self):
        if not self.availability_time or not self.availability_time.strip():
            raise ValueError("availability_time cannot be empty")
        if self.hackathons_participated < 0:
            raise ValueError("hackathons_participated must be >= 0")
        if self.hackathons_won < 0:
            raise ValueError("hackathons_won must be >= 0")
        if self.hackathons_won > self.hackathons_participated:
            raise ValueError("hackathons_won cannot exceed hackathons_participated")
        return self

class StudentProfileResponse(BaseModel):
    user_id: str
    name: str
    college: Optional[str] = None
    qualification: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    preferred_role: Optional[str] = None
    team_preference: Optional[str] = None
    availability_time: str = "Flexible"
    hackathons_participated: int = 0
    hackathons_won: int = 0

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
    availability_time: str = "Flexible"
    hackathons_participated: int = 0
    hackathons_won: int = 0
    match_score: int

class TeamMatchResponse(BaseModel):
    items: List[TeamMatch]
    count: int

# --- Graph + DP Matching Schemas ---

class GraphMatchRequest(BaseModel):
    team_size: int = Field(default=3, ge=2, le=5)

    @model_validator(mode="after")
    def validate_team_size(self):
        if self.team_size < 2 or self.team_size > 5:
            raise ValueError("team_size must be between 2 and 5")
        return self

class TeamMemberMatchDetail(BaseModel):
    user_id: str
    name: str
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    preferred_role: Optional[str] = None
    availability_time: str = "Flexible"
    hackathons_participated: int = 0
    hackathons_won: int = 0
    compatibility_score: int
    shared_skills: List[str] = Field(default_factory=list)
    complementary_skills: List[str] = Field(default_factory=list)
    shared_interests: List[str] = Field(default_factory=list)
    availability_overlap: bool = True

class GraphMatchResponse(BaseModel):
    algorithm: str = "Graph + Dynamic Programming (DP) Team Optimizer"
    requested_team_size: int
    source_user_id: str
    team_overall_score: int
    selected_team_members: List[TeamMemberMatchDetail] = Field(default_factory=list)
    explanation: str
