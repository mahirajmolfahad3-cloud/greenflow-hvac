"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Leaf } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-config";
import type { Role } from "@/lib/permissions";

export function MobileDrawer({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-background p-4">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="font-semibold">GreenFlow</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
