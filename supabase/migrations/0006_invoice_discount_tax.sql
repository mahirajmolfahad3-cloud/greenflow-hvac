-- ============================================================================
-- GreenFlow HVAC — Add discount and tax columns to gf_invoices
-- Discounts and taxes are now stored at the document level rather than as
-- negative line items, following standard accounting practices.
-- ============================================================================

-- Add discount_cents and tax_rate to gf_invoices (mirrors gf_estimates schema)
alter table gf_invoices
  add column if not exists discount_cents integer not null default 0 check (discount_cents >= 0),
  add column if not exists tax_rate numeric(5, 4) not null default 0;