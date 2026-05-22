# Pamoja+ — Database Migrations

> Run **in order** in the Supabase SQL Editor. Each migration is idempotent — safe to re-run if you're unsure.

---

## How to apply

1. Open **Supabase Dashboard → SQL Editor → New query**.
2. Open the migration file from this repo (e.g. `supabase/migrations/0001_init.sql`), paste, run.
3. Confirm "Success. No rows returned" (or rows returned for the seed inserts).
4. Move to the next file.

After each migration, the verification snippets below tell you whether it landed.

---

## The migrations

| # | File | What it adds | Verify |
|---|---|---|---|
| 0001 | `0001_init.sql` | Core schema: `sellers`, `seller_applications`, `listings`, `ambassadors`, `referrals`, `revenue_events`, `milestones`, `team_users`. RLS. Seed milestones. | `select count(*) from milestones;` → 8+ |
| 0002 | `0002_control_plane.sql` | Full control plane: permissions, KYC, listing moderation, inquiries, orders, payment_intents, payouts, disputes, notifications, support, ambassador clicks, boosts, spotlights, compliance, audit_log + trigger, analytics_events. Views: `v_seller_health`, `v_ambassador_leaderboard`, `v_attention_queue`, `v_vat_tracker`. | `select count(*) from information_schema.tables where table_schema='public';` → 30+ |
| 0003 | `0003_inquiry_anon_insert.sql` | RLS policy: anyone can insert into `inquiries` (so `/api/inquiry` can log clicks). | `select policyname from pg_policies where tablename='inquiries' and policyname='inquiries_anon_insert';` → 1 row |
| 0004 | `0004_storage_and_kyc_helpers.sql` | Creates **`seller-docs`** private storage bucket. Adds `bump_seller_tier()` RPC. Storage RLS for team. | `select id from storage.buckets where id='seller-docs';` → 1 row |
| 0005 | `0005_listing_autoflag.sql` | Trigger: on listing insert/update, scan for `prohibited_keywords`, queue a pending `listing_reviews` row. | `select tgname from pg_trigger where tgname='trg_listings_autoflag';` → 1 row |
| 0006 | `0006_public_marketplace_view.sql` | Views `v_public_listings` + `v_public_sellers` (only verified + live). | `select count(*) from v_public_listings;` |
| 0007 | `0007_seller_portal.sql` | Adds `sellers.user_id` (links auth.users → sellers). `is_seller_owner()` helper. RLS for seller self-service across sellers / listings / kyc / inquiries / storage. | `select column_name from information_schema.columns where table_name='sellers' and column_name='user_id';` → 1 row |

---

## Full health check (run after applying all 7)

```sql
-- Counts
select 'tables'   as kind, count(*) from information_schema.tables where table_schema='public'
union all
select 'views',         count(*) from information_schema.views  where table_schema='public'
union all
select 'enums',         count(*) from pg_type t join pg_namespace n on n.oid=t.typnamespace where t.typtype='e' and n.nspname='public'
union all
select 'policies',      count(*) from pg_policies where schemaname='public'
union all
select 'milestones',    count(*) from milestones
union all
select 'permissions',   count(*) from permissions
union all
select 'role_perms',    count(*) from role_permissions;

-- Bucket
select id, public from storage.buckets where id = 'seller-docs';

-- Triggers we care about
select tgname from pg_trigger where tgname in (
  'trg_listings_autoflag',
  'trg_sellers_audit',
  'trg_listings_audit',
  'trg_payouts_audit',
  'trg_disputes_audit'
);
```

Expected rough numbers (post-0007):

- `tables` ≥ 30
- `views`  ≥ 6
- `enums`  ≥ 20
- `policies` ≥ 35
- `milestones` = 8 (seeded)
- `permissions` = 18 (seeded)
- `role_permissions` ≥ 40 (seeded)
- `seller-docs` bucket present, `public = false`
- All 5 triggers above present

---

## Bootstrapping the first team member

Migrations are idempotent on schema, but you still need:

1. Create yourself in **Supabase → Authentication → Users → Add user** (email + temporary password, *confirm email*).
2. Run in SQL editor (replace email):
   ```sql
   insert into team_users (id, email, role)
   select id, email, 'founder'
   from auth.users
   where email = 'YOUR_EMAIL@pamojaplus.co.tz';
   ```
3. Sign in at `/login` — you'll land on `/dashboard`.

---

## Bootstrapping a seller test account

So you can exercise the seller portal:

1. Approve at least one application via `/dashboard/applications` (creates a `sellers` row).
2. Note the email on that seller.
3. Supabase → Authentication → Users → Add a user with that **same email**.
4. Visit `/seller/signup` and sign up with the same email + a password — the `claimSellerProfile()` action auto-links `auth.users.id` → `sellers.user_id`.
5. Alternative for an existing user: run
   ```sql
   update sellers set user_id = (select id from auth.users where email = 'seller@example.com')
   where email = 'seller@example.com';
   ```

---

## Naming collisions to know about

`permissions` and `role_permissions` are common table names. If you reuse this Supabase project with another schema that uses them, expect conflicts. (We hit this once and rolled back — see git history.)

---

## Future migrations (planned)

| When | File | Purpose |
|---|---|---|
| Phase 3 | `0008_payment_webhooks.sql` | Provider-specific tables for Selcom/Clickpesa webhook payloads + idempotency keys |
| Phase 3 | `0009_inngest_jobs.sql` | Cron table for scheduled-job tracking (if not using Inngest's own state) |
| Phase 4 | `0010_orders_v2.sql` | Order line-items + multi-item carts when checkout goes live |
