import { PageHeader } from "@/components/shared/page-header";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getInventoryList } from "@/features/inventory/service";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default async function InventoryPage() {
  const items = await getInventoryList();
  const lowStock = items.filter((i) => i.quantityOnHand <= i.reorderThreshold);
  const suppliers = Array.from(new Set(items.map((i) => i.supplier)));

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Parts and supplies on hand"
        actions={<Button><Plus className="h-4 w-4" /> Add item</Button>}
      />

      {lowStock.length > 0 && (
        <Card className="mb-4 border-amber-300 bg-amber-50">
          <p className="text-sm font-medium text-amber-800">
            {lowStock.length} item(s) at or below reorder threshold: {lowStock.map((i) => i.name).join(", ")}
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Table>
            <THead>
              <TR><TH>Item</TH><TH>SKU</TH><TH>On hand</TH><TH>Unit cost</TH><TH>Status</TH></TR>
            </THead>
            <TBody>
              {items.map((i) => (
                <TR key={i.id}>
                  <TD>{i.name}</TD>
                  <TD>{i.sku}</TD>
                  <TD>{i.quantityOnHand}</TD>
                  <TD>{formatCurrency(i.unitCostCents)}</TD>
                  <TD>
                    {i.quantityOnHand <= i.reorderThreshold ? (
                      <Badge className="bg-amber-100 text-amber-700">Low stock</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700">In stock</Badge>
                    )}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>

        <Card>
          <CardHeader><CardTitle>Suppliers</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            {suppliers.map((s) => <p key={s}>{s}</p>)}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <h2 className="mb-2 text-sm font-semibold">Transaction history</h2>
        <EmptyState title="No transactions recorded" description="Stock movement history placeholder." />
      </div>
    </div>
  );
}
