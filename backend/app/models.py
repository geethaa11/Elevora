from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel, Column, JSON

class TeamMemberLink(SQLModel, table=True):
    """Junction table linking Users and Teams (Many-to-Many)."""
    __tablename__ = "teammemberlink"
    team_id: Optional[int] = Field(default=None, foreign_key="team.id", primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", primary_key=True)

class User(SQLModel, table=True):
    """User account model containing auth details."""
    __tablename__ = "user"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str

    # Relationships
    profile: Optional["UserProfile"] = Relationship(
        back_populates="user", 
        sa_relationship_kwargs={"uselist": False, "cascade": "all, delete-orphan"}
    )
    teams: List["Team"] = Relationship(back_populates="members", link_model=TeamMemberLink)

class UserProfile(SQLModel, table=True):
    """Developer profile model containing hackathon specific details."""
    __tablename__ = "userprofile"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True, index=True)
    skills: List[str] = Field(default=[], sa_column=Column(JSON))
    interests: List[str] = Field(default=[], sa_column=Column(JSON))
    bio: str

    # Relationships
    user: Optional[User] = Relationship(back_populates="profile")

class Hackathon(SQLModel, table=True):
    """Hackathon listing model."""
    __tablename__ = "hackathon"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    organization: str
    deadline: str
    domain: str
    eligibility: str
    registration_url: str

class Mentor(SQLModel, table=True):
    """Mentor profile model."""
    __tablename__ = "mentor"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    expertise: List[str] = Field(default=[], sa_column=Column(JSON))
    rating: float

class MentorRequest(SQLModel, table=True):
    """User request model to contact a Mentor."""
    __tablename__ = "mentorrequest"
    id: Optional[int] = Field(default=None, primary_key=True)
    mentor_id: int = Field(foreign_key="mentor.id")
    user_id: int = Field(foreign_key="user.id")
    message: str
    status: str = Field(default="pending")

class Team(SQLModel, table=True):
    """Team model grouping users for hacking."""
    __tablename__ = "team"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    owner_id: int = Field(foreign_key="user.id")

    # Relationships
    members: List[User] = Relationship(back_populates="teams", link_model=TeamMemberLink)
