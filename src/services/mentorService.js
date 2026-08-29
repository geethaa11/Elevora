import { freeMentors, paidMentors } from "../data/mentors.js";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getFreeMentors() {
  return freeMentors;
}

export async function getFreeMentorById(id) {
  return freeMentors.find((m) => m.id === id) || null;
}

export async function getPaidMentors() {
  return paidMentors;
}

export async function getPaidMentorById(id) {
  return paidMentors.find((m) => m.id === id) || null;
}

export async function requestFreeGuidance(mentorId, payload) {
  await delay(800);
  return { success: true, mentorId, payload };
}

export async function bookPaidSession(mentorId, payload) {
  await delay(800);
  return { success: true, mentorId, payload };
}
