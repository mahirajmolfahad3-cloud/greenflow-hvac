import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { getJobList } from "@/features/jobs/service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { JobStatus } from "@/types";

export default async function JobsPage({ searchParams }: { searchParams: { status?: JobStatus } }) {
  const jobs = await getJobList(searchParams.status);

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Every service job, scheduled or not"
        actions={<Button><Plus className="h-4 w-4" /> New job</Button>}
      />
      <Table>
        <THead>
          <TR>
            <TH>Job</TH>
            <TH>Customer</TH>
            <TH>Status</TH>
            <TH>Priority</TH>
            <TH>Scheduled</TH>
            <TH>Assigned to</TH>
          </TR>
        </THead>
        <TBody>
          {jobs.map((j) => (
            <TR key={j.id}>
              <TD>
                <Link href={`/jobs/${j.id}`} className="font-medium text-primary hover:underline">{j.title}</Link>
              </TD>
              <TD>{j.customerName}</TD>
              <TD><StatusBadge status={j.status} /></TD>
              <TD><PriorityBadge priority={j.priority} /></TD>
              <TD>{j.scheduledFor ? new Date(j.scheduledFor).toLocaleString() : "Unscheduled"}</TD>
              <TD>{j.assignedTo ?? "Unassigned"}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
