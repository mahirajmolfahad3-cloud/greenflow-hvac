import type { NotificationItem } from "@/types";

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "Job assigned", body: "You were assigned to 'AC unit not cooling' at Riverside Apartments.", read: false, createdAt: "2026-07-17T08:00:00" },
  { id: "n2", title: "Invoice overdue", body: "Invoice #inv2 for Sunset Medical Center is overdue.", read: false, createdAt: "2026-07-16T15:00:00" },
  { id: "n3", title: "Estimate approved", body: "Riverside Apartments approved estimate #es1.", read: true, createdAt: "2026-07-14T11:20:00" },
];
