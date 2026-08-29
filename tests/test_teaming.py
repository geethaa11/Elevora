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

def test_create_and_get_student_profile():
    token = generate_token("user_profile_1")
    headers = {"Authorization": f"Bearer {token}"}

    # Create / update profile
    res_post = client.post("/api/v1/teaming/profile", json={
        "name": "Alice Cooper",
        "college": "Harvard",
        "qualification": "B.S. CS",
        "skills": ["Python", "Machine Learning"],
        "interests": ["Healthcare", "AI"],
        "preferred_role": "AI Developer",
        "team_preference": "Looking for team"
    }, headers=headers)
    assert res_post.status_code == 200
    data = res_post.json()
    assert data["user_id"] == "user_profile_1"
    assert data["name"] == "Alice Cooper"
    assert "Python" in data["skills"]

    # Get profile by user_id
    res_get = client.get("/api/v1/teaming/profile/user_profile_1")
    assert res_get.status_code == 200
    get_data = res_get.json()
    assert get_data["name"] == "Alice Cooper"
    assert get_data["college"] == "Harvard"

def test_get_nonexistent_profile_404():
    res = client.get("/api/v1/teaming/profile/nonexistent_user_999")
    assert res.status_code == 404
    assert res.json()["error"] == "not_found"

def test_unauthorized_matches_request():
    res = client.get("/api/v1/teaming/matches")
    assert res.status_code == 401
    assert res.json()["error"] == "unauthorized"

def test_get_teammate_matches_success():
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
    assert "match_score" in first_match
    assert 0 <= first_match["match_score"] <= 100

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

    # Create team
    res_create = client.post("/api/v1/teams", json={"name": "Alpha Team"}, headers=headers)
    assert res_create.status_code == 201
    team_id = res_create.json()["team_id"]

    # Attempt to join team user created (and is already member of) -> 409 Conflict
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
