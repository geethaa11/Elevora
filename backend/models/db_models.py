from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, UniqueConstraint, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False) # 'student' or 'mentor'
    contact = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("StudentProfile", back_populates="user", uselist=False)
    verification = relationship("UserVerification", back_populates="user", uselist=False)
    settings = relationship("UserSettings", back_populates="user", uselist=False)

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    email_notifications = Column(Boolean, default=True)
    team_notifications = Column(Boolean, default=True)
    hackathon_notifications = Column(Boolean, default=True)
    match_notifications = Column(Boolean, default=True)
    profile_visibility = Column(String, default="public")
    show_email = Column(Boolean, default=False)
    show_contact = Column(Boolean, default=False)
    theme = Column(String, default="system")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="settings")

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    purpose = Column(String, nullable=True)
    education = Column(String, nullable=True)
    college_name = Column(String, nullable=True)
    interests = Column(Text, nullable=True) # JSON str
    skills = Column(Text, nullable=True) # JSON str
    preferred_role = Column(String, nullable=True)
    teaming_preference = Column(String, nullable=True)
    hackathon_interests = Column(Text, nullable=True) # JSON str

    user = relationship("User", back_populates="profile")

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    hackathon_id = Column(Integer, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(String, nullable=True)
    max_members = Column(Integer, default=4)
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("TeamMember", back_populates="team")

class TeamMember(Base):
    __tablename__ = "team_members"
    __table_args__ = (UniqueConstraint('team_id', 'user_id', name='_team_user_uc'),)

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role_in_team = Column(String, nullable=False) # 'leader' or 'member'
    joined_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="members")

class SwipeAction(Base):
    __tablename__ = "swipe_actions"
    __table_args__ = (UniqueConstraint('swiper_id', 'swiped_id', name='_swiper_swiped_uc'),)

    id = Column(Integer, primary_key=True, index=True)
    swiper_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    swiped_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False) # 'interested' or 'pass'
    created_at = Column(DateTime, default=datetime.utcnow)
