import jwt
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import JWT_SECRET
from app.database.db import init_db

client = TestClient(app)

def generate_token(user_id: str = "user_test_teaming") -> str:
    payload = {
        "sub": user_id,
        "email": "student_teaming@elevora.edu",
        "role": "student",
        "exp": 1999999999
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

@pytest.fixture(autouse=True)
def setup_db():
    init_db()

def test_create_and_get_student_profile_with_new_fields():
    token = generate_token("user_profile_ext")
    headers = {"Authorization": f"Bearer {token}"}

    # Create profile with 3 new fields
    res_post = client.post("/api/v1/teaming/profile", json={
        "name": "Arun",
        "college": "ABC Engineering College",
        "qualification": "B.E. CSE - 1st Year",
        "skills": ["Python", "React", "AI/ML"],
        "interests": ["Artificial Intelligence", "Healthcare"],
        "preferred_role": "AI/ML Developer",
        "team_preference": "Looking for a team",
        "availability_time": "6 PM - 10 PM",
        "hackathons_participated": 3,
        "hackathons_won": 1
    }, headers=headers)
    assert res_post.status_code == 200
    data = res_post.json()
    assert data["user_id"] == "user_profile_ext"
    assert data["name"] == "Arun"
    assert data["availability_time"] == "6 PM - 10 PM"
    assert data["hackathons_participated"] == 3
    assert data["hackathons_won"] == 1

    # Update profile
    res_update = client.post("/api/v1/teaming/profile", json={
        "name": "Arun Updated",
        "college": "ABC Engineering College",
        "qualification": "B.E. CSE - 2nd Year",
        "skills": ["Python", "React", "AI/ML", "PyTorch"],
        "interests": ["Artificial Intelligence", "Healthcare"],
        "preferred_role": "Lead AI Developer",
        "team_preference": "Looking for a team",
        "availability_time": "7 PM - 11 PM",
        "hackathons_participated": 4,
        "hackathons_won": 2
    }, headers=headers)
    assert res_update.status_code == 200
    up_data = res_update.json()
    assert up_data["name"] == "Arun Updated"
    assert up_data["availability_time"] == "7 PM - 11 PM"
    assert up_data["hackathons_participated"] == 4
    assert up_data["hackathons_won"] == 2

    # Get profile by user_id
    res_get = client.get("/api/v1/teaming/profile/user_profile_ext")
    assert res_get.status_code == 200
    get_data = res_get.json()
    assert get_data["name"] == "Arun Updated"
    assert get_data["availability_time"] == "7 PM - 11 PM"
    assert get_data["hackathons_participated"] == 4
    assert get_data["hackathons_won"] == 2

def test_profile_validation_negative_participated_422():
    token = generate_token("user_val_1")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/v1/teaming/profile", json={
        "name": "Test User",
        "availability_time": "6 PM - 10 PM",
        "hackathons_participated": -1,
        "hackathons_won": 0
    }, headers=headers)
    assert res.status_code == 422

def test_profile_validation_negative_won_422():
    token = generate_token("user_val_2")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/v1/teaming/profile", json={
        "name": "Test User",
        "availability_time": "6 PM - 10 PM",
        "hackathons_participated": 2,
        "hackathons_won": -1
    }, headers=headers)
    assert res.status_code == 422

def test_profile_validation_won_exceeds_participated_422():
    token = generate_token("user_val_3")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/v1/teaming/profile", json={
        "name": "Test User",
        "availability_time": "6 PM - 10 PM",
        "hackathons_participated": 2,
        "hackathons_won": 5
    }, headers=headers)
    assert res.status_code == 422

def test_profile_validation_empty_availability_time_422():
    token = generate_token("user_val_4")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/v1/teaming/profile", json={
        "name": "Test User",
        "availability_time": "   ",
        "hackathons_participated": 2,
        "hackathons_won": 1
    }, headers=headers)
    assert res.status_code == 422

def test_get_nonexistent_profile_404():
    res = client.get("/api/v1/teaming/profile/nonexistent_user_999")
    assert res.status_code == 404
    assert res.json()["error"] == "not_found"

def test_unauthorized_matches_request():
    res = client.get("/api/v1/teaming/matches")
    assert res.status_code == 401
    assert res.json()["error"] == "unauthorized"

def test_get_teammate_matches_includes_new_fields():
    token = generate_token("user_profile_1")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/teaming/matches", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "count" in data
    assert data["count"] > 0
    first_match = data["items"][0]
    assert "user_id" in first_match
    assert "name" in first_match
    assert "skills" in first_match
    assert "interests" in first_match
    assert "availability_time" in first_match
    assert "hackathons_participated" in first_match
    assert "hackathons_won" in first_match
    assert "match_score" in first_match

def test_create_get_and_join_team():
    creator_token = generate_token("team_creator_user")
    creator_headers = {"Authorization": f"Bearer {creator_token}"}

    # Create team
    res_create = client.post("/api/v1/teams", json={
        "name": "Hackathon Winners",
        "hackathon_id": "h1"
    }, headers=creator_headers)
    assert res_create.status_code == 201
    team_data = res_create.json()
    team_id = team_data["team_id"]
    assert team_data["name"] == "Hackathon Winners"
    assert team_data["creator_user_id"] == "team_creator_user"
    assert len(team_data["members"]) == 1
    assert team_data["members"][0]["user_id"] == "team_creator_user"

    # Get team details
    res_get = client.get(f"/api/v1/teams/{team_id}")
    assert res_get.status_code == 200
    assert res_get.json()["name"] == "Hackathon Winners"

    # Second user joins team
    joiner_token = generate_token("team_joiner_user")
    joiner_headers = {"Authorization": f"Bearer {joiner_token}"}

    res_join = client.post(f"/api/v1/teams/{team_id}/join", headers=joiner_headers)
    assert res_join.status_code == 200
    joined_team = res_join.json()
    assert len(joined_team["members"]) == 2
    member_user_ids = [m["user_id"] for m in joined_team["members"]]
    assert "team_joiner_user" in member_user_ids

def test_duplicate_team_join_409():
    token = generate_token("team_dup_user")
    headers = {"Authorization": f"Bearer {token}"}

    res_create = client.post("/api/v1/teams", json={"name": "Alpha Team"}, headers=headers)
    assert res_create.status_code == 201
    team_id = res_create.json()["team_id"]

    res_join_again = client.post(f"/api/v1/teams/{team_id}/join", headers=headers)
    assert res_join_again.status_code == 409
    assert res_join_again.json()["error"] == "already_member"

def test_invalid_team_id_404():
    res_get = client.get("/api/v1/teams/invalid_team_999")
    assert res_get.status_code == 404
    assert res_get.json()["error"] == "not_found"

    token = generate_token()
    headers = {"Authorization": f"Bearer {token}"}
    res_join = client.post("/api/v1/teams/invalid_team_999/join", headers=headers)
    assert res_join.status_code == 404
    assert res_join.json()["error"] == "not_found"
