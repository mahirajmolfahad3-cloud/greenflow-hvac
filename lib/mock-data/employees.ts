import type { Employee } from "@/types";

export const MOCK_EMPLOYEES: Employee[] = [
  { id: "u1", fullName: "Dana Whitfield", email: "dana@greenflowhvac.com", phone: "+1 (555) 100-2000", role: "admin", status: "active" },
  { id: "u2", fullName: "Priya Nair", email: "priya@greenflowhvac.com", phone: "+1 (555) 100-2001", role: "dispatcher", status: "active" },
  { id: "u3", fullName: "Mike Torres", email: "mike@greenflowhvac.com", phone: "+1 (555) 100-2002", role: "technician", status: "active" },
  { id: "u4", fullName: "Alicia Ford", email: "alicia@greenflowhvac.com", phone: "+1 (555) 100-2003", role: "technician", status: "active" },
  { id: "u5", fullName: "Sam Reyes", email: "sam@greenflowhvac.com", phone: "+1 (555) 100-2004", role: "accountant", status: "invited" },
  { id: "u6", fullName: "Demo User", email: "demo@greenflowhvac.com", phone: "+1 (555) 999-9999", role: "demo", status: "active" },
];