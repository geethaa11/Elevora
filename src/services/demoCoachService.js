function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitPitchForCoaching(payload) {
  await delay(1200);
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

export const mockJudgeQuestions = [
  "How is your solution different from existing solutions?",
  "What happens if your core data source is unavailable on demo day?",
  "Who is your first real user, specifically?",
  "What was the hardest technical decision you made, and why?",
  "If you had another 48 hours, what would you build next?",
];
