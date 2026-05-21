# Pamoja+ — Internal System Architecture (Step 5)

> Technical spec for the internal/public web system.
> Stack confirmed: **Next.js 14 (App Router) + Tailwind CSS + Framer Motion**.

---

## 1. Goals

The system has four jobs, in priority order:

1. **Show the world what Pamoja+ is** — public-facing landing, brand story, seller signup.
2. **Show the team what's been achieved** — milestones, KPIs, live timeline.
3. **Help the team run the business** — internal dashboard for sellers/listings/revenue.
4. **Present the company professionally** — in-app branded presentations for partners, investors, sellers.

The system is **not** a full marketplace at launch. It is an internal command center + a credible public face. Marketplace transactions stay on WhatsApp/direct contact during Phase 1, as the legal doc recommends.

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        BROWSER (mobile-first)                    │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                  ┌──────────▼──────────┐
                  │  Next.js 14 (App)   │   Vercel Edge
                  │  React Server Comp. │
                  └──────────┬──────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐         ┌────▼─────┐         ┌────▼─────┐
   │  Public  │         │ Internal │         │  Slides  │
   │  routes  │         │  routes  │         │ /present │
   └────┬─────┘         └────┬─────┘         └──────────┘
        │                    │
        │              ┌─────▼──────┐
        │              │  Supabase  │   (Phase 2)
        │              │ Auth + DB  │
        │              └─────┬──────┘
        │                    │
   ┌────▼────────────────────▼────┐
   │   content/  (MDX + JSON)      │   Phase 1 — file-based data
   └───────────────────────────────┘
```

### Phases

| Phase | Data | Auth | Status |
|---|---|---|---|
| **Phase 1** | Local MDX + TypeScript modules | None | Build first |
| **Phase 2** | Supabase (Postgres + Storage) | Supabase Auth | After Month 1 |
| **Phase 3** | Add aggregator (Selcom/Clickpesa), real seller dashboard | + RBAC | After Month 3 |

---

## 3. Tech Stack (locked)

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 App Router | SSR + RSC, Vercel-native, mature |
| Language | TypeScript (strict) | Catch errors early |
| Styling | Tailwind CSS 3.4+ | Token-driven, fast |
| Animation | Framer Motion | Fluid, layout animations |
| Icons | Lucide React | Clean, customizable |
| Fonts | next/font with Plus Jakarta Sans + Inter | Self-hosted, no FOUT |
| Forms | React Hook Form + Zod | Typed validation |
| Charts | Recharts | Simple, themable |
| MDX | `@next/mdx` + `next-mdx-remote` | Content as code |
| Slides | Custom reveal-style component (Framer Motion) | Branded, in-app |
| Lint/Format | ESLint + Prettier + Tailwind plugin | Standard |
| Testing (later) | Vitest + Playwright | When it matters |
| Hosting | Vercel | Free tier, preview deploys |
| Analytics | Vercel Analytics + Plausible (self-host later) | Privacy-friendly |
| Error monitoring | Sentry (free tier) | Production hygiene |
| CI | GitHub Actions | Lint + typecheck on PR |

**Phase 2 additions:** Supabase (Auth, Postgres, Storage), Resend (transactional email), Uploadthing or Supabase Storage for seller photos.

---

## 4. Theme Tokens (single source of truth)

`brand/tokens.json` — imported by Tailwind config at build time.

```json
{
  "colors": {
    "p-green":       "#2BB24C",
    "p-green-dark":  "#1E8A39",
    "p-green-soft":  "#E6F6EA",
    "p-yellow":      "#F5C518",
    "p-yellow-soft": "#FFF6D6",
    "p-ink":         "#0F1B14",
    "p-ink-2":       "#3A4A40",
    "p-bg":          "#FAFBF7",
    "p-white":       "#FFFFFF",
    "p-line":        "#E4E9E2",
    "p-danger":      "#D64545"
  },
  "fonts": {
    "display": "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif",
    "body":    "Inter, ui-sans-serif, system-ui, sans-serif",
    "mono":    "JetBrains Mono, ui-monospace, monospace"
  },
  "radius": {
    "sm": "0.5rem",
    "md": "0.75rem",
    "lg": "1rem",
    "xl": "1.25rem",
    "2xl": "1.5rem"
  },
  "shadow": {
    "card":  "0 4px 24px rgba(43,178,76,0.08)",
    "lift":  "0 8px 32px rgba(15,27,20,0.12)",
    "glow":  "0 0 0 4px rgba(245,197,24,0.25)"
  },
  "motion": {
    "ease":     "cubic-bezier(0.22, 1, 0.36, 1)",
    "fast":     "150ms",
    "base":     "250ms",
    "slow":     "400ms"
  }
}
```

---

## 5. Routes & Modules

### 5.1 Public routes

| Route | Purpose | Components |
|---|---|---|
| `/` | Landing — hero, value props, featured deals, CTA | `Hero`, `ValueGrid`, `DealStrip`, `CTASection` |
| `/about` | Brand story, mission, vision | `StoryHero`, `MissionGrid`, `TeamPreview` |
| `/journey` | Interactive 90-day timeline | `JourneyTimeline`, `MilestoneCard` |
| `/pricing` | Plans + interactive simulator | `PricingTable`, `RevenueSimulator` |
| `/sellers/apply` | Seller signup form | `SellerForm` (RHF + Zod) |
| `/contact` | Contact + WhatsApp click-to-chat | `ContactCard`, `Map` |
| `/legal/terms` | Terms & Conditions (MDX) | `LegalLayout` |
| `/legal/privacy` | Privacy Policy (MDX) | `LegalLayout` |
| `/legal/cookies` | Cookie Policy | `LegalLayout` |

### 5.2 Internal routes (auth-gated in Phase 2)

| Route | Purpose |
|---|---|
| `/dashboard` | KPI overview: sellers, listings, revenue, ambassadors |
| `/dashboard/sellers` | Seller CRUD + verification status |
| `/dashboard/listings` | Listing audit (expired deals, weak descriptions) |
| `/dashboard/ambassadors` | Ambassador roster + referrals + payouts |
| `/dashboard/revenue` | Subscriptions, boosts, campaigns, commissions |
| `/dashboard/calendar` | Content calendar |
| `/achievements` | Milestone wall (animated, public-shareable) |
| `/team` | Org chart + roles |
| `/present` | List of decks |
| `/present/[slug]` | Run a deck full-screen |

### 5.3 Route protection

Phase 1: rely on environment (run internally / behind Vercel password protection).
Phase 2: Supabase Auth + middleware on `/dashboard/*` and `/present/*` (edit mode).

---

## 6. Component System

### 6.1 Primitives (shadcn-style, custom-built)

`Button`, `Input`, `Textarea`, `Select`, `Badge`, `Card`, `Tag`, `Avatar`, `Stat`, `Sparkline`, `Tabs`, `Accordion`, `Dialog`, `Toast`, `Tooltip`, `Progress`.

### 6.2 Brand patterns

- **`StarSpark`** — animated star/burst echoing logo, used on CTAs and hero moments
- **`CommunityRing`** — circular layout of dots, used to wrap avatars or stats
- **`TimelineRail`** — vertical/horizontal rail with milestone nodes
- **`PriceCard`** — plan card with featured-state shimmer
- **`SellerCard`** — listing preview, verified badge, response stars
- **`MetricCard`** — KPI tile with trend sparkline

### 6.3 Layout

- `SiteHeader` — sticky, transparent → solid on scroll
- `SiteFooter` — links, social, language switch
- `DashboardShell` — sidebar + topbar + content
- `LegalLayout` — long-form text, anchored nav

### 6.4 Motion library

| Pattern | Where | How |
|---|---|---|
| Stagger reveal | Lists/grids on enter | `motion.div` with `staggerChildren: 0.08` |
| Layout transition | Timeline expand, tabs | Framer `layout` prop |
| Number count-up | KPI tiles | Custom hook with `useSpring` |
| Star shimmer | Primary CTA | `motion.span` looped gradient |
| Page transition | Route change | `AnimatePresence` in root layout |
| Hover lift | Cards | `whileHover={{ y: -4 }}` |

All motion respects `prefers-reduced-motion`.

---

## 7. Data Model (Phase 2 — Supabase)

```sql
-- sellers
id              uuid pk
business_name   text
owner_name      text
phone           text
whatsapp        text
email           text
location        text
category        text
plan            text  -- 'free' | 'growth' | 'plus' | 'partner'
verified        boolean
response_rate   numeric
created_at      timestamptz
notes           text

-- listings
id              uuid pk
seller_id       uuid fk -> sellers
title           text
description     text
price_tzs       integer
photos          text[] -- storage URLs
deal_type       text   -- 'standard' | 'deal' | 'featured'
deal_expires_at timestamptz nullable
status          text   -- 'draft' | 'live' | 'expired' | 'removed'
created_at      timestamptz

-- ambassadors
id              uuid pk
name            text
type            text   -- 'digital' | 'field' | 'campus'
phone           text
referral_code   text unique
active          boolean
joined_at       timestamptz

-- referrals
id              uuid pk
ambassador_id   uuid fk
seller_id       uuid fk nullable
shopper_phone   text nullable
status          text   -- 'pending' | 'joined_free' | 'joined_paid' | 'rejected'
reward_tzs      integer
paid_at         timestamptz nullable

-- revenue_events
id              uuid pk
seller_id       uuid fk
type            text   -- 'subscription' | 'boost' | 'spotlight' | 'commission'
amount_tzs      integer
period_start    date nullable
period_end      date nullable
mobile_money_ref text nullable
recorded_at     timestamptz

-- milestones
id              uuid pk
title           text
description     text
date            date
icon            text
public          boolean

-- users (team)
id              uuid pk
email           text unique
role            text   -- 'founder' | 'ops' | 'bd' | 'marketing' | 'tech' | 'finance'
created_at      timestamptz
```

Row-Level Security policies:
- Public can read `milestones WHERE public = true`
- Authenticated team can CRUD everything
- Role-based restrictions: only `founder`/`finance` can edit `revenue_events`

---

## 8. Folder Structure (Next.js app)

```
web/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # /
│   │   ├── about/page.tsx
│   │   ├── journey/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── sellers/apply/page.tsx
│   │   ├── contact/page.tsx
│   │   └── legal/
│   │       ├── terms/page.mdx
│   │       ├── privacy/page.mdx
│   │       └── cookies/page.mdx
│   ├── (internal)/
│   │   ├── layout.tsx            # DashboardShell
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── sellers/page.tsx
│   │   │   ├── listings/page.tsx
│   │   │   ├── ambassadors/page.tsx
│   │   │   ├── revenue/page.tsx
│   │   │   └── calendar/page.tsx
│   │   ├── achievements/page.tsx
│   │   ├── team/page.tsx
│   │   ├── present/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   ├── api/                      # Phase 2 route handlers
│   ├── globals.css
│   └── layout.tsx                # root, fonts, providers
├── components/
│   ├── ui/                       # primitives
│   ├── brand/                    # StarSpark, CommunityRing, etc.
│   ├── layout/                   # SiteHeader, SiteFooter, DashboardShell
│   └── modules/                  # JourneyTimeline, PricingTable, etc.
├── content/
│   ├── milestones.ts
│   ├── timeline.ts
│   ├── team.ts
│   ├── pricing.ts
│   └── decks/
│       ├── investor.mdx
│       ├── seller-pitch.mdx
│       └── brand-spotlight.mdx
├── lib/
│   ├── tokens.ts                 # imports brand/tokens.json
│   ├── format.ts                 # currency, dates
│   ├── motion.ts                 # shared variants
│   └── supabase.ts               # Phase 2
├── public/
│   ├── logo.png
│   ├── og-image.png
│   └── ...
├── styles/
│   └── globals.css
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## 9. Key Module Specs

### 9.1 Landing (`/`)

- **Hero** — Pamoja+ logo + animated star + tagline; primary CTA "I'm a Seller", secondary "Browse Deals"
- **Value grid** — 3 cards: For Sellers · For Shoppers · For Community
- **Featured deals strip** — horizontal scroll, 6 deal cards
- **Brand spotlight** — large card, currently-featured business
- **How it works** — 3 steps with icons
- **Trust strip** — verified count, sellers count, cities (animated count-up)
- **Closing CTA** — "Join the movement"

### 9.2 Journey timeline (`/journey`)

- Vertical rail with 12 nodes (one per week)
- Each node: status dot (done/active/upcoming), title, summary
- Click → expands (Framer `layout`) showing actions, owners, KPIs
- Filter by track: Business · Legal · Product
- Top: progress bar showing % of Q1 complete

### 9.3 Pricing (`/pricing`)

- 4 plan cards (Free · Growth · Plus · Partner)
- Highlighted plan: yellow shimmer border
- **Revenue Simulator** below:
  - Sliders: # of sellers per plan, # of boosts/week, # of spotlights/month
  - Live monthly revenue projection
  - Breakdown chart (Recharts)

### 9.4 Achievements (`/achievements`)

- Masonry grid of milestone cards
- Each card: icon, date, title, short description, optional photo
- Featured "biggest wins" pinned top
- Add-milestone modal (internal only)
- Public-shareable view (read-only)

### 9.5 Dashboard (`/dashboard`)

Top row: 4 metric cards
- Total Sellers (with delta vs last week)
- Active Listings
- Revenue This Month (TZS)
- Active Ambassadors

Middle row:
- Revenue trend chart (last 12 weeks)
- Top categories (bar chart)

Bottom row:
- Recent seller signups (table)
- Items needing attention (expired deals, unresponsive sellers)

### 9.6 Presentations (`/present`)

- List view: cards for each deck (title, audience, last updated)
- Detail view: full-screen slides
  - Arrow keys / swipe to navigate
  - Brand chrome (small logo bottom-left, slide # bottom-right)
  - Speaker notes panel (toggle with `S`)
  - Auto-fits to screen, mobile-friendly
- Slides written as MDX in `content/decks/`

---

## 10. Performance & Quality Budget

| Metric | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Largest Contentful Paint | < 2.0s on 3G |
| Cumulative Layout Shift | < 0.05 |
| Total JS (initial) | < 150 KB gzipped |
| Image strategy | next/image, AVIF, lazy by default |
| Font strategy | next/font, subset latin + extended |

---

## 11. Accessibility

- Semantic HTML; landmarks on every page
- Focus rings always visible (`focus-visible`)
- Contrast: AA minimum, AAA for body text where possible
- All interactive components keyboard-operable
- `prefers-reduced-motion` disables non-essential motion
- Form errors announced via `aria-live`
- Alt text on all images; decorative images get `alt=""`

---

## 12. Internationalization

Tanzania is bilingual operationally. Start English-first, design for Swahili.

- All copy in `content/i18n/{en,sw}.ts`
- Language toggle in header (`EN | SW`)
- Locale stored in cookie
- Numbers/currency: `Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS' })`
- Dates: `Intl.DateTimeFormat('sw-TZ')`

Phase 1: scaffold structure, ship EN. Phase 2: SW translations.

---

## 13. Security & Privacy

- HTTPS only (Vercel default)
- Strict CSP headers via `next.config.mjs`
- No third-party analytics that ship to non-EU/US/AF endpoints
- Cookie consent banner before any analytics fires
- Phase 2: Supabase RLS on every table; service role key never on client
- Secrets in Vercel env vars; never committed
- Personal data minimized; retention policy in privacy policy
- PDPC compliance: data controller registration tracked in `IMPLEMENTATION_PLAN.md`

---

## 14. Build Order (when we ship Step 6)

1. **Scaffold + theme** — Next.js, Tailwind config, fonts, layout shell (~½ day)
2. **Primitives + brand components** — Button, Card, StarSpark, MetricCard (~1 day)
3. **Landing page** — hero, value grid, trust strip (~1 day)
4. **Journey timeline** — interactive, with mock data (~1 day)
5. **Pricing + simulator** (~1 day)
6. **About + Team + Contact** (~½ day)
7. **Achievements wall** (~½ day)
8. **Internal dashboard with mock data** (~1 day)
9. **Presentations module** (~1 day)
10. **Polish, a11y pass, Lighthouse** (~½ day)
11. **Deploy to Vercel, hand off** (~½ hour)

Total ~7–8 working days for a clean v1 ready to demo.

---

## 15. Out of Scope (v1)

To keep v1 shippable, the following are explicitly **not** in v1:
- Real checkout / payment processing
- Real seller authentication / portal
- Public reviews / ratings
- Real-time chat
- Delivery tracking
- Mobile native apps
- SMS notifications
- Multi-tenancy

These move to Phase 2 or Phase 3 based on demand from Q1 review.

---

## 16. Open Technical Decisions

- [ ] **Auth provider** — Supabase Auth vs Clerk vs Auth.js? (Recommend Supabase for stack cohesion.)
- [ ] **Email** — Resend vs Postmark vs SES?
- [ ] **Image storage** — Supabase Storage vs Uploadthing vs Cloudflare R2?
- [ ] **Analytics** — Vercel Analytics vs self-hosted Plausible vs Umami?
- [ ] **Form submissions** in Phase 1 — email to ops inbox vs Google Sheets webhook vs Notion API?
- [ ] **Deck format** — MDX-as-slides (custom) vs embedded Slidev vs Reveal.js?

Default recommendations: Supabase Auth · Resend · Supabase Storage · Vercel Analytics + Plausible later · Resend-to-ops in Phase 1 · custom MDX slides.

---

**Sign-off:** Founders + Tech Lead initial this before scaffolding begins.
