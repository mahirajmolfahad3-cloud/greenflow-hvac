import type { Customer } from "@/types";

// Placeholder data — replace with features/customers/repository.ts once
// Supabase migrations are applied and real queries are wired in.
export const MOCK_CUSTOMERS: Customer[] = [
  { id: "c1", name: "Riverside Apartments", email: "manager@riverside.com", phone: "555-0101", address: "120 Riverside Dr, Austin, TX", createdAt: "2024-01-12", equipmentCount: 8, openJobs: 2 },
  { id: "c2", name: "Blue Sky Diner", email: "owner@blueskydiner.com", phone: "555-0102", address: "45 Congress Ave, Austin, TX", createdAt: "2024-02-03", equipmentCount: 2, openJobs: 0 },
  { id: "c3", name: "Maple Grove School", email: "facilities@maplegrove.edu", phone: "555-0103", address: "900 Maple Grove Rd, Round Rock, TX", createdAt: "2024-03-20", equipmentCount: 15, openJobs: 3 },
  { id: "c4", name: "Sunset Medical Center", email: "ops@sunsetmed.com", phone: "555-0104", address: "77 Sunset Blvd, Austin, TX", createdAt: "2024-04-11", equipmentCount: 6, openJobs: 1 },
  { id: "c5", name: "Harper Residence", email: "j.harper@email.com", phone: "555-0105", address: "12 Harper Ln, Cedar Park, TX", createdAt: "2024-05-02", equipmentCount: 1, openJobs: 0 },
];
