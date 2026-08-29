from pydantic import BaseModel
from typing import List

class HackathonSchema(BaseModel):
    id: str
    name: str
    organization: str
    deadline: str
    domain: str
    eligibility: str
    registration_url: str

class HackathonListResponse(BaseModel):
    items: List[HackathonSchema]
    count: int
    fallback_used: bool = False
