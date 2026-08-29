# Elevora — Definitive API Contract & Agent Prompts (v1.0)

This supersedes the earlier plan. Everything ambiguous last time is now
pinned down: every endpoint has a full schema, every error has a code,
every fallback has an exact trigger, and the auth handoff between backend
devs is spelled out field-by-field. Nobody should have to invent a shape
tonight — if they do, that's a bug in this document, not a judgment call
for them to make.

Commit this whole file as `/docs/api-contract.md` before anyone writes a
line of endpoint code.

---

## 0. Global rules (apply to every endpoint below, no exceptions)

**Base URL:** `/api/v1`

**Auth:** Bearer JWT in `Authorization: Bearer <token>` header, on every
endpoint except `POST /auth/signup` and `POST /auth/login`.

**JWT payload (fixed shape, Backend 1 issues it, everyone else just
reads it):**
```json
{ "sub": "user_id_string", "email": "string", "role": "student", "exp": 1234567890 }
```
Any endpoint that needs "who is calling this" reads `sub` from the
decoded token as `user_id`. Nobody re-derives identity any other way.

**Standard success envelope:** return the resource directly (no wrapper)
for single objects; return `{ "items": [...], "count": N }` for lists.

**Standard error envelope (identical shape, every endpoint, every service):**
```json
{ "error": "snake_case_code", "message": "human readable string", "details": {} }
```

**Global error code table — use these codes, don't invent new ones without adding a row here:**

| HTTP | error code | when |
|---|---|---|
| 400 | `invalid_input` | malformed body, wrong type |
| 401 | `unauthorized` | missing/invalid/expired token |
| 403 | `forbidden` | valid token, wrong permissions |
| 404 | `not_found` | resource id doesn't exist |
| 422 | `missing_field` | required field absent — `details: {"field": "x"}` |
| 429 | `rate_limited` | upstream or internal rate limit hit |
| 503 | `service_unavailable` | downstream (AI/DB/external API) down — response body still includes `fallback_used: true` on endpoints that support fallback |
| 500 | `internal_error` | anything unhandled — should be rare; log it |

**Timeouts (hard rule):** any call to an external service (AI API,
hackathon data source) has a 10-second timeout. On timeout, return the
fallback response for that endpoint (see per-endpoint spec), never let
the client hang.

**Lists never return `null` or error on empty — always `{ "items": [], "count": 0 }`.**

**Pagination (list endpoints):** `?page=1&limit=20` query params, default
`page=1&limit=20`, max `limit=50`.

---

## 1. AUTH — Owner: Backend Dev 1

### POST /auth/signup
Request:
```json
{ "email": "string, required", "password": "string, required, min 8 chars", "name": "string, required" }
```
Success 201:
```json
{ "user_id": "string", "email": "string", "name": "string", "token": "jwt_string" }
```
Errors: `422 missing_field`, `400 invalid_input` (bad email format, password too short), `409 { "error": "email_taken" }`

### POST /auth/login
Request: `{ "email": "string", "password": "string" }`
Success 200: `{ "user_id": "string", "email": "string", "name": "string", "token": "jwt_string" }`
Errors: `401 { "error": "invalid_credentials" }`, `422 missing_field`

---

## 2. USERS — Owner: Backend Dev 1

### POST /users
Extends the signup profile. Request:
```json
{
  "skills": ["string"],
  "interests": ["string"],
  "bio": "string, optional",
  "college": "string, optional",
  "qualification": "string, optional",
  "preferred_role": "string, optional",
  "team_preference": "string, optional",
  "availability_time": "string, required, non-empty",
  "hackathons_participated": "integer, required, >= 0",
  "hackathons_won": "integer, required, >= 0, <= hackathons_participated"
}
```
Auth required — updates the profile for `sub` from the token.
Success 200: full user object (see GET /users/{id} shape).
Errors: `401 unauthorized`, `422 missing_field`

### GET /users/{id}
Success 200:
```json
{
  "user_id": "string",
  "email": "string",
  "name": "string",
  "skills": ["string"],
  "interests": ["string"],
  "bio": "string",
  "college": "string",
  "qualification": "string",
  "preferred_role": "string",
  "team_preference": "string",
  "availability_time": "string",
  "hackathons_participated": 0,
  "hackathons_won": 0
}
```
Errors: `404 not_found`

---

## 3. HACKATHONS — Owner: Integration Dev (you)

### GET /hackathons
Query params: `?domain=string&search=string&page=1&limit=20`
Success 200:
```json
{ "items": [ { "id": "string", "name": "string", "organization": "string", "deadline": "ISO8601 string", "domain": "string", "eligibility": "string", "registration_url": "string" } ], "count": N }
```
On external source failure/timeout/malformed data: still 200, `items` populated from the demo dataset, plus `"fallback_used": true` at the top level of the response (alongside `items`/`count`). Never a 503 to the frontend for this endpoint — hackathon listings must always render.

### GET /hackathons/{id}
Success 200: single hackathon object as above.
Errors: `404 not_found` (checked against combined real + demo dataset)

---

## 4. AI — Owner: Backend Dev 2

### POST /validator
Auth required.
Request:
```json
{ "idea": "string, required", "problem_statement": "string, required", "domain": "string, optional", "technology": "string, optional" }
```
Success 200:
```json
{
  "overall_score": 0,
  "feasibility": "low",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestions": ["string"],
  "possible_improvements": ["string"],
  "fallback_used": false
}
```
`overall_score`: integer 0-100. `feasibility`: one of `low|medium|high`.
Errors: `422 missing_field` (idea or problem_statement absent)
**Fallback trigger:** AI call exceeds 10s, throws, or returns non-JSON /
unparseable output. On trigger: return 200 (not 503) with a static but
idea-aware fallback — echo back a generic-but-plausible structured
response and set `fallback_used: true`. The frontend renders one code
path regardless.

### POST /demo-coach
Auth required.
Request: `{ "pitch_text": "string, required", "project_context": "string, optional" }`
Success 200:
```json
{
  "overall_feedback": "string",
  "clarity_feedback": "string",
  "structure_feedback": "string",
  "technical_explanation_feedback": "string",
  "missing_points": ["string"],
  "improvement_suggestions": ["string"],
  "fallback_used": false
}
```
Errors: `422 missing_field`
Fallback: identical policy to /validator — same shape, `fallback_used: true`, 200 not 503, triggered by the same conditions (timeout/exception/parse failure).

---

## 5. MENTORS — Owner: Backend Dev 2

### GET /mentors
Query params: `?skill=string&domain=string&search=string&page=1&limit=20`
Success 200:
```json
{ "items": [ { "mentor_id": "string", "name": "string", "title": "string", "organization": "string", "skills": ["string"], "bio": "string", "availability": "string" } ], "count": N }
```
Empty match → `{ "items": [], "count": 0 }`, never an error.

### GET /mentors/{id}
Success 200: single mentor object as above.
Errors: `404 not_found`

### POST /mentors/request
Auth required. Request: `{ "mentor_id": "string, required", "message": "string, required" }`
Success 201:
```json
{ "request_id": "string", "mentor_id": "string", "user_id": "string (from token sub)", "message": "string", "status": "pending", "created_at": "ISO8601 string" }
```
Errors: `422 missing_field`, `404 not_found` (mentor_id doesn't exist)

---

## 6. TEAMING — Owner: Backend Dev 1

### GET /team-matches/{user_id}
Success 200:
```json
{ "items": [ { "user_id": "string", "name": "string", "skills": ["string"], "match_score": 0 } ], "count": N }
```
`match_score`: integer 0-100. Empty → `{ "items": [], "count": 0 }`.

### POST /teams
Auth required. Request: `{ "name": "string, required", "hackathon_id": "string, required", "description": "string, optional" }`
Success 201:
```json
{ "team_id": "string", "name": "string", "hackathon_id": "string", "owner_id": "string (from token)", "members": ["user_id"], "description": "string" }
```
Errors: `422 missing_field`

### POST /teams/{team_id}/join
Auth required, no body.
Success 200: updated team object (same shape as above, `members` includes the joining `sub`).
Errors: `404 not_found`, `409 { "error": "already_member" }`, `409 { "error": "team_full" }` (if you implement a max size)

### GET /teams/{team_id}
Success 200: team object as above.
Errors: `404 not_found`

---

## 7. Coordination artifacts (exact files, exact update rule)

| File | Owner | Updated when |
|---|---|---|
| `/docs/api-contract.md` | Integration Dev only | Any endpoint added/changed — Integration Dev edits after backend dev proposes in chat/PR comment |
| `/docs/integration-status.md` | Integration Dev, read by all | Every time a flow moves Not started → Wired → Tested → Broken |
| `/docs/changelog.md` | Whoever makes a breaking change | Immediately, same commit as the change: `[HH:MM] <endpoint> — changed X to Y — owner: <name>` |

Rule: a backend dev who needs a contract change posts the proposed diff
in the PR/chat and **waits for the Integration Dev to commit it** before
relying on the new shape elsewhere. This is the one designed bottleneck —
it's intentional, it's what keeps 5 agents from forking reality.

---

## 8. Dependency graph (build order, not a flat list)

```
auth (signup/login)
  └─▶ users
        └─▶ everything requiring auth: /users POST, /mentors/request,
            /teams*, /team-matches
hackathons (no auth dependency) ──▶ can build in parallel from minute 0
validator / demo-coach (auth required, no other backend dependency)
  ──▶ can build in parallel from minute 0, just needs the JWT shape agreed
mentors GET* (no auth) ──▶ parallel from minute 0
mentors POST /request (needs user_id from token) ──▶ needs auth JWT shape agreed, not auth backend finished
```
Practical read: **only `/users` POST and `/teams*` truly block on
Backend 1 finishing auth.** Everything else needs the *JWT shape* agreed
(done, above) but not the auth implementation finished. Communicate this
explicitly so Backend Dev 2 and the Integration Dev don't sit idle
waiting on Backend Dev 1.

---

## 9. Final prompt — API & Integration Developer

```
ROLE: API & Integration Developer — Elevora
Contract of record: /docs/api-contract.md (v1.0, already fully specified
— you own edits to it, but the initial shapes are done; your job tonight
is enforcement and integration, not drafting from scratch).

YOU ENFORCE, YOU DON'T IMPROVISE
- Every endpoint in the contract has a full request/response schema and
  error table already. If an agent's implementation doesn't match it
  exactly (field names, types, status codes), that's a bug to flag and
  fix, not a new shape to accept.
- If a genuinely new field/endpoint is needed mid-build: the requesting
  dev proposes it to you, you add it to the contract with a changelog
  entry in /docs/changelog.md, THEN it gets implemented. Never the
  reverse order.

TONIGHT, IN ORDER
1. Confirm all 5 agents have read /docs/api-contract.md and the JWT
   payload shape in §0. This unblocks Backend Dev 2 and both frontend
   agents immediately — they don't need to wait on Backend Dev 1's auth
   implementation, only the token shape, which is already fixed.
2. Own GET /hackathons and GET /hackathons/{id} end to end:
   - Integrate the real external source.
   - Build the demo dataset (8-10 hackathons) matching the exact schema.
   - Wire automatic fallback: on timeout (10s) or malformed data, serve
     demo data with fallback_used: true, HTTP 200 — never a 503 here.
   - This endpoint has zero auth dependency — do this first, it can be
     fully done and tested before anyone else finishes anything.
3. As each backend endpoint comes online, write a smoke test that
   asserts against the *exact* schema in the contract — field names,
   types, status codes, error codes from the table in §0. Run it the
   moment an endpoint is reported done. A mismatch is a bug report back
   to that backend dev immediately, not something the frontend works
   around.
4. Wire frontend to backend one flow at a time, in this order (matches
   the dependency graph): (1) Signup→Onboarding→Dashboard, (2) Hackathon
   Explorer, (3) AI Validator, (4) AI Demo Coach, (5) Mentor Marketplace,
   (6) Teaming. After wiring each, use the Antigravity browser agent to
   click through it live — update /docs/integration-status.md
   immediately after (Not started → Wired → Tested → Broken).
5. For flows 3 and 4 specifically: test both the real AI path AND the
   forced-fallback path (kill the AI key temporarily) — confirm the
   frontend renders identically either way, since fallback_used is the
   only difference in the payload.

DO NOT
- Do not accept a response shape that "basically matches" the contract.
  Exact field names and types, or it's a bug.
- Do not let a backend dev commit a contract change directly — route it
  through you and the changelog.

END OF NIGHT
Post /docs/integration-status.md as-is, plus any changelog entries made,
plus a named list of what's blocked and on whom.
```

---

## 10. Final prompt — Backend Developer 2 (Feature/AI Backend)

```
ROLE: Backend Developer 2 — Feature/AI Backend — Elevora
Stack: Python, FastAPI, Pydantic, SQLite, external AI API.
Contract of record: /docs/api-contract.md §4 (AI) and §5 (Mentors) —
fully specified, including exact field names, types, error codes, and
fallback behavior. Implement to that spec exactly; do not adjust field
names for convenience.

WHAT YOU CAN START IMMEDIATELY, NO WAITING
- /validator and /demo-coach need zero dependency on Backend Dev 1 — only
  the JWT shape in §0 (already fixed: decode token, read `sub` as
  user_id if you need it — you don't for these two endpoints).
- /mentors and /mentors/{id} need zero auth — start immediately.
- /mentors/request needs the JWT shape only (already fixed) — don't wait
  for Backend Dev 1's auth service to be "done," just decode the token
  format already agreed.

1. POST /validator — build to §4 exactly:
   - Pydantic model enforces idea + problem_statement required, 422 with
     details.field on missing.
   - 10-second timeout on the AI call, hard-enforced.
   - Fallback trigger = timeout OR exception OR non-JSON/unparseable
     response. On trigger: return HTTP 200 with the exact success shape,
     fallback_used: true, and reasonable generic content — never let this
     surface as a 503 to the frontend, and never let it hang past 10s.

2. POST /demo-coach — identical discipline, per §4 schema.

3. GET /mentors, GET /mentors/{id}, POST /mentors/request — per §5.
   Seed 8-12 demo mentors directly into SQLite at startup (name, title,
   org, skills[], bio, availability) — this feature ships with zero
   external dependency tonight by design.
   For /mentors/request: read user_id from the decoded JWT's `sub` field,
   validate mentor_id exists (404 if not), persist status: "pending".

4. DATABASE: mentors, mentorship_requests tables. Pydantic
   request/response models are separate from your DB models — a DB
   column rename must never silently change what the API returns.

5. TEST EVERY ENDPOINT VIA SWAGGER BEFORE REPORTING DONE
   - Valid input → matches success schema exactly.
   - Missing required field → 422 with correct details.field.
   - Unset/broken AI key → confirm fallback fires within 10s, response
     shape identical to success except fallback_used: true.
   "Done" = contract-matched and fallback-tested, not "returns 200 once."

COORDINATE
- Any field you need that isn't in §4/§5 → propose to Integration Dev,
  wait for the contract update, then implement. Don't add it yourself.
- Never touch Backend Dev 1's auth/users/teams tables or endpoints.

DO NOT
- No multi-step AI pipelines, no RAG, no fine-tuning tonight. One prompt,
  one call, one parse, one fallback — per endpoint.
- No secrets committed. .env only, read via environment variables.

END OF NIGHT
Swagger link + one line per endpoint: contract-matched & fallback-tested,
or blocked (name the blocker).
```
