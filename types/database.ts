/**
 * Hand-authored placeholder for Supabase generated types.
 * In a real project, replace this with:
 *   npx supabase gen types typescript --project-id <id> > types/database.ts
 * Kept intentionally small here — expand per-table as features are built out.
 */

export type Role = "admin" | "dispatcher" | "technician" | "accountant" | "demo";

export type EmployeeStatus = "active" | "invited" | "suspended" | "archived";

export interface Database {
  public: {
    Tables: {
      gf_profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: Role;
          avatar_url: string | null;
          phone: string | null;
          is_active: boolean;
          status: EmployeeStatus;
          invited_at: string | null;
          archived_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["gf_profiles"]["Row"]> & { id: string; email: string; role: Role; full_name: string };
        Update: Partial<Database["public"]["Tables"]["gf_profiles"]["Row"]>;
      };
      // Additional tables mirror supabase/migrations/0001_init.sql.
      // Left untyped here to keep this scaffold file short; generate real
      // types from the DB once migrations are applied.
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
}