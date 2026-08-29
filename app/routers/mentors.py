import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional, List
from app.auth_utils import get_current_user_id
from app.database.db import get_connection
from app.schemas.mentors import MentorSchema, MentorListResponse, MentorshipRequestCreate, MentorshipRequestResponse

router = APIRouter(prefix="/api/v1", tags=["Mentors"])

@router.get("/mentors", response_model=MentorListResponse)
def get_mentors(
    skill: Optional[str] = Query(None),
    domain: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1)
):
    # Clamp limit to max 50 per contract
    clamped_limit = min(limit, 50)
    
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT mentor_id, name, title, organization, bio, availability, domain FROM mentors;")
        mentor_rows = cursor.fetchall()
        
        # Build full mentor objects with skills
        all_mentors: List[MentorSchema] = []
        for row in mentor_rows:
            m_id = row["mentor_id"]
            cursor.execute("SELECT skill FROM mentor_skills WHERE mentor_id = ?;", (m_id,))
            skills = [s_row["skill"] for s_row in cursor.fetchall()]
            
            mentor = MentorSchema(
                mentor_id=row["mentor_id"],
                name=row["name"],
                title=row["title"],
                organization=row["organization"],
                skills=skills,
                bio=row["bio"],
                availability=row["availability"]
            )
            all_mentors.append((mentor, row["domain"]))

        # Apply filters
        filtered: List[MentorSchema] = []
        for mentor, m_domain in all_mentors:
            # Filter by skill
            if skill:
                skill_lower = skill.lower()
                if not any(skill_lower in s.lower() for s in mentor.skills):
                    continue

            # Filter by domain
            if domain:
                domain_lower = domain.lower()
                if domain_lower not in m_domain.lower() and not any(domain_lower in s.lower() for s in mentor.skills):
                    continue

            # Filter by general search
            if search:
                s_lower = search.lower()
                matches_search = (
                    s_lower in mentor.name.lower() or
                    s_lower in mentor.title.lower() or
                    s_lower in mentor.organization.lower() or
                    s_lower in mentor.bio.lower() or
                    s_lower in m_domain.lower() or
                    any(s_lower in s.lower() for s in mentor.skills)
                )
                if not matches_search:
                    continue

            filtered.append(mentor)

        total_count = len(filtered)
        
        # Paginate
        start_idx = (page - 1) * clamped_limit
        end_idx = start_idx + clamped_limit
        paginated_items = filtered[start_idx:end_idx]

        return MentorListResponse(items=paginated_items, count=total_count)

@router.get("/mentors/{id}", response_model=MentorSchema)
def get_mentor_by_id(id: str):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT mentor_id, name, title, organization, bio, availability FROM mentors WHERE mentor_id = ?;", (id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "error": "not_found",
                    "message": f"Mentor with id '{id}' not found",
                    "details": {}
                }
            )
        
        cursor.execute("SELECT skill FROM mentor_skills WHERE mentor_id = ?;", (id,))
        skills = [s_row["skill"] for s_row in cursor.fetchall()]
        
        return MentorSchema(
            mentor_id=row["mentor_id"],
            name=row["name"],
            title=row["title"],
            organization=row["organization"],
            skills=skills,
            bio=row["bio"],
            availability=row["availability"]
        )

@router.post("/mentors/request", response_model=MentorshipRequestResponse, status_code=status.HTTP_201_CREATED)
def post_mentor_request(
    req: MentorshipRequestCreate,
    user_id: str = Depends(get_current_user_id)
):
    if not req.mentor_id or not req.mentor_id.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": "missing_field",
                "message": "Field 'mentor_id' is required",
                "details": {"field": "mentor_id"}
            }
        )
    if not req.message or not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": "missing_field",
                "message": "Field 'message' is required",
                "details": {"field": "message"}
            }
        )

    with get_connection() as conn:
        cursor = conn.cursor()
        # Verify mentor_id exists FIRST
        cursor.execute("SELECT 1 FROM mentors WHERE mentor_id = ?;", (req.mentor_id,))
        if not cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "error": "not_found",
                    "message": f"Mentor with id '{req.mentor_id}' does not exist",
                    "details": {}
                }
            )

        request_id = f"req_{uuid.uuid4().hex[:12]}"
        created_at = datetime.now(timezone.utc).isoformat()
        status_val = "pending"

        cursor.execute("""
            INSERT INTO mentorship_requests (request_id, mentor_id, user_id, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?);
        """, (request_id, req.mentor_id, user_id, req.message, status_val, created_at))
        conn.commit()

        return MentorshipRequestResponse(
            request_id=request_id,
            mentor_id=req.mentor_id,
            user_id=user_id,
            message=req.message,
            status=status_val,
            created_at=created_at
        )
