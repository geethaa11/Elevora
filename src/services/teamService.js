import { students } from "../data/students.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function getTeamMatches(userId, limit = 10, offset = 0) {
  const response = await fetch(`${BASE_URL}/api/v1/team-matches/${userId}?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error('Unauthorized');
    if (response.status === 403) throw new Error('Forbidden');
    if (response.status === 404) throw new Error('Not found');
    throw new Error('Failed to fetch matches');
  }
  return response.json();
}

export async function swipeAction(swipedId, action) {
  const response = await fetch(`${BASE_URL}/api/v1/team-matches/${action}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ swiped_id: swipedId, action: action })
  });
  if (!response.ok) {
    const err = new Error(`Failed to record ${action}`);
    err.status = response.status;
    throw err;
  }
  return response.json();
}

export async function getStudents() {
  return students;
}

export async function getStudentById(id) {
  return students.find((s) => s.id === id) || null;
}
