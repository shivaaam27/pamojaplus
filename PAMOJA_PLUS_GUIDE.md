# Pamoja+ — Master Guide

> **Grow Together. Shop Smarter.**
> A community-powered digital marketplace for Tanzania.

This document is the single source of truth for the Pamoja+ startup: brand, plan, team, pricing, legal context, Tanzanian-market corrections, and the roadmap for the internal web system. Keep this file at the project root and update it as decisions change.

---

## Table of Contents

1. [Brand Essence](#1-brand-essence)
2. [Visual Identity & Theme Tokens](#2-visual-identity--theme-tokens)
3. [Tanzanian Market Audit — Errors & Gaps Found](#3-tanzanian-market-audit--errors--gaps-found)
4. [Corrected Reference Sheet](#4-corrected-reference-sheet)
5. [Condensed 90-Day Execution Plan](#5-condensed-90-day-execution-plan)
6. [Team & Ownership Map](#6-team--ownership-map)
7. [Pricing Reference Card](#7-pricing-reference-card)
8. [Legal & Compliance Checklist (TZ)](#8-legal--compliance-checklist-tz)
9. [Internal System — Architecture](#9-internal-system--architecture)
10. [File & Folder Structure](#10-file--folder-structure)
11. [Implementation Roadmap](#11-implementation-roadmap)
12. [Open Questions / Decisions Pending](#12-open-questions--decisions-pending)

---

## 1. Brand Essence

| Item | Value |
|---|---|
| Name | **Pamoja+** |
| Meaning | "Pamoja" (Swahili) = *together* |
| Category | Community-powered digital marketplace |
| Geography | Tanzania first (Dar es Salaam → Arusha, Mwanza, Dodoma) |
| Tagline | **Grow Together. Shop Smarter.** |
| Core promise | Connect people, brands, and opportunities through commerce + community |
| Audience | Local SMEs, wellness/lifestyle brands, everyday TZ shoppers, diaspora |
| Positioning | Tanzania's community-powered marketplace for local discovery, smarter deals, and collective growth |

**Personality keywords:** community-driven · supportive · trustworthy · vibrant · innovative · conscious · collaborative.

---

## 2. Visual Identity & Theme Tokens

Derived from the official Pamoja+ logo (green star + yellow burst + community dots).

### Color tokens

| Token | Hex | Use |
|---|---|---|
| `--p-green` | `#2BB24C` | Primary brand, CTAs, headings accents |
| `--p-green-dark` | `#1E8A39` | Hover states, deep accents |
| `--p-green-soft` | `#E6F6EA` | Section backgrounds, cards |
| `--p-yellow` | `#F5C518` | Highlights, badges, energy moments |
| `--p-yellow-soft` | `#FFF6D6` | Hover backgrounds, callouts |
| `--p-ink` | `#0F1B14` | Body text |
| `--p-ink-2` | `#3A4A40` | Secondary text |
| `--p-bg` | `#FAFBF7` | Page background |
| `--p-white` | `#FFFFFF` | Cards, surfaces |
| `--p-line` | `#E4E9E2` | Borders, dividers |
| `--p-danger` | `#D64545` | Errors, danger states |

### Typography

- **Display / Headings:** `Plus Jakarta Sans` (700/800) — modern, geometric, friendly
- **Body / UI:** `Inter` (400/500/600) — neutral, highly readable
- **Numerals (dashboards):** `JetBrains Mono` or tabular Inter

### Motion principles

- **Fluid, not flashy** — eased transitions (200–400ms), `cubic-bezier(0.22, 1, 0.36, 1)`
- **Community feel** — staggered enter animations on lists/cards
- **Star moments** — subtle yellow shimmer on key CTAs, never gimmicky
- Framer Motion `layout` for timeline expansions, route transitions

### Shape language

- **Generous radii** — `rounded-2xl` (16px) for cards, `rounded-full` for pills/badges
- **Soft shadows** — `0 4px 24px rgba(43,178,76,0.08)` (green-tinted)
- Star/spark micro-icons echoing the logo

---

## 3. Tanzanian Market Audit — Errors & Gaps Found

Issues identified across the 5 source documents. These should be corrected in the next revision.

### 3.1 — Payment Structure document

| # | Issue | Why it matters | Fix |
|---|---|---|---|
| 1 | **"Tigo Pesa"** listed as a current mobile money brand | Tigo Tanzania rebranded to **Yas** in 2024; Tigo Pesa is now **Mixx by Yas**. Using the old name signals outdated market knowledge. | Replace with **Mixx by Yas** |
| 2 | **T-Pesa (TTCL)** missing | TTCL's mobile money is an option for government-leaning customers and rural reach. | Add T-Pesa to optional providers |
| 3 | **Card payments deferred to "later"** with no diaspora carve-out | TZ diaspora (UK, US, UAE, SA) is a real early revenue source for wellness/fashion. | Add card support via **Flutterwave / Selcom / DPO / Pesapal** by Month 3 |
| 4 | No mention of **Selcom Pay / Pesapal / DPO / Clickpesa** | These are the dominant TZ aggregators; choosing one is a Month-2 decision. | Add aggregator shortlist |
| 5 | Commission 3–5% with no mention of **mobile money MDR** | M-Pesa/Mixx by Yas merchant pricing eats into margin. | Add note: net commission ≈ gross commission − ~1.5–2.5% MDR |
| 6 | No **regional price elasticity** (Dar vs Mwanza/Dodoma) | TZS 35k may convert well in Dar but resist outside. | Add regional plan considerations |
| 7 | "Mobile money transaction cost, if charged by the provider" — vague | TZ regulators (BoT) have capped certain fees; sellers will ask. | State who absorbs the fee per scenario |

### 3.2 — Legal Considerations document

| # | Issue | Why it matters | Fix |
|---|---|---|---|
| 1 | **TMDA not named** (Tanzania Medicines & Medical Devices Authority) | Replaced TFDA in 2019. Regulates cosmetics, supplements, health-claim products — categories Pamoja+ explicitly plans to host. | Add TMDA as the regulator for cosmetics, supplements, medical-device claims |
| 2 | **TBS not named** (Tanzania Bureau of Standards) | Required mark/clearance for many imported and packaged goods. | Add TBS for food packaging, electronics, imported goods |
| 3 | **TCRA not named** (Tanzania Communications Regulatory Authority) | Online content services may require TCRA's *content service licence*; bloggers/influencers/ambassador campaigns can fall under this. | Confirm with counsel; likely required as Pamoja+ scales paid content |
| 4 | **FCC not named** (Fair Competition Commission) | Actual regulator for misleading advertising and consumer protection. | Add FCC as the consumer protection authority |
| 5 | **VAT threshold value missing** | Currently **TZS 200,000,000** annual turnover. | Add the explicit number so the team can monitor it |
| 6 | **EFD requirement not mentioned** | Once VAT-registered, TRA requires Electronic Fiscal Device (EFD) or Virtual Fiscal Device (VFD) — material operational cost. | Add EFD/VFD obligation post-VAT-registration |
| 7 | **SDL trigger not stated** | Skills Development Levy = 3.5% of gross emoluments, payable by employers with **10+ employees**. | Make trigger explicit |
| 8 | **NSSF vs PSSSF** ambiguous | Private sector → NSSF (correct), public sector → PSSSF. For clarity. | Clarify Pamoja+ uses NSSF (private) |
| 9 | **WCF rate not stated** | Workers Compensation Fund = ~0.5% of gross emoluments. | Add the rate for budgeting |
| 10 | **Local Service Levy not stated by rate** | 0.3% of turnover in some councils — not "where applicable" vagueness. | State the rate explicitly for Dar |
| 11 | **PDPC registration** treated as "assessment" | Tanzania's Personal Data Protection Act 2022 + Regulations 2023 require data controllers/processors to register with PDPC. For a marketplace, this is almost certainly required. | Treat PDPC registration as **required**, not optional |
| 12 | **Trademark scope** unclear | BRELA TZ + consider **ARIPO** (regional) for future scale. | Add ARIPO as Phase 2 option |
| 13 | **Ambassador rewards** with no tax note | Cash payments to ambassadors past TRA thresholds trigger withholding tax. | Add WHT clause to Ambassador Agreement |
| 14 | **Fair Competition Tribunal** (FCT) appeals path not mentioned | Useful to know for dispute escalation. | Note in legal annex |

### 3.3 — Company Profile document

| # | Issue | Fix |
|---|---|---|
| 1 | Smart quotes rendered as `?` in places (encoding issue in source `.docx`) | Re-save the file in UTF-8; replace `?` with proper curly quotes |
| 2 | "National digital marketplace" claim — be careful with regulator-sensitive wording | Soften to "leading community marketplace" until reach is proven |
| 3 | No clear **B2B2C segmentation** for diaspora | Add diaspora as a distinct shopper segment |

### 3.4 — 3-Month Timeline document

| # | Issue | Fix |
|---|---|---|
| 1 | Month 1 target "15–20 sellers, 50+ listings" — **no city/zone specified** | Constrain Month 1 to **Dar es Salaam only** (Kinondoni, Ilala, Ubungo) for ops discipline |
| 2 | No **content language guidance** | Specify Swahili-first captions, English secondary |
| 3 | Ambassador recruitment in Month 2 — no **vetting SOP** referenced | Add link to Ambassador Verification SOP |
| 4 | Paid promotion test prices (TZS 25,000 / 50,000) — **inconsistent** with Payment doc (TZS 5,000/day boost) | Reconcile: weekly boost = TZS 25,000 aligns; document the daily price too |
| 5 | "First revenue target TZS 300,000 – 1,500,000" — **no unit** (per month? cumulative?) | Clarify: **cumulative across the 3 months** |

### 3.5 — Team Structure document

| # | Issue | Fix |
|---|---|---|
| 1 | Ambassador rewards in TZS without **WHT mention** | Cross-reference with legal doc |
| 2 | No **founder equity / cap table** placeholder | Add a section for founder shares and option pool |
| 3 | Field Representative role has **no transport allowance** budgeted | Add to Finance section |
| 4 | "Outsourced Legal" — no **retainer estimate** | Add typical TZ retainer range (TZS 500k–1.5M/month for early-stage) |

### 3.6 — Cross-document inconsistencies

- **Brand spotlight package price** differs slightly between docs (TZS 100k–200k in Payment & Timeline) — reconcile to a single price ladder.
- **Seller count targets** in Team doc ("Onboard 15–30 businesses per week") are **far more aggressive** than the Timeline doc (15–20 in Month 1). Pick one ambition level. **Recommendation: trust the Timeline doc** — it's more realistic for Dar es Salaam launch.
- All five docs use **straight quotes shown as `?`** in extraction — encoding/typography fix needed on re-save.

---

## 4. Corrected Reference Sheet

Quick facts the team can rely on.

### Mobile money — correct current names (2026)

| Brand | Operator | Status |
|---|---|---|
| **M-Pesa** | Vodacom Tanzania | Largest user base |
| **Mixx by Yas** | Yas Tanzania (ex-Tigo) | **Rebranded** from Tigo Pesa in 2024 |
| **Airtel Money** | Airtel Tanzania | Strong reach |
| **Halopesa** | Halotel | Niche, regional |
| **AzamPesa** | Azam Group | Growing |
| **T-Pesa** | TTCL | Public-sector adjacent |

### Payment aggregators to shortlist

- **Selcom** — strong TZ presence, all MMOs in one API
- **Clickpesa** — TZ-native, developer-friendly
- **Pesapal** — pan-EA, card + MM
- **Flutterwave** — diaspora/cards/international
- **DPO Pay** — established, card-strong

### Key TZ regulators

| Body | Domain |
|---|---|
| **BRELA** | Company & trademark registration |
| **TRA** | Tax (TIN, VAT, PAYE, WHT, EFD) |
| **PDPC** | Personal data protection (registration required) |
| **TCRA** | Communications & content service licensing |
| **TMDA** | Medicines, cosmetics, supplements, medical devices |
| **TBS** | Product standards (food, electronics, imports) |
| **FCC** | Fair competition & consumer protection |
| **NSSF** | Social security (private sector) |
| **WCF** | Workers compensation |
| **BoT** | Banking & mobile money supervision (indirect) |

### Tax thresholds & rates (verify with advisor)

| Item | Value |
|---|---|
| **VAT mandatory registration threshold** | TZS 200,000,000 annual turnover |
| **VAT rate** | 18% |
| **Corporate income tax (resident)** | 30% |
| **SDL** | 3.5% of gross emoluments (10+ employees) |
| **NSSF (employer + employee)** | 20% combined (10% + 10%) |
| **WCF** | ~0.5% of gross emoluments |
| **Local Service Levy** | up to 0.3% of turnover (council-dependent) |
| **PAYE** | Progressive, 0–30% |
| **WHT on service fees (resident)** | 5% |

> ⚠️ Always confirm current rates with a TRA-registered tax advisor before quoting in client docs.

---

## 5. Condensed 90-Day Execution Plan

```
┌─────────────────────────────────────────────────────────────────────┐
│  MONTH 1 — FOUNDATION   │  MONTH 2 — TEST       │  MONTH 3 — MONEY  │
│  Dar es Salaam only     │  Add ambassadors      │  Paid plans live  │
│  15–20 sellers          │  25–35 sellers        │  40–60 sellers    │
│  50+ listings           │  100+ listings        │  150+ listings    │
│  Internal dashboard MVP │  Public site v1       │  Brand spotlight  │
│  Legal docs signed off  │  Boost test live      │  Next-Q plan      │
└─────────────────────────────────────────────────────────────────────┘
```

### Month 1 — Foundation (Dar only)
- **Wk 1:** Company + bank + TIN + first draft of all 8 legal pages
- **Wk 2:** Seller pitch deck, lead list of 50, onboarding form, internal CMS started
- **Wk 3:** Onboard 10–15 verified sellers, publish first 30–50 listings
- **Wk 4:** Soft launch — IG, TikTok, WhatsApp Business; collect feedback

### Month 2 — Market Testing
- **Wk 5:** Clean up listings; weekly content calendar; first 5 ambassadors
- **Wk 6:** Onboard 10–15 more sellers; identify paid-boost candidates
- **Wk 7:** Run paid boost pilot; track inquiries-per-listing
- **Wk 8:** Performance review; lock in winning categories

### Month 3 — Monetization
- **Wk 9:** Introduce Pamoja Growth (TZS 15k) & Plus (TZS 35k) plans
- **Wk 10:** Verified Seller badges live; testimonials collected
- **Wk 11:** Pitch 5 brands for Brand Spotlight (TZS 100k–200k)
- **Wk 12:** Quarter review; Month 4–6 plan; possible Arusha/Mwanza pilot

---

## 6. Team & Ownership Map

```
                        Managing Director
                               │
   ┌────────────┬──────────────┼───────────────┬────────────┐
   │            │              │               │            │
 Biz Dev   Operations    Marketing & Comm    Tech &     Finance &
 Manager    Manager         Manager          Product     Admin
   │            │              │               │            │
 Onboard.   Marketplace   Content Creator    UI/UX       (Legal —
 Officer   Coordinator    Ambassador Coord.  Designer    outsourced)
   │            │              │             Developer
 Field    Cust. Support  Ambassadors (5–20
 Rep       Officer        part-time)
```

**Launch headcount: 6–8 core + ambassadors.** See full role detail in source doc; reuse the SOP list as-is.

---

## 7. Pricing Reference Card

| Tier | Monthly | Listings | Headline benefit |
|---|---|---|---|
| **Start Pamoja** | Free | 10 | Be discoverable |
| **Pamoja Growth** | TZS 15,000 | 50 | Deals + analytics + 1 feature |
| **Pamoja Plus** | TZS 35,000 | 150 | Higher rank, 2 features, report |
| **Pamoja Partner** | TZS 75,000 | High/Unlimited | Homepage, badge, brand story, 4 features |

**Boosts:** TZS 5,000/day deal · TZS 25,000/week deal · TZS 50,000/week featured slot · TZS 30,000/social post · TZS 100k–200k brand story.
**Commission:** 0% direct inquiry · 3–5% platform-processed order · 5–8% campaign sale.
**Shopper:** Free at launch. Optional **Savings Club** TZS 5,000/mo or TZS 50,000/yr later.

---

## 8. Legal & Compliance Checklist (TZ)

Pre-launch (P), First 3 months (3M), Before checkout (CK), Before scale (SC).

- [ ] **P** — Register company at BRELA, obtain Certificate of Incorporation
- [ ] **P** — TIN from TRA
- [ ] **P** — Business licence (BRELA or LGA)
- [ ] **P** — Business bank account
- [ ] **P** — Mobile money merchant accounts (M-Pesa, Mixx by Yas, Airtel Money minimum)
- [ ] **P** — Trademark application via BRELA (name, logo, tagline)
- [ ] **P** — Terms & Conditions
- [ ] **P** — Privacy Policy
- [ ] **P** — Seller Agreement
- [ ] **P** — Refund & Dispute Policy
- [ ] **P** — Prohibited Products Policy
- [ ] **3M** — Paid Promotion Agreement
- [ ] **3M** — Ambassador Agreement (with WHT clause)
- [ ] **3M** — PDPC registration as data controller
- [ ] **3M** — Track monthly turnover vs VAT threshold (TZS 200M)
- [ ] **3M** — Cookie Policy if using analytics
- [ ] **CK** — Selcom/Clickpesa/Pesapal aggregator agreement
- [ ] **CK** — EFD/VFD with TRA (if VAT-registered)
- [ ] **CK** — Settlement & refund rules with sellers
- [ ] **SC** — TMDA clearance workflow for cosmetics/supplements category
- [ ] **SC** — TBS clearance check for imported goods
- [ ] **SC** — TCRA content service licence (if applicable)
- [ ] **SC** — Insurance review (cyber, professional indemnity)

---

## 9. Internal System — Architecture

### Goals
1. **Showcase progress** — milestones, achievements, KPIs
2. **Live timeline** — interactive 3-month roadmap
3. **Public website** — brand story, seller signup, deal preview
4. **Presentation builder** — branded slides without leaving the app
5. **Internal dashboard** — sellers, listings, revenue (mock first)

### Tech stack (confirmed)

| Layer | Choice |
|---|---|
| Framework | **Next.js 14+ (App Router)** |
| Styling | **Tailwind CSS** with custom theme tokens |
| Animation | **Framer Motion** |
| Icons | **Lucide React** |
| Fonts | Plus Jakarta Sans + Inter (next/font) |
| Charts | **Recharts** (for dashboard KPIs) |
| Slides | **Slidev** (embedded) or in-app reveal-style component |
| Data (Phase 1) | Local JSON / TypeScript modules — no DB |
| Data (Phase 2) | **Supabase** (Postgres + Auth + Storage) |
| Hosting | **Vercel** (free tier) |
| Forms | React Hook Form + Zod |

### Modules

1. `/` — **Landing** (hero, vision, what we offer, CTA)
2. `/about` — Brand story, mission, team
3. `/journey` — Interactive 90-day timeline (Framer Motion expand cards)
4. `/achievements` — Milestone wall (animated counters, badges)
5. `/team` — Org chart, photos, roles
6. `/pricing` — Plans + interactive simulator
7. `/presentations` — List of decks, click to present
8. `/dashboard` — Internal KPI view (sellers, listings, revenue, ambassadors)
9. `/sellers` — Onboard a seller (CMS form)
10. `/sign-in` — Internal team auth (Phase 2 with Supabase)

### Public vs. internal

- Public: `/`, `/about`, `/journey`, `/pricing`, `/sellers/apply`
- Internal (auth-gated Phase 2): `/dashboard`, `/sellers`, `/presentations`, `/achievements/edit`

---

## 10. File & Folder Structure

```
pamojaplus/
├── PAMOJA_PLUS_GUIDE.md          ← this file (source of truth)
├── docs/
│   ├── 01-company-profile.md
│   ├── 02-legal-tanzania.md
│   ├── 03-timeline-90d.md
│   ├── 04-team-structure.md
│   ├── 05-payment-structure.md
│   └── audit-corrections.md      ← Section 3 expanded
├── brand/
│   ├── logo.png
│   ├── tokens.json               ← color + type tokens (auto-imported by web)
│   └── moodboard.md
├── web/                          ← Next.js app (Step 6)
│   ├── app/
│   ├── components/
│   ├── content/                  ← MDX for journey, achievements
│   ├── lib/
│   ├── public/
│   ├── tailwind.config.ts
│   └── package.json
└── ops/
    ├── sops/                     ← seller onboarding, complaints, etc.
    ├── templates/                ← invoice, T&Cs, ambassador agreement
    └── trackers/                 ← seller-pipeline.csv, kpi-weekly.csv
```

---

## 11. Implementation Roadmap

### Phase A — Documentation (Week 0)
- [x] Read all source docs
- [x] Build this guide
- [ ] Produce tracked-changes versions of all 5 `.docx` files
- [ ] Get founder sign-off on audit corrections

### Phase B — Brand system (Week 0–1)
- [ ] Export logo variants (full, mark-only, monochrome)
- [ ] Lock color/type tokens in `brand/tokens.json`
- [ ] One-page brand guidelines PDF

### Phase C — Internal web scaffold (Week 1–2)
- [ ] `npx create-next-app@latest web --ts --tailwind --app`
- [ ] Install Framer Motion, Lucide, Recharts
- [ ] Apply theme tokens to Tailwind config
- [ ] Build layout, nav, footer

### Phase D — Module build (Week 2–4)
- [ ] Landing page
- [ ] Journey (interactive timeline)
- [ ] Pricing (with simulator)
- [ ] Team page
- [ ] Achievements wall
- [ ] Internal dashboard with mock data

### Phase E — Content load (Week 4)
- [ ] Move all real copy into MDX
- [ ] Real photos, real seller logos (with consent)

### Phase F — Auth + data (Week 5+, optional)
- [ ] Supabase setup
- [ ] Internal sign-in for the team
- [ ] Move seller pipeline from spreadsheet to DB

### Phase G — Deploy (end of Week 2 for v1)
- [ ] Vercel deploy on a private domain
- [ ] Share with founders + ops team

---

## 12. Open Questions / Decisions Pending

These need a founder decision before the next iteration:

1. **Legal entity name** — is "Pamoja Plus Tanzania Limited" available at BRELA?
2. **Domain** — `pamojaplus.co.tz` vs `.com` vs `.africa`?
3. **First city only or two cities?** — recommendation: Dar only for M1.
4. **Ambassador rewards** — paid in cash, airtime, or store credit?
5. **Aggregator choice** — Selcom vs Clickpesa vs Pesapal for Month 2.
6. **Diaspora support in Month 3?** — Flutterwave card support yes/no.
7. **Savings Club** — launch in Month 6 or hold for Year 2?
8. **Office** — Dar serviced office vs fully remote at launch?
9. **Wellness category** — soft-launch with educational content only? (Recommended — TMDA risk.)
10. **Trademark** — file in TZ only or include ARIPO?

---

## Closing

Pamoja+ has a strong concept and a sensible launch shape. The biggest near-term risks are:

1. **Regulatory accuracy** — outdated mobile money names and missing regulators (TMDA, TCRA, FCC, TBS) need fixing before any public-facing legal doc is published.
2. **PDPC registration** — treat as required, not optional, given the scope of personal data the platform will handle.
3. **Realistic ambition** — Timeline doc is realistic; Team doc has aspirational seller numbers that should be reconciled downward.
4. **Category caution** — wellness/cosmetics/supplements are TMDA-regulated; lead with verified, low-risk sellers in Month 1.

Fix those, ship the internal system on Next.js + Tailwind + Framer Motion, and the team will have both the legal hygiene and the operational visibility to grow with confidence.

**Pamoja+ — Grow Together. Shop Smarter.**
