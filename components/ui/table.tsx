import { cn } from "@/lib/utils";
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-border">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  );
}
export function THead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-muted text-left" {...props} />;
}
export function TBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}
export function TR(props: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="border-t border-border" {...props} />;
}
export function TH({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-3 py-2 font-medium", className)} {...props} />;
}
export function TD({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-3 py-2", className)} {...props} />;
}
