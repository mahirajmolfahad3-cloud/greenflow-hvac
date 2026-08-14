import Link from "next/link";
import {
  ClipboardList,
  CalendarClock,
  Receipt,
  Users,
  Wrench,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { LandingNav } from "@/components/layout/landing-nav";
import { loginWithDemoAction } from "@/features/auth/actions";

// Root renders landing content directly to avoid Next.js SSG/runtime issues
// caused by wrapper indirection through route groups.

const features = [
  {
    icon: ClipboardList,
    title: "Job Management",
    description:
      "Create, assign, and track jobs from dispatch to completion. Keep your team organized and customers informed.",
  },
  {
    icon: CalendarClock,
    title: "Scheduling & Dispatch",
    description:
      "Plan your schedule with an intuitive calendar. Drag-and-drop simplicity for busy dispatchers.",
  },
  {
    icon: Receipt,
    title: "Estimates & Invoices",
    description:
      "Generate professional estimates and invoices quickly. Convert estimates to jobs in one click.",
  },
  {
    icon: Users,
    title: "Customer Management",
    description:
      "Keep detailed customer records, service history, and notes all in one secure place.",
  },
  {
    icon: Wrench,
    title: "Equipment Tracking",
    description:
      "Track installations, maintenance schedules, and warranty info for every unit you service.",
  },
  {
    icon: BarChart3,
    title: "Reports & Insights",
    description:
      "Understand your business with clear reports on revenue, jobs, and team performance.",
  },
];

export default function RootPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      <main className="container mx-auto px-4 py-20 sm:py-28">
        {/* Hero */}
        <div className="relative mx-auto max-w-3xl text-center">
          <div
            className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-72 opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(60% 100% at 50% 0%, hsl(var(--primary)/0.18) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="hero-in mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Built for HVAC professionals
          </div>

          <h1 className="hero-in text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl" style={{ animationDelay: "0.06s" }}>
            Welcome to GreenFlow HVAC
          </h1>

          <p className="hero-in mt-6 text-lg leading-8 text-muted-foreground" style={{ animationDelay: "0.12s" }}>
            The complete field service management solution built specifically for HVAC companies.
            Streamline your operations, manage jobs, track equipment, and grow your business—all in one place.
          </p>
          <p className="hero-in mt-4 text-base text-muted-foreground" style={{ animationDelay: "0.16s" }}>
            Made for HVAC professionals who want to spend less time on paperwork and more time serving customers.
          </p>

          <div className="hero-in mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-base font-semibold leading-6 text-primary transition-colors hover:text-primary/80"
            >
              Click &ldquo;Try Demo&rdquo; to check the site out
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mx-auto mt-28 max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to run your HVAC business
          </h2>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            From scheduling jobs to invoicing customers, GreenFlow HVAC has you covered.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="mx-auto mt-28 max-w-2xl rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to see it in action?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Click &ldquo;Try Demo&rdquo; on the login page to explore GreenFlow HVAC with sample data—no sign-up required.
          </p>
          <div className="mt-8">
            <form action={loginWithDemoAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Try Demo
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="mt-24 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>GreenFlow HVAC. Built for HVAC professionals.</p>
        </div>
      </footer>

      {/* Scoped, dependency-free entrance animation for the hero */}
      <style>{`
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-in {
          opacity: 0;
          animation: heroIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}