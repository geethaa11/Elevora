import pytest
import uuid
from fastapi.testclient import TestClient
from backend.main import app
from backend.database import SessionLocal
from backend.models.db_models import SwipeAction

client = TestClient(app)

def create_user(role="student"):
    email = f"user_{uuid.uuid4()}@example.com"
    resp = client.post("/api/v1/auth/signup", json={
        "name": "Test User",
        "email": email,
        "password": "password123",
        "role": role
    })
    return resp.json()["user_id"], resp.json()["token"]

def get_db_session():
    return SessionLocal()

def test_unauthorized_recommendation_access():
    response = client.get("/api/v1/team-matches/1")
    assert response.status_code == 401

def test_authorized_recommendation_access():
    u1_id, u1_token = create_user()
    response = client.get(f"/api/v1/team-matches/{u1_id}", headers={"Authorization": f"Bearer {u1_token}"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_successful_interested():
    u1_id, u1_token = create_user()
    u2_id, _ = create_user()
    
    response = client.post(
        "/api/v1/team-matches/interested",
        headers={"Authorization": f"Bearer {u1_token}"},
        json={"swiped_id": u2_id, "action": "interested"}
    )
    assert response.status_code == 200
    assert response.json()["success"] is True

    # verify in db
    db = get_db_session()
    swipe = db.query(SwipeAction).filter_by(swiper_id=u1_id, swiped_id=u2_id).first()
    assert swipe is not None
    assert swipe.action == "interested"
    db.close()

def test_duplicate_interested():
    u1_id, u1_token = create_user()
    u2_id, _ = create_user()
    
    client.post("/api/v1/team-matches/interested", headers={"Authorization": f"Bearer {u1_token}"}, json={"swiped_id": u2_id, "action": "interested"})
    
    response = client.post(
        "/api/v1/team-matches/interested",
        headers={"Authorization": f"Bearer {u1_token}"},
        json={"swiped_id": u2_id, "action": "interested"}
    )
    assert response.status_code == 409

def test_successful_pass():
    u1_id, u1_token = create_user()
    u2_id, _ = create_user()
    
    response = client.post(
        "/api/v1/team-matches/pass",
        headers={"Authorization": f"Bearer {u1_token}"},
        json={"swiped_id": u2_id, "action": "pass"}
    )
    assert response.status_code == 200
    assert response.json()["success"] is True

def test_duplicate_pass():
    u1_id, u1_token = create_user()
    u2_id, _ = create_user()
    
    client.post("/api/v1/team-matches/pass", headers={"Authorization": f"Bearer {u1_token}"}, json={"swiped_id": u2_id, "action": "pass"})
    response = client.post(
        "/api/v1/team-matches/pass",
        headers={"Authorization": f"Bearer {u1_token}"},
        json={"swiped_id": u2_id, "action": "pass"}
    )
    assert response.status_code == 409

def test_excluded_from_recommendations():
    u1_id, u1_token = create_user()
    u2_id, _ = create_user()
    u3_id, _ = create_user()
    
    # We must mock profiles for them to appear in matches, 
    # but the API doesn't expose a simple way in this test context to create full profiles without onboarding.
    # However, since they are mocked via SQLite fallback, we can insert profiles directly using DB session.
    from backend.models.db_models import StudentProfile
    db = get_db_session()
    for uid in [u1_id, u2_id, u3_id]:
        db.add(StudentProfile(user_id=uid, skills="[]", interests="[]", hackathon_interests="[]"))
    db.commit()
    db.close()
    
    # Check that they appear
    response = client.get(f"/api/v1/team-matches/{u1_id}", headers={"Authorization": f"Bearer {u1_token}"})
    matches_before = {m["user_id"] for m in response.json()}
    
    # Ensure they are present
    assert u2_id in matches_before
    assert u3_id in matches_before
    
    # Swipe
    client.post("/api/v1/team-matches/interested", headers={"Authorization": f"Bearer {u1_token}"}, json={"swiped_id": u2_id, "action": "interested"})
    client.post("/api/v1/team-matches/pass", headers={"Authorization": f"Bearer {u1_token}"}, json={"swiped_id": u3_id, "action": "pass"})
    
    # Check they are gone
    response = client.get(f"/api/v1/team-matches/{u1_id}", headers={"Authorization": f"Bearer {u1_token}"})
    matches_after = {m["user_id"] for m in response.json()}
    
    assert u2_id not in matches_after
    assert u3_id not in matches_after

def test_pagination():
    u1_id, u1_token = create_user()
    
    response = client.get(f"/api/v1/team-matches/{u1_id}?limit=1&offset=0", headers={"Authorization": f"Bearer {u1_token}"})
    assert response.status_code == 200
    assert len(response.json()) <= 1
