import { notFound } from "next/navigation";
import { listEstimates } from "@/features/estimates/repository";
import { calculateEstimateTotals } from "@/features/estimates/service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default async function EstimateDetailPage({ params }: { params: { id: string } }) {
  const estimates = await listEstimates();
  const estimate = estimates.find((e) => e.id === params.id);
  if (!estimate) notFound();

  const totals = calculateEstimateTotals(estimate);

  return (
    <div>
      <PageHeader
        title={`Estimate — ${estimate.customerName}`}
        actions={<StatusBadge status={estimate.status} />}
      />

      <Card className="mb-4">
        <CardHeader><CardTitle>Line items</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR><TH>Description</TH><TH>Qty</TH><TH>Unit price</TH><TH>Amount</TH></TR>
            </THead>
            <TBody>
              {estimate.items.map((item) => (
                <TR key={item.id}>
                  <TD>{item.description}</TD>
                  <TD>{item.quantity}</TD>
                  <TD>{formatCurrency(item.unitPriceCents)}</TD>
                  <TD>{formatCurrency(item.quantity * item.unitPriceCents)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <div className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(estimate.discountCents)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(totals.tax)}</span></div>
            <div className="flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(totals.total)}</span></div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary">Download PDF (placeholder)</Button>
        <Button variant="secondary">Email to customer (placeholder)</Button>
        <Button variant="secondary">Mark approved (placeholder)</Button>
        <Button>Convert to job (placeholder)</Button>
      </div>
    </div>
  );
}
