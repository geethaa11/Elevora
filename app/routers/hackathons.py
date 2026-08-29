from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from app.schemas.hackathons import HackathonSchema, HackathonListResponse
from app.services.hackathon_service import fetch_hackathons, fetch_hackathon_by_id

router = APIRouter(prefix="/api/v1", tags=["Hackathons"])

@router.get("/hackathons", response_model=HackathonListResponse)
def get_hackathons(
    domain: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1)
):
    """
    Public endpoint to browse and search hackathons.
    No JWT authentication required per API contract.
    """
    return fetch_hackathons(domain=domain, search=search, page=page, limit=limit)

@router.get("/hackathons/{id}", response_model=HackathonSchema)
def get_hackathon_by_id(id: str):
    """
    Public endpoint to fetch a single hackathon by ID.
    No JWT authentication required per API contract.
    Returns 404 not_found if ID does not exist.
    """
    hackathon = fetch_hackathon_by_id(id)
    if not hackathon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "not_found",
                "message": f"Hackathon with id '{id}' not found",
                "details": {}
            }
        )
    return hackathon
