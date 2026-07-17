import Link from "next/link";

export function LandingNav() {
  return (
    <nav className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="text-xl font-bold text-primary">GreenFlow HVAC</div>
      </div>
      <div>
        <Link
          href="/login"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Log in
        </Link>
      </div>
    </nav>
  );
}