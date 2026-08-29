# Elevora — Frontend B

All five Frontend B features from the brief, implemented against the
approved Elevora design system (dark theme, gold `#B8860B` + purple
`#6D38D9`, DM Serif Display + Inter) and wired together with routing so the
full journey — Explorer → Details → Teaming → Validator → Demo Coach, with
Mentor Marketplace reachable throughout — actually flows end to end.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production
bundle in `dist/`.

## What's here

```
src/
  components/         Button, Badge, SearchBar, Select, FilterBar, Fields
                       (Input/Textarea/FieldSelect/Tabs/RadioCard), Avatar,
                       ScoreCard/ProgressBar, HackathonCard, StudentCard,
                       MentorCard, TimeSection, States (Empty/Loading), Layout
  context/AppState.jsx selected hackathon, team roster, validator + demo-coach
                       results — shared across routes without a backend
  data/                hackathons.js (20 records), students.js (12),
                       mentors.js (free + paid)
  services/            mockServices.js — async, delayed mock endpoints
                       standing in for POST /validator, /demo-coach, mentor
                       request/booking
  features/
    hackathons/         HackathonExplorer, HackathonDetails
    teamBuilder/         TeamBuilder, TeammateProfile, CreateTeam
    validator/            ValidatorInput, ValidatorResult
    demoCoach/             DemoCoachInput, PitchAnalysisResult,
                            DetailedFeedback, ImprovedPitch, MockJudge
    mentors/                MentorMarketplace, Free*/Paid* list, profile,
                            request/booking flows
  utils/dateUtils.js   section-bucketing (Closing soon / This week / ...)
```

`components/Layout.jsx` provides a sidebar + topbar so the app is
navigable — but it's explicitly labelled a **preview stand-in**, not the
real shared shell. In the real Elevora app these routes render inside the
sidebar/topbar owned by Frontend A, per the brief ("do not redesign the
global sidebar"). Swap `Layout` for the real one and every route below
keeps working unchanged.

## Routes implemented

```
/                              Home (links into all five features)
/hackathons                    Hackathon Explorer
/hackathons/:id                Hackathon Details → "Build Project"
/team-builder                  Student Teaming
/team-builder/:id              Teammate Profile
/team-builder/create            Create Team → "Continue to Idea Validator"
/validator                     AI Idea Validator input
/validator/result              Validation result → "Continue to Demo Coach"
/demo-coach                    AI Demo Coach input
/demo-coach/result             Pitch analysis result
/demo-coach/feedback           Detailed feedback (tabs)
/demo-coach/improved-pitch     Improved pitch
/demo-coach/mock-judge         Mock judge → "Demo Ready"
/mentors                       Marketplace (Free vs Paid, equal weight)
/mentors/free                  Volunteer mentor list
/mentors/free/:id               Volunteer profile
/mentors/free/:id/request        Guidance request (short, no payment)
/mentors/paid                  Expert mentor list
/mentors/paid/:id                Expert profile
/mentors/paid/:id/book            7-step booking → summary → mock confirm
```

## About the mock data

Five records (tagged `source: "unstop"` in `hackathons.js`) are built from
real, live listings on unstop.com/hackathons, captured 29 Aug 2026:
ForgeX AI 2026, Lun4R CTF 2026, PromptCraft 1.0, GopwnIt CTF, and the
GAME-ATHON at NMIMS Chandigarh. Unstop's public listing page doesn't expose
prize pools or full descriptions for most of these, so those fields are
reasonable placeholders, not scraped values — worth swapping in the real
numbers before demo day if you want it airtight.

The other 15 records are realistic supporting data written to fill out the
time-based sections (closing soon / this week / next 7 days / this month /
upcoming / next month) the brief asked for, including a few names pulled
straight from the reference deck (Smart India Hackathon, Devfolio, MLH
Fellowship, Build for Bharat).

Deadlines are generated relative to whenever the app is opened
(`addDays(n)` in `hackathons.js`), so "3 days left" stays true whether this
runs today or next week — swap in real `POST /hackathons` data later and
the section logic keeps working unchanged.

## Wiring up the real API later

Every feature reads from a local `data/*.js` file or `services/mockServices.js`
as its only data source — no component talks to mock data directly except
through those two seams. To go live:

- `data/hackathons.js` → `GET /hackathons` (keep the same record shape)
- `data/students.js` → `GET /team-matches`, `GET /students/:id`, `POST /teams`
- `data/mentors.js` → `GET /mentors/free`, `GET /mentors/paid`
- `services/mockServices.js` → `POST /validator`, `POST /demo-coach`,
  `POST /mentors/free/:id/request`, `POST /mentors/paid/:id/book`

Swap the body of each mock function/import for a real `fetch`, keep the
return shape, and every screen downstream — filtering, sorting, scoring,
forms — keeps working unchanged.

## Known simplifications (flagged, not hidden)

- No real payment integration on the paid booking flow, per the brief —
  it ends on a clearly labelled "Prototype booking" mock confirmation.
- `AppState` (selected hackathon, team roster, validator/demo-coach
  results) lives in React context and resets on page refresh. Fine for a
  demo; swap for real persistence (backend or localStorage-via-API) before
  relying on it past a single session.
- Hackathon thumbnails are domain-tinted icon cards, not photos — kept
  on-brand without an external image dependency for mock data.
- Mock Judge grading is a random score in a plausible range, not real
  analysis — same spirit as the rest of the mock-first data.
