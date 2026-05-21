-- =====================================================================
-- Pamoja+ — Initial schema
-- =====================================================================
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- =====================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
do $$ begin
  create type seller_plan as enum ('free', 'growth', 'plus', 'partner');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_status as enum ('draft', 'live', 'expired', 'removed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ambassador_type as enum ('digital', 'field', 'campus');
exception when duplicate_object then null; end $$;

do $$ begin
  create type referral_status as enum ('pending', 'joined_free', 'joined_paid', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type revenue_type as enum ('subscription', 'boost', 'spotlight', 'commission');
exception when duplicate_object then null; end $$;

do $$ begin
  create type team_role as enum ('founder', 'ops', 'bd', 'marketing', 'tech', 'finance');
exception when duplicate_object then null; end $$;

do $$ begin
  create type seller_application_status as enum ('new', 'reviewing', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Sellers
-- ---------------------------------------------------------------------
create table if not exists sellers (
  id              uuid primary key default gen_random_uuid(),
  business_name   text not null,
  owner_name      text,
  phone           text,
  whatsapp        text,
  email           text,
  location        text,
  category        text,
  plan            seller_plan not null default 'free',
  verified        boolean not null default false,
  response_rate   numeric(5,2),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_sellers_category on sellers(category);
create index if not exists idx_sellers_plan on sellers(plan);
create index if not exists idx_sellers_verified on sellers(verified);

-- Public seller-application table (writeable by anyone via the apply form,
-- separate from `sellers` which only admins manage)
create table if not exists seller_applications (
  id              uuid primary key default gen_random_uuid(),
  business_name   text not null,
  owner_name      text not null,
  whatsapp        text not null,
  email           text,
  category        text not null,
  location        text not null,
  description     text not null,
  socials         text,
  status          seller_application_status not null default 'new',
  created_at      timestamptz not null default now()
);
create index if not exists idx_seller_apps_status on seller_applications(status);
create index if not exists idx_seller_apps_created on seller_applications(created_at desc);

-- ---------------------------------------------------------------------
-- Listings
-- ---------------------------------------------------------------------
create table if not exists listings (
  id              uuid primary key default gen_random_uuid(),
  seller_id       uuid not null references sellers(id) on delete cascade,
  title           text not null,
  description     text,
  price_tzs       integer,
  photos          text[] not null default '{}',
  deal_type       text not null default 'standard',
  deal_expires_at timestamptz,
  status          listing_status not null default 'draft',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_listings_seller on listings(seller_id);
create index if not exists idx_listings_status on listings(status);

-- ---------------------------------------------------------------------
-- Ambassadors & referrals
-- ---------------------------------------------------------------------
create table if not exists ambassadors (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  type            ambassador_type not null default 'digital',
  phone           text,
  referral_code   text not null unique,
  active          boolean not null default true,
  joined_at       timestamptz not null default now()
);

create table if not exists referrals (
  id              uuid primary key default gen_random_uuid(),
  ambassador_id   uuid not null references ambassadors(id) on delete cascade,
  seller_id       uuid references sellers(id) on delete set null,
  shopper_phone   text,
  status          referral_status not null default 'pending',
  reward_tzs      integer not null default 0,
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists idx_referrals_ambassador on referrals(ambassador_id);
create index if not exists idx_referrals_status on referrals(status);

-- ---------------------------------------------------------------------
-- Revenue events
-- ---------------------------------------------------------------------
create table if not exists revenue_events (
  id              uuid primary key default gen_random_uuid(),
  seller_id       uuid references sellers(id) on delete set null,
  type            revenue_type not null,
  amount_tzs      integer not null,
  period_start    date,
  period_end      date,
  mobile_money_ref text,
  recorded_at     timestamptz not null default now()
);
create index if not exists idx_revenue_seller on revenue_events(seller_id);
create index if not exists idx_revenue_recorded on revenue_events(recorded_at desc);

-- ---------------------------------------------------------------------
-- Milestones (public)
-- ---------------------------------------------------------------------
create table if not exists milestones (
  id              uuid primary key default gen_random_uuid(),
  date            date not null,
  title           text not null,
  description     text,
  icon            text not null default 'star',
  featured        boolean not null default false,
  public          boolean not null default true,
  created_at      timestamptz not null default now()
);
create index if not exists idx_milestones_public on milestones(public);
create index if not exists idx_milestones_date on milestones(date desc);

-- Seed initial milestones
insert into milestones (date, title, description, icon, featured) values
  ('2026-01-15', 'Pamoja+ Concept Locked',     'Brand, mission, and 3-month plan signed off.',                 'star',   true),
  ('2026-02-01', 'Company Registered',         'BRELA incorporation + TIN obtained.',                          'check',  false),
  ('2026-02-10', 'Mobile Money Live',          'M-Pesa, Mixx by Yas, Airtel Money merchant accounts active.',  'money',  false),
  ('2026-02-20', 'First 10 Sellers',           'First verified businesses onboarded in Dar es Salaam.',        'users',  true),
  ('2026-03-05', 'Soft Launch on Social',      'First Deal of the Day series live.',                            'rocket', false),
  ('2026-03-20', '5 Ambassadors Active',       'Referral pilot generating first leads.',                        'users',  false),
  ('2026-04-10', 'First Paid Subscription',    'Pamoja Growth plan activated.',                                 'money',  true),
  ('2026-04-25', 'First Brand Spotlight',      'Sponsored campaign signed with a wellness brand.',              'trophy', true)
on conflict do nothing;

-- ---------------------------------------------------------------------
-- Team users (links to auth.users)
-- ---------------------------------------------------------------------
create table if not exists team_users (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null unique,
  role            team_role not null default 'ops',
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_sellers_updated on sellers;
create trigger trg_sellers_updated  before update on sellers  for each row execute function set_updated_at();
drop trigger if exists trg_listings_updated on listings;
create trigger trg_listings_updated before update on listings for each row execute function set_updated_at();

-- =====================================================================
-- Row-Level Security
-- =====================================================================
alter table sellers              enable row level security;
alter table seller_applications  enable row level security;
alter table listings             enable row level security;
alter table ambassadors          enable row level security;
alter table referrals            enable row level security;
alter table revenue_events       enable row level security;
alter table milestones           enable row level security;
alter table team_users           enable row level security;

-- Helper: is the caller a team member?
create or replace function is_team_member()
returns boolean language sql security definer stable as $$
  select exists(select 1 from team_users where id = auth.uid());
$$;

-- Helper: is the caller a founder?
create or replace function is_founder()
returns boolean language sql security definer stable as $$
  select exists(select 1 from team_users where id = auth.uid() and role = 'founder');
$$;

-- ---------------------------------------------------------------------
-- Milestones — public can read public ones, team can do everything
-- ---------------------------------------------------------------------
drop policy if exists milestones_select_public on milestones;
create policy milestones_select_public on milestones
  for select using (public = true or is_team_member());

drop policy if exists milestones_team_write on milestones;
create policy milestones_team_write on milestones
  for all using (is_team_member()) with check (is_team_member());

-- ---------------------------------------------------------------------
-- Seller applications — anyone can INSERT, only team can read/update
-- (this is what powers the public /sellers/apply form)
-- ---------------------------------------------------------------------
drop policy if exists seller_apps_insert_anon on seller_applications;
create policy seller_apps_insert_anon on seller_applications
  for insert with check (true);

drop policy if exists seller_apps_team_read on seller_applications;
create policy seller_apps_team_read on seller_applications
  for select using (is_team_member());

drop policy if exists seller_apps_team_update on seller_applications;
create policy seller_apps_team_update on seller_applications
  for update using (is_team_member()) with check (is_team_member());

-- ---------------------------------------------------------------------
-- Sellers (verified business directory) — public can read verified only
-- ---------------------------------------------------------------------
drop policy if exists sellers_select_public on sellers;
create policy sellers_select_public on sellers
  for select using (verified = true or is_team_member());

drop policy if exists sellers_team_write on sellers;
create policy sellers_team_write on sellers
  for all using (is_team_member()) with check (is_team_member());

-- ---------------------------------------------------------------------
-- Listings — public can read live ones from verified sellers
-- ---------------------------------------------------------------------
drop policy if exists listings_select_public on listings;
create policy listings_select_public on listings
  for select using (
    (status = 'live' and exists (select 1 from sellers s where s.id = seller_id and s.verified = true))
    or is_team_member()
  );

drop policy if exists listings_team_write on listings;
create policy listings_team_write on listings
  for all using (is_team_member()) with check (is_team_member());

-- ---------------------------------------------------------------------
-- Internal-only tables — team can read; founders only can write revenue
-- ---------------------------------------------------------------------
drop policy if exists ambassadors_team on ambassadors;
create policy ambassadors_team on ambassadors
  for all using (is_team_member()) with check (is_team_member());

drop policy if exists referrals_team on referrals;
create policy referrals_team on referrals
  for all using (is_team_member()) with check (is_team_member());

drop policy if exists revenue_select on revenue_events;
create policy revenue_select on revenue_events
  for select using (is_team_member());

drop policy if exists revenue_write_founders on revenue_events;
create policy revenue_write_founders on revenue_events
  for all using (is_founder() or exists(select 1 from team_users where id = auth.uid() and role = 'finance'))
       with check (is_founder() or exists(select 1 from team_users where id = auth.uid() and role = 'finance'));

drop policy if exists team_users_self_read on team_users;
create policy team_users_self_read on team_users
  for select using (auth.uid() = id or is_founder());

drop policy if exists team_users_founder_write on team_users;
create policy team_users_founder_write on team_users
  for all using (is_founder()) with check (is_founder());

-- =====================================================================
-- Done.
-- =====================================================================
