import { MOCK_CUSTOMERS } from "@/lib/mock-data/customers";

/**
 * Repository layer — the ONLY place that talks to the data source.
 * Currently backed by mock data; swap the body of these functions for
 * Supabase queries (via lib/supabase/server.ts) without touching callers.
 */
export async function listCustomers() {
  return MOCK_CUSTOMERS;
}

export async function getCustomerById(id: string) {
  return MOCK_CUSTOMERS.find((item: any) => item.id === id) ?? null;
}
