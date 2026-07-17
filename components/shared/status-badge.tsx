import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<string, string> = {
  unscheduled: "bg-gray-100 text-gray-700",
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  converted: "bg-purple-100 text-purple-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  void: "bg-gray-100 text-gray-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700"}>
      {status.replace("_", " ")}
    </Badge>
  );
}
