"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { PageHeader } from "@/components/shared/page-header";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { RoleBadge } from "@/components/shared/role-badge";
import { Avatar } from "@/components/shared/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getEmployeesList } from "@/features/employees/service";
import { inviteEmployeeAction, updateEmployeeStatusAction, resendInviteAction } from "@/features/employees/actions";
import type { Employee } from "@/types";
import { Plus } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  invited: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  suspended: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  archived: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [, inviteAction] = useFormState(inviteEmployeeAction, {});
  const [, statusAction] = useFormState(updateEmployeeStatusAction, {});
  const [, resendAction] = useFormState(resendInviteAction, {});

  useEffect(() => {
    getEmployeesList().then((data) => {
      setEmployees(data);
      setLoading(false);
    });
  }, []);

  async function refreshList() {
    const data = await getEmployeesList();
    setEmployees(data);
  }

  async function handleStatusChange(employeeId: string, newStatus: string) {
    const fd = new FormData();
    fd.set("employeeId", employeeId);
    fd.set("status", newStatus);
    await updateEmployeeStatusAction({}, fd);
    refreshList();
  }

  async function handleResendInvite(email: string) {
    const fd = new FormData();
    fd.set("email", email);
    await resendInviteAction({}, fd);
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Employees" description="Manage staff accounts and roles" />
        <p className="text-sm text-muted-foreground">Loading employees...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage staff accounts and roles"
        actions={<Button onClick={() => setInviteOpen(true)}><Plus className="h-4 w-4" /> Invite employee</Button>}
      />

      <Table>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Role</TH>
            <TH>Status</TH>
            <TH>Actions</TH>
          </TR>
        </THead>
        <TBody>
          {employees.map((e) => (
            <TR key={e.id}>
              <TD>
                <div className="flex items-center gap-2">
                  <Avatar name={e.fullName} />
                  <div>
                    <p className="font-medium">{e.fullName}</p>
                    <p className="text-xs text-muted-foreground">{e.email}</p>
                    {e.phone && <p className="text-xs text-muted-foreground">{e.phone}</p>}
                  </div>
                </div>
              </TD>
              <TD><RoleBadge role={e.role as any} /></TD>
              <TD><Badge className={STATUS_STYLE[e.status] ?? ""}>{e.status}</Badge></TD>
              <TD>
                <div className="flex gap-2">
                  {e.status === "invited" && (
                    <Button variant="secondary" onClick={() => handleResendInvite(e.email)}>
                      Resend invite
                    </Button>
                  )}
                  {e.status === "active" && (
                    <Button variant="destructive" onClick={() => handleStatusChange(e.id, "suspended")}>
                      Suspend
                    </Button>
                  )}
                  {e.status === "suspended" && (
                    <Button variant="secondary" onClick={() => handleStatusChange(e.id, "active")}>
                      Reactivate
                    </Button>
                  )}
                  {e.status !== "archived" && (
                    <Button variant="destructive" onClick={() => handleStatusChange(e.id, "archived")}>
                      Archive
                    </Button>
                  )}
                </div>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite employee">
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const result = await inviteEmployeeAction({}, fd);
            if (!result.error) {
              setInviteOpen(false);
              refreshList();
            }
          }}
        >
          <div>
            <Label htmlFor="inv-name">Full name</Label>
            <Input id="inv-name" name="fullName" type="text" required placeholder="Jane Smith" />
          </div>
          <div>
            <Label htmlFor="inv-email">Email</Label>
            <Input id="inv-email" name="email" type="email" required placeholder="new.hire@greenflowhvac.com" />
          </div>
          <div>
            <Label htmlFor="inv-phone">Phone (optional)</Label>
            <Input id="inv-phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          <div>
            <Label htmlFor="inv-role">Role</Label>
            <select
              id="inv-role"
              name="role"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              defaultValue="technician"
            >
              <option value="dispatcher">Dispatcher</option>
              <option value="technician">Technician</option>
              <option value="accountant">Accountant</option>
            </select>
          </div>
          <Button type="submit" className="w-full">Send invite</Button>
        </form>
      </Dialog>
    </div>
  );
}