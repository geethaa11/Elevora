import { students } from "../data/students.js";

export async function getStudents() {
  return students;
}

export async function getStudentById(id) {
  return students.find((s) => s.id === id) || null;
}
