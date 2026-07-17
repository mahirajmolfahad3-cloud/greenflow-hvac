import { createClient } from "@/lib/supabase/server";
import type { Employee, EmployeeStatus } from "@/types";
import type { Role } from "@/lib/permissions";

/**
 * Repository layer — the ONLY place that talks to the data source.
 * Currently backed by mock data; swap the body of these functions for
 * Supabase queries (via lib/supabase/server.ts) without touching callers.
 */
export async function listEmployees(): Promise<Employee[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gf_profiles")
    .select("id, full_name, email, phone, role, status, invited_at, archived_at, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to list employees:", error);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    role: row.role as Role,
    status: row.status as EmployeeStatus,
    invitedAt: row.invited_at,
    archivedAt: row.archived_at,
  }));
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gf_profiles")
    .select("id, full_name, email, phone, role, status, invited_at, archived_at, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    phone: data.phone,
    role: data.role as Role,
    status: data.status as EmployeeStatus,
    invitedAt: data.invited_at,
    archivedAt: data.archived_at,
  };
}