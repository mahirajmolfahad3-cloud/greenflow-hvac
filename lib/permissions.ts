/**
 * Centralized permission system.
 * This is the SINGLE source of truth for role-based authorization.
 * It must be consulted by UI, Server Actions/Route Handlers, and mirrored by
 * Supabase RLS policies (see supabase/migrations/0002_rls_policies.sql).
 *
 * Never scatter `if (role === 'admin')` checks across the codebase — always
 * go through `can()` / `hasRole()` so the rules stay in one place.
 */

export type Role = "admin" | "dispatcher" | "technician" | "accountant" | "demo";

export type Permission =
  | "customers:read"
  | "customers:write"
  | "equipment:read"
  | "equipment:write"
  | "jobs:read"
  | "jobs:read:own"
  | "jobs:write"
  | "calendar:read"
  | "calendar:write"
  | "estimates:read"
  | "estimates:write"
  | "invoices:read"
  | "invoices:write"
  | "inventory:read"
  | "inventory:write"
  | "employees:read"
  | "employees:write"
  | "reports:read"
  | "finance:read"
  | "finance:write"
  | "settings:read"
  | "settings:write";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "customers:read", "customers:write",
    "equipment:read", "equipment:write",
    "jobs:read", "jobs:write",
    "calendar:read", "calendar:write",
    "estimates:read", "estimates:write",
    "invoices:read", "invoices:write",
    "inventory:read", "inventory:write",
    "employees:read", "employees:write",
    "reports:read",
    "finance:read", "finance:write",
    "settings:read", "settings:write",
  ],
  dispatcher: [
    "customers:read", "customers:write",
    "equipment:read", "equipment:write",
    "jobs:read", "jobs:write",
    "calendar:read", "calendar:write",
    "estimates:read", "estimates:write",
    "invoices:read",
    "inventory:read",
    "reports:read",
  ],
  technician: [
    "jobs:read:own",
    "equipment:read",
    "customers:read",
  ],
  accountant: [
    "customers:read",
    "invoices:read", "invoices:write",
    "estimates:read",
    "finance:read", "finance:write",
    "reports:read",
    "inventory:read",
  ],
  demo: [
    "customers:read",
    "equipment:read",
    "jobs:read",
    "calendar:read",
    "estimates:read",
    "invoices:read",
    "inventory:read",
    "employees:read",
    "reports:read",
    "finance:read",
    "settings:read",
  ],
};

/** Default landing route per role after login. */
export const ROLE_HOME_ROUTE: Record<Role, string> = {
  admin: "/dashboard",
  dispatcher: "/dashboard",
  technician: "/my-jobs",
  accountant: "/finance",
  demo: "/dashboard",
};

export function hasRole(userRole: Role, allowed: Role[]): boolean {
  return allowed.includes(userRole);
}

export function can(userRole: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function isDemo(userRole: Role): boolean {
  return userRole === "demo";
}

/** Route-level access map used by middleware.ts to guard whole sections. */
export const ROUTE_ROLE_MAP: { prefix: string; roles: Role[] }[] = [
  { prefix: "/dashboard", roles: ["admin", "dispatcher", "demo"] },
  { prefix: "/customers", roles: ["admin", "dispatcher", "accountant", "demo"] },
  { prefix: "/equipment", roles: ["admin", "dispatcher", "technician", "demo"] },
  { prefix: "/jobs", roles: ["admin", "dispatcher", "demo"] },
  { prefix: "/calendar", roles: ["admin", "dispatcher", "demo"] },
  { prefix: "/estimates", roles: ["admin", "dispatcher", "accountant", "demo"] },
  { prefix: "/invoices", roles: ["admin", "dispatcher", "accountant", "demo"] },
  { prefix: "/inventory", roles: ["admin", "dispatcher", "demo"] },
  { prefix: "/employees", roles: ["admin", "demo"] },
  { prefix: "/reports", roles: ["admin", "dispatcher", "accountant", "demo"] },
  { prefix: "/finance", roles: ["admin", "accountant", "demo"] },
  { prefix: "/settings", roles: ["admin", "demo"] },
  { prefix: "/my-jobs", roles: ["technician"] },
];