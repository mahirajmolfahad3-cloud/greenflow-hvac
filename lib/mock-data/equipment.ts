import type { Equipment } from "@/types";

export const MOCK_EQUIPMENT: Equipment[] = [
  { id: "e1", customerId: "c1", customerName: "Riverside Apartments", manufacturer: "Carrier", model: "24ACC6", serial: "CR-88213", installedAt: "2019-06-01", warrantyUntil: "2026-06-01", lastMaintenance: "2026-03-15" },
  { id: "e2", customerId: "c2", customerName: "Blue Sky Diner", manufacturer: "Trane", model: "XR16", serial: "TR-44210", installedAt: "2021-09-14", warrantyUntil: "2027-09-14", lastMaintenance: "2026-01-08" },
  { id: "e3", customerId: "c3", customerName: "Maple Grove School", manufacturer: "Lennox", model: "EL16XC1", serial: "LX-99871", installedAt: "2018-03-22", warrantyUntil: null, lastMaintenance: "2025-11-30" },
  { id: "e4", customerId: "c4", customerName: "Sunset Medical Center", manufacturer: "Goodman", model: "GSX16", serial: "GD-33012", installedAt: "2022-12-01", warrantyUntil: "2028-12-01", lastMaintenance: "2026-05-02" },
];
