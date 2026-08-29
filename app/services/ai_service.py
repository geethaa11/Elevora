import json
import asyncio
import logging
import httpx
from typing import Optional
from app.config import GEMINI_API_KEY
from app.schemas.ai import ValidatorResponse, DemoCoachResponse
from app.services.fallback_service import get_validator_fallback, get_demo_coach_fallback

logger = logging.getLogger("elevora.ai_service")

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

async def generate_validator_analysis(
    idea: str,
    problem_statement: str,
    domain: Optional[str] = None,
    technology: Optional[str] = None
) -> ValidatorResponse:
    if not GEMINI_API_KEY:
        logger.info("GEMINI_API_KEY not set. Using fallback for /validator.")
        return get_validator_fallback(idea, problem_statement, domain, technology)

    prompt = f"""
    You are an expert startup hackathon judge and technical validator.
    Evaluate the following project idea:
    Idea: {idea}
    Problem Statement: {problem_statement}
    Domain: {domain or 'General'}
    Technology: {technology or 'Unspecified'}

    Return ONLY a raw valid JSON object with no markdown formatting or triple backticks, matching this schema exactly:
    {{
      "overall_score": <int 0 to 100>,
      "feasibility": "<low|medium|high>",
      "strengths": ["<strength 1>", "<strength 2>"],
      "weaknesses": ["<weakness 1>", "<weakness 2>"],
      "suggestions": ["<suggestion 1>", "<suggestion 2>"],
      "possible_improvements": ["<improvement 1>", "<improvement 2>"],
      "fallback_used": false
    }}
    """

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                json={
                    "contents": [{"parts": [{"text": prompt}]}]
                }
            )
            if response.status_code != 200:
                logger.warning(f"Gemini API returned status {response.status_code}. Triggering fallback.")
                return get_validator_fallback(idea, problem_statement, domain, technology)

            data = response.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()

            # Clean potential markdown formatting
            if raw_text.startswith("```"):
                lines = raw_text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_text = "\n".join(lines).strip()

            parsed = json.loads(raw_text)
            parsed["fallback_used"] = False
            return ValidatorResponse(**parsed)
    except Exception as e:
        logger.warning(f"AI Call failed or timed out: {e}. Triggering fallback.")
        return get_validator_fallback(idea, problem_statement, domain, technology)

async def generate_demo_coach_analysis(
    pitch_text: str,
    project_context: Optional[str] = None
) -> DemoCoachResponse:
    if not GEMINI_API_KEY:
        logger.info("GEMINI_API_KEY not set. Using fallback for /demo-coach.")
        return get_demo_coach_fallback(pitch_text, project_context)

    prompt = f"""
    You are an elite pitch coach for hackathons and demo days.
    Analyze the following pitch text:
    Pitch Text: {pitch_text}
    Project Context: {project_context or 'None'}

    Return ONLY a raw valid JSON object with no markdown formatting or triple backticks, matching this schema exactly:
    {{
      "overall_feedback": "<overall feedback string>",
      "clarity_feedback": "<clarity feedback string>",
      "structure_feedback": "<structure feedback string>",
      "technical_explanation_feedback": "<technical explanation feedback string>",
      "missing_points": ["<missing point 1>", "<missing point 2>"],
      "improvement_suggestions": ["<suggestion 1>", "<suggestion 2>"],
      "fallback_used": false
    }}
    """

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                json={
                    "contents": [{"parts": [{"text": prompt}]}]
                }
            )
            if response.status_code != 200:
                logger.warning(f"Gemini API returned status {response.status_code}. Triggering fallback.")
                return get_demo_coach_fallback(pitch_text, project_context)

            data = response.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()

            if raw_text.startswith("```"):
                lines = raw_text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_text = "\n".join(lines).strip()

            parsed = json.loads(raw_text)
            parsed["fallback_used"] = False
            return DemoCoachResponse(**parsed)
    except Exception as e:
        logger.warning(f"AI Call failed or timed out: {e}. Triggering fallback.")
        return get_demo_coach_fallback(pitch_text, project_context)
