import type { Invoice } from "@/types";

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv1", customerName: "Blue Sky Diner", status: "paid", dueDate: "2026-07-01", createdAt: "2026-06-20", totalCents: 38000,
    items: [{ id: "ii1", description: "Annual maintenance", quantity: 1, unitPriceCents: 38000 }],
  },
  {
    id: "inv2", customerName: "Sunset Medical Center", status: "overdue", dueDate: "2026-07-05", createdAt: "2026-06-25", totalCents: 154000,
    items: [{ id: "ii2", description: "Emergency repair", quantity: 1, unitPriceCents: 154000 }],
  },
  {
    id: "inv3", customerName: "Harper Residence", status: "sent", dueDate: "2026-07-28", createdAt: "2026-07-14", totalCents: 22000,
    items: [{ id: "ii3", description: "Thermostat replacement", quantity: 1, unitPriceCents: 22000 }],
  },
];
