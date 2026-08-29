import { hackathons } from "../data/hackathons.js";

export async function getHackathons() {
  return hackathons;
}

export async function getHackathonById(id) {
  return hackathons.find((h) => h.id === id) || null;
}
