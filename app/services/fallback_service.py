from app.schemas.ai import ValidatorResponse, DemoCoachResponse

def get_validator_fallback(idea: str, problem_statement: str, domain: str = None, technology: str = None) -> ValidatorResponse:
    domain_str = f" in {domain}" if domain else ""
    tech_str = f" using {technology}" if technology else ""
    
    return ValidatorResponse(
        overall_score=78,
        feasibility="medium",
        strengths=[
            f"Addresses a real problem: '{problem_statement[:60]}...'",
            f"Clear project core idea concept{domain_str}.",
            f"Strong tech foundation opportunity{tech_str}."
        ],
        weaknesses=[
            "High reliance on early user adoption and initial dataset seeding.",
            "Requires careful risk mitigation around scalability and network latency."
        ],
        suggestions=[
            "Validate value proposition with 10 potential users before full build.",
            "Define concrete metrics for tracking engagement and retention."
        ],
        possible_improvements=[
            "Implement automated monitoring and automated error recovery.",
            "Add interactive user onboarding walkthrough."
        ],
        fallback_used=True
    )

def get_demo_coach_fallback(pitch_text: str, project_context: str = None) -> DemoCoachResponse:
    context_str = f" ({project_context})" if project_context else ""
    return DemoCoachResponse(
        overall_feedback=f"Solid foundational pitch structure{context_str}. Clear hook and goal presentation.",
        clarity_feedback="The core problem statement and solution explanation are direct and easy to follow.",
        structure_feedback="Good flow from Hook -> Problem -> Solution -> Target Audience.",
        technical_explanation_feedback="Technical architecture is highlighted; ensure key data flow diagrams are emphasized.",
        missing_points=[
            "Monetization model and long-term sustainability strategy.",
            "Key competitive advantage over existing market solutions."
        ],
        improvement_suggestions=[
            "Include a 15-second live visual demo or prototype walkthrough.",
            "End with a clear, high-impact call to action for judges."
        ],
        fallback_used=True
    )
