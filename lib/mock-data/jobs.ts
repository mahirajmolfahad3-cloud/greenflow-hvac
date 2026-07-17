import type { Job } from "@/types";

export const MOCK_JOBS: Job[] = [
  { id: "j1", title: "AC unit not cooling", customerName: "Riverside Apartments", address: "120 Riverside Dr", status: "in_progress", priority: "high", scheduledFor: "2026-07-17T09:00:00", assignedTo: "Mike Torres", createdAt: "2026-07-15" },
  { id: "j2", title: "Annual maintenance", customerName: "Blue Sky Diner", address: "45 Congress Ave", status: "scheduled", priority: "low", scheduledFor: "2026-07-18T13:00:00", assignedTo: "Alicia Ford", createdAt: "2026-07-14" },
  { id: "j3", title: "Furnace inspection", customerName: "Maple Grove School", address: "900 Maple Grove Rd", status: "unscheduled", priority: "medium", scheduledFor: null, assignedTo: null, createdAt: "2026-07-16" },
  { id: "j4", title: "Emergency no-heat call", customerName: "Sunset Medical Center", address: "77 Sunset Blvd", status: "completed", priority: "emergency", scheduledFor: "2026-07-10T07:30:00", assignedTo: "Mike Torres", createdAt: "2026-07-09" },
  { id: "j5", title: "Thermostat replacement", customerName: "Harper Residence", address: "12 Harper Ln", status: "scheduled", priority: "medium", scheduledFor: "2026-07-19T10:00:00", assignedTo: "Alicia Ford", createdAt: "2026-07-16" },
];
