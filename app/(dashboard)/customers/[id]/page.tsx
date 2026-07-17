import { notFound } from "next/navigation";
import { getCustomerProfile } from "@/features/customers/service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_EQUIPMENT } from "@/lib/mock-data/equipment";
import { MOCK_JOBS } from "@/lib/mock-data/jobs";
import { MOCK_INVOICES } from "@/lib/mock-data/invoices";
import { ActivityFeed } from "@/components/shared/activity-feed";

const TABS = ["Overview", "Equipment", "Service History", "Invoices", "Photos", "Notes", "Activity"];

export default async function CustomerProfilePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  const customer = await getCustomerProfile(params.id);
  if (!customer) notFound();

  const activeTab = searchParams.tab ?? "Overview";
  const equipment = MOCK_EQUIPMENT.filter((e) => e.customerId === customer.id);
  const jobs = MOCK_JOBS.filter((j) => j.customerName === customer.name);
  const invoices = MOCK_INVOICES.filter((i) => i.customerName === customer.name);

  return (
    <div>
      <PageHeader title={customer.name} description={customer.address} />

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((tab) => (
          <a
            key={tab}
            href={`?tab=${tab}`}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm ${
              activeTab === tab ? "border-primary font-medium text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            {tab}
          </a>
        ))}
      </div>

      {activeTab === "Overview" && (
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <p><span className="text-muted-foreground">Email:</span> {customer.email ?? "—"}</p>
            <p><span className="text-muted-foreground">Phone:</span> {customer.phone ?? "—"}</p>
            <p><span className="text-muted-foreground">Equipment:</span> {customer.equipmentCount}</p>
            <p><span className="text-muted-foreground">Open jobs:</span> {customer.openJobs}</p>
          </CardContent>
        </Card>
      )}

      {activeTab === "Equipment" && (
        equipment.length === 0 ? <EmptyState title="No equipment recorded" /> : (
          <div className="space-y-2">
            {equipment.map((e) => (
              <Card key={e.id}>
                <p className="font-medium">{e.manufacturer} {e.model}</p>
                <p className="text-sm text-muted-foreground">Serial {e.serial} · Installed {e.installedAt}</p>
              </Card>
            ))}
          </div>
        )
      )}

      {activeTab === "Service History" && (
        jobs.length === 0 ? <EmptyState title="No service history yet" /> : (
          <div className="space-y-2">
            {jobs.map((j) => (
              <Card key={j.id}>
                <p className="font-medium">{j.title}</p>
                <p className="text-sm text-muted-foreground">{j.status} · {j.createdAt}</p>
              </Card>
            ))}
          </div>
        )
      )}

      {activeTab === "Invoices" && (
        invoices.length === 0 ? <EmptyState title="No invoices yet" /> : (
          <div className="space-y-2">
            {invoices.map((i) => (
              <Card key={i.id}>
                <p className="font-medium">${(i.totalCents / 100).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{i.status} · due {i.dueDate}</p>
              </Card>
            ))}
          </div>
        )
      )}

      {activeTab === "Photos" && <EmptyState title="No photos uploaded" description="Photo upload is a Phase 2 feature." />}

      {activeTab === "Notes" && <EmptyState title="No notes yet" description="Add notes about this customer here." />}

      {activeTab === "Activity" && (
        <ActivityFeed
          entries={[
            { id: "a1", actor: "System", action: "customer record created", timestamp: customer.createdAt },
          ]}
        />
      )}
    </div>
  );
}
