from pydantic import BaseModel, Field
from typing import List, Optional

class ValidatorRequest(BaseModel):
    idea: str
    problem_statement: str
    domain: Optional[str] = None
    technology: Optional[str] = None

class ValidatorResponse(BaseModel):
    overall_score: int = Field(ge=0, le=100)
    feasibility: str
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    possible_improvements: List[str]
    fallback_used: bool = False

class DemoCoachRequest(BaseModel):
    pitch_text: str
    project_context: Optional[str] = None

class DemoCoachResponse(BaseModel):
    overall_feedback: str
    clarity_feedback: str
    structure_feedback: str
    technical_explanation_feedback: str
    missing_points: List[str]
    improvement_suggestions: List[str]
    fallback_used: bool = False
