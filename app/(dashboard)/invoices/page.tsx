import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { getInvoiceList } from "@/features/invoices/service";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function InvoicesPage() {
  const invoices = await getInvoiceList();

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Billing sent to customers"
        actions={<Button><Plus className="h-4 w-4" /> New invoice</Button>}
      />
      <Table>
        <THead>
          <TR><TH>Customer</TH><TH>Status</TH><TH>Total</TH><TH>Due date</TH></TR>
        </THead>
        <TBody>
          {invoices.map((inv) => (
            <TR key={inv.id}>
              <TD><Link href={`/invoices/${inv.id}`} className="font-medium text-primary hover:underline">{inv.customerName}</Link></TD>
              <TD><StatusBadge status={inv.status} /></TD>
              <TD>{formatCurrency(inv.totalCents)}</TD>
              <TD>{inv.dueDate}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
