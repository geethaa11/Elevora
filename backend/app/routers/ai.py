from fastapi import APIRouter
from pydantic import BaseModel

from app.utils.response import send_success

router = APIRouter(tags=["AI Diagnostics"])

class ValidatorRequest(BaseModel):
    ideaTitle: str
    ideaDescription: str

class DemoCoachRequest(BaseModel):
    pitchText: str

@router.post("/validator")
def validate_idea(data: ValidatorRequest):
    """Stub endpoint simulating an AI evaluation of a project idea."""
    title = data.ideaTitle.lower()
    description = data.ideaDescription.lower()
    
    # Calculate a mock score based on text properties and length
    score = 75
    if len(description) > 100:
        score += 5
    if len(title) > 10:
        score += 3
        
    # Analyze keywords for specific stub advice
    strengths = []
    risks = []
    
    if "ai" in title or "ai" in description or "intelligence" in description:
        score += 5
        feedback = "Very strong relevance. Combining machine learning or cognitive functions addresses scalable needs."
        strengths = [
            "Leverages cutting-edge machine learning and cognitive processing.",
            "High automation potential reducing operational friction."
        ]
        risks = [
            "Heavy dependence on API stability or hosting infrastructure costs.",
            "Data privacy concerns when handling proprietary user input."
        ]
    elif "eco" in title or "carbon" in description or "green" in description or "sustain" in description:
        score += 4
        feedback = "Great climate-tech alignment. Sustainability represents a highly valued focus for current hackathon tracks."
        strengths = [
            "Clear correlation with ESG metrics and positive environmental impact.",
            "Strong appeal to corporate sponsors looking for green innovations."
        ]
        risks = [
            "Difficult verification loop for actual carbon reduction stats.",
            "Relies heavily on consumer behavior modification which is hard to enforce."
        ]
    else:
        feedback = "Solid general concept. Clearly defines a functional gap, though could stand out more with a unique technological angle."
        strengths = [
            "Solves a concrete, immediate problem-solution match.",
            "Simple, highly direct architecture lowers time-to-market."
        ]
        risks = [
            "Fierce competition in this specific app category.",
            "Potential high customer acquisition costs."
        ]
        
    # Cap score at 99
    score = min(score, 99)
    
    return send_success(
        data={
            "score": score,
            "feedback": feedback,
            "strengths": strengths,
            "risks": risks
        },
        status_code=200
    )

@router.post("/demo-coach")
def coach_demo(data: DemoCoachRequest):
    """Stub endpoint simulating an AI review of a project pitch presentation."""
    pitch = data.pitchText
    length = len(pitch)
    
    clarity_score = 70
    suggestions = []
    
    if length < 50:
        clarity_score = 50
        feedback = "Your pitch is too brief. You need to expand on the core problem statement, your specific product solution, and who is on your team."
        suggestions = [
            "Add a clear hook introducing the core problem in the first 10 seconds.",
            "Describe the technology stack you are using to address this issue.",
            "End with a clear, inspiring vision statement."
        ]
    elif length > 400:
        clarity_score = 60
        feedback = "Your pitch is quite wordy. Remember, hackathon demo pitches are typically limited to 2-3 minutes. Condense your sentences for punchier delivery."
        suggestions = [
            "Reduce total text length to about 150-200 words.",
            "Avoid overly complex industry jargon in favor of direct value propositions.",
            "Use bullet points for key accomplishments instead of long paragraphs."
        ]
    else:
        clarity_score = 80
        feedback = "Great length and pacing. The presentation contains a solid balance of context, solution explanation, and impact."
        suggestions = [
            "Mention exact user statistics or testing validation results during your run.",
            "Highlight the unique advantage your team holds compared to existing software.",
            "Practice delivery timings to ensure you stay under the hard time limit."
        ]
        
    return send_success(
        data={
            "feedback": feedback,
            "clarityScore": clarity_score,
            "suggestions": suggestions
        },
        status_code=200
    )
