import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/layout/top-nav";
import type { Role } from "@/lib/permissions";

// Technician portal deliberately skips the desktop sidebar — this section
// is mobile-first, single-column, and optimized for a phone in the field.
export default async function MyJobsLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = (user.user_metadata?.role as Role) ?? "technician";
  const name = (user.user_metadata?.full_name as string) ?? user.email ?? "Technician";

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <TopNav role={role} name={name} />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
