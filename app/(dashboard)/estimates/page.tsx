import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { getEstimateList, calculateEstimateTotals } from "@/features/estimates/service";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function EstimatesPage() {
  const estimates = await getEstimateList();

  return (
    <div>
      <PageHeader
        title="Estimates"
        description="Quotes sent to customers before work begins"
        actions={<Button><Plus className="h-4 w-4" /> New estimate</Button>}
      />
      <Table>
        <THead>
          <TR>
            <TH>Customer</TH>
            <TH>Status</TH>
            <TH>Total</TH>
            <TH>Created</TH>
          </TR>
        </THead>
        <TBody>
          {estimates.map((e) => (
            <TR key={e.id}>
              <TD><Link href={`/estimates/${e.id}`} className="font-medium text-primary hover:underline">{e.customerName}</Link></TD>
              <TD><StatusBadge status={e.status} /></TD>
              <TD>{formatCurrency(calculateEstimateTotals(e).total)}</TD>
              <TD>{e.createdAt}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
