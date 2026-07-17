import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/shared/avatar";
import { RoleBadge } from "@/components/shared/role-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/permissions";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (user.user_metadata?.full_name as string) ?? "User";
  const role = (user.user_metadata?.role as Role) ?? "technician";

  return (
    <div>
      <PageHeader title="Profile" description="Your account details" />
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar name={name} className="h-12 w-12 text-base" />
            <div>
              <CardTitle>{name}</CardTitle>
              <RoleBadge role={role} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Full name</Label><Input defaultValue={name} /></div>
          <div><Label>Email</Label><Input defaultValue={user.email ?? ""} disabled /></div>
          <Button>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
