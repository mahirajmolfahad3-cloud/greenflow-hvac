import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { getCustomerList } from "@/features/customers/service";
import { Plus } from "lucide-react";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const customers = await getCustomerList(searchParams.q);

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Every customer GreenFlow services"
        actions={
          <Button>
            <Plus className="h-4 w-4" /> New customer
          </Button>
        }
      />

      <form className="mb-4 max-w-xs">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search customers..."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </form>

      {customers.length === 0 ? (
        <EmptyState title="No customers found" description="Try a different search term." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Contact</TH>
              <TH>Address</TH>
              <TH>Equipment</TH>
              <TH>Open jobs</TH>
            </TR>
          </THead>
          <TBody>
            {customers.map((c) => (
              <TR key={c.id}>
                <TD>
                  <Link href={`/customers/${c.id}`} className="font-medium text-primary hover:underline">
                    {c.name}
                  </Link>
                </TD>
                <TD>{c.email ?? c.phone ?? "—"}</TD>
                <TD>{c.address}</TD>
                <TD>{c.equipmentCount}</TD>
                <TD>{c.openJobs}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
