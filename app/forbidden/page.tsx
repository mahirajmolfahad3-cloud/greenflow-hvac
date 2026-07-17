import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
      <ShieldAlert className="h-10 w-10 text-red-500" />
      <h1 className="text-2xl font-bold">Access denied</h1>
      <p className="text-muted-foreground">You don&apos;t have permission to view this page.</p>
      <Link href="/login" className="text-primary underline">Back to login</Link>
    </div>
  );
}
