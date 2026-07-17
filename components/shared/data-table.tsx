"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";

/** Generic, reusable table built on TanStack Table. Feature modules pass columns + data. */
export function DataTable<T>({
  columns,
  data,
  emptyLabel = "No records found",
}: {
  columns: ColumnDef<T, any>[];
  data: T[];
  emptyLabel?: string;
}) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  if (data.length === 0) return <EmptyState title={emptyLabel} />;

  return (
    <Table>
      <THead>
        {table.getHeaderGroups().map((headerGroup) => (
          <TR key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TH key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TH>
            ))}
          </TR>
        ))}
      </THead>
      <TBody>
        {table.getRowModel().rows.map((row) => (
          <TR key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TD key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TD>
            ))}
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
