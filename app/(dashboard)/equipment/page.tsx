import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { getEquipmentList } from "@/features/equipment/service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function EquipmentPage() {
  const equipment = await getEquipmentList();

  return (
    <div>
      <PageHeader
        title="Equipment"
        description="Installed HVAC units across all customers"
        actions={<Button><Plus className="h-4 w-4" /> Add equipment</Button>}
      />
      <Table>
        <THead>
          <TR>
            <TH>Manufacturer / Model</TH>
            <TH>Serial</TH>
            <TH>Customer</TH>
            <TH>Installed</TH>
            <TH>Warranty</TH>
            <TH>Last maintenance</TH>
          </TR>
        </THead>
        <TBody>
          {equipment.map((e) => (
            <TR key={e.id}>
              <TD>
                <Link href={`/equipment/${e.id}`} className="font-medium text-primary hover:underline">
                  {e.manufacturer} {e.model}
                </Link>
              </TD>
              <TD>{e.serial}</TD>
              <TD>{e.customerName}</TD>
              <TD>{e.installedAt}</TD>
              <TD>{e.warrantyUntil ?? "Expired"}</TD>
              <TD>{e.lastMaintenance ?? "—"}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
