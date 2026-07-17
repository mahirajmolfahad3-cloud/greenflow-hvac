import { listJobs, getJobById } from "./repository";
import type { JobStatus } from "@/types";

export async function getJobList(status?: JobStatus) {
  const jobs = await listJobs();
  if (!status) return jobs;
  return jobs.filter((j) => j.status === status);
}

export async function getJobDetail(id: string) {
  return getJobById(id);
}

export async function getTechnicianJobs(technicianName: string) {
  const jobs = await listJobs();
  return jobs.filter((j) => j.assignedTo === technicianName);
}
