// Every function here stands in for a real network call. They're async and
// take a beat, on purpose, so loading states are real to build and test
// against — swap the body for a fetch() later and nothing upstream changes.

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitIdeaForValidation(payload) {
  await delay(1400);
  return {
    overallScore: 8.7,
    metrics: {
      Innovation: 9.0,
      Feasibility: 7.8,
      Impact: 8.8,
      Uniqueness: 8.2,
    },
    strengths: [
      "Clear, specific problem statement with a defined user",
      "Technology choices match the team's stated skills",
      "Realistic scope for a 36-hour build",
    ],
    weaknesses: [
      "Feasibility of the AI component under a hard time limit is untested",
      "No mention of how you'll get real data to demo with",
    ],
    suggestedFeatures: [
      "Add a lightweight onboarding flow so judges can try it in under a minute",
      "Pre-seed mock data so the demo doesn't depend on live input",
    ],
    recommendedTechStack: payload.techStack
      ? payload.techStack.split(",").map((s) => s.trim()).filter(Boolean)
      : ["React", "FastAPI", "PostgreSQL"],
    competitorAnalysis:
      "A few adjacent tools solve pieces of this (scheduling, matching, feedback) separately, but none combine them into one guided flow — that's your differentiation to lead with.",
    improvementSuggestions: [
      "Cut scope to one end-to-end flow that works perfectly over five that half-work",
      "Rehearse the demo path before the deadline, not during it",
    ],
  };
}

export async function submitPitchForCoaching(payload) {
  await delay(1400);
  return {
    overallScore: 7.8,
    metrics: {
      "Problem Clarity": 8,
      Innovation: 9,
      "Technical Depth": 6,
      Impact: 9,
      Presentation: 7,
    },
    wentWell: [
      "Strong problem explanation — a judge unfamiliar with the space would follow it",
      "Impact framing lands early instead of being an afterthought",
    ],
    needsImprovement: [
      "Technical implementation is described in vague terms — name the actual approach",
      "Scalability isn't addressed; expect a judge to ask about it",
    ],
    feedbackByCategory: {
      Problem: {
        issue: "The problem statement is broad enough to cover several unrelated use cases.",
        why: "Judges reward precision — a narrow, well-defended problem beats a broad, vague one.",
        how: "Name the specific user and the specific moment they hit this problem.",
      },
      Solution: {
        issue: "The solution is described at a feature level, not a mechanism level.",
        why: "Feature lists don't show technical judgment; mechanisms do.",
        how: "Pick your one hardest technical decision and explain why you made it.",
      },
      "Technical Depth": {
        issue: "Stack is named but not justified.",
        why: "Judges use this to gauge whether you understand your own build or just assembled it.",
        how: "Have one sentence ready on why each major piece of the stack was the right call.",
      },
      Impact: {
        issue: "Impact is asserted rather than quantified.",
        why: "A number, even a rough one, is more convincing than an adjective.",
        how: "Add one concrete estimate — users affected, time saved, cost reduced.",
      },
      Presentation: {
        issue: "The pitch doesn't have a clear closing ask or next step.",
        why: "Judges remember the last 10 seconds more than the first 10.",
        how: "End on what you'd build next, not just what you already built.",
      },
    },
    improvedPitch:
      "We're building for students who lose their first two hours of a hackathon just deciding what to build. Our tool turns a rough idea into a scored, feasible plan in under five minutes, so teams spend their time building instead of debating. In testing, that cut planning time by half. Next, we're adding live team-compatibility scoring so the same tool helps you find who to build it with.",
  };
}

export async function requestFreeGuidance(mentorId, payload) {
  await delay(900);
  return { success: true, mentorId, payload };
}

export async function bookPaidSession(mentorId, payload) {
  await delay(900);
  return { success: true, mentorId, payload };
}

export const mockJudgeQuestions = [
  "How is your solution different from existing solutions?",
  "What happens if your core data source is unavailable on demo day?",
  "Who is your first real user, specifically?",
  "What was the hardest technical decision you made, and why?",
  "If you had another 48 hours, what would you build next?",
];
