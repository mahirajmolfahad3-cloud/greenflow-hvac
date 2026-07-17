import { notFound } from "next/navigation";
import { listInvoices } from "@/features/invoices/repository";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoices = await listInvoices();
  const invoice = invoices.find((i) => i.id === params.id);
  if (!invoice) notFound();

  return (
    <div>
      <PageHeader title={`Invoice — ${invoice.customerName}`} actions={<StatusBadge status={invoice.status} />} />
      <Card className="mb-4">
        <CardHeader><CardTitle>Line items</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead><TR><TH>Description</TH><TH>Qty</TH><TH>Unit price</TH><TH>Amount</TH></TR></THead>
            <TBody>
              {invoice.items.map((item) => (
                <TR key={item.id}>
                  <TD>{item.description}</TD>
                  <TD>{item.quantity}</TD>
                  <TD>{formatCurrency(item.unitPriceCents)}</TD>
                  <TD>{formatCurrency(item.quantity * item.unitPriceCents)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <div className="mt-4 flex justify-end text-sm font-semibold">
            Total: {formatCurrency(invoice.totalCents)}
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary">Download PDF (placeholder)</Button>
        <Button>Record payment (placeholder)</Button>
      </div>
    </div>
  );
}
