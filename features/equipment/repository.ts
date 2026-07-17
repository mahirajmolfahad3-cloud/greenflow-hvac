import { MOCK_EQUIPMENT } from "@/lib/mock-data/equipment";

/**
 * Repository layer — the ONLY place that talks to the data source.
 * Currently backed by mock data; swap the body of these functions for
 * Supabase queries (via lib/supabase/server.ts) without touching callers.
 */
export async function listEquipment() {
  return MOCK_EQUIPMENT;
}

export async function getEquipmentById(id: string) {
  return MOCK_EQUIPMENT.find((item: any) => item.id === id) ?? null;
}
