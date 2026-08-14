-- ============================================================================
-- GreenFlow HVAC — Remote seed (safe for hosted Supabase)
-- Run with: supabase db query --linked -f supabase/seed-remote.sql
-- NOTE: Auth users are created via the Admin Auth API, NOT here.
-- This script only inserts profiles (matching real auth user IDs) and
-- business data using subselects so all FKs resolve correctly.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
insert into gf_roles (name, description) values
  ('admin', 'Full access to every module'),
  ('dispatcher', 'Manages customers, jobs, calendar, estimates'),
  ('technician', 'Field access to assigned jobs only'),
  ('accountant', 'Access to financial modules'),
  ('demo', 'Read-only access for demonstration purposes')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- Profiles — one row per auth user (IDs come from auth.users created via API)
-- ---------------------------------------------------------------------------
insert into gf_profiles (id, full_name, email, role, status, phone) values
  ((select id from auth.users where email = 'mike@greenflowhvac.com' limit 1),  'Mike Torres',   'mike@greenflowhvac.com',   'technician',  'active', '+1 (555) 100-1001'),
  ((select id from auth.users where email = 'alicia@greenflowhvac.com' limit 1), 'Alicia Chen',   'alicia@greenflowhvac.com', 'technician',  'active', '+1 (555) 100-1002'),
  ((select id from auth.users where email = 'dana@greenflowhvac.com' limit 1),  'Dana Walsh',    'dana@greenflowhvac.com',   'dispatcher',  'active', '+1 (555) 100-1003'),
  ((select id from auth.users where email = 'priya@greenflowhvac.com' limit 1), 'Priya Sharma',  'priya@greenflowhvac.com',  'admin',       'active', '+1 (555) 100-1004'),
  ((select id from auth.users where email = 'demo@greenflowhvac.com' limit 1),  'Demo User',     'demo@greenflowhvac.com',   'demo',        'active', '+1 (555) 999-9999')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Demo settings — marks the demo user for read-only enforcement
-- ---------------------------------------------------------------------------
insert into gf_demo_settings (demo_user_id) values
  ((select id from auth.users where email = 'demo@greenflowhvac.com' limit 1))
on conflict (demo_user_id) do nothing;

-- ---------------------------------------------------------------------------
-- Suppliers
-- ---------------------------------------------------------------------------
insert into gf_suppliers (id, name, contact_email, contact_phone) values
  ('11111111-1111-1111-1111-111111111101', 'CoolParts Supply', 'orders@coolparts.example', '+1 (555) 200-1000'),
  ('11111111-1111-1111-1111-111111111102', 'HVAC Depot', 'sales@hvacdepot.example', '+1 (555) 200-1001'),
  ('11111111-1111-1111-1111-111111111103', 'ThermoKing Distributors', 'info@thermoking.example', '+1 (555) 200-1002');

-- ---------------------------------------------------------------------------
-- Inventory Items
-- ---------------------------------------------------------------------------
insert into gf_inventory_items (name, sku, supplier_id, quantity_on_hand, reorder_threshold, unit_cost_cents) values
  ('R-410A Refrigerant (25lb)', 'REF-410A-25', '11111111-1111-1111-1111-111111111101', 6, 4, 15000),
  ('Capacitor 45/5 MFD', 'CAP-45-5', '11111111-1111-1111-1111-111111111102', 22, 10, 1800),
  ('Air Filter 20x25x1', 'FLT-20251', '11111111-1111-1111-1111-111111111102', 3, 15, 900),
  ('Air Filter 16x25x1', 'FLT-16251', '11111111-1111-1111-1111-111111111102', 8, 12, 750),
  ('Thermostat Programmable', 'TSTAT-PRO', '11111111-1111-1111-1111-111111111103', 15, 5, 4500),
  ('Condenser Fan Motor', 'CFM-1/4HP', '11111111-1111-1111-1111-111111111101', 4, 3, 8500),
  ('Contact Relay 24V', 'REL-24V', '11111111-1111-1111-1111-111111111102', 18, 8, 1200),
  ('Duct Tape (50yd)', 'TAPE-DUCT', '11111111-1111-1111-1111-111111111103', 25, 10, 600);

-- ---------------------------------------------------------------------------
-- Inventory Transactions — explain the initial on-hand quantities
-- ---------------------------------------------------------------------------
insert into gf_inventory_transactions (inventory_item_id, quantity_delta, reason, created_by) values
  ((select id from gf_inventory_items where sku = 'REF-410A-25'),   6,  'Initial stock',  (select id from gf_profiles where email = 'priya@greenflowhvac.com')),
  ((select id from gf_inventory_items where sku = 'CAP-45-5'),     22,  'Initial stock',  (select id from gf_profiles where email = 'priya@greenflowhvac.com')),
  ((select id from gf_inventory_items where sku = 'FLT-20251'),     3,  'Initial stock',  (select id from gf_profiles where email = 'priya@greenflowhvac.com')),
  ((select id from gf_inventory_items where sku = 'FLT-16251'),     8,  'Initial stock',  (select id from gf_profiles where email = 'priya@greenflowhvac.com')),
  ((select id from gf_inventory_items where sku = 'TSTAT-PRO'),    15,  'Initial stock',  (select id from gf_profiles where email = 'priya@greenflowhvac.com')),
  ((select id from gf_inventory_items where sku = 'CFM-1/4HP'),     4,  'Initial stock',  (select id from gf_profiles where email = 'priya@greenflowhvac.com')),
  ((select id from gf_inventory_items where sku = 'REL-24V'),      18,  'Initial stock',  (select id from gf_profiles where email = 'priya@greenflowhvac.com')),
  ((select id from gf_inventory_items where sku = 'TAPE-DUCT'),    25,  'Initial stock',  (select id from gf_profiles where email = 'priya@greenflowhvac.com'));

-- ---------------------------------------------------------------------------
-- Customers
-- ---------------------------------------------------------------------------
insert into gf_customers (id, name, email, phone, address, billing_address, notes) values
  ('22222222-2222-2222-2222-222222222201', 'Sunset Medical Center', 'billing@sunsetmed.example', '+1 (555) 300-1000', '742 Evergreen Terrace, Springfield, IL 62701', '742 Evergreen Terrace, Springfield, IL 62701', 'Commercial HVAC maintenance contract. Priority service.'),
  ('22222222-2222-2222-2222-222222222202', 'Blue Sky Diner', 'manager@blueskydiner.example', '+1 (555) 300-1001', '123 Main Street, Springfield, IL 62702', '123 Main Street, Springfield, IL 62702', 'Walk-in cooler and dining area HVAC.'),
  ('22222222-2222-2222-2222-222222222203', 'Oakwood Apartments', 'admin@oakwoodapts.example', '+1 (555) 300-1002', '456 Oak Avenue, Springfield, IL 62703', '456 Oak Avenue, Springfield, IL 62703', 'Multi-unit residential. 12 units, central HVAC.'),
  ('22222222-2222-2222-2222-222222222204', 'Riverside Church', 'office@riversidechurch.example', '+1 (555) 300-1003', '789 River Road, Springfield, IL 62704', '789 River Road, Springfield, IL 62704', 'Sanctuary and office HVAC. Annual maintenance.'),
  ('22222222-2222-2222-2222-222222222205', 'Greenleaf School District', 'facilities@greenleaf.example', '+1 (555) 300-1004', '1000 Education Drive, Springfield, IL 62705', '1000 Education Drive, Springfield, IL 62705', 'K-12 school district. Multiple buildings.'),
  ('22222222-2222-2222-2222-222222222206', 'Thompson Family Residence', 'jthompson@email.example', '+1 (555) 300-1005', '55 Maple Lane, Springfield, IL 62706', '55 Maple Lane, Springfield, IL 62706', 'Residential. Two-story home.'),
  ('22222222-2222-2222-2222-222222222207', 'Harbor View Hotel', 'frontdesk@harborview.example', '+1 (555) 300-1006', '200 Harbor Boulevard, Springfield, IL 62707', '200 Harbor Boulevard, Springfield, IL 62707', 'Boutique hotel. 30 rooms. Full HVAC system.');

-- ---------------------------------------------------------------------------
-- Customer Contacts
-- ---------------------------------------------------------------------------
insert into gf_customer_contacts (customer_id, full_name, role, email, phone, is_primary) values
  ('22222222-2222-2222-2222-222222222201', 'Dr. Sarah Chen', 'Facilities Director', 'schen@sunsetmed.example', '+1 (555) 300-2000', true),
  ('22222222-2222-2222-2222-222222222202', 'Tom Delaney', 'Owner', 'tom@blueskydiner.example', '+1 (555) 300-2001', true),
  ('22222222-2222-2222-2222-222222222203', 'Linda Park', 'Property Manager', 'lpark@oakwoodapts.example', '+1 (555) 300-2002', true),
  ('22222222-2222-2222-2222-222222222204', 'Rev. James Brown', 'Pastor', 'jbrown@riversidechurch.example', '+1 (555) 300-2003', true),
  ('22222222-2222-2222-2222-222222222205', 'Patricia Miller', 'Facilities Manager', 'pmiller@greenleaf.example', '+1 (555) 300-2004', true),
  ('22222222-2222-2222-2222-222222222206', 'John Thompson', 'Homeowner', 'jthompson@email.example', '+1 (555) 300-2005', true),
  ('22222222-2222-2222-2222-222222222207', 'Maria Gonzalez', 'General Manager', 'mgonzalez@harborview.example', '+1 (555) 300-2006', true);

-- ---------------------------------------------------------------------------
-- Equipment
-- ---------------------------------------------------------------------------
insert into gf_equipment (id, customer_id, manufacturer, model, serial, installed_at, warranty_until, last_maintenance_at, notes) values
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'Carrier', '48TC-D18', 'CRR-2022-001', '2022-03-15', '2027-03-15', '2025-12-01', 'Main rooftop unit - Building A'),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 'Trane', 'XL20i', 'TRN-2021-042', '2021-06-01', '2026-06-01', '2025-11-15', 'Surgical wing HVAC'),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222202', 'Lennox', 'EL16XC1', 'LNX-2023-007', '2023-01-20', '2028-01-20', '2025-10-10', 'Dining area unit'),
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222202', 'Carrier', '38MHR', 'CRR-2023-018', '2023-02-10', '2028-02-10', '2025-09-22', 'Walk-in cooler condenser'),
  ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222203', 'Goodman', 'GSX160601', 'GDM-2020-101', '2020-05-01', '2025-05-01', '2025-08-15', 'Building A - 4 units'),
  ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222203', 'Goodman', 'GSX160601', 'GDM-2020-102', '2020-05-01', '2025-05-01', '2025-08-15', 'Building B - 4 units'),
  ('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222204', 'Rheem', 'RP14', 'RHM-2021-055', '2021-04-10', '2026-04-10', '2025-07-20', 'Sanctuary HVAC'),
  ('33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222205', 'Trane', 'XLi', 'TRN-2022-088', '2022-08-01', '2027-08-01', '2025-06-10', 'Main school building'),
  ('33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222206', 'Lennox', 'ML14XC1', 'LNX-2024-001', '2024-03-01', '2029-03-01', '2025-12-15', 'Residential split system'),
  ('33333333-3333-3333-3333-333333333310', '22222222-2222-2222-2222-222222222207', 'Carrier', '48HC', 'CRR-2021-099', '2021-09-15', '2026-09-15', '2025-11-01', 'Hotel main HVAC');

-- ---------------------------------------------------------------------------
-- Jobs
-- ---------------------------------------------------------------------------
insert into gf_jobs (id, customer_id, equipment_id, title, description, address, status, priority, scheduled_for, created_at) values
  ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333301', 'Rooftop unit maintenance', 'Semi-annual maintenance of Carrier rooftop unit. Check refrigerant levels, clean coils, inspect electrical connections.', '742 Evergreen Terrace, Springfield, IL 62701', 'scheduled', 'medium', '2026-07-20 08:00:00+00', '2026-07-10 10:00:00+00'),
  ('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333303', 'Dining area AC not cooling', 'Customer reports dining area temperature rising to 78°F. Thermostat set to 72°F. Possible refrigerant leak.', '123 Main Street, Springfield, IL 62702', 'in_progress', 'high', '2026-07-17 09:00:00+00', '2026-07-16 14:00:00+00'),
  ('44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333305', 'Apartment A3 no heat', 'Tenant reports heating not working in unit A3. Pilot light ok, blower not engaging.', '456 Oak Avenue, Springfield, IL 62703', 'unscheduled', 'emergency', null, '2026-07-17 08:00:00+00'),
  ('44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222204', '33333333-3333-3333-3333-333333333307', 'Sanctuary thermostat replacement', 'Upgrade old thermostat to programmable model. Current unit non-functional.', '789 River Road, Springfield, IL 62704', 'scheduled', 'low', '2026-07-22 10:00:00+00', '2026-07-15 09:00:00+00'),
  ('44444444-4444-4444-4444-444444444405', '22222222-2222-2222-2222-222222222205', '33333333-3333-3333-3333-333333333308', 'School HVAC inspection', 'Pre-season inspection of all school HVAC units before fall semester. Check 8 units total.', '1000 Education Drive, Springfield, IL 62705', 'scheduled', 'medium', '2026-08-01 07:00:00+00', '2026-07-14 11:00:00+00'),
  ('44444444-4444-4444-4444-444444444406', '22222222-2222-2222-2222-222222222206', '33333333-3333-3333-3333-333333333309', 'New AC installation', 'Install new Lennox split system. Remove old unit, install new condenser and air handler.', '55 Maple Lane, Springfield, IL 62706', 'completed', 'medium', '2026-07-10 08:00:00+00', '2026-07-01 10:00:00+00'),
  ('44444444-4444-4444-4444-444444444407', '22222222-2222-2222-2222-222222222207', '33333333-3333-3333-3333-333333333310', 'Hotel AC zone balancing', 'Guests on 3rd floor reporting uneven cooling. Need to balance dampers and check zone controls.', '200 Harbor Boulevard, Springfield, IL 62707', 'scheduled', 'medium', '2026-07-19 09:00:00+00', '2026-07-12 13:00:00+00'),
  ('44444444-4444-4444-4444-444444444408', '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333302', 'Surgical wing humidity issue', 'Surgical wing humidity levels above acceptable range. Check dehumidification controls on Trane unit.', '742 Evergreen Terrace, Springfield, IL 62701', 'in_progress', 'high', '2026-07-18 07:00:00+00', '2026-07-16 16:00:00+00'),
  ('44444444-4444-4444-4444-444444444409', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333304', 'Walk-in cooler compressor noise', 'Unusual rattling noise from walk-in cooler compressor. Needs diagnostic and possible repair.', '123 Main Street, Springfield, IL 62702', 'unscheduled', 'high', null, '2026-07-17 06:00:00+00'),
  ('44444444-4444-4444-4444-444444444410', '22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333306', 'Building B filter replacement', 'Quarterly filter replacement for all 4 units in Building B. 20x25x1 filters.', '456 Oak Avenue, Springfield, IL 62703', 'scheduled', 'low', '2026-07-25 08:00:00+00', '2026-07-10 09:00:00+00');

-- ---------------------------------------------------------------------------
-- Job Assignments
-- ---------------------------------------------------------------------------
insert into gf_job_assignments (job_id, technician_id) values
  ('44444444-4444-4444-4444-444444444401', (select id from gf_profiles where email = 'mike@greenflowhvac.com' limit 1)),
  ('44444444-4444-4444-4444-444444444402', (select id from gf_profiles where email = 'mike@greenflowhvac.com' limit 1)),
  ('44444444-4444-4444-4444-444444444404', (select id from gf_profiles where email = 'alicia@greenflowhvac.com' limit 1)),
  ('44444444-4444-4444-4444-444444444405', (select id from gf_profiles where email = 'mike@greenflowhvac.com' limit 1)),
  ('44444444-4444-4444-4444-444444444406', (select id from gf_profiles where email = 'alicia@greenflowhvac.com' limit 1)),
  ('44444444-4444-4444-4444-444444444407', (select id from gf_profiles where email = 'mike@greenflowhvac.com' limit 1)),
  ('44444444-4444-4444-4444-444444444408', (select id from gf_profiles where email = 'alicia@greenflowhvac.com' limit 1)),
  ('44444444-4444-4444-4444-444444444410', (select id from gf_profiles where email = 'alicia@greenflowhvac.com' limit 1));

-- ---------------------------------------------------------------------------
-- Job Notes
-- ---------------------------------------------------------------------------
insert into gf_job_notes (job_id, author_id, body) values
  ('44444444-4444-4444-4444-444444444402', (select id from gf_profiles where email = 'mike@greenflowhvac.com' limit 1), 'Arrived on site. Checked refrigerant levels - low on R-410A. Will need 2lbs to top off.'),
  ('44444444-4444-4444-4444-444444444402', (select id from gf_profiles where email = 'priya@greenflowhvac.com' limit 1), 'Customer called again. Temperature now at 80°F. Please prioritize.'),
  ('44444444-4444-4444-4444-444444444406', (select id from gf_profiles where email = 'alicia@greenflowhvac.com' limit 1), 'Installation complete. System running well. Customer satisfied.'),
  ('44444444-4444-4444-4444-444444444408', (select id from gf_profiles where email = 'alicia@greenflowhvac.com' limit 1), 'Checked humidity controls. Dehumidification coil may need cleaning. Will return with supplies.');

-- ---------------------------------------------------------------------------
-- Estimates
-- ---------------------------------------------------------------------------
insert into gf_estimates (id, customer_id, job_id, status, tax_rate, discount_cents, created_at) values
  ('55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222202', '44444444-4444-4444-4444-444444444402', 'approved', 0.0825, 0, '2026-07-16 15:00:00+00'),
  ('55555555-5555-5555-5555-555555555502', '22222222-2222-2222-2222-222222222206', '44444444-4444-4444-4444-444444444406', 'converted', 0.0825, 50000, '2026-07-01 10:00:00+00'),
  ('55555555-5555-5555-5555-555555555503', '22222222-2222-2222-2222-222222222207', '44444444-4444-4444-4444-444444444407', 'draft', 0.0825, 0, '2026-07-12 14:00:00+00'),
  ('55555555-5555-5555-5555-555555555504', '22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444408', 'sent', 0.0825, 0, '2026-07-16 17:00:00+00');

insert into gf_estimate_items (estimate_id, description, quantity, unit_price_cents, sort_order) values
  ('55555555-5555-5555-5555-555555555501', 'R-410A Refrigerant (per lb)', 2, 7500, 1),
  ('55555555-5555-5555-5555-555555555501', 'Labor - AC diagnostic & repair (per hour)', 2, 9500, 2),
  ('55555555-5555-5555-5555-555555555501', 'System performance test', 1, 5000, 3),
  ('55555555-5555-5555-5555-555555555502', 'Lennox ML14XC1 split system', 1, 320000, 1),
  ('55555555-5555-5555-5555-555555555502', 'Labor - full installation', 1, 150000, 2),
  ('55555555-5555-5555-5555-555555555502', 'Disposal of old unit', 1, 25000, 3),
  ('55555555-5555-5555-5555-555555555503', 'Zone damper inspection & balancing', 4, 8500, 1),
  ('55555555-5555-5555-5555-555555555503', 'Thermostat calibration', 3, 4500, 2),
  ('55555555-5555-5555-5555-555555555504', 'Dehumidification coil cleaning', 1, 12000, 1),
  ('55555555-5555-5555-5555-555555555504', 'Humidity control system diagnostic', 1, 8500, 2);

-- ---------------------------------------------------------------------------
-- Invoices
-- ---------------------------------------------------------------------------
insert into gf_invoices (id, customer_id, job_id, estimate_id, status, due_date, discount_cents, tax_rate, created_at) values
  ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222206', '44444444-4444-4444-4444-444444444406', '55555555-5555-5555-5555-555555555502', 'paid', '2026-08-01', 50000, 0, '2026-07-11 10:00:00+00'),
  ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222202', '44444444-4444-4444-4444-444444444402', '55555555-5555-5555-5555-555555555501', 'sent', '2026-08-15', 0, 0.0825, '2026-07-17 09:00:00+00'),
  ('66666666-6666-6666-6666-666666666603', '22222222-2222-2222-2222-222222222201', null, null, 'overdue', '2026-07-01', 0, 0, '2026-06-01 08:00:00+00'),
  ('66666666-6666-6666-6666-666666666604', '22222222-2222-2222-2222-222222222203', null, null, 'draft', '2026-08-20', 0, 0, '2026-07-15 12:00:00+00');

insert into gf_invoice_items (invoice_id, description, quantity, unit_price_cents, sort_order) values
  ('66666666-6666-6666-6666-666666666601', 'Lennox ML14XC1 split system', 1, 320000, 1),
  ('66666666-6666-6666-6666-666666666601', 'Labor - full installation', 1, 150000, 2),
  ('66666666-6666-6666-6666-666666666601', 'Disposal of old unit', 1, 25000, 3),
  ('66666666-6666-6666-6666-666666666602', 'R-410A Refrigerant (per lb)', 2, 7500, 1),
  ('66666666-6666-6666-6666-666666666602', 'Labor - AC diagnostic & repair (per hour)', 2, 9500, 2),
  ('66666666-6666-6666-6666-666666666602', 'System performance test', 1, 5000, 3),
  ('66666666-6666-6666-6666-666666666603', 'Q2 Maintenance Contract', 1, 250000, 1),
  ('66666666-6666-6666-6666-666666666604', 'Quarterly filter replacement', 4, 2500, 1);

-- ---------------------------------------------------------------------------
-- Payments
-- ---------------------------------------------------------------------------
insert into gf_payments (invoice_id, amount_cents, method, paid_at) values
  ('66666666-6666-6666-6666-666666666601', 445000, 'check', '2026-07-15 14:00:00+00');

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
insert into gf_notifications (recipient_id, title, body, is_read, link) values
  ((select id from gf_profiles where email = 'mike@greenflowhvac.com' limit 1), 'New job assigned', 'You have been assigned to "Dining area AC not cooling" at Blue Sky Diner.', false, '/jobs/44444444-4444-4444-4444-444444444402'),
  ((select id from gf_profiles where email = 'alicia@greenflowhvac.com' limit 1), 'New job assigned', 'You have been assigned to "Surgical wing humidity issue" at Sunset Medical Center.', false, '/jobs/44444444-4444-4444-4444-444444444408'),
  ((select id from gf_profiles where email = 'dana@greenflowhvac.com' limit 1), 'Estimate approved', 'Estimate #ES-001 for Blue Sky Diner has been approved.', false, '/estimates/55555555-5555-5555-5555-555555555501'),
  ((select id from gf_profiles where email = 'priya@greenflowhvac.com' limit 1), 'Invoice overdue', 'Invoice #INV-003 for Sunset Medical Center is now overdue.', true, '/invoices/66666666-6666-6666-6666-666666666603');

-- ---------------------------------------------------------------------------
-- Activity Logs
-- ---------------------------------------------------------------------------
insert into gf_activity_logs (actor_id, entity_type, entity_id, action, metadata) values
  ((select id from gf_profiles where email = 'dana@greenflowhvac.com' limit 1), 'job', '44444444-4444-4444-4444-444444444402', 'job.created', '{"title": "Dining area AC not cooling"}'),
  ((select id from gf_profiles where email = 'priya@greenflowhvac.com' limit 1), 'job', '44444444-4444-4444-4444-444444444402', 'job.assigned', '{"technician": "Mike Torres"}'),
  ((select id from gf_profiles where email = 'mike@greenflowhvac.com' limit 1), 'job', '44444444-4444-4444-4444-444444444402', 'job.note_added', '{"note": "Arrived on site. Checked refrigerant levels."}'),
  ((select id from gf_profiles where email = 'alicia@greenflowhvac.com' limit 1), 'job', '44444444-4444-4444-4444-444444444406', 'job.completed', '{"title": "New AC installation"}'),
  ((select id from gf_profiles where email = 'dana@greenflowhvac.com' limit 1), 'estimate', '55555555-5555-5555-5555-555555555501', 'estimate.approved', '{}'),
  ((select id from gf_profiles where email = 'dana@greenflowhvac.com' limit 1), 'invoice', '66666666-6666-6666-6666-666666666601', 'invoice.paid', '{"amount_cents": 445000}');

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------
insert into gf_settings (key, value) values
  ('company_name', '"GreenFlow HVAC"'),
  ('company_address', '"123 Business Park Drive, Springfield, IL 62701"'),
  ('company_phone', '"+1 (555) 000-0000"'),
  ('company_email', '"info@greenflowhvac.com"'),
  ('default_tax_rate', '0.0825')
on conflict (key) do nothing;