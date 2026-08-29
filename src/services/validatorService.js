function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitIdeaForValidation(payload) {
  await delay(1200);
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
