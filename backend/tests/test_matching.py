import pytest
from backend.services.matching_service import calculate_compatibility, normalize_list, is_complementary_role, get_broad_skill_bucket
import json

class MockProfile:
    def __init__(self, skills="[]", interests="[]", preferred_role="", hackathon_interests="[]", college_name=""):
        self.skills = skills
        self.interests = interests
        self.preferred_role = preferred_role
        self.hackathon_interests = hackathon_interests
        self.college_name = college_name

def test_normalize_list():
    assert normalize_list("[\"Python\", \" SQL \"]") == ["python", "sql"]
    assert normalize_list([" Python", "SQL "]) == ["python", "sql"]
    assert normalize_list("") == []
    assert normalize_list(None) == []

def test_is_complementary_role():
    assert is_complementary_role("backend", "frontend") is True
    assert is_complementary_role("backend", "backend") is False
    assert is_complementary_role("frontend", "ui/ux") is True
    assert is_complementary_role("data science", "backend") is True

def test_get_broad_skill_bucket():
    assert get_broad_skill_bucket("react") == "frontend"
    assert get_broad_skill_bucket("python") == "backend"
    assert get_broad_skill_bucket("tensorflow") == "ai/data"
    assert get_broad_skill_bucket("figma") == "ui/ux"

def test_calculate_compatibility():
    target = MockProfile(
        skills='["Python", "FastAPI"]',
        interests='["AI"]',
        preferred_role="backend",
        hackathon_interests='["HackMIT"]',
        college_name="MIT"
    )
    
    # Candidate 1: Complementary (Frontend)
    cand1 = MockProfile(
        skills='["React", "CSS"]',
        interests='["AI"]',
        preferred_role="frontend",
        hackathon_interests='["HackMIT"]',
        college_name="MIT"
    )
    
    comp1 = calculate_compatibility(target, cand1)
    
    # Score breakdown:
    # No shared skills (0)
    # Shared interest "ai" (0.1)
    # Shared hackathon "hackmit" (0.15)
    # Comp role (backend vs frontend) (0.15)
    # Comp skills (frontend vs backend) (0.05 max)
    # Same college (0.10)
    assert comp1["complementary_role"] is True
    assert len(comp1["shared_interests"]) == 1
    assert "React" in comp1["complementary_skills"] or "Css" in comp1["complementary_skills"]
    assert "Complementary role (Frontend)" in comp1["match_reasons"]
    assert "Same college/university" in comp1["match_reasons"]
    
    # Candidate 2: Similar Backend but fewer other matches
    cand2 = MockProfile(
        skills='["Python", "Django", "SQL"]',
        interests='["Web Dev"]',
        preferred_role="backend",
        college_name="Stanford"
    )
    
    comp2 = calculate_compatibility(target, cand2)
    assert comp2["complementary_role"] is False
    assert len(comp2["shared_skills"]) == 1 # python
    
    # Empty profile fallback
    empty_target = MockProfile()
    empty_cand = MockProfile()
    comp_empty = calculate_compatibility(empty_target, empty_cand)
    assert comp_empty["score"] == 0.10 # Base score for recommendation
    assert "General recommendation" in comp_empty["match_reasons"]
