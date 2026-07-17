-- ============================================================================
-- GreenFlow HVAC — Demo role RLS policies
-- Demo users get SELECT-only access to all tables (read-only).
-- All INSERT/UPDATE/DELETE operations are denied for the demo role.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- gf_profiles: demo can read all profiles (needed for dropdowns, etc.)
-- but cannot modify anything.
-- ---------------------------------------------------------------------------
create policy gf_profiles_demo_select on gf_profiles
  for select using (gf_current_role() = 'demo');

-- ---------------------------------------------------------------------------
-- gf_customers: demo read-only
-- ---------------------------------------------------------------------------
create policy gf_customers_demo_select on gf_customers
  for select using (gf_current_role() = 'demo');

create policy gf_customer_contacts_demo_select on gf_customer_contacts
  for select using (gf_current_role() = 'demo');

-- ---------------------------------------------------------------------------
-- gf_equipment: demo read-only
-- ---------------------------------------------------------------------------
create policy gf_equipment_demo_select on gf_equipment
  for select using (gf_current_role() = 'demo');

-- ---------------------------------------------------------------------------
-- gf_jobs and sub-resources: demo read-only
-- ---------------------------------------------------------------------------
create policy gf_jobs_demo_select on gf_jobs
  for select using (gf_current_role() = 'demo');

create policy gf_job_assignments_demo_select on gf_job_assignments
  for select using (gf_current_role() = 'demo');

create policy gf_job_notes_demo_select on gf_job_notes
  for select using (gf_current_role() = 'demo');

create policy gf_job_images_demo_select on gf_job_images
  for select using (gf_current_role() = 'demo');

create policy gf_job_checklists_demo_select on gf_job_checklists
  for select using (gf_current_role() = 'demo');

create policy gf_signatures_demo_select on gf_signatures
  for select using (gf_current_role() = 'demo');

-- ---------------------------------------------------------------------------
-- gf_estimates and items: demo read-only
-- ---------------------------------------------------------------------------
create policy gf_estimates_demo_select on gf_estimates
  for select using (gf_current_role() = 'demo');

create policy gf_estimate_items_demo_select on gf_estimate_items
  for select using (gf_current_role() = 'demo');

-- ---------------------------------------------------------------------------
-- gf_invoices, items, payments: demo read-only
-- ---------------------------------------------------------------------------
create policy gf_invoices_demo_select on gf_invoices
  for select using (gf_current_role() = 'demo');

create policy gf_invoice_items_demo_select on gf_invoice_items
  for select using (gf_current_role() = 'demo');

create policy gf_payments_demo_select on gf_payments
  for select using (gf_current_role() = 'demo');

-- ---------------------------------------------------------------------------
-- gf_inventory, suppliers, transactions: demo read-only
-- ---------------------------------------------------------------------------
create policy gf_inventory_items_demo_select on gf_inventory_items
  for select using (gf_current_role() = 'demo');

create policy gf_inventory_transactions_demo_select on gf_inventory_transactions
  for select using (gf_current_role() = 'demo');

create policy gf_suppliers_demo_select on gf_suppliers
  for select using (gf_current_role() = 'demo');

-- ---------------------------------------------------------------------------
-- gf_notifications: demo read-only (own notifications)
-- ---------------------------------------------------------------------------
create policy gf_notifications_demo_select on gf_notifications
  for select using (gf_current_role() = 'demo' and recipient_id = auth.uid());

-- ---------------------------------------------------------------------------
-- gf_activity_logs: demo read-only
-- ---------------------------------------------------------------------------
create policy gf_activity_logs_demo_select on gf_activity_logs
  for select using (gf_current_role() = 'demo');

-- ---------------------------------------------------------------------------
-- gf_settings: demo read-only
-- ---------------------------------------------------------------------------
create policy gf_settings_demo_select on gf_settings
  for select using (gf_current_role() = 'demo');