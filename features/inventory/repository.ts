import { MOCK_INVENTORY } from "@/lib/mock-data/inventory";

/**
 * Repository layer — the ONLY place that talks to the data source.
 * Currently backed by mock data; swap the body of these functions for
 * Supabase queries (via lib/supabase/server.ts) without touching callers.
 */
export async function listInventory() {
  return MOCK_INVENTORY;
}

export async function getInventoryById(id: string) {
  return MOCK_INVENTORY.find((item: any) => item.id === id) ?? null;
}
