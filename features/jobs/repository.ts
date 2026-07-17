import { MOCK_JOBS } from "@/lib/mock-data/jobs";

/**
 * Repository layer — the ONLY place that talks to the data source.
 * Currently backed by mock data; swap the body of these functions for
 * Supabase queries (via lib/supabase/server.ts) without touching callers.
 */
export async function listJobs() {
  return MOCK_JOBS;
}

export async function getJobById(id: string) {
  return MOCK_JOBS.find((item: any) => item.id === id) ?? null;
}
