# Elevora — Frontend (Phase 1: Landing + Login)

The AI-powered hackathon operating system. This package contains the
landing page and login page, built as a real, responsive React app —
cinematic black-and-gold theme, golden particle field, custom cursor
glow, and scroll-driven reveals.

## Tech stack

- React 18 + Vite
- Tailwind CSS (design tokens in `tailwind.config.js`)
- Framer Motion (scroll reveals, hover/tap micro-interactions, spring cursor)
- React Router DOM v6 (`/` and `/login`)
- lucide-react (icons)
- Golden particle field and globe visuals are hand-rolled Canvas/SVG —
  no extra particle or 3D library, to keep the bundle light.

## Installation

```bash
npm install
npm run dev       # start local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

> This environment doesn't have outbound network access, so the
> dependencies above haven't been installed or build-verified here.
> Run `npm install && npm run build` on your machine to confirm —
> if anything comes up, it'll most likely be a stray import to fix,
> not a structural issue.

## Project structure

```
src/
  components/
    Navbar.jsx            fixed navbar, hover-underline links, mobile menu
    ScrollProgressRail.jsx  left-side 01–05 scroll rail (landing, desktop only)
    GoldenParticles.jsx    reusable canvas particle field (used on every section)
    CursorGlow.jsx         global gold cursor-follow glow, disabled on touch
    Hero.jsx               hero section: wordmark, tagline, CTAs, orbital trails
    HackathonSection.jsx   "Discover" section with globe + floating hackathon cards
    ValidatorSection.jsx   "Build" section — AI Validator holographic panel
    TeamBuilderSection.jsx "Grow" section — AI team-matching network graphic
    MentorSection.jsx      mentor marketplace cards with a featured mentor
    FinalCTA.jsx           closing cinematic CTA (silhouette + skyline + planet)
    LoginCard.jsx          login form: email/password, show/hide, social buttons
    GlobeVisual.jsx         shared animated globe SVG (landing + login)
    GoldenButton.jsx        PrimaryButton / SecondaryButton
    SectionLabel.jsx        small eyebrow label
    TiltCard.jsx             shared hover-lift + subtle-tilt card wrapper
    Logo.jsx                 circuit-mark logo + "ELEVORA" wordmark

  pages/
    Landing.jsx    assembles all landing sections
    Login.jsx       assembles the login page

  data/
    hackathons.js, mentors.js, teamMembers.js   content for the floating cards

  App.jsx, main.jsx, index.css
```

## Navigation

- Landing `Get Started` / `Join Elevora` → `/login`
- Login `Back to home` → `/`
- Login `Sign up` / `Forgot password` / social buttons are placeholder
  interactions only — no backend wired up yet (by design, this is Phase 1)

## Asset replacement

There are no external/stock images — the globe, particles, orbital
trails, city skyline and silhouette are all generated with Canvas/SVG so
the app looks complete with zero asset dependencies. If you'd rather
swap in real illustrations or photography later, the natural drop-in
points are:

- `GlobeVisual.jsx` → replace with an image/GLTF if you want a literal 3D globe
- `Hero.jsx` asteroid field / orbital trails → swap for a rendered background plate
- `FinalCTA.jsx` skyline + silhouette → swap for real artwork

## What's intentionally not built yet

Per the Phase 1 scope: no Firebase/Google/GitHub OAuth, no backend, no
dashboard, onboarding, or profile pages. Those are later phases.

## Accessibility & performance notes

- All interactive elements have visible focus rings (`:focus-visible`)
- `prefers-reduced-motion` is respected globally (CSS) and inside the
  particle field and cursor glow (JS)
- The custom cursor and scroll rail are disabled/hidden on touch and
  small screens respectively
- Particle field is a single canvas per section (not DOM nodes), so
  scroll/hover performance stays smooth even with several sections on
  screen
