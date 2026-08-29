import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_hackathons_list_success():
    res = client.get("/api/v1/hackathons")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "count" in data
    assert data["count"] == 10
    assert len(data["items"]) == 10
    first_item = data["items"][0]
    assert "id" in first_item
    assert "name" in first_item
    assert "organization" in first_item
    assert "deadline" in first_item
    assert "domain" in first_item
    assert "eligibility" in first_item
    assert "registration_url" in first_item

def test_get_hackathon_by_valid_id():
    res = client.get("/api/v1/hackathons/h1")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "h1"
    assert data["name"] == "Global AI Innovators Hackathon 2026"
    assert data["domain"] == "Artificial Intelligence"

def test_get_hackathon_by_invalid_id_404():
    res = client.get("/api/v1/hackathons/non_existent_h999")
    assert res.status_code == 404
    data = res.json()
    assert data["error"] == "not_found"
    assert data["message"] == "Hackathon with id 'non_existent_h999' not found"
    assert data["details"] == {}

def test_hackathons_domain_filtering():
    res = client.get("/api/v1/hackathons?domain=Fintech")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] == 1
    assert data["items"][0]["id"] == "h2"
    assert data["items"][0]["domain"] == "Fintech"

def test_hackathons_search_filtering():
    res = client.get("/api/v1/hackathons?search=Stripe")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] == 1
    assert data["items"][0]["organization"] == "Stripe"

    res_ai = client.get("/api/v1/hackathons?search=DeepMind")
    assert res_ai.status_code == 200
    data_ai = res_ai.json()
    assert data_ai["count"] == 1
    assert data_ai["items"][0]["id"] == "h1"

def test_hackathons_pagination():
    res_page1 = client.get("/api/v1/hackathons?page=1&limit=3")
    assert res_page1.status_code == 200
    data1 = res_page1.json()
    assert len(data1["items"]) == 3
    assert data1["items"][0]["id"] == "h1"
    assert data1["items"][1]["id"] == "h2"
    assert data1["items"][2]["id"] == "h3"

    res_page2 = client.get("/api/v1/hackathons?page=2&limit=3")
    assert res_page2.status_code == 200
    data2 = res_page2.json()
    assert len(data2["items"]) == 3
    assert data2["items"][0]["id"] == "h4"
    assert data2["items"][1]["id"] == "h5"
    assert data2["items"][2]["id"] == "h6"

def test_hackathons_limit_clamping():
    res = client.get("/api/v1/hackathons?limit=100")
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) <= 50
    assert data["count"] == 10
