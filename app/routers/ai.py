from fastapi import APIRouter, Depends, HTTPException, status
from app.auth_utils import get_current_user_id
from app.schemas.ai import ValidatorRequest, ValidatorResponse, DemoCoachRequest, DemoCoachResponse
from app.services.ai_service import generate_validator_analysis, generate_demo_coach_analysis

router = APIRouter(prefix="/api/v1", tags=["AI"])

@router.post("/validator", response_model=ValidatorResponse)
async def post_validator(
    req: ValidatorRequest,
    user_id: str = Depends(get_current_user_id)
):
    if not req.idea or not req.idea.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": "missing_field",
                "message": "Field 'idea' is required",
                "details": {"field": "idea"}
            }
        )
    if not req.problem_statement or not req.problem_statement.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": "missing_field",
                "message": "Field 'problem_statement' is required",
                "details": {"field": "problem_statement"}
            }
        )

    result = await generate_validator_analysis(
        idea=req.idea,
        problem_statement=req.problem_statement,
        domain=req.domain,
        technology=req.technology
    )
    return result

@router.post("/demo-coach", response_model=DemoCoachResponse)
async def post_demo_coach(
    req: DemoCoachRequest,
    user_id: str = Depends(get_current_user_id)
):
    if not req.pitch_text or not req.pitch_text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": "missing_field",
                "message": "Field 'pitch_text' is required",
                "details": {"field": "pitch_text"}
            }
        )

    result = await generate_demo_coach_analysis(
        pitch_text=req.pitch_text,
        project_context=req.project_context
    )
    return result
