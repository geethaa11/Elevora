# Elevora API Contract

This document serves as the single source of truth for the Elevora API. All endpoints must adhere to the contracts defined below.

---

## 1. Response Envelope

All API endpoints return a standardized JSON response envelope.

### Success Response
Returned with HTTP status 200 (or 201 for creation).
```json
{
  "success": true,
  "data": {
    ...
  }
}
```

### Error Response
Returned with appropriate HTTP status codes (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity, 500 Internal Server Error).
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "A human-readable description of the error."
  }
}
```

---

## 2. Frontend Axios Client & Interceptor Behavior

To ensure uniform error handling and clean response extraction, the frontend uses a shared Axios client.

### Interceptor Response Behavior
* **Success Interception:** The response interceptor returns `response.data`, which represents the **complete success envelope** returned by the server (i.e., `{ success: true, data: { ... } }`).
* **Why this approach?** Keeping the outer envelope ensures frontend components can explicitly verify `response.success` if needed and aligns with standard server communication logs.
* **Error Interception:** If the server returns a non-2xx status code, the interceptor catches the error, extracts the error message from `error.response.data.error.message` (defaulting to a fallback generic message), and returns a rejected promise containing `{ message, raw: error }`.

---

## 3. Endpoints Detail

### Foundation & Diagnostics

#### Health Check
* **Method:** `GET`
* **Endpoint:** `/health`
* **Auth Required:** No
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

---

### Authentication

#### User Signup
* **Method:** `POST`
* **Endpoint:** `/auth/signup`
* **Auth Required:** No
* **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongpassword123"
}
```
* **Status:** `201 Created`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
* **Error Example (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "A user with this email already exists."
  }
}
```

#### User Login
* **Method:** `POST`
* **Endpoint:** `/auth/login`
* **Auth Required:** No
* **Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "strongpassword123"
}
```
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
* **Error Example (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password."
  }
}
```

---

### User Profiles

#### Create or Update Profile
* **Method:** `POST`
* **Endpoint:** `/users`
* **Auth Required:** Yes (`Authorization: Bearer <token>`)
* **Request Body:**
```json
{
  "skills": ["Python", "FastAPI", "React", "Docker"],
  "interests": ["AI", "Web3", "Hackathons"],
  "bio": "Full stack developer interested in building AI platforms."
}
```
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "skills": ["Python", "FastAPI", "React", "Docker"],
    "interests": ["AI", "Web3", "Hackathons"],
    "bio": "Full stack developer interested in building AI platforms."
  }
}
```

#### Get Profile Detail
* **Method:** `GET`
* **Endpoint:** `/users/{id}`
* **Auth Required:** Yes (`Authorization: Bearer <token>`)
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "skills": ["Python", "FastAPI", "React", "Docker"],
    "interests": ["AI", "Web3", "Hackathons"],
    "bio": "Full stack developer interested in building AI platforms."
  }
}
```
* **Error Example (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Profile not found for this user."
  }
}
```

---

### Hackathons

#### List Hackathons
* **Method:** `GET`
* **Endpoint:** `/hackathons`
* **Query Parameters:** `?search=global&domain=AI` (optional)
* **Auth Required:** No
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "hackathons": [
      {
        "id": 1,
        "name": "Global AI Hackathon",
        "organization": "AI Association",
        "deadline": "2026-10-15T23:59:59Z",
        "domain": "AI",
        "eligibility": "All students",
        "registration_url": "https://example.com/register/1"
      }
    ]
  }
}
```

#### Get Hackathon Detail
* **Method:** `GET`
* **Endpoint:** `/hackathons/{id}`
* **Auth Required:** No
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Global AI Hackathon",
    "organization": "AI Association",
    "deadline": "2026-10-15T23:59:59Z",
    "domain": "AI",
    "eligibility": "All students",
    "registration_url": "https://example.com/register/1"
  }
}
```

---

### AI Integration Services

#### AI Idea Validator
* **Method:** `POST`
* **Endpoint:** `/validator`
* **Auth Required:** No
* **Request Body:**
```json
{
  "ideaTitle": "EcoTracker App",
  "ideaDescription": "A mobile application tracking users' carbon footprint by scanning grocery receipts."
}
```
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "score": 85,
    "feedback": "Great concept linking environmental awareness with daily consumption patterns.",
    "strengths": ["Scalable scanning technology", "High market interest in sustainability"],
    "risks": ["Difficult receipt OCR precision", "User fatigue with manual tracking"]
  }
}
```

#### AI Demo Coach
* **Method:** `POST`
* **Endpoint:** `/demo-coach`
* **Auth Required:** No
* **Request Body:**
```json
{
  "pitchText": "Hello, our app is EcoTracker and it scans receipts to save the world by counting your carbon footprint."
}
```
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "feedback": "Good initial hook, but need to explain the concrete mechanism of action faster.",
    "clarityScore": 72,
    "suggestions": [
      "Explain receipt scanning technology in the first 15 seconds.",
      "Quantify impact instead of using broad statements like 'save the world'."
    ]
  }
}
```

---

### Mentor Marketplace

#### List Mentors
* **Method:** `GET`
* **Endpoint:** `/mentors`
* **Auth Required:** No
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "mentors": [
      {
        "id": 1,
        "name": "Dr. Sarah Connor",
        "expertise": ["Machine Learning", "System Security"],
        "rating": 4.9
      }
    ]
  }
}
```

#### Get Mentor Detail
* **Method:** `GET`
* **Endpoint:** `/mentors/{id}`
* **Auth Required:** No
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Dr. Sarah Connor",
    "expertise": ["Machine Learning", "System Security"],
    "rating": 4.9
  }
}
```

#### Request Mentor Session
* **Method:** `POST`
* **Endpoint:** `/mentors/request`
* **Auth Required:** Yes (`Authorization: Bearer <token>`)
* **Request Body:**
```json
{
  "mentorId": 1,
  "message": "Hi, we are building a receipt parser and need advice on NLP accuracy."
}
```
* **Status:** `201 Created`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "requestId": 1,
    "status": "pending"
  }
}
```

---

### Student Teaming

#### Get Recommended Team Matches (Based on current user profile)
* **Method:** `GET`
* **Endpoint:** `/team-matches/me`
* **Auth Required:** Yes (`Authorization: Bearer <token>`)
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "userId": 2,
        "name": "Bob Smith",
        "skills": ["UI/UX", "Figma", "CSS"],
        "matchScore": 92
      }
    ]
  }
}
```

#### Create Team
* **Method:** `POST`
* **Endpoint:** `/teams`
* **Auth Required:** Yes (`Authorization: Bearer <token>`)
* **Request Body:**
```json
{
  "name": "The Carbon Busters"
}
```
* **Status:** `201 Created`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "The Carbon Busters",
    "ownerId": 1,
    "members": [
      {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com"
      }
    ]
  }
}
```

#### Join Team
* **Method:** `POST`
* **Endpoint:** `/teams/{team_id}/join`
* **Auth Required:** Yes (`Authorization: Bearer <token>`)
* **Request Body:** None
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "The Carbon Busters",
    "ownerId": 1,
    "members": [
      {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      {
        "id": 2,
        "name": "Bob Smith",
        "email": "bob@example.com"
      }
    ]
  }
}
```
* **Error Examples:**
  * **Team not found (404 Not Found):**
    ```json
    { "success": false, "error": { "code": "TEAM_NOT_FOUND", "message": "Team does not exist." } }
    ```
  * **Already a member (400 Bad Request):**
    ```json
    { "success": false, "error": { "code": "ALREADY_MEMBER", "message": "You are already a member of this team." } }
    ```

#### Get Team Detail
* **Method:** `GET`
* **Endpoint:** `/teams/{team_id}`
* **Auth Required:** No
* **Status:** `200 OK`
* **Response Body:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "The Carbon Busters",
    "ownerId": 1,
    "members": [
      {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      {
        "id": 2,
        "name": "Bob Smith",
        "email": "bob@example.com"
      }
    ]
  }
}
```
