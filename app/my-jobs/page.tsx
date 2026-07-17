import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { createClient } from "@/lib/supabase/server";
import { getTechnicianJobs } from "@/features/jobs/service";

export default async function MyJobsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = (user?.user_metadata?.full_name as string) ?? "Mike Torres";

  // Falls back to a demo technician name so the portal has data to show
  // even before real auth/profile linkage is wired up.
  const jobs = await getTechnicianJobs(name.includes("Mike") || name.includes("Alicia") ? name : "Mike Torres");

  return (
    <div>
      <PageHeader title="Today's jobs" description={name} />
      {jobs.length === 0 ? (
        <EmptyState title="No jobs assigned to you today" />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link key={job.id} href={`/my-jobs/${job.id}`}>
              <Card>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.customerName}</p>
                    <p className="text-xs text-muted-foreground">{job.address}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={job.status} />
                    <PriorityBadge priority={job.priority} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
