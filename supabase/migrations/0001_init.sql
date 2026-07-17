-- ============================================================================
-- GreenFlow HVAC — Initial schema
-- Namespaced with gf_ prefix. Every table has a UUID PK, created_at,
-- updated_at, and appropriate FKs/indexes/constraints.
-- ============================================================================

create extension if not exists "pgcrypto";

-- Generic trigger to keep updated_at current on every UPDATE.
create or replace function gf_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------------------------------------------
-- Roles & profiles
-- ----------------------------------------------------------------------------

create type gf_role as enum ('admin', 'dispatcher', 'technician', 'accountant');

-- gf_roles exists as a lookup/reference table in addition to the enum so
-- role metadata (e.g. display labels) can be extended without a migration.
create table gf_roles (
  id uuid primary key default gen_random_uuid(),
  name gf_role not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per authenticated user, mirrors auth.users.
create table gf_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role gf_role not null default 'technician',
  avatar_url text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_profiles_role_idx on gf_profiles (role);

create trigger gf_profiles_set_updated_at
  before update on gf_profiles
  for each row execute function gf_set_updated_at();

-- ----------------------------------------------------------------------------
-- Customers
-- ----------------------------------------------------------------------------

create table gf_customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  address text not null,
  billing_address text,
  notes text,
  created_by uuid references gf_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_customers_name_idx on gf_customers using gin (to_tsvector('english', name));

create trigger gf_customers_set_updated_at
  before update on gf_customers
  for each row execute function gf_set_updated_at();

create table gf_customer_contacts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references gf_customers (id) on delete cascade,
  full_name text not null,
  role text,
  email text,
  phone text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_customer_contacts_customer_idx on gf_customer_contacts (customer_id);

create trigger gf_customer_contacts_set_updated_at
  before update on gf_customer_contacts
  for each row execute function gf_set_updated_at();

-- ----------------------------------------------------------------------------
-- Equipment
-- ----------------------------------------------------------------------------

create table gf_equipment (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references gf_customers (id) on delete cascade,
  manufacturer text not null,
  model text not null,
  serial text not null,
  installed_at date,
  warranty_until date,
  last_maintenance_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (customer_id, serial)
);
create index gf_equipment_customer_idx on gf_equipment (customer_id);

create trigger gf_equipment_set_updated_at
  before update on gf_equipment
  for each row execute function gf_set_updated_at();

-- ----------------------------------------------------------------------------
-- Jobs
-- ----------------------------------------------------------------------------

create type gf_job_status as enum ('unscheduled', 'scheduled', 'in_progress', 'completed', 'cancelled');
create type gf_job_priority as enum ('low', 'medium', 'high', 'emergency');

create table gf_jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references gf_customers (id) on delete restrict,
  equipment_id uuid references gf_equipment (id) on delete set null,
  title text not null,
  description text,
  address text not null,
  status gf_job_status not null default 'unscheduled',
  priority gf_job_priority not null default 'medium',
  scheduled_for timestamptz,
  completed_at timestamptz,
  created_by uuid references gf_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_jobs_customer_idx on gf_jobs (customer_id);
create index gf_jobs_status_idx on gf_jobs (status);
create index gf_jobs_scheduled_for_idx on gf_jobs (scheduled_for);

create trigger gf_jobs_set_updated_at
  before update on gf_jobs
  for each row execute function gf_set_updated_at();

-- Many-to-many: a job can have multiple assigned technicians over time.
create table gf_job_assignments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references gf_jobs (id) on delete cascade,
  technician_id uuid not null references gf_profiles (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  unassigned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, technician_id, assigned_at)
);
create index gf_job_assignments_job_idx on gf_job_assignments (job_id);
create index gf_job_assignments_technician_idx on gf_job_assignments (technician_id);

create trigger gf_job_assignments_set_updated_at
  before update on gf_job_assignments
  for each row execute function gf_set_updated_at();

create table gf_job_notes (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references gf_jobs (id) on delete cascade,
  author_id uuid references gf_profiles (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_job_notes_job_idx on gf_job_notes (job_id);

create trigger gf_job_notes_set_updated_at
  before update on gf_job_notes
  for each row execute function gf_set_updated_at();

create table gf_job_images (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references gf_jobs (id) on delete cascade,
  storage_path text not null, -- path within the gf-job-photos bucket
  caption text,
  uploaded_by uuid references gf_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_job_images_job_idx on gf_job_images (job_id);

create trigger gf_job_images_set_updated_at
  before update on gf_job_images
  for each row execute function gf_set_updated_at();

create table gf_job_checklists (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references gf_jobs (id) on delete cascade,
  label text not null,
  is_complete boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_job_checklists_job_idx on gf_job_checklists (job_id);

create trigger gf_job_checklists_set_updated_at
  before update on gf_job_checklists
  for each row execute function gf_set_updated_at();

create table gf_signatures (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references gf_jobs (id) on delete cascade,
  signer_name text not null,
  storage_path text not null, -- path within the gf-signatures bucket
  signed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_signatures_job_idx on gf_signatures (job_id);

create trigger gf_signatures_set_updated_at
  before update on gf_signatures
  for each row execute function gf_set_updated_at();

-- ----------------------------------------------------------------------------
-- Estimates
-- ----------------------------------------------------------------------------

create type gf_estimate_status as enum ('draft', 'sent', 'approved', 'declined', 'converted');

create table gf_estimates (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references gf_customers (id) on delete restrict,
  job_id uuid references gf_jobs (id) on delete set null,
  status gf_estimate_status not null default 'draft',
  tax_rate numeric(5, 4) not null default 0,
  discount_cents integer not null default 0 check (discount_cents >= 0),
  created_by uuid references gf_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_estimates_customer_idx on gf_estimates (customer_id);
create index gf_estimates_status_idx on gf_estimates (status);

create trigger gf_estimates_set_updated_at
  before update on gf_estimates
  for each row execute function gf_set_updated_at();

create table gf_estimate_items (
  id uuid primary key default gen_random_uuid(),
  estimate_id uuid not null references gf_estimates (id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1 check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_estimate_items_estimate_idx on gf_estimate_items (estimate_id);

create trigger gf_estimate_items_set_updated_at
  before update on gf_estimate_items
  for each row execute function gf_set_updated_at();

-- ----------------------------------------------------------------------------
-- Invoices & payments
-- ----------------------------------------------------------------------------

create type gf_invoice_status as enum ('draft', 'sent', 'paid', 'overdue', 'void');

create table gf_invoices (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references gf_customers (id) on delete restrict,
  job_id uuid references gf_jobs (id) on delete set null,
  estimate_id uuid references gf_estimates (id) on delete set null,
  status gf_invoice_status not null default 'draft',
  due_date date,
  created_by uuid references gf_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_invoices_customer_idx on gf_invoices (customer_id);
create index gf_invoices_status_idx on gf_invoices (status);

create trigger gf_invoices_set_updated_at
  before update on gf_invoices
  for each row execute function gf_set_updated_at();

create table gf_invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references gf_invoices (id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1 check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_invoice_items_invoice_idx on gf_invoice_items (invoice_id);

create trigger gf_invoice_items_set_updated_at
  before update on gf_invoice_items
  for each row execute function gf_set_updated_at();

create table gf_payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references gf_invoices (id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  method text not null default 'manual', -- e.g. card, check, cash, ach — gateway integration is Phase 2
  paid_at timestamptz not null default now(),
  recorded_by uuid references gf_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_payments_invoice_idx on gf_payments (invoice_id);

create trigger gf_payments_set_updated_at
  before update on gf_payments
  for each row execute function gf_set_updated_at();

-- ----------------------------------------------------------------------------
-- Inventory
-- ----------------------------------------------------------------------------

create table gf_suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_email text,
  contact_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger gf_suppliers_set_updated_at
  before update on gf_suppliers
  for each row execute function gf_set_updated_at();

create table gf_inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text not null unique,
  supplier_id uuid references gf_suppliers (id) on delete set null,
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  reorder_threshold integer not null default 0 check (reorder_threshold >= 0),
  unit_cost_cents integer not null default 0 check (unit_cost_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_inventory_items_supplier_idx on gf_inventory_items (supplier_id);

create trigger gf_inventory_items_set_updated_at
  before update on gf_inventory_items
  for each row execute function gf_set_updated_at();

-- Derived on-hand quantity is NOT stored redundantly beyond the running
-- total above; this table is the append-only ledger that explains it.
create table gf_inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references gf_inventory_items (id) on delete cascade,
  job_id uuid references gf_jobs (id) on delete set null,
  quantity_delta integer not null, -- positive = restock, negative = usage
  reason text,
  created_by uuid references gf_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_inventory_transactions_item_idx on gf_inventory_transactions (inventory_item_id);

create trigger gf_inventory_transactions_set_updated_at
  before update on gf_inventory_transactions
  for each row execute function gf_set_updated_at();

-- ----------------------------------------------------------------------------
-- Notifications & activity log
-- ----------------------------------------------------------------------------

create table gf_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references gf_profiles (id) on delete cascade,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_notifications_recipient_idx on gf_notifications (recipient_id);
create index gf_notifications_unread_idx on gf_notifications (recipient_id) where is_read = false;

create trigger gf_notifications_set_updated_at
  before update on gf_notifications
  for each row execute function gf_set_updated_at();

-- Generic append-only audit trail. entity_type/entity_id keep this table
-- reusable across every feature instead of one log table per module.
create table gf_activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references gf_profiles (id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gf_activity_logs_entity_idx on gf_activity_logs (entity_type, entity_id);

create trigger gf_activity_logs_set_updated_at
  before update on gf_activity_logs
  for each row execute function gf_set_updated_at();

-- ----------------------------------------------------------------------------
-- Settings (single-row-per-key company configuration)
-- ----------------------------------------------------------------------------

create table gf_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references gf_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger gf_settings_set_updated_at
  before update on gf_settings
  for each row execute function gf_set_updated_at();
