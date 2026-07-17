"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link href="/dashboard" className="hover:underline">Home</Link>
      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        return (
          <span key={href} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            <Link href={href} className="capitalize hover:underline">
              {decodeURIComponent(segment)}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
