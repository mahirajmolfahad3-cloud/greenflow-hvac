-- ============================================================================
-- GreenFlow HVAC — Employee status, demo role, and invitation support
-- ============================================================================

-- Add 'demo' to the role enum (PostgreSQL doesn't allow removing enum values,
-- so we add it after 'accountant').
alter type gf_role add value 'demo' after 'accountant';

-- Create employee status enum
create type gf_employee_status as enum ('active', 'invited', 'suspended', 'archived');

-- Add status column to gf_profiles (replaces the simple is_active boolean)
alter table gf_profiles
  add column if not exists status gf_employee_status not null default 'active',
  add column if not exists invited_at timestamptz,
  add column if not exists archived_at timestamptz;

-- Keep is_active in sync with status for backward compatibility
create or replace function gf_sync_is_active()
returns trigger as $$
begin
  new.is_active := (new.status = 'active' or new.status = 'invited');
  return new;
end;
$$ language plpgsql;

create trigger gf_profiles_sync_is_active
  before insert or update of status on gf_profiles
  for each row execute function gf_sync_is_active();

-- Demo settings table — stores the demo user UUID so the system knows
-- which account is the demo one (enforces read-only at RLS level).
create table gf_demo_settings (
  id uuid primary key default gen_random_uuid(),
  demo_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index gf_demo_settings_user_idx on gf_demo_settings (demo_user_id);

create trigger gf_demo_settings_set_updated_at
  before update on gf_demo_settings
  for each row execute function gf_set_updated_at();

-- Helper: is the current user the demo user?
create or replace function gf_is_demo_user()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from gf_demo_settings where demo_user_id = auth.uid()
  );
$$;