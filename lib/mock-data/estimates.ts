import type { Estimate } from "@/types";

export const MOCK_ESTIMATES: Estimate[] = [
  {
    id: "es1", customerName: "Riverside Apartments", status: "sent", taxRate: 0.0825, discountCents: 0, createdAt: "2026-07-10",
    items: [
      { id: "i1", description: "Compressor replacement", quantity: 1, unitPriceCents: 120000 },
      { id: "i2", description: "Labor (4 hrs)", quantity: 4, unitPriceCents: 9500 },
    ],
  },
  {
    id: "es2", customerName: "Maple Grove School", status: "draft", taxRate: 0.0825, discountCents: 5000, createdAt: "2026-07-14",
    items: [{ id: "i3", description: "Ductwork inspection (15 units)", quantity: 15, unitPriceCents: 4500 }],
  },
];
