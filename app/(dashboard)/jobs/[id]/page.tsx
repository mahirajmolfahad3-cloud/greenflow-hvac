import { notFound } from "next/navigation";
import { getJobDetail } from "@/features/jobs/service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { Timeline } from "@/components/shared/timeline";
import { EmptyState } from "@/components/shared/empty-state";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJobDetail(params.id);
  if (!job) notFound();

  return (
    <div>
      <PageHeader
        title={job.title}
        description={job.address}
        actions={
          <>
            <StatusBadge status={job.status} />
            <PriorityBadge priority={job.priority} />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Confirm access with customer</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Diagnose issue</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Replace/repair part</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Test system</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Collect signature</label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Photo gallery</CardTitle></CardHeader>
            <CardContent>
              <EmptyState title="No photos uploaded" description="Photo upload placeholder — wired up in Phase 2." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent>
              <textarea className="w-full rounded-md border border-border bg-background p-2 text-sm" rows={3} placeholder="Add a note..." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Customer signature</CardTitle></CardHeader>
            <CardContent>
              <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                Signature capture placeholder
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Customer:</span> {job.customerName}</p>
              <p><span className="text-muted-foreground">Assigned to:</span> {job.assignedTo ?? "Unassigned"}</p>
              <p><span className="text-muted-foreground">Scheduled:</span> {job.scheduledFor ? new Date(job.scheduledFor).toLocaleString() : "Unscheduled"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
            <CardContent>
              <Timeline
                events={[
                  { id: "t1", label: "Job created", timestamp: job.createdAt },
                  { id: "t2", label: "Status: " + job.status, timestamp: "—" },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
