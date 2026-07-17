import { notFound } from "next/navigation";
import { getEquipmentById } from "@/features/equipment/repository";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_JOBS } from "@/lib/mock-data/jobs";
import { EmptyState } from "@/components/shared/empty-state";

export default async function EquipmentDetailPage({ params }: { params: { id: string } }) {
  const equipment = await getEquipmentById(params.id);
  if (!equipment) notFound();

  const relatedJobs = MOCK_JOBS.filter((j) => j.customerName === equipment.customerName);

  return (
    <div>
      <PageHeader title={`${equipment.manufacturer} ${equipment.model}`} description={`Serial ${equipment.serial}`} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Customer:</span> {equipment.customerName}</p>
            <p><span className="text-muted-foreground">Installed:</span> {equipment.installedAt}</p>
            <p><span className="text-muted-foreground">Warranty until:</span> {equipment.warrantyUntil ?? "Expired"}</p>
            <p><span className="text-muted-foreground">Last maintenance:</span> {equipment.lastMaintenance ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Related jobs</CardTitle></CardHeader>
          <CardContent>
            {relatedJobs.length === 0 ? (
              <EmptyState title="No related jobs" />
            ) : (
              <ul className="space-y-2 text-sm">
                {relatedJobs.map((j) => <li key={j.id}>{j.title} — {j.status}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
