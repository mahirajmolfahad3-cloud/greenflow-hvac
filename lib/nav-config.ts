import type { Role } from "@/lib/permissions";
import {
  LayoutDashboard, Users, Wrench, ClipboardList, Calendar, FileText,
  Receipt, Boxes, UserCog, BarChart3, Wallet, Settings, User,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

/** Single source of truth for sidebar links, filtered per-role. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "dispatcher", "demo"] },
  { label: "Customers", href: "/customers", icon: Users, roles: ["admin", "dispatcher", "accountant", "demo"] },
  { label: "Equipment", href: "/equipment", icon: Wrench, roles: ["admin", "dispatcher", "demo"] },
  { label: "Jobs", href: "/jobs", icon: ClipboardList, roles: ["admin", "dispatcher", "demo"] },
  { label: "Calendar", href: "/calendar", icon: Calendar, roles: ["admin", "dispatcher", "demo"] },
  { label: "Estimates", href: "/estimates", icon: FileText, roles: ["admin", "dispatcher", "accountant", "demo"] },
  { label: "Invoices", href: "/invoices", icon: Receipt, roles: ["admin", "dispatcher", "accountant", "demo"] },
  { label: "Inventory", href: "/inventory", icon: Boxes, roles: ["admin", "dispatcher", "demo"] },
  { label: "Employees", href: "/employees", icon: UserCog, roles: ["admin", "demo"] },
  { label: "Reports", href: "/reports", icon: BarChart3, roles: ["admin", "dispatcher", "accountant", "demo"] },
  { label: "Finance", href: "/finance", icon: Wallet, roles: ["admin", "accountant", "demo"] },
  { label: "Settings", href: "/settings", icon: Settings, roles: ["admin", "demo"] },
  { label: "Profile", href: "/profile", icon: User, roles: ["admin", "dispatcher", "technician", "accountant", "demo"] },
];