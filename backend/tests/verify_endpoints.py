import sys
import httpx

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("=== STARTING ELEVORA API INTEGRATION VERIFICATION ===")
    
    # 1. Verification of health check
    print("\nTesting: GET /health ...")
    r = httpx.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    resp_json = r.json()
    assert resp_json["success"] is True, "Expected success: true"
    assert resp_json["data"]["status"] == "ok", "Expected status: ok"
    print("[OK] Health check passed.")

    # 2. Authentication - User 1 Signup
    print("\nTesting: POST /auth/signup (User 1) ...")
    signup_data_1 = {
        "name": "Jane Developer",
        "email": "jane@example.com",
        "password": "securepassword123"
    }
    r = httpx.post(f"{BASE_URL}/auth/signup", json=signup_data_1)
    # Could be 201 or 400 if user already exists from a previous run
    if r.status_code == 400 and r.json()["error"]["code"] == "EMAIL_ALREADY_EXISTS":
        print("User already exists. Logging in instead...")
        login_data_1 = {
            "email": "jane@example.com",
            "password": "securepassword123"
        }
        r = httpx.post(f"{BASE_URL}/auth/login", json=login_data_1)
        assert r.status_code == 200, f"Login failed: {r.text}"
    else:
        assert r.status_code == 201, f"Expected 201, got {r.status_code} - {r.text}"
    
    token_1 = r.json()["data"]["token"]
    user_1_id = r.json()["data"]["user"]["id"]
    print(f"[OK] User 1 authenticated. ID: {user_1_id}")

    # 3. Authentication - Duplicate signup check
    print("\nTesting: POST /auth/signup (Duplicate Email Error Case) ...")
    r = httpx.post(f"{BASE_URL}/auth/signup", json=signup_data_1)
    assert r.status_code == 400, f"Expected 400, got {r.status_code}"
    assert r.json()["error"]["code"] == "EMAIL_ALREADY_EXISTS", "Expected EMAIL_ALREADY_EXISTS"
    print("[OK] Duplicate signup validation checked.")

    # 4. Profiles - Create Profile for User 1
    print("\nTesting: POST /users (Create User 1 Profile) ...")
    profile_data_1 = {
        "skills": ["Python", "FastAPI", "React", "SQL"],
        "interests": ["AI", "Web3", "Sustainability"],
        "bio": "Hacker building integration layers."
    }
    headers_1 = {"Authorization": f"Bearer {token_1}"}
    r = httpx.post(f"{BASE_URL}/users", json=profile_data_1, headers=headers_1)
    assert r.status_code == 200, f"Expected 200, got {r.status_code} - {r.text}"
    assert r.json()["data"]["skills"] == profile_data_1["skills"]
    print("[OK] Profile for User 1 created.")

    # 5. Profiles - Get Profile (Authenticated vs Unauthenticated)
    print("\nTesting: GET /users/{id} (Fetch Profile Detail) ...")
    # Authenticated fetch
    r = httpx.get(f"{BASE_URL}/users/{user_1_id}", headers=headers_1)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    # Unauthenticated fetch
    r_unauth = httpx.get(f"{BASE_URL}/users/{user_1_id}")
    assert r_unauth.status_code == 401, f"Expected 401, got {r_unauth.status_code}"
    print("[OK] Profile authentication logic verified.")

    # 6. Hackathons - Query list & Detail (Seeded data checks)
    print("\nTesting: GET /hackathons (Checking seeded hackathons) ...")
    r = httpx.get(f"{BASE_URL}/hackathons")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    hackathons = r.json()["data"]["hackathons"]
    assert len(hackathons) > 0, "Expected database to be seeded with hackathons"
    print(f"[OK] Found {len(hackathons)} seeded hackathons.")
    
    # Filter test
    print("Testing domain query filters (domain=AI) ...")
    r_filter = httpx.get(f"{BASE_URL}/hackathons?domain=AI")
    ai_hacks = r_filter.json()["data"]["hackathons"]
    assert all(h["domain"].lower() == "ai" for h in ai_hacks), "Expected all matching items to have domain='AI'"
    print("[OK] Domain filtering verified.")

    # Detail test
    first_hack_id = hackathons[0]["id"]
    print(f"Testing detail route /hackathons/{first_hack_id} ...")
    r_detail = httpx.get(f"{BASE_URL}/hackathons/{first_hack_id}")
    assert r_detail.status_code == 200, f"Expected 200, got {r_detail.status_code}"
    assert r_detail.json()["data"]["id"] == first_hack_id
    print("[OK] Hackathon detail retrieval passed.")

    # 7. AI Validator & Demo Coach (Rule stubs checks)
    print("\nTesting AI Services ...")
    # Validator
    validator_input = {
        "ideaTitle": "AI Carbon Tracker",
        "ideaDescription": "Using computer vision to detect environmental waste items."
    }
    r_val = httpx.post(f"{BASE_URL}/validator", json=validator_input)
    assert r_val.status_code == 200, f"Expected 200, got {r_val.status_code}"
    val_data = r_val.json()["data"]
    assert "score" in val_data and len(val_data["strengths"]) > 0, "Malformed validator output"
    print(f"[OK] AI Validator stub verified. Mock Score: {val_data['score']}")

    # Demo Coach
    coach_input = {
        "pitchText": "Short pitch text."
    }
    r_coach = httpx.post(f"{BASE_URL}/demo-coach", json=coach_input)
    assert r_coach.status_code == 200, f"Expected 200, got {r_coach.status_code}"
    coach_data = r_coach.json()["data"]
    assert coach_data["clarityScore"] == 50, "Expected low score for short pitch"
    print("[OK] AI Demo Coach stub verified.")

    # 8. Mentors Marketplace
    print("\nTesting: Mentors & Request flows ...")
    # List
    r_mentors = httpx.get(f"{BASE_URL}/mentors")
    assert r_mentors.status_code == 200
    mentors = r_mentors.json()["data"]["mentors"]
    assert len(mentors) > 0, "Mentors table was not seeded"
    print(f"[OK] Found {len(mentors)} seeded mentors.")

    # Send Request
    first_mentor_id = mentors[0]["id"]
    req_payload = {
        "mentorId": first_mentor_id,
        "message": "Need help debugging an SQLite multi-thread lock issue."
    }
    r_req = httpx.post(f"{BASE_URL}/mentors/request", json=req_payload, headers=headers_1)
    assert r_req.status_code == 201, f"Expected 201, got {r_req.status_code} - {r_req.text}"
    assert "requestId" in r_req.json()["data"]
    print("[OK] Mentor connection request submitted successfully.")

    # 9. Teaming & Teammate recommendations
    # Create User 2 with matching skills to test recommendation scoring
    print("\nSetting up User 2 for matching verification ...")
    signup_data_2 = {
        "name": "Bob Programmer",
        "email": "bob@example.com",
        "password": "securepassword123"
    }
    r_signup_2 = httpx.post(f"{BASE_URL}/auth/signup", json=signup_data_2)
    if r_signup_2.status_code == 400:
        r_signup_2 = httpx.post(f"{BASE_URL}/auth/login", json=signup_data_2)
    token_2 = r_signup_2.json()["data"]["token"]
    user_2_id = r_signup_2.json()["data"]["user"]["id"]
    headers_2 = {"Authorization": f"Bearer {token_2}"}

    # Profile User 2
    profile_data_2 = {
        "skills": ["Python", "React", "UI/UX Design"], # Overlaps with User 1: Python, React
        "interests": ["AI", "ClimateTech"],           # Overlaps with User 1: AI
        "bio": "Hacker specializing in UI/UX development."
    }
    httpx.post(f"{BASE_URL}/users", json=profile_data_2, headers=headers_2)
    print("[OK] User 2 set up with overlapping profile.")

    # Call /team-matches/me
    print("Testing GET /team-matches/me ...")
    r_matches = httpx.get(f"{BASE_URL}/team-matches/me", headers=headers_1)
    assert r_matches.status_code == 200, f"Expected 200, got {r_matches.status_code}"
    matches_list = r_matches.json()["data"]["matches"]
    assert len(matches_list) > 0, "No teammate recommendation returned"
    assert any(m["userId"] == user_2_id for m in matches_list), "User 2 not suggested as teammate"
    print("[OK] Matches recommendation endpoint calculated scores correctly.")

    # 10. Teams creation and joining
    print("\nTesting: Teaming CRUD operations ...")
    # Create Team
    r_team = httpx.post(f"{BASE_URL}/teams", json={"name": "EcoDevs"}, headers=headers_1)
    assert r_team.status_code == 201, f"Expected 201, got {r_team.status_code}"
    team_data = r_team.json()["data"]
    team_id = team_data["id"]
    assert team_data["owner_id"] == user_1_id, "Expected User 1 to own the team"
    assert len(team_data["members"]) == 1, "Expected team to have 1 member initially"
    print("[OK] Team created. Owner automatically added to member list.")

    # Join Team
    r_join = httpx.post(f"{BASE_URL}/teams/{team_id}/join", headers=headers_2)
    assert r_join.status_code == 200, f"Expected 200, got {r_join.status_code} - {r_join.text}"
    members_list = r_join.json()["data"]["members"]
    assert len(members_list) == 2, "Expected 2 members in team after join"
    print("[OK] User 2 joined team successfully.")

    # Error Case: Join again
    print("Testing duplicate membership join error case ...")
    r_rejoin = httpx.post(f"{BASE_URL}/teams/{team_id}/join", headers=headers_2)
    assert r_rejoin.status_code == 400, f"Expected 400, got {r_rejoin.status_code}"
    assert r_rejoin.json()["error"]["code"] == "ALREADY_MEMBER"
    print("[OK] Duplicate membership joining blocked.")

    # Get Team detail
    print(f"Testing GET /teams/{team_id} ...")
    r_team_detail = httpx.get(f"{BASE_URL}/teams/{team_id}")
    assert r_team_detail.status_code == 200
    assert len(r_team_detail.json()["data"]["members"]) == 2
    print("[OK] Get Team details passed.")

    # Nonexistent team join error
    print("Testing join nonexistent team error case ...")
    r_bad_join = httpx.post(f"{BASE_URL}/teams/99999/join", headers=headers_2)
    assert r_bad_join.status_code == 404, f"Expected 404, got {r_bad_join.status_code}"
    assert r_bad_join.json()["error"]["code"] == "TEAM_NOT_FOUND"
    print("[OK] Nonexistent team joining validation verified.")

    print("\n=== ALL ELEVORA INTEGRATION TESTS COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    try:
        run_tests()
    except AssertionError as e:
        print(f"\n[ERROR] TEST FAILURE: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] UNEXPECTED ERROR: {e}")
        sys.exit(1)
