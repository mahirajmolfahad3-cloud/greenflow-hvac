import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { DemoBanner } from "@/components/layout/demo-banner";
import { isDemo, type Role } from "@/lib/permissions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = (user.user_metadata?.role as Role) ?? "technician";
  const name = (user.user_metadata?.full_name as string) ?? user.email ?? "User";
  const demoMode = isDemo(role);

  return (
    <div className="flex min-h-screen flex-col">
      {demoMode && <DemoBanner />}
      <div className="flex flex-1">
        <Sidebar role={role} />
        <div className="flex flex-1 flex-col">
          <TopNav role={role} name={name} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}