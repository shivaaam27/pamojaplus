# Pamoja+ — System Architecture

> Revision 3 (post seller-portal + marketplace launch).
> Companion docs: [MIGRATIONS.md](./MIGRATIONS.md) · [ROUTES.md](./ROUTES.md) · [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md) · [ENV.md](./ENV.md) · [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)

---

## 1. Goals

The system has **five jobs**, prioritized:

1. **Show the world what Pamoja+ is** — public landing, brand story, seller signup.
2. **Be a real marketplace surface** — verified sellers' listings, with WhatsApp inquiry funnel and ambassador attribution.
3. **Let sellers operate themselves** — self-serve KYC, listings, inquiry replies, profile.
4. **Give the team a control plane** — onboarding, moderation, payouts, disputes, compliance, audit, broadcasts.
5. **Be auditable and compliant** — every state change logged; PDPC DSRs handled; VAT threshold tracked.

The system is **not** a full checkout marketplace at launch. Buyer transactions stay on WhatsApp during Phase 1–2. Checkout (orders + payment intents + disputes from real orders) is Phase 3.

---

## 2. Architecture Overview

```
                              BROWSER (mobile-first)
                                       │
                              ┌────────▼────────┐
                              │ Next.js 14 App  │
                              │ (Vercel Edge)   │
                              └────────┬────────┘
                                       │
       ┌───────────────┬───────────────┼───────────────┬─────────────┐
       │               │               │               │             │
  ┌────▼─────┐   ┌─────▼─────┐   ┌─────▼──────┐   ┌────▼────┐   ┌────▼────┐
  │  Public  │   │ Marketplace│   │  Seller    │   │  Ops    │   │   API   │
  │  pages   │   │  /s, /m... │   │ portal     │   │ /dash.. │   │ /api/.. │
  └──────────┘   └────────────┘   └────────────┘   └────┬────┘   └────┬────┘
                                                       │            │
                                       ┌───────────────┴────────────┘
                                       │
                                ┌──────▼─────────┐
                                │   Supabase     │
                                │  Postgres +    │
                                │  Auth + Storage│
                                │  + RLS         │
                                └──────┬─────────┘
                                       │
              ┌────────────────────────┼─────────────────────────┐
              │                        │                         │
        ┌─────▼──────┐         ┌───────▼────────┐        ┌───────▼────────┐
        │  audit_log │         │ v_attention_q  │        │ Background     │
        │  (trigger) │         │ + health views │        │ (Inngest, P3)  │
        └────────────┘         └────────────────┘        └────────────────┘
```

### Phases

| Phase | Status | Scope |
|---|---|---|
| 1. Internal control plane | ✅ Shipped | Schema, RLS, ops dashboard, audit, attention queue |
| 2. Marketplace + seller self-service | ✅ Shipped | Public listings, seller portal, KYC self-upload, inquiry tracking, ambassador attribution |
| 3. Real money + delivery wiring | ◯ Planned | Aggregator (Selcom/Clickpesa) webhooks → `payment_intents` → revenue auto-write; Beem SMS + 360dialog WhatsApp + Resend email workers draining `notifications`; Inngest jobs (payouts batch, expiry sweep, VAT alert) |
| 4. Multi-city + ratings + live | ◯ Planned | Arusha/Mwanza expansion, verified-buyer reviews, live shopping, group-buy |

---

## 3. Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 App Router | RSC for low JS payload; route groups |
| Language | TypeScript (strict) | Catch errors early |
| Styling | Tailwind CSS 3.4+ | Token-driven from `brand/tokens.json` |
| Animation | Framer Motion | Fluid, layout-aware |
| Icons | Lucide React | Clean, tree-shaken |
| Charts | Recharts | Simple, themable, SSR-friendly with `'use client'` boundary |
| Forms | React Hook Form + Zod (when needed) | Typed validation; most current forms use server actions directly |
| Auth | Supabase Auth (`@supabase/ssr`) | Cohesive with DB; cookie-based SSR session |
| DB | Supabase Postgres | RLS, triggers, views, RPC |
| Storage | Supabase Storage (`seller-docs` private bucket) | Signed URLs for ops, scoped uploads for sellers |
| Background jobs | Inngest (planned Phase 3) | Retries, scheduling, observability |
| Email | Resend (planned Phase 3) | Cheap, modern, EU/US POPs |
| SMS | Beem Africa (planned Phase 3) | TZ-native, cheap bulk |
| WhatsApp | 360dialog (planned Phase 3) | Lower fees than Twilio for TZ |
| BI | Metabase (planned) | Self-host on top of Postgres read replica |
| Error monitoring | Sentry (planned) | Standard |
| Product analytics | PostHog (planned) | Events + feature flags |
| Hosting | Vercel | Preview deploys, edge runtime |

---

## 4. Data model snapshot

See [MIGRATIONS.md](./MIGRATIONS.md) for the authoritative order and per-table details. High-level groupings:

### Identity & RBAC
`team_users` (links to `auth.users`), `permissions`, `role_permissions`. Helper functions: `is_team_member()`, `is_founder()`, `is_seller_owner(uuid)`, `has_permission(text)`.

### Seller pipeline
`seller_applications` (public anon insert) → `sellers` (ops-managed; `user_id` links to auth) → `seller_documents` (KYC) → `verification_events` (audit) → `sellers.tier` (`none | bronze | silver | gold`).

### Listings
`listings` (status: `draft | live | expired | removed`) → `listing_reviews` (auto-queued by trigger) → `listing_flags` + `compliance_flags` (auto from `prohibited_keywords`). `listing_edits` (jsonb before/after for diff).

### Engagement
`inquiries` (anonymous insert via `/api/inquiry`; seller/team can update `responded`/`converted`) → `saved_items` (planned), `reviews` + `review_responses` (planned).

### Commerce (Phase 3)
`orders` + `order_items` → `payment_intents` (provider webhook lands here) → `revenue_events` (manual today; auto from webhook later) → `payouts` (with WHT). `disputes` + `dispute_messages` with SLA timer.

### Communications
`notification_templates` + `notifications` (queue). `broadcasts` (segment + send → fan-out into `notifications`). `support_tickets` + `support_messages` (planned).

### Growth
`ambassadors` + `ambassador_clicks` + `referrals`. `boosts` + `spotlights` + `campaigns` (Phase 3 with checkout).

### Compliance
`prohibited_keywords` (seeded with TMDA terms), `compliance_flags`, `data_subject_requests` (PDPC), `consent_log`.

### Observability
`audit_log` + generic `audit_row_change()` trigger attached to high-value tables. `analytics_events` (PostHog mirror, planned).

### Views
- `v_attention_queue` — unified ops inbox (KYC, mod, flags, disputes, compliance, stale inquiries)
- `v_seller_health` — per-seller KPIs
- `v_ambassador_leaderboard` — signup/click funnel
- `v_vat_tracker` — rolling 12-month gross vs TZS 200M
- `v_public_listings` — verified + live, used by `/marketplace`
- `v_public_sellers` — verified, used by `/s/[id]`

---

## 5. Route surfaces

See [ROUTES.md](./ROUTES.md) for the complete map. Short version:

| Surface | Path prefix | Auth |
|---|---|---|
| Public site | `/`, `/about`, `/journey`, `/pricing`, `/team`, `/contact`, `/legal/*`, `/present/*`, `/achievements`, `/sellers/apply` | None |
| Marketplace | `/marketplace`, `/marketplace/[id]`, `/s/[id]` | None |
| API | `/api/inquiry`, `/r/[code]` | None |
| Seller portal | `/seller/*` (except `/seller/login`, `/seller/signup`) | Supabase Auth |
| Ops dashboard | `/dashboard/*` | Supabase Auth + RLS gated by `team_users` row |
| Sign-in | `/login`, `/seller/login`, `/seller/signup` | None |

`web/middleware.ts` enforces session presence; **RLS in Postgres** is the real authorization layer — front-end gates exist only for UX.

---

## 6. Component system

### Primitives (`components/ui/`)
`Button`, `Card`, `Badge`, `Container`, `Section`.

### Brand (`components/brand/`)
`Logo`, `StarSpark`.

### Layout (`components/layout/`)
`SiteHeader`, `SiteFooter`, `DashboardShell` (ops sidebar), `SellerShell` (seller sidebar).

### Admin (`components/admin/`)
`PageHeader`, `EmptyState`, `ScaffoldPage` (TBD-page template).

### Marketplace (`components/marketplace/`)
`ListingCard`.

### Listing (`components/listing/`)
`InquireButton` — wraps `/api/inquiry?seller=&listing=&ref=` so any product card can become an attributed lead.

### Motion principles
- 200–400ms cubic-bezier(0.22, 1, 0.36, 1)
- Stagger on lists
- `whileHover={{ y: -4 }}` on cards
- Respect `prefers-reduced-motion`

---

## 7. Folder structure

```
pamojaplus/
├── brand/
│   └── tokens.json            # colors, fonts, radii, motion
├── docs/
│   ├── SYSTEM_ARCHITECTURE.md (this file)
│   ├── IMPLEMENTATION_PLAN.md
│   ├── MIGRATIONS.md
│   ├── ROUTES.md
│   ├── ENV.md
│   └── OPERATIONS_RUNBOOK.md
├── supabase/
│   └── migrations/
│       ├── 0001_init.sql
│       ├── 0002_control_plane.sql
│       ├── 0003_inquiry_anon_insert.sql
│       ├── 0004_storage_and_kyc_helpers.sql
│       ├── 0005_listing_autoflag.sql
│       ├── 0006_public_marketplace_view.sql
│       └── 0007_seller_portal.sql
├── web/
│   ├── app/
│   │   ├── (public pages)
│   │   ├── marketplace/        # /marketplace + /[id]
│   │   ├── s/[id]/             # seller storefront
│   │   ├── r/[code]/           # tracked redirect
│   │   ├── api/inquiry/        # WhatsApp deep-link logger
│   │   ├── login/              # team sign-in
│   │   ├── seller/             # SELLER PORTAL (login/signup/listings/kyc/inquiries/profile)
│   │   │   ├── _lib/getSeller.ts
│   │   │   ├── layout.tsx
│   │   │   ├── login/ signup/
│   │   │   ├── listings/ + /new
│   │   │   ├── kyc/ inquiries/ profile/
│   │   │   └── page.tsx        # overview
│   │   └── dashboard/          # OPS CONTROL PLANE
│   │       ├── layout.tsx      # DashboardShell
│   │       ├── page.tsx        # KPIs + attention
│   │       ├── applications/   # onboarding queue
│   │       ├── sellers/        # + /[id]
│   │       ├── kyc/ listings/ inquiries/
│   │       ├── revenue/ payouts/ boosts/
│   │       ├── disputes/       # + /[id]
│   │       ├── compliance/ ambassadors/ broadcasts/
│   │       ├── team/ audit/ experiments/
│   │       └── _charts.tsx
│   ├── components/
│   │   ├── ui/ brand/ layout/ admin/ marketplace/ listing/
│   ├── content/                # static MDX/TS data for landing
│   ├── lib/
│   │   ├── cn.ts format.ts
│   │   └── supabase.ts         # browserClient + serverClient + types
│   ├── middleware.ts           # gates /dashboard/* and /seller/*
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── package.json
└── PAMOJA_PLUS_GUIDE.md        # the master strategy + brand doc
```

---

## 8. Authentication & Authorization

### Three account types

| Type | Where they live | How they sign in | What they see |
|---|---|---|---|
| **Shopper** | (not stored separately yet) | n/a | Public site + marketplace; can tap InquireButton (anonymous) |
| **Seller** | `auth.users` + `sellers.user_id` | `/seller/login` | `/seller/*` only |
| **Team** | `auth.users` + `team_users` | `/login` | `/dashboard/*`; RLS scopes per `team_users.role` |

### Authorization layers

1. **Middleware** — coarse gate: is there an auth session? If not, redirect to the right login.
2. **Postgres RLS** — fine-grained: every table has policies that check `auth.uid()`, `is_team_member()`, `is_seller_owner()`, or `has_permission()`.
3. **Server actions** — call Supabase with the cookie-bound session; RLS does the rest.

A team member with role `marketing` can *visit* `/dashboard/payouts` but RLS will refuse the queries — they see an empty list, not an error. (Phase 3: route-level perm checks add a friendlier denial UI.)

---

## 9. Inquiry funnel (the conversion loop)

```
   Shopper on a listing card
            │
            │  Click <InquireButton>
            ▼
   GET /api/inquiry?seller=…&listing=…&ref=…
            │
            │  1. Look up seller + listing for whatsapp + title
            │  2. Resolve ambassador_id from ?ref= OR pamoja_ref cookie
            │  3. Insert into `inquiries` (anon — RLS policy 0003)
            │  4. 302 to https://wa.me/<phone>?text=<Swahili prefill>
            ▼
   Conversation happens on WhatsApp
            │
            ▼
   Seller (or ops) marks inquiry responded → drives response_rate
   Seller (or ops) marks inquiry converted → counts toward seller revenue
```

The ambassador `pamoja_ref` cookie is set by `/r/[code]` and lives 30 days. So even if the shopper browses for a week before tapping inquire, the click is attributed.

---

## 10. Auditability

Every state change on these tables writes to `audit_log` via the generic `audit_row_change()` trigger:

`sellers`, `listings`, `seller_documents`, `listing_reviews`, `payouts`, `disputes`, `revenue_events`, `team_users`, `broadcasts`, `data_subject_requests`.

`audit_log` rows include `actor_id` (from JWT), `actor_email`, `action`, `entity_table`, `entity_id`, `before` (jsonb), `after` (jsonb), `at`.

This is the **evidence base** for:

- PDPC data-subject requests ("show me everything you did with my data")
- TRA tax disputes ("when did this revenue event land?")
- Seller disputes ("you said you approved my listing on X")
- Internal blameless post-mortems

The viewer lives at `/dashboard/audit` with filters by table / action / actor email, and an expandable before/after JSON diff.

---

## 11. Performance & Quality Budget

| Metric | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse Accessibility        | ≥ 95 |
| Largest Contentful Paint        | < 2.0s on 3G |
| Cumulative Layout Shift         | < 0.05 |
| Total JS (initial)              | < 150 KB gzipped |
| Image strategy                  | `next/image` for landing assets; `unoptimized` for seller-uploaded photos (Cloudflare Images in Phase 3) |
| Font strategy                   | `next/font` self-hosted |

---

## 12. Security & Privacy

- HTTPS only (Vercel default).
- Strict CSP headers (`next.config.mjs` — TODO Phase 3).
- Cookie consent banner before any analytics fires (TODO when PostHog wires in).
- RLS on every table; `service_role` key never on the client.
- KYC documents in private storage bucket; ops sees them via short-lived signed URLs (5 min).
- IP addresses in `ambassador_clicks` are SHA-256 hashed with `IP_HASH_SALT`.
- Personal data minimized; retention policy in `/legal/privacy`.
- PDPC: registered as data controller (per implementation plan §10.x); DSR workflow in `/dashboard/compliance`.

---

## 13. Open technical decisions (still open)

- [ ] **Image storage strategy at scale**: keep on Supabase Storage vs front with Cloudflare Images?
- [ ] **Job runner**: confirm Inngest vs Trigger.dev for Phase 3.
- [ ] **Feature flags**: confirm PostHog vs GrowthBook.
- [ ] **KYC verification**: manual only or wire Smile ID API?
- [ ] **Email provider**: Resend (recommended) vs Postmark vs SES.
- [ ] **BI / dashboards**: Metabase self-host vs Hex (paid).

Decisions live in `IMPLEMENTATION_PLAN.md` §11.7.

---

**Sign-off:** Founders + Tech Lead initial this on each major revision.
