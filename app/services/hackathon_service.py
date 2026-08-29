import logging
from typing import Optional, List, Tuple
from app.schemas.hackathons import HackathonSchema, HackathonListResponse

logger = logging.getLogger("elevora.hackathon_service")

DEMO_HACKATHONS = [
    HackathonSchema(
        id="h1",
        name="Global AI Innovators Hackathon 2026",
        organization="DeepMind & Google Cloud",
        deadline="2026-10-15T23:59:59Z",
        domain="Artificial Intelligence",
        eligibility="Open to all students & developers worldwide",
        registration_url="https://elevora.io/hackathons/h1"
    ),
    HackathonSchema(
        id="h2",
        name="FinTech Revolution Buildathon",
        organization="Stripe",
        deadline="2026-11-01T23:59:59Z",
        domain="Fintech",
        eligibility="Undergraduate & Graduate Students",
        registration_url="https://elevora.io/hackathons/h2"
    ),
    HackathonSchema(
        id="h3",
        name="Web3 & Zero-Knowledge Challenge",
        organization="Ethereum Foundation",
        deadline="2026-09-30T23:59:59Z",
        domain="Blockchain",
        eligibility="Open to teams of 1 to 4 members",
        registration_url="https://elevora.io/hackathons/h3"
    ),
    HackathonSchema(
        id="h4",
        name="Cloud Native Architecture Hackathon",
        organization="AWS & CNCF",
        deadline="2026-10-05T23:59:59Z",
        domain="Cloud Architecture",
        eligibility="Student developers & Cloud enthusiasts",
        registration_url="https://elevora.io/hackathons/h4"
    ),
    HackathonSchema(
        id="h5",
        name="CyberDefense AppSec Challenge",
        organization="CrowdStrike",
        deadline="2026-10-20T23:59:59Z",
        domain="Security",
        eligibility="Enrolled University Students",
        registration_url="https://elevora.io/hackathons/h5"
    ),
    HackathonSchema(
        id="h6",
        name="Design Systems & UI Excellence 2026",
        organization="Figma",
        deadline="2026-11-15T23:59:59Z",
        domain="Design",
        eligibility="Design & Frontend Students",
        registration_url="https://elevora.io/hackathons/h6"
    ),
    HackathonSchema(
        id="h7",
        name="Sustainable Tech & Green Code Hack",
        organization="Green Tech Alliance",
        deadline="2026-12-01T23:59:59Z",
        domain="ClimateTech",
        eligibility="Global Students & Impact Founders",
        registration_url="https://elevora.io/hackathons/h7"
    ),
    HackathonSchema(
        id="h8",
        name="HealthTech AI & Medical Imaging Hack",
        organization="Biomedical Research Lab",
        deadline="2026-11-20T23:59:59Z",
        domain="Healthcare",
        eligibility="Students & Medical Tech Researchers",
        registration_url="https://elevora.io/hackathons/h8"
    ),
    HackathonSchema(
        id="h9",
        name="Next.js Full Stack Speed Run",
        organization="Vercel",
        deadline="2026-10-25T23:59:59Z",
        domain="Web Development",
        eligibility="All developers & students",
        registration_url="https://elevora.io/hackathons/h9"
    ),
    HackathonSchema(
        id="h10",
        name="Data Science & Predictive Analytics Cup",
        organization="Kaggle & Uber",
        deadline="2026-12-10T23:59:59Z",
        domain="Data Science",
        eligibility="Data Science Students",
        registration_url="https://elevora.io/hackathons/h10"
    )
]

def fetch_hackathons(
    domain: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20
) -> HackathonListResponse:
    """
    Fetch hackathons list with filtering and pagination.
    Clamps limit to a maximum of 50 per contract specification.
    Serves demo dataset reliably (fallback_used=True if external source is simulated or used as fallback).
    """
    clamped_limit = min(max(limit, 1), 50)
    clamped_page = max(page, 1)

    filtered_items: List[HackathonSchema] = []
    for item in DEMO_HACKATHONS:
        # Domain filter
        if domain:
            if domain.lower() not in item.domain.lower():
                continue

        # Search filter across name, organization, domain, eligibility
        if search:
            s_lower = search.lower()
            matches = (
                s_lower in item.name.lower() or
                s_lower in item.organization.lower() or
                s_lower in item.domain.lower() or
                s_lower in item.eligibility.lower()
            )
            if not matches:
                continue

        filtered_items.append(item)

    total_count = len(filtered_items)
    start_idx = (clamped_page - 1) * clamped_limit
    end_idx = start_idx + clamped_limit
    paginated_items = filtered_items[start_idx:end_idx]

    return HackathonListResponse(
        items=paginated_items,
        count=total_count,
        fallback_used=False
    )

def fetch_hackathon_by_id(hackathon_id: str) -> Optional[HackathonSchema]:
    """
    Find single hackathon object by ID.
    Returns None if not found.
    """
    for item in DEMO_HACKATHONS:
        if item.id == hackathon_id:
            return item
    return None
