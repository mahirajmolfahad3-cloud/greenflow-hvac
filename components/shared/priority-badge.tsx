import { Badge } from "@/components/ui/badge";

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  emergency: "bg-red-100 text-red-700",
};

export function PriorityBadge({ priority }: { priority: string }) {
  return <Badge className={PRIORITY_STYLES[priority] ?? "bg-gray-100 text-gray-700"}>{priority}</Badge>;
}
