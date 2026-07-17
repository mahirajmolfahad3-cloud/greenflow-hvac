import type { InventoryItem } from "@/types";

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: "inv-1", name: "R-410A Refrigerant (25lb)", sku: "REF-410A-25", supplier: "CoolParts Supply", quantityOnHand: 6, reorderThreshold: 4, unitCostCents: 15000 },
  { id: "inv-2", name: "Capacitor 45/5 MFD", sku: "CAP-45-5", supplier: "HVAC Depot", quantityOnHand: 22, reorderThreshold: 10, unitCostCents: 1800 },
  { id: "inv-3", name: "Air Filter 20x25x1", sku: "FLT-20251", supplier: "FilterCo", quantityOnHand: 3, reorderThreshold: 15, unitCostCents: 900 },
  { id: "inv-4", name: "Contactor 40A", sku: "CTC-40A", supplier: "HVAC Depot", quantityOnHand: 12, reorderThreshold: 6, unitCostCents: 2500 },
];
