export * from "./database";
import type { Role, EmployeeStatus } from "./database";

export type JobStatus = "unscheduled" | "scheduled" | "in_progress" | "completed" | "cancelled";
export type JobPriority = "low" | "medium" | "high" | "emergency";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";
export type EstimateStatus = "draft" | "sent" | "approved" | "declined" | "converted";

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string;
  createdAt: string;
  equipmentCount: number;
  openJobs: number;
}

export interface Equipment {
  id: string;
  customerId: string;
  customerName: string;
  manufacturer: string;
  model: string;
  serial: string;
  installedAt: string;
  warrantyUntil: string | null;
  lastMaintenance: string | null;
}

export interface Job {
  id: string;
  title: string;
  customerName: string;
  address: string;
  status: JobStatus;
  priority: JobPriority;
  scheduledFor: string | null;
  assignedTo: string | null;
  createdAt: string;
}

export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
}

export interface Estimate {
  id: string;
  customerName: string;
  status: EstimateStatus;
  items: EstimateItem[];
  taxRate: number;
  discountCents: number;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  totalCents: number;
  dueDate: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  supplier: string;
  quantityOnHand: number;
  reorderThreshold: number;
  unitCostCents: number;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: EmployeeStatus;
  invitedAt?: string | null;
  archivedAt?: string | null;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}