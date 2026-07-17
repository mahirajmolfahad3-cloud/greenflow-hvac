"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav-config";
import type { Role } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border p-4 md:block">
      <div className="mb-6 flex items-center gap-2 px-2">
        <Leaf className="h-5 w-5 text-primary" />
        <span className="font-semibold">GreenFlow</span>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-sm",
                active ? "bg-primary text-white" : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
