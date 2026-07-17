import { LandingNav } from "@/components/layout/landing-nav";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to GreenFlow HVAC
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            The complete field service management solution built specifically for HVAC companies.
            Streamline your operations, manage jobs, track equipment, and grow your business—all in one place.
          </p>
          <p className="mt-4 text-base text-muted-foreground">
            Made for HVAC professionals who want to spend less time on paperwork and more time serving customers.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/login"
              className="rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Get started
            </a>
            <a
              href="/login"
              className="text-base font-semibold leading-6 text-primary hover:text-primary/80"
            >
              Click "Try Demo" to check the site out <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to run your HVAC business
          </h2>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            From scheduling jobs to invoicing customers, GreenFlow HVAC has you covered.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Job Management</h3>
              <p className="mt-2 text-muted-foreground">
                Create, assign, and track jobs from dispatch to completion. Keep your team organized and customers informed.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Scheduling & Dispatch</h3>
              <p className="mt-2 text-muted-foreground">
                Plan your schedule with an intuitive calendar. Drag-and-drop simplicity for busy dispatchers.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Estimates & Invoices</h3>
              <p className="mt-2 text-muted-foreground">
                Generate professional estimates and invoices quickly. Convert estimates to jobs in one click.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Customer Management</h3>
              <p className="mt-2 text-muted-foreground">
                Keep detailed customer records, service history, and notes all in one secure place.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Equipment Tracking</h3>
              <p className="mt-2 text-muted-foreground">
                Track installations, maintenance schedules, and warranty info for every unit you service.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Reports & Insights</h3>
              <p className="mt-2 text-muted-foreground">
                Understand your business with clear reports on revenue, jobs, and team performance.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to see it in action?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Click "Try Demo" on the login page to explore GreenFlow HVAC with sample data—no sign-up required.
          </p>
          <div className="mt-8">
            <a
              href="/login"
              className="rounded-md bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Try Demo
            </a>
          </div>
        </div>
      </main>

      <footer className="mt-24 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>GreenFlow HVAC. Built for HVAC professionals.</p>
        </div>
      </footer>
    </div>
  );
}