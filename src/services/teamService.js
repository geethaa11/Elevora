import { students } from "../data/students.js";

export async function getTeamMatches(userId, limit = 10, offset = 0) {
  const matches = students.slice(offset, offset + limit).map((student) => ({
    ...student,
    match_score: student.match_score ?? 0.85,
    shared_skills: student.shared_skills ?? [],
    shared_interests: student.shared_interests ?? [],
    complementary_skills: student.complementary_skills ?? [],
    complementary_role: student.complementary_role ?? true,
    match_reasons: student.match_reasons ?? [
      "Compatible technical skills",
      "Complementary role",
      "Shared interests"
    ]
  }));

  return matches;
}

export async function swipeAction(swipedId, action) {
  console.log(`Demo swipe: ${action}`, swipedId);

  return {
    success: true,
    swiped_id: swipedId,
    action
  };
}
