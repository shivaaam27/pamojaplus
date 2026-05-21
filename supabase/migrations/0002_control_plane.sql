-- =====================================================================
-- Pamoja+ — Control plane (admin, ops, money, trust, compliance)
-- =====================================================================
-- Run AFTER 0001_init.sql. Idempotent: safe to re-run.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- New enums
-- ---------------------------------------------------------------------
do $$ begin create type kyc_doc_kind     as enum ('id_front','id_back','business_licence','selfie','tin_certificate','other'); exception when duplicate_object then null; end $$;
do $$ begin create type kyc_doc_status   as enum ('pending','approved','rejected'); exception when duplicate_object then null; end $$;
do $$ begin create type verify_tier      as enum ('none','bronze','silver','gold'); exception when duplicate_object then null; end $$;
do $$ begin create type mod_status       as enum ('pending','approved','changes_requested','rejected'); exception when duplicate_object then null; end $$;
do $$ begin create type inquiry_channel  as enum ('whatsapp','phone','email','onsite'); exception when duplicate_object then null; end $$;
do $$ begin create type order_status     as enum ('pending','paid','fulfilled','cancelled','refunded','disputed'); exception when duplicate_object then null; end $$;
do $$ begin create type pay_status       as enum ('initiated','succeeded','failed','refunded'); exception when duplicate_object then null; end $$;
do $$ begin create type mmo_provider     as enum ('mpesa','mixx_yas','airtel_money','halopesa','azampesa','tpesa','card','bank','cash'); exception when duplicate_object then null; end $$;
do $$ begin create type payout_status    as enum ('scheduled','approved','paid','failed','on_hold'); exception when duplicate_object then null; end $$;
do $$ begin create type dispute_status   as enum ('open','mediation','resolved_buyer','resolved_seller','escalated','closed'); exception when duplicate_object then null; end $$;
do $$ begin create type notif_channel    as enum ('sms','whatsapp','email','push','inapp'); exception when duplicate_object then null; end $$;
do $$ begin create type notif_status     as enum ('queued','sent','delivered','failed','read'); exception when duplicate_object then null; end $$;
do $$ begin create type ticket_status    as enum ('open','pending','resolved','closed'); exception when duplicate_object then null; end $$;
do $$ begin create type boost_kind       as enum ('deal_day','deal_week','featured_week','social_post','spotlight'); exception when duplicate_object then null; end $$;
do $$ begin create type compliance_kind  as enum ('tmda_term','tbs_required','prohibited','copyright','price_outlier','other'); exception when duplicate_object then null; end $$;
do $$ begin create type dsr_kind         as enum ('access','correction','deletion','portability','objection'); exception when duplicate_object then null; end $$;
do $$ begin create type dsr_status       as enum ('received','verifying','in_progress','fulfilled','rejected'); exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- 1. ROLES & PERMISSIONS (granular RBAC layered on team_users.role)
-- ---------------------------------------------------------------------
create table if not exists permissions (
  key         text primary key,
  description text not null
);

create table if not exists role_permissions (
  role        team_role not null,
  permission  text not null references permissions(key) on delete cascade,
  primary key (role, permission)
);

insert into permissions (key, description) values
  ('sellers.read',         'View sellers and applications'),
  ('sellers.write',        'Create/edit sellers'),
  ('sellers.verify',       'Grant/revoke verified badge & tier'),
  ('listings.read',        'View listings'),
  ('listings.moderate',    'Approve/reject listings'),
  ('inquiries.read',       'View inquiry funnel'),
  ('orders.read',          'View orders'),
  ('orders.refund',        'Issue refunds'),
  ('payouts.approve',      'Approve payout batches'),
  ('disputes.mediate',     'Act as dispute mediator'),
  ('ambassadors.write',    'Manage ambassadors & referrals'),
  ('ambassadors.payout',   'Approve ambassador payouts (with WHT)'),
  ('broadcasts.send',      'Send SMS/WA/Email broadcasts'),
  ('compliance.review',    'Review compliance flags'),
  ('compliance.pdpc',      'Handle PDPC data-subject requests'),
  ('revenue.write',        'Record revenue events'),
  ('audit.read',           'Read the audit log'),
  ('team.write',           'Manage team members & roles')
on conflict (key) do nothing;

-- Default role → permission map
insert into role_permissions (role, permission) values
  ('founder','sellers.read'),('founder','sellers.write'),('founder','sellers.verify'),
  ('founder','listings.read'),('founder','listings.moderate'),
  ('founder','inquiries.read'),('founder','orders.read'),('founder','orders.refund'),
  ('founder','payouts.approve'),('founder','disputes.mediate'),
  ('founder','ambassadors.write'),('founder','ambassadors.payout'),
  ('founder','broadcasts.send'),('founder','compliance.review'),('founder','compliance.pdpc'),
  ('founder','revenue.write'),('founder','audit.read'),('founder','team.write'),

  ('ops','sellers.read'),('ops','sellers.write'),('ops','sellers.verify'),
  ('ops','listings.read'),('ops','listings.moderate'),
  ('ops','inquiries.read'),('ops','orders.read'),
  ('ops','disputes.mediate'),('ops','compliance.review'),

  ('bd','sellers.read'),('bd','sellers.write'),('bd','listings.read'),
  ('bd','inquiries.read'),('bd','ambassadors.write'),

  ('marketing','sellers.read'),('marketing','listings.read'),
  ('marketing','broadcasts.send'),('marketing','ambassadors.write'),

  ('tech','sellers.read'),('tech','listings.read'),('tech','audit.read'),

  ('finance','sellers.read'),('finance','orders.read'),('finance','orders.refund'),
  ('finance','payouts.approve'),('finance','ambassadors.payout'),
  ('finance','revenue.write'),('finance','audit.read')
on conflict do nothing;

-- Helper: does the caller have permission X?
create or replace function has_permission(p text)
returns boolean language sql security definer stable as $$
  select exists (
    select 1
    from team_users tu
    join role_permissions rp on rp.role = tu.role
    where tu.id = auth.uid() and rp.permission = p
  );
$$;

-- ---------------------------------------------------------------------
-- 2. KYC & VERIFICATION
-- ---------------------------------------------------------------------
create table if not exists seller_documents (
  id           uuid primary key default gen_random_uuid(),
  seller_id    uuid not null references sellers(id) on delete cascade,
  kind         kyc_doc_kind not null,
  storage_path text not null,
  status       kyc_doc_status not null default 'pending',
  reviewer_id  uuid references team_users(id),
  review_note  text,
  uploaded_at  timestamptz not null default now(),
  reviewed_at  timestamptz
);
create index if not exists idx_seller_docs_seller on seller_documents(seller_id);
create index if not exists idx_seller_docs_status on seller_documents(status);

alter table sellers add column if not exists tier verify_tier not null default 'none';
alter table sellers add column if not exists tier_granted_at timestamptz;

create table if not exists verification_events (
  id           uuid primary key default gen_random_uuid(),
  seller_id    uuid not null references sellers(id) on delete cascade,
  actor_id     uuid references team_users(id),
  event        text not null,        -- 'badge_granted' | 'badge_revoked' | 'tier_changed' | 'kyc_approved' | 'kyc_rejected'
  from_tier    verify_tier,
  to_tier      verify_tier,
  reason       text,
  at           timestamptz not null default now()
);
create index if not exists idx_ver_events_seller on verification_events(seller_id, at desc);

-- ---------------------------------------------------------------------
-- 3. LISTINGS LIFECYCLE — moderation, flags, edit history
-- ---------------------------------------------------------------------
create table if not exists listing_reviews (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references listings(id) on delete cascade,
  status       mod_status not null default 'pending',
  reviewer_id  uuid references team_users(id),
  note         text,
  created_at   timestamptz not null default now(),
  decided_at   timestamptz
);
create index if not exists idx_listing_rev_status on listing_reviews(status);
create index if not exists idx_listing_rev_listing on listing_reviews(listing_id);

create table if not exists listing_flags (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references listings(id) on delete cascade,
  flagged_by   text not null,        -- 'buyer' | 'auto' | 'team'
  reporter_id  uuid references auth.users(id) on delete set null,
  reason       text not null,
  details      text,
  resolved     boolean not null default false,
  resolved_by  uuid references team_users(id),
  resolved_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists idx_listing_flags_listing on listing_flags(listing_id);
create index if not exists idx_listing_flags_open    on listing_flags(resolved) where resolved = false;

create table if not exists listing_edits (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references listings(id) on delete cascade,
  actor_id     uuid references auth.users(id),
  before       jsonb,
  after        jsonb,
  at           timestamptz not null default now()
);
create index if not exists idx_listing_edits_listing on listing_edits(listing_id, at desc);

-- ---------------------------------------------------------------------
-- 4. ENGAGEMENT (inquiries, saved items, reviews)
-- ---------------------------------------------------------------------
create table if not exists inquiries (
  id              uuid primary key default gen_random_uuid(),
  listing_id      uuid references listings(id) on delete set null,
  seller_id       uuid references sellers(id) on delete set null,
  channel         inquiry_channel not null default 'whatsapp',
  shopper_phone   text,
  shopper_name    text,
  message         text,
  responded       boolean not null default false,
  responded_at    timestamptz,
  converted       boolean not null default false,
  converted_at    timestamptz,
  ambassador_id   uuid references ambassadors(id) on delete set null,
  utm             jsonb,
  created_at      timestamptz not null default now()
);
create index if not exists idx_inquiries_listing on inquiries(listing_id);
create index if not exists idx_inquiries_seller  on inquiries(seller_id, created_at desc);
create index if not exists idx_inquiries_unresp  on inquiries(responded) where responded = false;

create table if not exists saved_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  listing_id  uuid not null references listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, listing_id)
);

create table if not exists reviews (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid not null references listings(id) on delete cascade,
  seller_id     uuid not null references sellers(id) on delete cascade,
  reviewer_id   uuid references auth.users(id) on delete set null,
  rating        smallint not null check (rating between 1 and 5),
  body          text,
  photos        text[] not null default '{}',
  verified_buyer boolean not null default false,
  hidden        boolean not null default false,
  created_at    timestamptz not null default now()
);
create index if not exists idx_reviews_seller on reviews(seller_id, created_at desc);

create table if not exists review_responses (
  id         uuid primary key default gen_random_uuid(),
  review_id  uuid not null unique references reviews(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5. ORDERS, PAYMENTS, PAYOUTS, DISPUTES
-- ---------------------------------------------------------------------
create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  buyer_id      uuid references auth.users(id) on delete set null,
  buyer_phone   text,
  buyer_name    text,
  seller_id     uuid not null references sellers(id) on delete restrict,
  subtotal_tzs  integer not null,
  fees_tzs      integer not null default 0,
  total_tzs     integer not null,
  status        order_status not null default 'pending',
  delivery_addr text,
  notes         text,
  placed_at     timestamptz not null default now(),
  fulfilled_at  timestamptz
);
create index if not exists idx_orders_seller on orders(seller_id, placed_at desc);
create index if not exists idx_orders_status on orders(status);

create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  listing_id  uuid references listings(id) on delete set null,
  title       text not null,
  unit_price_tzs integer not null,
  qty         integer not null default 1
);

create table if not exists payment_intents (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid references orders(id) on delete set null,
  seller_id      uuid references sellers(id) on delete set null,
  purpose        text not null,        -- 'order' | 'subscription' | 'boost' | 'spotlight'
  provider       text not null,        -- 'selcom' | 'clickpesa' | 'pesapal' | 'flutterwave' | 'manual'
  mmo            mmo_provider,
  amount_tzs     integer not null,
  fee_tzs        integer not null default 0,
  status         pay_status not null default 'initiated',
  provider_ref   text,
  raw_payload    jsonb,
  created_at     timestamptz not null default now(),
  settled_at     timestamptz
);
create index if not exists idx_pi_order on payment_intents(order_id);
create index if not exists idx_pi_status on payment_intents(status);
create index if not exists idx_pi_provider_ref on payment_intents(provider_ref);

create table if not exists payouts (
  id             uuid primary key default gen_random_uuid(),
  seller_id      uuid references sellers(id) on delete set null,
  ambassador_id  uuid references ambassadors(id) on delete set null,
  gross_tzs      integer not null,
  wht_tzs        integer not null default 0,    -- withholding tax (TRA)
  fees_tzs       integer not null default 0,
  net_tzs        integer not null,
  status         payout_status not null default 'scheduled',
  scheduled_for  date,
  approved_by    uuid references team_users(id),
  approved_at    timestamptz,
  paid_at        timestamptz,
  mmo            mmo_provider,
  mmo_ref        text,
  note           text,
  created_at     timestamptz not null default now(),
  check (seller_id is not null or ambassador_id is not null)
);
create index if not exists idx_payouts_status on payouts(status);
create index if not exists idx_payouts_seller on payouts(seller_id);
create index if not exists idx_payouts_amb    on payouts(ambassador_id);

create table if not exists disputes (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  opened_by    text not null,             -- 'buyer' | 'seller' | 'team'
  reason       text not null,
  status       dispute_status not null default 'open',
  mediator_id  uuid references team_users(id),
  resolution   text,
  opened_at    timestamptz not null default now(),
  resolved_at  timestamptz,
  sla_due_at   timestamptz                 -- ops SLA timer
);
create index if not exists idx_disputes_status on disputes(status);
create index if not exists idx_disputes_sla on disputes(sla_due_at) where status in ('open','mediation');

create table if not exists dispute_messages (
  id          uuid primary key default gen_random_uuid(),
  dispute_id  uuid not null references disputes(id) on delete cascade,
  author      text not null,                -- 'buyer' | 'seller' | 'team'
  author_id   uuid references auth.users(id),
  body        text not null,
  attachments text[] not null default '{}',
  at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 6. COMMUNICATIONS (notifications, templates, support inbox)
-- ---------------------------------------------------------------------
create table if not exists notification_templates (
  id           uuid primary key default gen_random_uuid(),
  key          text not null,                -- e.g. 'inquiry_received'
  channel      notif_channel not null,
  locale       text not null default 'en',   -- 'en' | 'sw'
  subject      text,
  body         text not null,
  version      integer not null default 1,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  unique (key, channel, locale, version)
);

create table if not exists notifications (
  id           uuid primary key default gen_random_uuid(),
  template_key text,
  channel      notif_channel not null,
  recipient    text not null,                -- phone / email / user id
  user_id      uuid references auth.users(id) on delete set null,
  payload      jsonb,
  status       notif_status not null default 'queued',
  provider     text,                         -- 'beem' | 'resend' | '360dialog'
  provider_ref text,
  error        text,
  queued_at    timestamptz not null default now(),
  sent_at      timestamptz,
  delivered_at timestamptz
);
create index if not exists idx_notifs_status on notifications(status);
create index if not exists idx_notifs_recipient on notifications(recipient, queued_at desc);

create table if not exists broadcasts (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  channel      notif_channel not null,
  template_id  uuid references notification_templates(id),
  segment      jsonb not null,               -- filter spec: plan, city, tier, etc.
  scheduled_at timestamptz,
  sent_at      timestamptz,
  sent_count   integer not null default 0,
  created_by   uuid references team_users(id),
  created_at   timestamptz not null default now()
);

create table if not exists support_tickets (
  id           uuid primary key default gen_random_uuid(),
  subject      text not null,
  status       ticket_status not null default 'open',
  channel      notif_channel,
  seller_id    uuid references sellers(id) on delete set null,
  user_id      uuid references auth.users(id) on delete set null,
  order_id     uuid references orders(id) on delete set null,
  assignee_id  uuid references team_users(id),
  priority     smallint not null default 3,  -- 1=urgent, 5=low
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_tickets_status on support_tickets(status);

create table if not exists support_messages (
  id           uuid primary key default gen_random_uuid(),
  ticket_id    uuid not null references support_tickets(id) on delete cascade,
  author       text not null,                -- 'team' | 'user' | 'seller' | 'system'
  author_id    uuid references auth.users(id),
  body         text not null,
  attachments  text[] not null default '{}',
  at           timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 7. AMBASSADOR EXTENSIONS (attribution, tiers, payouts already above)
-- ---------------------------------------------------------------------
create table if not exists ambassador_clicks (
  id            uuid primary key default gen_random_uuid(),
  ambassador_id uuid not null references ambassadors(id) on delete cascade,
  ref_code      text not null,
  path          text,
  ip_hash       text,
  user_agent    text,
  at            timestamptz not null default now()
);
create index if not exists idx_amb_clicks_amb on ambassador_clicks(ambassador_id, at desc);

alter table ambassadors add column if not exists tier verify_tier not null default 'bronze';
alter table ambassadors add column if not exists email text;
alter table ambassadors add column if not exists region text;

-- ---------------------------------------------------------------------
-- 8. COMMERCE OPS (boosts, spotlights, campaigns)
-- ---------------------------------------------------------------------
create table if not exists boosts (
  id            uuid primary key default gen_random_uuid(),
  seller_id     uuid not null references sellers(id) on delete cascade,
  listing_id    uuid references listings(id) on delete set null,
  kind          boost_kind not null,
  price_tzs     integer not null,
  starts_at     timestamptz not null,
  ends_at       timestamptz not null,
  payment_id    uuid references payment_intents(id),
  created_at    timestamptz not null default now()
);
create index if not exists idx_boosts_window on boosts(starts_at, ends_at);
create index if not exists idx_boosts_seller on boosts(seller_id);

create table if not exists spotlights (
  id            uuid primary key default gen_random_uuid(),
  seller_id     uuid not null references sellers(id) on delete cascade,
  starts_on     date not null,
  ends_on       date not null,
  price_tzs     integer not null,
  deliverables  jsonb,                       -- {brand_story:false, social_posts:0/3, homepage:false}
  payment_id    uuid references payment_intents(id),
  created_at    timestamptz not null default now()
);

create table if not exists campaigns (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  kind          text not null,               -- 'launch' | 'seasonal' | 'partner'
  starts_on     date,
  ends_on       date,
  budget_tzs    integer,
  attributed_signups integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 9. COMPLIANCE (TMDA/TBS/PDPC)
-- ---------------------------------------------------------------------
create table if not exists prohibited_keywords (
  id            uuid primary key default gen_random_uuid(),
  term          text not null unique,
  kind          compliance_kind not null,
  note          text,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);
insert into prohibited_keywords (term, kind, note) values
  ('cures',    'tmda_term',  'Medical claim — requires TMDA review'),
  ('treats',   'tmda_term',  'Medical claim — requires TMDA review'),
  ('heals',    'tmda_term',  'Medical claim — requires TMDA review'),
  ('weight loss', 'tmda_term','Supplement claim — TMDA review'),
  ('FDA approved','tmda_term','False jurisdiction claim'),
  ('counterfeit','prohibited','Counterfeit goods not allowed'),
  ('firearm',  'prohibited', 'Weapons not allowed')
on conflict (term) do nothing;

create table if not exists compliance_flags (
  id            uuid primary key default gen_random_uuid(),
  entity_table  text not null,                -- 'listings' | 'sellers' | 'reviews'
  entity_id     uuid not null,
  kind          compliance_kind not null,
  detail        text,
  source        text not null,                -- 'auto' | 'team' | 'buyer'
  status        text not null default 'open', -- 'open' | 'cleared' | 'action_taken'
  reviewer_id   uuid references team_users(id),
  resolved_at   timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists idx_compflags_entity on compliance_flags(entity_table, entity_id);
create index if not exists idx_compflags_open on compliance_flags(status) where status = 'open';

create table if not exists data_subject_requests (
  id           uuid primary key default gen_random_uuid(),
  requester_email text not null,
  requester_phone text,
  kind         dsr_kind not null,
  status       dsr_status not null default 'received',
  notes        text,
  due_by       date,                          -- PDPC 30-day default
  handled_by   uuid references team_users(id),
  created_at   timestamptz not null default now(),
  closed_at    timestamptz
);
create index if not exists idx_dsr_status on data_subject_requests(status);

create table if not exists consent_log (
  id           uuid primary key default gen_random_uuid(),
  subject      text not null,                 -- email/phone/user_id
  purpose      text not null,                 -- 'marketing' | 'cookies_analytics' | 'tos'
  granted      boolean not null,
  source       text,                          -- 'signup_form' | 'cookie_banner'
  ip_hash      text,
  at           timestamptz not null default now()
);

-- VAT-threshold tracker view (rolling 12 months)
create or replace view v_vat_tracker as
  select
    coalesce(sum(amount_tzs) filter (where recorded_at > now() - interval '12 months'), 0) as last_12m_tzs,
    200000000::bigint as threshold_tzs
  from revenue_events;

-- ---------------------------------------------------------------------
-- 10. OBSERVABILITY — audit log + analytics events
-- ---------------------------------------------------------------------
create table if not exists audit_log (
  id           bigserial primary key,
  actor_id     uuid,
  actor_email  text,
  action       text not null,                 -- 'insert' | 'update' | 'delete' | custom
  entity_table text not null,
  entity_id    text,
  before       jsonb,
  after        jsonb,
  ip           inet,
  at           timestamptz not null default now()
);
create index if not exists idx_audit_entity on audit_log(entity_table, entity_id);
create index if not exists idx_audit_actor on audit_log(actor_id, at desc);
create index if not exists idx_audit_at on audit_log(at desc);

-- Generic audit trigger — attach to any table with a uuid id
create or replace function audit_row_change()
returns trigger language plpgsql security definer as $$
declare
  v_actor uuid := nullif(current_setting('request.jwt.claims', true)::jsonb->>'sub','')::uuid;
  v_email text := nullif(current_setting('request.jwt.claims', true)::jsonb->>'email','');
begin
  if (tg_op = 'DELETE') then
    insert into audit_log(actor_id, actor_email, action, entity_table, entity_id, before)
    values (v_actor, v_email, 'delete', tg_table_name, (row_to_json(old)->>'id'), to_jsonb(old));
    return old;
  elsif (tg_op = 'UPDATE') then
    insert into audit_log(actor_id, actor_email, action, entity_table, entity_id, before, after)
    values (v_actor, v_email, 'update', tg_table_name, (row_to_json(new)->>'id'), to_jsonb(old), to_jsonb(new));
    return new;
  elsif (tg_op = 'INSERT') then
    insert into audit_log(actor_id, actor_email, action, entity_table, entity_id, after)
    values (v_actor, v_email, 'insert', tg_table_name, (row_to_json(new)->>'id'), to_jsonb(new));
    return new;
  end if;
  return null;
end $$;

-- Attach to high-value tables
do $$
declare t text;
begin
  for t in select unnest(array[
    'sellers','listings','seller_documents','listing_reviews',
    'payouts','disputes','revenue_events','team_users',
    'broadcasts','data_subject_requests'
  ]) loop
    execute format('drop trigger if exists trg_%I_audit on %I', t, t);
    execute format('create trigger trg_%I_audit after insert or update or delete on %I for each row execute function audit_row_change()', t, t);
  end loop;
end $$;

create table if not exists analytics_events (
  id           bigserial primary key,
  name         text not null,                 -- 'page_view' | 'inquiry_click' | 'apply_submit'
  user_id      uuid,
  session_id   text,
  props        jsonb,
  url          text,
  referrer     text,
  at           timestamptz not null default now()
);
create index if not exists idx_analytics_name_at on analytics_events(name, at desc);
create index if not exists idx_analytics_session on analytics_events(session_id);

-- ---------------------------------------------------------------------
-- 11. ROW-LEVEL SECURITY for all new tables
-- ---------------------------------------------------------------------
alter table permissions             enable row level security;
alter table role_permissions        enable row level security;
alter table seller_documents        enable row level security;
alter table verification_events     enable row level security;
alter table listing_reviews         enable row level security;
alter table listing_flags           enable row level security;
alter table listing_edits           enable row level security;
alter table inquiries               enable row level security;
alter table saved_items             enable row level security;
alter table reviews                 enable row level security;
alter table review_responses        enable row level security;
alter table orders                  enable row level security;
alter table order_items             enable row level security;
alter table payment_intents         enable row level security;
alter table payouts                 enable row level security;
alter table disputes                enable row level security;
alter table dispute_messages        enable row level security;
alter table notification_templates  enable row level security;
alter table notifications           enable row level security;
alter table broadcasts              enable row level security;
alter table support_tickets         enable row level security;
alter table support_messages        enable row level security;
alter table ambassador_clicks       enable row level security;
alter table boosts                  enable row level security;
alter table spotlights              enable row level security;
alter table campaigns               enable row level security;
alter table prohibited_keywords     enable row level security;
alter table compliance_flags        enable row level security;
alter table data_subject_requests   enable row level security;
alter table consent_log             enable row level security;
alter table audit_log               enable row level security;
alter table analytics_events        enable row level security;

-- Team-readable static refs
drop policy if exists perms_team_read on permissions;
create policy perms_team_read on permissions for select using (is_team_member());
drop policy if exists rp_team_read on role_permissions;
create policy rp_team_read on role_permissions for select using (is_team_member());

-- Team-only operational tables (one shared policy where granular perms not yet needed)
do $$
declare t text;
begin
  for t in select unnest(array[
    'seller_documents','verification_events','listing_reviews','listing_flags','listing_edits',
    'inquiries','reviews','review_responses','orders','order_items','payment_intents',
    'disputes','dispute_messages','notification_templates','notifications','broadcasts',
    'support_tickets','support_messages','ambassador_clicks','boosts','spotlights','campaigns',
    'prohibited_keywords','compliance_flags','data_subject_requests','consent_log','analytics_events'
  ]) loop
    execute format('drop policy if exists %I_team_all on %I', t, t);
    execute format($f$create policy %I_team_all on %I for all using (is_team_member()) with check (is_team_member())$f$, t, t);
  end loop;
end $$;

-- Saved items: each user manages their own
drop policy if exists saved_self on saved_items;
create policy saved_self on saved_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Payouts: read by team; only finance/founder can approve
drop policy if exists payouts_read_team on payouts;
create policy payouts_read_team on payouts for select using (is_team_member());
drop policy if exists payouts_write_finance on payouts;
create policy payouts_write_finance on payouts for all
  using (has_permission('payouts.approve') or has_permission('ambassadors.payout'))
  with check (has_permission('payouts.approve') or has_permission('ambassadors.payout'));

-- Audit log: read only, by audit.read permission
drop policy if exists audit_read on audit_log;
create policy audit_read on audit_log for select using (has_permission('audit.read'));

-- =====================================================================
-- 12. HELPFUL VIEWS for the admin UI
-- =====================================================================
create or replace view v_seller_health as
  select
    s.id,
    s.business_name,
    s.plan,
    s.verified,
    s.tier,
    (select count(*) from listings l where l.seller_id = s.id and l.status = 'live') as live_listings,
    (select count(*) from inquiries i where i.seller_id = s.id and i.created_at > now() - interval '30 days') as inquiries_30d,
    (select count(*) from inquiries i where i.seller_id = s.id and i.responded and i.created_at > now() - interval '30 days') as responded_30d,
    (select coalesce(avg(rating)::numeric(3,2), null) from reviews r where r.seller_id = s.id and not r.hidden) as avg_rating,
    (select coalesce(sum(amount_tzs),0) from revenue_events re where re.seller_id = s.id and re.recorded_at > now() - interval '90 days') as revenue_90d_tzs
  from sellers s;

create or replace view v_ambassador_leaderboard as
  select
    a.id, a.name, a.tier, a.referral_code,
    (select count(*) from referrals r where r.ambassador_id = a.id and r.status in ('joined_free','joined_paid')) as signups,
    (select count(*) from referrals r where r.ambassador_id = a.id and r.status = 'joined_paid') as paid_signups,
    (select count(*) from ambassador_clicks c where c.ambassador_id = a.id and c.at > now() - interval '30 days') as clicks_30d,
    (select coalesce(sum(net_tzs),0) from payouts p where p.ambassador_id = a.id and p.status = 'paid') as paid_total_tzs
  from ambassadors a;

create or replace view v_attention_queue as
  -- Anything an ops human should look at today
  select 'kyc' as kind, sd.id as ref, sd.seller_id as seller_id, sd.uploaded_at as at, 'KYC document pending review' as label
  from seller_documents sd where sd.status = 'pending'
  union all
  select 'listing_mod', lr.id, l.seller_id, lr.created_at, 'Listing awaiting moderation'
  from listing_reviews lr join listings l on l.id = lr.listing_id where lr.status = 'pending'
  union all
  select 'flag', lf.id, l.seller_id, lf.created_at, 'Open listing flag: ' || lf.reason
  from listing_flags lf join listings l on l.id = lf.listing_id where not lf.resolved
  union all
  select 'dispute', d.id, o.seller_id, d.opened_at, 'Open dispute: ' || d.reason
  from disputes d join orders o on o.id = d.order_id where d.status in ('open','mediation')
  union all
  select 'compliance', cf.id, null, cf.created_at, 'Compliance flag: ' || cf.kind::text
  from compliance_flags cf where cf.status = 'open'
  union all
  select 'unresponsive', i.id, i.seller_id, i.created_at, 'Inquiry unanswered > 48h'
  from inquiries i where not i.responded and i.created_at < now() - interval '48 hours';

-- =====================================================================
-- Done.
-- =====================================================================
