import jwt
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import JWT_SECRET
from app.database.db import init_db
from app.schemas.teaming import StudentProfileResponse
from app.services.graph_matching_service import (
    parse_availability_time,
    check_availability_overlap,
    compute_pairwise_compatibility,
    CompatibilityGraph,
    optimize_team_selection_dp
)

client = TestClient(app)

def generate_token(user_id: str = "user_graph_dp_test") -> str:
    payload = {
        "sub": user_id,
        "email": "graph_dp@elevora.edu",
        "role": "student",
        "exp": 1999999999
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

@pytest.fixture(autouse=True)
def setup_db():
    init_db()

# --- Unit Tests for Graph & Availability Logic ---

def test_availability_parser_overlapping_ranges():
    flex1, start1, end1 = parse_availability_time("6 PM - 10 PM")
    assert flex1 is False
    assert start1 == 18
    assert end1 == 22

    flex2, start2, end2 = parse_availability_time("7 PM - 11 PM")
    assert flex2 is False
    assert start2 == 19
    assert end2 == 23

    has_overlap, score = check_availability_overlap("6 PM - 10 PM", "7 PM - 11 PM")
    assert has_overlap is True
    assert score == 20

def test_availability_parser_flexible():
    has_overlap, score = check_availability_overlap("Flexible", "6 PM - 10 PM")
    assert has_overlap is True
    assert score == 20

def test_availability_parser_no_overlap():
    has_overlap, score = check_availability_overlap("6 PM - 8 PM", "9 PM - 11 PM")
    assert has_overlap is False
    assert score == 0

def test_availability_parser_malformed_string_safety():
    flex, start, end = parse_availability_time("invalid_time_string")
    assert flex is True
    has_overlap, score = check_availability_overlap("invalid_time_string", "7 PM - 11 PM")
    assert has_overlap is True
    assert score == 20

def test_pairwise_compatibility_and_skill_complementarity():
    student_a = StudentProfileResponse(
        user_id="sa",
        name="Student A",
        skills=["Python", "AI/ML"],
        interests=["Healthcare"],
        preferred_role="AI Developer",
        availability_time="6 PM - 10 PM",
        hackathons_participated=2,
        hackathons_won=0
    )
    student_b = StudentProfileResponse(
        user_id="sb",
        name="Student B",
        skills=["React", "TypeScript"],
        interests=["Healthcare"],
        preferred_role="Frontend Developer",
        availability_time="7 PM - 11 PM",
        hackathons_participated=4,
        hackathons_won=1
    )

    weight, shared_skills, comp_skills, shared_interests, avail_overlap = compute_pairwise_compatibility(student_a, student_b)
    assert weight >= 70
    assert "Healthcare" in shared_interests
    assert "React" in comp_skills
    assert "TypeScript" in comp_skills
    assert avail_overlap is True

def test_dp_team_optimization_logic():
    source = StudentProfileResponse(
        user_id="src", name="Source", skills=["Python"], interests=["AI"], preferred_role="Backend", availability_time="Flexible"
    )
    c1 = StudentProfileResponse(
        user_id="c1", name="Cand 1", skills=["React"], interests=["AI"], preferred_role="Frontend", availability_time="Flexible"
    )
    c2 = StudentProfileResponse(
        user_id="c2", name="Cand 2", skills=["Figma"], interests=["AI"], preferred_role="Designer", availability_time="Flexible"
    )
    c3 = StudentProfileResponse(
        user_id="c3", name="Cand 3", skills=["Python"], interests=["Finance"], preferred_role="Backend", availability_time="Flexible"
    )

    graph = CompatibilityGraph()
    graph.add_node(source)
    graph.add_node(c1)
    graph.add_node(c2)
    graph.add_node(c3)

    for c in [c1, c2, c3]:
        w, s_sk, c_sk, s_in, av = compute_pairwise_compatibility(source, c)
        graph.add_edge(source.user_id, c.user_id, w, s_sk, c_sk, s_in, av)

    selected = optimize_team_selection_dp(
        graph=graph,
        source_user_id="src",
        candidate_ids=["c1", "c2", "c3"],
        k_teammates_needed=2
    )

    assert len(selected) == 2

# --- Integration Tests for POST /api/v1/teaming/graph-match ---

def test_post_graph_match_endpoint_team_size_2():
    token = generate_token("user_graph_src_2")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/v1/teaming/graph-match", json={"team_size": 2}, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["algorithm"] == "Graph + Dynamic Programming (DP) Team Optimizer"
    assert data["requested_team_size"] == 2
    assert len(data["selected_team_members"]) == 1

def test_post_graph_match_endpoint_team_size_3():
    token = generate_token("user_graph_src_3")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/v1/teaming/graph-match", json={"team_size": 3}, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["requested_team_size"] == 3
    assert len(data["selected_team_members"]) == 2
    first_member = data["selected_team_members"][0]
    assert "compatibility_score" in first_member
    assert "shared_skills" in first_member
    assert "complementary_skills" in first_member
    assert "availability_overlap" in first_member

def test_post_graph_match_invalid_team_size_422():
    token = generate_token("user_graph_src_err")
    headers = {"Authorization": f"Bearer {token}"}

    # Invalid team_size < 2
    res1 = client.post("/api/v1/teaming/graph-match", json={"team_size": 1}, headers=headers)
    assert res1.status_code == 422

    # Invalid team_size > 5
    res2 = client.post("/api/v1/teaming/graph-match", json={"team_size": 10}, headers=headers)
    assert res2.status_code == 422

def test_post_graph_match_unauthorized_401():
    res = client.post("/api/v1/teaming/graph-match", json={"team_size": 3})
    assert res.status_code == 401
