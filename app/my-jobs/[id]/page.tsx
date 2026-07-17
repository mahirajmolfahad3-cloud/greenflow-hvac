import { notFound } from "next/navigation";
import { getJobDetail } from "@/features/jobs/service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default async function TechnicianJobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJobDetail(params.id);
  if (!job) notFound();

  return (
    <div>
      <PageHeader title={job.title} description={job.address} />

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Checklist</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Arrived on site</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Diagnosed issue</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Repair completed</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> System tested</label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Photos</CardTitle></CardHeader>
          <CardContent>
            <EmptyState title="No photos yet" description="Tap to upload (placeholder)." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent>
            <textarea className="w-full rounded-md border border-border bg-background p-2 text-sm" rows={3} placeholder="Add job notes..." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Customer signature</CardTitle></CardHeader>
          <CardContent>
            <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
              Tap to capture signature (placeholder)
            </div>
          </CardContent>
        </Card>

        <Button className="w-full">Complete job</Button>
      </div>
    </div>
  );
}
