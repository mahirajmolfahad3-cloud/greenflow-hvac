import { MOCK_NOTIFICATIONS } from "@/lib/mock-data/notifications";

/**
 * Repository layer — the ONLY place that talks to the data source.
 * Currently backed by mock data; swap the body of these functions for
 * Supabase queries (via lib/supabase/server.ts) without touching callers.
 */
export async function listNotifications() {
  return MOCK_NOTIFICATIONS;
}

export async function getNotificationById(id: string) {
  return MOCK_NOTIFICATIONS.find((item: any) => item.id === id) ?? null;
}
