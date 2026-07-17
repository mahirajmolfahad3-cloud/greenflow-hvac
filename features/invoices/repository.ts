import { MOCK_INVOICES } from "@/lib/mock-data/invoices";

/**
 * Repository layer — the ONLY place that talks to the data source.
 * Currently backed by mock data; swap the body of these functions for
 * Supabase queries (via lib/supabase/server.ts) without touching callers.
 */
export async function listInvoices() {
  return MOCK_INVOICES;
}

export async function getInvoiceById(id: string) {
  return MOCK_INVOICES.find((item: any) => item.id === id) ?? null;
}
