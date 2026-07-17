import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { getInvoiceList, getOutstandingBalanceCents } from "@/features/invoices/service";
import { formatCurrency } from "@/lib/utils";
import { Wallet, TrendingUp, AlertCircle } from "lucide-react";

export default async function FinancePage() {
  const invoices = await getInvoiceList();
  const outstanding = await getOutstandingBalanceCents();
  const paid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.totalCents, 0);
  const overdue = invoices.filter((i) => i.status === "overdue").length;

  return (
    <div>
      <PageHeader title="Finance" description="Revenue, payments, and outstanding balances" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Collected" value={formatCurrency(paid)} icon={TrendingUp} />
        <MetricCard label="Outstanding" value={formatCurrency(outstanding)} icon={Wallet} />
        <MetricCard label="Overdue invoices" value={overdue} icon={AlertCircle} />
      </div>

      <Table>
        <THead><TR><TH>Customer</TH><TH>Status</TH><TH>Total</TH><TH>Due date</TH></TR></THead>
        <TBody>
          {invoices.map((inv) => (
            <TR key={inv.id}>
              <TD>{inv.customerName}</TD>
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
