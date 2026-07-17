import { Leaf } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">GreenFlow HVAC</span>
        </div>
        {children}
      </div>
    </div>
  );
}
