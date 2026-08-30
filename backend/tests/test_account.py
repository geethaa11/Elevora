import pytest
from fastapi.testclient import TestClient
from backend.main import app
import uuid

client = TestClient(app)

def create_user_and_get_token(email, password):
    client.post("/api/v1/auth/signup", json={
        "name": "Test User",
        "email": email,
        "password": password,
        "role": "student"
    })
    
    resp = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": password
    })
    return resp.json()["token"]

def test_change_password_success():
    email = f"pass1_{uuid.uuid4()}@example.com"
    token = create_user_and_get_token(email, "oldpass")
    
    resp = client.put("/api/v1/auth/change-password", json={
        "current_password": "oldpass",
        "new_password": "newpass"
    }, headers={"Authorization": f"Bearer {token}"})
    
    assert resp.status_code == 200
    
    # Try logging in with new password
    login_resp = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "newpass"
    })
    assert login_resp.status_code == 200

def test_change_password_fail():
    email = f"pass2_{uuid.uuid4()}@example.com"
    token = create_user_and_get_token(email, "oldpass")
    
    resp = client.put("/api/v1/auth/change-password", json={
        "current_password": "wrongpass",
        "new_password": "newpass"
    }, headers={"Authorization": f"Bearer {token}"})
    
    assert resp.status_code == 400

def test_delete_account():
    email = f"delete_{uuid.uuid4()}@example.com"
    token = create_user_and_get_token(email, "pass")
    
    resp = client.delete("/api/v1/account", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    
    # Try logging in
    login_resp = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "pass"
    })
    assert login_resp.status_code == 401
