import type { Employee, EmployeeStatus } from "@/types";
import type { Role } from "@/lib/permissions";
import { MOCK_EMPLOYEES } from "@/lib/mock-data/employees";

/**
 * Repository layer — the ONLY place that talks to the data source.
 * Currently backed by mock data; swap the body of these functions for
 * Supabase queries (via lib/supabase/server.ts) without touching callers.
 */
export async function listEmployees(): Promise<Employee[]> {
  return MOCK_EMPLOYEES;
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  return MOCK_EMPLOYEES.find((item: any) => item.id === id) ?? null;
}
