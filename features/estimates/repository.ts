import { MOCK_ESTIMATES } from "@/lib/mock-data/estimates";

/**
 * Repository layer — the ONLY place that talks to the data source.
 * Currently backed by mock data; swap the body of these functions for
 * Supabase queries (via lib/supabase/server.ts) without touching callers.
 */
export async function listEstimates() {
  return MOCK_ESTIMATES;
}

export async function getEstimateById(id: string) {
  return MOCK_ESTIMATES.find((item: any) => item.id === id) ?? null;
}
