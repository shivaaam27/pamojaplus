# Pamoja+ Web

Internal + public web system for Pamoja+ — Tanzania's community-powered marketplace.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Recharts · Lucide.

---

## Quick start

```bash
cd web
npm install
npm run dev
```

Then open http://localhost:3000.

> First install will take a couple of minutes. After that, hot-reload is instant.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server on :3000 |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (no emit) |

## Routes

**Public**
- `/` — Landing
- `/about` — Brand story
- `/journey` — Interactive 90-day timeline
- `/pricing` — Plans + revenue simulator
- `/team` — Team and departments
- `/achievements` — Milestone wall
- `/present` — Presentation deck list
- `/present/[slug]` — Run a deck fullscreen (arrow keys / space)
- `/sellers/apply` — Seller signup form
- `/contact` — Contact info
- `/legal/terms`, `/legal/privacy`

**Internal**
- `/dashboard` — KPI dashboard (mock data)

## Project structure

```
web/
├── app/                 # Next.js App Router pages
├── components/
│   ├── brand/           # Logo, StarSpark
│   ├── layout/          # SiteHeader, SiteFooter
│   └── ui/              # Button, Card, Container primitives
├── content/             # timeline.ts, pricing.ts, team.ts, milestones.ts, decks.ts
├── lib/                 # cn.ts, format.ts
├── tailwind.config.ts   # imports ../brand/tokens.json
└── package.json
```

Brand color & type tokens live at `../brand/tokens.json`. Edit once, theme propagates everywhere.

## Editing content

- **Add a milestone:** edit `content/milestones.ts`
- **Update timeline weeks:** edit `content/timeline.ts` (mark a node `status: "done"` / `"active"`)
- **Change pricing:** edit `content/pricing.ts`
- **Add a deck:** add to `content/decks.ts`, then visit `/present/<slug>`

## Deploy

Push to a Git repo, import into Vercel, deploy. Zero config needed.

## Next steps (Phase 2)

- Supabase Auth + Postgres for real data
- Internal team sign-in on `/dashboard/*`
- Seller form → email/Sheets/DB integration
- Swahili translations under `content/i18n/`
- Cookie consent banner before any analytics
