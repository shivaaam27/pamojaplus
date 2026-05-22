# Pamoja+ — Route Map

> Every URL the app exposes. Keep this current when you add routes.

## Conventions

- **Public** — no auth, anyone can visit.
- **Seller** — gated by middleware; redirects to `/seller/login`.
- **Team** — gated by middleware; redirects to `/login`. Inside, RLS + `has_permission()` further restrict actions.

---

## Public

| Route | Purpose | Notes |
|---|---|---|
| `/` | Landing — hero, value props, CTAs | Primary CTA → `/marketplace` |
| `/about` | Brand story, mission, vision | Static |
| `/journey` | 12-week 90-day timeline | From `content/timeline.ts` |
| `/pricing` | Plan cards + revenue simulator | From `content/pricing.ts` |
| `/team` | Org chart + roles | From `content/team.ts` |
| `/achievements` | Milestone wall | Reads `milestones` (RLS: public ones) |
| `/contact` | Contact + WhatsApp click-to-chat | Static |
| `/sellers/apply` | Seller pitch form | Anonymous insert → `seller_applications` |
| `/legal/terms` | Terms & Conditions | MDX |
| `/legal/privacy` | Privacy Policy | MDX |
| `/present` | List of presentations | Public read |
| `/present/[slug]` | Full-screen deck | Public read |
| `/marketplace` | Verified-seller listing grid | Filters: q, category, location |
| `/marketplace/[id]` | Listing detail + InquireButton | Reads `v_public_listings` |
| `/s/[id]` | Seller storefront | Reads `v_public_sellers` |
| `/r/[code]` | Tracked ambassador redirect | Logs `ambassador_clicks`, sets `pamoja_ref` cookie, 302 to `?to=` (default `/`) with `?ref=<code>` |
| `/api/inquiry` | Logs an `inquiries` row, then 302 to WhatsApp | Query: `seller`, `listing`, `ref` (or cookie). Swahili-prefilled message. |
| `/login` | Team sign-in | Redirects to `?next=` after auth |
| `/seller/login` | Seller sign-in | |
| `/seller/signup` | Seller account creation | Calls `claimSellerProfile()` to link to existing sellers row by email |

## Seller portal (`/seller/*`)

| Route | Purpose |
|---|---|
| `/seller` | Overview — KPIs, plan/tier, quick actions |
| `/seller/listings` | List own listings |
| `/seller/listings/new` | Create new listing (status='draft', auto-queued for moderation) |
| `/seller/inquiries` | Filter open / responded / converted; Mark actions |
| `/seller/kyc` | Upload docs to seller-docs bucket (path = seller_id/) |
| `/seller/profile` | Edit owner/whatsapp/phone/location/category |

## Ops dashboard (`/dashboard/*`)

### Overview
| Route | Purpose |
|---|---|
| `/dashboard` | KPI cards (links to sections), revenue trend, attention queue (`v_attention_queue`) |

### Operate
| Route | Purpose |
|---|---|
| `/dashboard/applications` | Onboarding queue. Expand row for full pitch. Approve → creates `sellers` row. |
| `/dashboard/sellers` | Verified business directory |
| `/dashboard/sellers/[id]` | Seller drilldown — health KPIs, KYC docs (with uploader), listings (with creator), inquiries |
| `/dashboard/kyc` | Doc review queue. Signed-URL preview. Approve/reject → `bump_seller_tier()` |
| `/dashboard/listings` | Moderation queue. Auto-flag from `prohibited_keywords`. Approve / changes / reject |
| `/dashboard/inquiries` | Filters (open / stale>48h / responded / converted) + Mark actions |

### Money
| Route | Purpose |
|---|---|
| `/dashboard/revenue` | Manual entry form, VAT-threshold bar from `v_vat_tracker`, ledger table |
| `/dashboard/payouts` | Schedule (seller or amb with 5% WHT) → approve → mark paid (MMO + ref) |
| `/dashboard/boosts` | **Scaffold** — boosts/spotlights calendar (Phase 3) |

### Trust
| Route | Purpose |
|---|---|
| `/dashboard/disputes` | List sorted by SLA; SLA-breach badge |
| `/dashboard/disputes/[id]` | Threaded reply + state transitions (mediation / resolved_buyer / resolved_seller / escalated / closed) |
| `/dashboard/compliance` | Open `compliance_flags` (auto from listing trigger) + DSR queue (PDPC) |

### Growth
| Route | Purpose |
|---|---|
| `/dashboard/ambassadors` | Leaderboard from `v_ambassador_leaderboard` + create form (auto ref code) + copy `/r/<code>` link |
| `/dashboard/broadcasts` | Compose WA/SMS/Email to segment (plan/tier/location/verified). Queues to `notifications`. |

### System
| Route | Purpose |
|---|---|
| `/dashboard/team` | List `team_users`, change role, remove |
| `/dashboard/audit` | Searchable `audit_log` with before/after JSON diff |
| `/dashboard/experiments` | **Scaffold** — flags (PostHog/GrowthBook in Phase 3) |

---

## Middleware matchers

`web/middleware.ts`:

- `/dashboard/:path*` → requires auth; redirects to `/login`
- `/seller/((?!login|signup).*)` → requires auth; redirects to `/seller/login`

`/api/*`, `/marketplace/*`, `/s/*`, `/r/*` are all public.

---

## Server actions (not routes, but worth listing)

- `app/dashboard/applications/actions.ts` — approve/reject/reviewing
- `app/dashboard/kyc/actions.ts` — reviewDocument, signedDocUrl
- `app/dashboard/listings/actions.ts` — decideListing
- `app/dashboard/inquiries/actions.ts` — markResponded / markConverted
- `app/dashboard/ambassadors/actions.ts` — createAmbassador, toggleAmbassador
- `app/dashboard/revenue/actions.ts` — recordRevenueEvent
- `app/dashboard/compliance/actions.ts` — resolveFlag, updateDsrStatus
- `app/dashboard/payouts/actions.ts` — createPayout, approvePayout, markPaid, holdPayout
- `app/dashboard/disputes/actions.ts` — postDisputeMessage, setDisputeStatus
- `app/dashboard/broadcasts/actions.ts` — previewSegment, sendBroadcast
- `app/dashboard/team/actions.ts` — setTeamRole, removeTeamUser
- `app/dashboard/sellers/[id]/upload-actions.ts` — uploadKycDocument (ops)
- `app/dashboard/sellers/[id]/listing-actions.ts` — createListing (ops)
- `app/seller/signup/actions.ts` — claimSellerProfile
- `app/seller/listings/new/actions.ts` — createOwnListing
- `app/seller/kyc/actions.ts` — uploadOwnKyc
- `app/seller/inquiries/actions.ts` — markOwnResponded / markOwnConverted
- `app/seller/profile/actions.ts` — updateMyProfile
