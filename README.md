# GreenFlow HVAC — Phase 1 Scaffold

A complete, minimally-styled foundation for a field service management platform.
Every route, layout, and module described in the spec exists and is wired
together. Business logic is placeholder/mock where real backend work would
normally live — the point of this phase is **architecture, not polish**.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript (strict) · Tailwind CSS ·
Supabase (Postgres, Auth, Storage) · React Hook Form + Zod · TanStack Table ·
Recharts · date-fns · Lucide icons

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase project values
npm run dev
```

Open http://localhost:3000 — you'll land on `/login`.

### Connecting Supabase

1. Create a project at supabase.com.
2. Copy the Project URL and anon key into `.env.local`.
3. Apply the schema:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
   This runs the three migrations in `supabase/migrations/` in order:
   - `0001_init.sql` — all `gf_*` tables, enums, indexes, triggers
   - `0002_rls_policies.sql` — row level security mirroring `lib/permissions.ts`
   - `0003_storage_buckets.sql` — the five storage buckets
4. (Optional) `supabase db reset` locally to also apply `supabase/seed.sql`.
5. Enable Google as an OAuth provider in Supabase Auth settings if you want
   the "Continue with Google" button to work — it's already wired up in
   `features/auth/actions.ts`, just needs credentials configured.

Until Supabase is connected, every screen renders from `lib/mock-data/*` via
each feature's `repository.ts`, so the whole app is explorable with
`npm run dev` and no backend at all — except the auth-gated routes, which
need a real Supabase project (auth can't be mocked away, on purpose).

## Architecture

```
app/                    Routes only. No business logic — pages call into features/.
  (auth)/               Public routes: login, signup, forgot-password
  (dashboard)/          Admin/dispatcher/accountant shell: sidebar + top nav
  my-jobs/              Mobile-first technician portal (separate layout)
  api/                  Route Handlers (health check example)
  auth/callback/        OAuth code exchange

features/<name>/        One folder per domain module
  repository.ts          Data access — the ONLY place querying the data source
  service.ts              Business logic (totals, filtering, derived data)
  validators.ts            Zod schemas
  actions.ts                Server Actions (auth module has the full example)
  components/                 Feature-specific UI (currently thin; grows here)

components/
  ui/                   Minimal design-system primitives (button, card, table…)
  layout/               Sidebar, top nav, breadcrumbs, mobile drawer
  shared/                Cross-feature reusable pieces (data table, metric
                          card, status/priority badges, empty/loading/error
                          states, pagination, search input, timeline…)

lib/
  supabase/             Client/server/middleware Supabase factories
  permissions.ts        SINGLE source of truth for role-based access —
                         consulted by middleware, and meant to be consulted
                         by every Server Action / Route Handler you add
  mock-data/             Placeholder data, one file per domain
  nav-config.ts           Sidebar link definitions, filtered per role
  utils.ts                 cn(), formatCurrency()

types/                  Shared TypeScript types + Supabase Database type stub

supabase/
  migrations/            0001 schema, 0002 RLS, 0003 storage buckets
  seed.sql                 Local dev seed data

middleware.ts           Auth gate + role-based section guard (uses lib/permissions.ts)
```

### Why this split

- **repository vs service**: repositories only fetch/persist; services hold
  the logic that depends on that data (e.g. `calculateEstimateTotals`,
  filtering jobs by technician). This is where the seams for real Supabase
  queries go — replace the body of a repository function and nothing else
  in the app needs to change.
- **Permissions in one file**: `lib/permissions.ts` is read by
  `middleware.ts` for route-level guarding. UI-level checks and Server
  Action checks should import `can()` / `hasRole()` from the same file, and
  the RLS policies in `0002_rls_policies.sql` encode the identical rules at
  the database layer — three layers, one source of truth.
- **Mock data behind repositories**: swapping mock data for live Supabase
  queries is a one-file-per-feature change, not a rewrite.

## What's intentionally a placeholder

PDF generation, email/SMS sending, push notifications, real file uploads,
payment gateways, advanced analytics/reporting engine, offline sync, GPS,
and recurring maintenance scheduling are all out of scope for Phase 1. Each
has a UI affordance (a disabled button, an empty state, a comment) marking
exactly where the real implementation plugs in.

## Known gaps / next steps

- `types/database.ts` is hand-written; regenerate with
  `supabase gen types typescript` once the schema is live for full type
  safety on every table.
- Drag-and-drop on the calendar is structurally ready (`draggable` job
  cards, day cells as drop targets) but not functionally wired — add
  `@dnd-kit/core` when that becomes a priority.
- Server Actions currently only exist for the auth module; other features
  should grow `actions.ts` files alongside their `service.ts` as real
  mutations are added.
