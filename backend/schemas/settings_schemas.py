from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SettingsUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    team_notifications: Optional[bool] = None
    hackathon_notifications: Optional[bool] = None
    match_notifications: Optional[bool] = None
    profile_visibility: Optional[str] = None
    show_email: Optional[bool] = None
    show_contact: Optional[bool] = None
    theme: Optional[str] = None

class SettingsResponse(BaseModel):
    id: int
    user_id: int
    email_notifications: bool
    team_notifications: bool
    hackathon_notifications: bool
    match_notifications: bool
    profile_visibility: str
    show_email: bool
    show_contact: bool
    theme: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
