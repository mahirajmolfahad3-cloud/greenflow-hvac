import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getJobList } from "@/features/jobs/service";
import { getCustomerList } from "@/features/customers/service";
import { getOutstandingBalanceCents } from "@/features/invoices/service";
import { formatCurrency } from "@/lib/utils";
import { Briefcase, Users, Wallet, Wrench } from "lucide-react";

export default async function DashboardPage() {
  const [jobs, customers, outstanding] = await Promise.all([
    getJobList(),
    getCustomerList(),
    getOutstandingBalanceCents(),
  ]);

  const openJobs = jobs.filter((j) => j.status !== "completed" && j.status !== "cancelled");

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of GreenFlow HVAC operations" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Open jobs" value={openJobs.length} icon={Briefcase} />
        <MetricCard label="Active customers" value={customers.length} icon={Users} />
        <MetricCard label="Outstanding balance" value={formatCurrency(outstanding)} icon={Wallet} />
        <MetricCard label="Equipment tracked" value={31} icon={Wrench} hint="Across all customers" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-muted-foreground">{job.customerName}</p>
                </div>
                <StatusBadge status={job.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed
              entries={[
                { id: "a1", actor: "Mike Torres", action: "completed job at Sunset Medical Center", timestamp: "2h ago" },
                { id: "a2", actor: "Priya Nair", action: "scheduled a new job for Blue Sky Diner", timestamp: "5h ago" },
                { id: "a3", actor: "Dana Whitfield", action: "approved estimate #es1", timestamp: "1d ago" },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
