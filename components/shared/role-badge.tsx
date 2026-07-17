import { Badge } from "@/components/ui/badge";

export function RoleBadge({ role }: { role: string }) {
  return <Badge className="bg-muted capitalize">{role}</Badge>;
}
