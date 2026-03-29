import { apiFetch, API_BASE_URL } from "../src/lib/api";
import { ResumeSummary, ResumeDetail } from "../types/resume.types";

export async function getUserResumes(): Promise<ResumeSummary[]> {
  return apiFetch(`${API_BASE_URL}/api/resumes`);
}

export async function getResumeDetail(id: string): Promise<ResumeDetail> {
  return apiFetch(`${API_BASE_URL}/api/resumes/${encodeURIComponent(id)}`);
}
