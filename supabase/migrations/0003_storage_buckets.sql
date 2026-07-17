-- ============================================================================
-- GreenFlow HVAC — Storage buckets
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('gf-customer-photos', 'gf-customer-photos', false),
  ('gf-job-photos', 'gf-job-photos', false),
  ('gf-company-assets', 'gf-company-assets', true),
  ('gf-pdfs', 'gf-pdfs', false),
  ('gf-signatures', 'gf-signatures', false)
on conflict (id) do nothing;

-- Baseline policy: authenticated users can read/write within buckets they
-- have table-level access to. Storage-level fine-graining (e.g. restricting
-- job photo access to assigned technicians) should be layered on top of
-- these once file paths encode job/customer IDs, e.g. `job_id/filename.jpg`.

create policy gf_storage_authenticated_read on storage.objects
  for select using (
    bucket_id in ('gf-customer-photos', 'gf-job-photos', 'gf-company-assets', 'gf-pdfs', 'gf-signatures')
    and auth.role() = 'authenticated'
  );

create policy gf_storage_authenticated_write on storage.objects
  for insert with check (
    bucket_id in ('gf-customer-photos', 'gf-job-photos', 'gf-company-assets', 'gf-pdfs', 'gf-signatures')
    and auth.role() = 'authenticated'
  );

create policy gf_storage_public_company_assets on storage.objects
  for select using (bucket_id = 'gf-company-assets');
