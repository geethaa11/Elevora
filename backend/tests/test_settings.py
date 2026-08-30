import pytest
from fastapi.testclient import TestClient
from backend.main import app
import uuid

client = TestClient(app)

def get_auth_token():
    email = f"settings_test_{uuid.uuid4()}@example.com"
    signup_data = {
        "name": "Settings Test",
        "email": email,
        "password": "password123",
        "role": "student"
    }
    client.post("/api/v1/auth/signup", json=signup_data)
    
    login_response = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "password123"
    })
    return login_response.json()["token"]



def test_unauthenticated_settings():
    response = client.get("/api/v1/settings")
    assert response.status_code == 401

def test_get_settings():
    token = get_auth_token()
    response = client.get("/api/v1/settings", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["email_notifications"] == True
    assert data["theme"] == "system"

def test_update_settings():
    token = get_auth_token()
    update_data = {
        "theme": "dark",
        "email_notifications": False
    }
    response = client.put("/api/v1/settings", json=update_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["theme"] == "dark"
    assert data["email_notifications"] == False
