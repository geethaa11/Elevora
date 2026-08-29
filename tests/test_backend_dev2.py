import os
import jwt
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import JWT_SECRET
from app.database.db import get_connection, init_db

client = TestClient(app)

def generate_test_token(user_id: str = "test_user_123") -> str:
    payload = {
        "sub": user_id,
        "email": "student@elevora.edu",
        "role": "student",
        "exp": 1999999999
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

@pytest.fixture(autouse=True)
def setup_test_db():
    init_db()

def test_auth_signup_login_and_me():
    # Test signup
    res_signup = client.post("/api/v1/auth/signup", json={
        "email": "newstudent@elevora.edu",
        "password": "securepassword123",
        "name": "Alex Smith"
    })
    assert res_signup.status_code == 201
    signup_data = res_signup.json()
    assert "token" in signup_data
    assert signup_data["email"] == "newstudent@elevora.edu"
    assert signup_data["name"] == "Alex Smith"

    # Test login
    res_login = client.post("/api/v1/auth/login", json={
        "email": "student@elevora.edu",
        "password": "password123"
    })
    assert res_login.status_code == 200
    login_data = res_login.json()
    assert "token" in login_data
    token = login_data["token"]

    # Test GET /auth/me with Bearer token
    headers = {"Authorization": f"Bearer {token}"}
    res_me = client.get("/api/v1/auth/me", headers=headers)
    assert res_me.status_code == 200
    me_data = res_me.json()
    assert me_data["user_id"] == "user_123"

def test_db_seeding_no_duplicates():
    init_db()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM mentors;")
        count1 = cursor.fetchone()["count"]
        assert count1 == 10
    
    # Run init_db again to verify seed non-duplication
    init_db()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM mentors;")
        count2 = cursor.fetchone()["count"]
        assert count2 == 10

def test_validator_missing_field_422():
    token = generate_test_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Missing idea
    res = client.post("/api/v1/validator", json={"problem_statement": "Problem text"}, headers=headers)
    assert res.status_code == 422
    data = res.json()
    assert data["error"] == "missing_field"
    assert data["details"]["field"] == "idea"

    # Missing problem_statement
    res = client.post("/api/v1/validator", json={"idea": "Idea text"}, headers=headers)
    assert res.status_code == 422
    data = res.json()
    assert data["error"] == "missing_field"
    assert data["details"]["field"] == "problem_statement"

def test_validator_fallback_path():
    token = generate_test_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.post("/api/v1/validator", json={
        "idea": "AI Resume Matcher",
        "problem_statement": "Recruiters spend too much time filtering CVs",
        "domain": "HRTech",
        "technology": "Python"
    }, headers=headers)
    
    assert res.status_code == 200
    data = res.json()
    assert "overall_score" in data
    assert data["feasibility"] in ["low", "medium", "high"]
    assert isinstance(data["strengths"], list)
    assert isinstance(data["weaknesses"], list)
    assert isinstance(data["suggestions"], list)
    assert isinstance(data["possible_improvements"], list)
    assert data["fallback_used"] is True

def test_validator_unauthorized_401():
    res = client.post("/api/v1/validator", json={
        "idea": "Idea text",
        "problem_statement": "Problem text"
    })
    assert res.status_code == 401
    data = res.json()
    assert data["error"] == "unauthorized"

def test_demo_coach_missing_field_422():
    token = generate_test_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.post("/api/v1/demo-coach", json={"project_context": "Context text"}, headers=headers)
    assert res.status_code == 422
    data = res.json()
    assert data["error"] == "missing_field"
    assert data["details"]["field"] == "pitch_text"

def test_demo_coach_fallback_path():
    token = generate_test_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.post("/api/v1/demo-coach", json={
        "pitch_text": "We are building an AI coach for students presenting at hackathons.",
        "project_context": "Elevora platform"
    }, headers=headers)
    
    assert res.status_code == 200
    data = res.json()
    assert "overall_feedback" in data
    assert "clarity_feedback" in data
    assert "structure_feedback" in data
    assert "technical_explanation_feedback" in data
    assert isinstance(data["missing_points"], list)
    assert isinstance(data["improvement_suggestions"], list)
    assert data["fallback_used"] is True

def test_get_mentors_list_and_filters():
    res = client.get("/api/v1/mentors")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] == 10
    assert len(data["items"]) == 10
    
    res = client.get("/api/v1/mentors?skill=PyTorch")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] == 1
    assert data["items"][0]["mentor_id"] == "m1"
    
    res = client.get("/api/v1/mentors?limit=100")
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) <= 50

def test_get_mentor_by_id_valid_and_404():
    res = client.get("/api/v1/mentors/m1")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Dr. Aris Thorne"
    assert "AI/ML" in data["skills"]

    res = client.get("/api/v1/mentors/nonexistent_mentor")
    assert res.status_code == 404
    data = res.json()
    assert data["error"] == "not_found"

def test_post_mentor_request_success_and_404():
    token = generate_test_token(user_id="user_999")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/v1/mentors/request", json={
        "mentor_id": "m1",
        "message": "Hi Dr. Thorne, I would love feedback on our ML pipeline!"
    }, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert data["mentor_id"] == "m1"
    assert data["user_id"] == "user_999"
    assert data["status"] == "pending"
    assert "request_id" in data

    res = client.post("/api/v1/mentors/request", json={
        "mentor_id": "m_fake_999",
        "message": "Hello?"
    }, headers=headers)
    assert res.status_code == 404
    data = res.json()
    assert data["error"] == "not_found"

def test_post_mentor_request_missing_field_422():
    token = generate_test_token()
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/v1/mentors/request", json={"message": "No mentor ID"}, headers=headers)
    assert res.status_code == 422
    data = res.json()
    assert data["error"] == "missing_field"
    assert data["details"]["field"] == "mentor_id"
