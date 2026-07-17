"use client";

import { Bell, Moon, Sun, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Avatar } from "@/components/shared/avatar";
import type { Role } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/client";

export function TopNav({ role, name }: { role: Role; name: string }) {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function toggleDark() {
    document.documentElement.classList.toggle("dark");
    setDark((d) => !d);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <MobileDrawer role={role} />
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="Toggle dark mode" onClick={toggleDark}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button aria-label="Notifications" onClick={() => router.push("/notifications")}>
          <Bell className="h-4 w-4" />
        </button>
        <div className="relative">
          <button className="flex items-center gap-2" onClick={() => setMenuOpen((v) => !v)}>
            <Avatar name={name} />
            <ChevronDown className="h-3 w-3" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md border border-border bg-background p-1 shadow-md">
              <button
                className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted"
                onClick={() => router.push("/profile")}
              >
                Profile
              </button>
              <button
                className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
