-- ============================================================================
-- GreenFlow HVAC — Row Level Security
-- Mirrors lib/permissions.ts. Admins: everything. Dispatchers: customers,
-- equipment, jobs, calendar. Technicians: only their assigned jobs.
-- Accountants: financial tables.
-- ============================================================================

-- Helper: current user's role, read from gf_profiles.
create or replace function gf_current_role()
returns gf_role
language sql
security definer
stable
as $$
  select role from gf_profiles where id = auth.uid();
$$;

-- Helper: is the current user assigned to a given job?
create or replace function gf_is_assigned_to_job(target_job_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from gf_job_assignments
    where job_id = target_job_id
      and technician_id = auth.uid()
      and unassigned_at is null
  );
$$;

alter table gf_profiles enable row level security;
alter table gf_customers enable row level security;
alter table gf_customer_contacts enable row level security;
alter table gf_equipment enable row level security;
alter table gf_jobs enable row level security;
alter table gf_job_assignments enable row level security;
alter table gf_job_notes enable row level security;
alter table gf_job_images enable row level security;
alter table gf_job_checklists enable row level security;
alter table gf_signatures enable row level security;
alter table gf_estimates enable row level security;
alter table gf_estimate_items enable row level security;
alter table gf_invoices enable row level security;
alter table gf_invoice_items enable row level security;
alter table gf_payments enable row level security;
alter table gf_inventory_items enable row level security;
alter table gf_inventory_transactions enable row level security;
alter table gf_suppliers enable row level security;
alter table gf_notifications enable row level security;
alter table gf_activity_logs enable row level security;
alter table gf_settings enable row level security;

-- ---------------------------------------------------------------------------
-- Profiles: everyone can read profiles (needed for assignment dropdowns,
-- avatars, etc). Users can update their own profile. Admins manage all.
-- ---------------------------------------------------------------------------

create policy gf_profiles_select_all on gf_profiles
  for select using (true);

create policy gf_profiles_insert_self on gf_profiles
  for insert with check (id = auth.uid());

create policy gf_profiles_update_self_or_admin on gf_profiles
  for update using (id = auth.uid() or gf_current_role() = 'admin');

create policy gf_profiles_admin_delete on gf_profiles
  for delete using (gf_current_role() = 'admin');

-- ---------------------------------------------------------------------------
-- Customers / contacts / equipment / calendar (jobs):
-- admin + dispatcher full access. Technicians: read-only, and only for
-- customers/equipment tied to jobs they're assigned to. Accountants: read.
-- ---------------------------------------------------------------------------

create policy gf_customers_admin_dispatcher_all on gf_customers
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

create policy gf_customers_read_accountant on gf_customers
  for select using (gf_current_role() = 'accountant');

create policy gf_customers_read_technician on gf_customers
  for select using (
    gf_current_role() = 'technician'
    and exists (
      select 1 from gf_jobs
      where gf_jobs.customer_id = gf_customers.id
        and gf_is_assigned_to_job(gf_jobs.id)
    )
  );

create policy gf_customer_contacts_admin_dispatcher_all on gf_customer_contacts
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

create policy gf_customer_contacts_read_others on gf_customer_contacts
  for select using (gf_current_role() in ('accountant', 'technician'));

create policy gf_equipment_admin_dispatcher_all on gf_equipment
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

create policy gf_equipment_read_others on gf_equipment
  for select using (gf_current_role() in ('accountant', 'technician'));

-- ---------------------------------------------------------------------------
-- Jobs: admin + dispatcher full access (this doubles as calendar access).
-- Technicians: only jobs they're assigned to.
-- ---------------------------------------------------------------------------

create policy gf_jobs_admin_dispatcher_all on gf_jobs
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

create policy gf_jobs_technician_own on gf_jobs
  for select using (
    gf_current_role() = 'technician' and gf_is_assigned_to_job(id)
  );

create policy gf_jobs_technician_update_own on gf_jobs
  for update using (
    gf_current_role() = 'technician' and gf_is_assigned_to_job(id)
  );

-- Job sub-resources (assignments, notes, images, checklists, signatures)
-- follow the same "own assigned job" rule for technicians, full access for
-- admin/dispatcher.
create policy gf_job_assignments_admin_dispatcher_all on gf_job_assignments
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

create policy gf_job_assignments_technician_own on gf_job_assignments
  for select using (technician_id = auth.uid());

create policy gf_job_notes_admin_dispatcher_all on gf_job_notes
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

create policy gf_job_notes_technician_own on gf_job_notes
  for all using (gf_current_role() = 'technician' and gf_is_assigned_to_job(job_id))
  with check (gf_current_role() = 'technician' and gf_is_assigned_to_job(job_id));

create policy gf_job_images_admin_dispatcher_all on gf_job_images
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

create policy gf_job_images_technician_own on gf_job_images
  for all using (gf_current_role() = 'technician' and gf_is_assigned_to_job(job_id))
  with check (gf_current_role() = 'technician' and gf_is_assigned_to_job(job_id));

create policy gf_job_checklists_admin_dispatcher_all on gf_job_checklists
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

create policy gf_job_checklists_technician_own on gf_job_checklists
  for all using (gf_current_role() = 'technician' and gf_is_assigned_to_job(job_id))
  with check (gf_current_role() = 'technician' and gf_is_assigned_to_job(job_id));

create policy gf_signatures_admin_dispatcher_all on gf_signatures
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

create policy gf_signatures_technician_own on gf_signatures
  for all using (gf_current_role() = 'technician' and gf_is_assigned_to_job(job_id))
  with check (gf_current_role() = 'technician' and gf_is_assigned_to_job(job_id));

-- ---------------------------------------------------------------------------
-- Financial tables: admin full access, accountant full access.
-- Dispatchers get read-only visibility (they create estimates/invoices from
-- jobs); technicians have no access.
-- ---------------------------------------------------------------------------

create policy gf_estimates_admin_accountant_all on gf_estimates
  for all using (gf_current_role() in ('admin', 'accountant'))
  with check (gf_current_role() in ('admin', 'accountant'));

create policy gf_estimates_dispatcher_all on gf_estimates
  for all using (gf_current_role() = 'dispatcher')
  with check (gf_current_role() = 'dispatcher');

create policy gf_estimate_items_admin_accountant_all on gf_estimate_items
  for all using (gf_current_role() in ('admin', 'accountant'))
  with check (gf_current_role() in ('admin', 'accountant'));

create policy gf_estimate_items_dispatcher_all on gf_estimate_items
  for all using (gf_current_role() = 'dispatcher')
  with check (gf_current_role() = 'dispatcher');

create policy gf_invoices_admin_accountant_all on gf_invoices
  for all using (gf_current_role() in ('admin', 'accountant'))
  with check (gf_current_role() in ('admin', 'accountant'));

create policy gf_invoices_dispatcher_read on gf_invoices
  for select using (gf_current_role() = 'dispatcher');

create policy gf_invoice_items_admin_accountant_all on gf_invoice_items
  for all using (gf_current_role() in ('admin', 'accountant'))
  with check (gf_current_role() in ('admin', 'accountant'));

create policy gf_invoice_items_dispatcher_read on gf_invoice_items
  for select using (gf_current_role() = 'dispatcher');

create policy gf_payments_admin_accountant_all on gf_payments
  for all using (gf_current_role() in ('admin', 'accountant'))
  with check (gf_current_role() in ('admin', 'accountant'));

-- ---------------------------------------------------------------------------
-- Inventory: admin + dispatcher manage; accountant read-only (cost data).
-- ---------------------------------------------------------------------------

create policy gf_inventory_items_admin_dispatcher_all on gf_inventory_items
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

create policy gf_inventory_items_read_accountant on gf_inventory_items
  for select using (gf_current_role() = 'accountant');

create policy gf_inventory_transactions_admin_dispatcher_all on gf_inventory_transactions
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

create policy gf_suppliers_admin_dispatcher_all on gf_suppliers
  for all using (gf_current_role() in ('admin', 'dispatcher'))
  with check (gf_current_role() in ('admin', 'dispatcher'));

-- ---------------------------------------------------------------------------
-- Notifications: users only ever see their own.
-- ---------------------------------------------------------------------------

create policy gf_notifications_own on gf_notifications
  for all using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Activity logs: admins see everything; everyone can insert (system writes
-- audit entries on behalf of the acting user); others read nothing directly
-- (surfaced instead through feature-specific views/queries as needed).
-- ---------------------------------------------------------------------------

create policy gf_activity_logs_admin_read on gf_activity_logs
  for select using (gf_current_role() = 'admin');

create policy gf_activity_logs_insert_authenticated on gf_activity_logs
  for insert with check (auth.uid() is not null);

-- ---------------------------------------------------------------------------
-- Settings: admin only.
-- ---------------------------------------------------------------------------

create policy gf_settings_admin_all on gf_settings
  for all using (gf_current_role() = 'admin')
  with check (gf_current_role() = 'admin');
