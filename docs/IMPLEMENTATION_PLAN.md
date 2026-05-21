# Pamoja+ — Implementation Plan (Step 4)

> The actionable, week-by-week rollout from "nothing" to "operating marketplace with internal system live."
> Companion to `PAMOJA_PLUS_GUIDE.md`. Read that first.

---

## 0. Plan at a Glance

```
┌──────────────┬──────────────────────────────────────────────────────────────┐
│  WEEK -2/-1  │  PRE-LAUNCH: legal, brand, infra                             │
│  WEEK 1–4    │  MONTH 1: foundation + soft launch in Dar es Salaam          │
│  WEEK 5–8    │  MONTH 2: market testing, ambassadors, paid-boost pilot     │
│  WEEK 9–12   │  MONTH 3: paid plans live, brand spotlight, next-Q plan     │
│  WEEK 13+    │  PHASE 2: expand cities, checkout, aggregator integration   │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

Three parallel tracks run throughout:
1. **Business track** — sellers, deals, ambassadors, revenue
2. **Legal & finance track** — BRELA → TIN → PDPC → VAT monitoring
3. **Product track** — internal system (Next.js) → public website → dashboard → data layer

---

## 1. Pre-Launch (Weeks -2 to 0)

**Goal:** be legally registered, brand-ready, and have the internal system scaffolded before Day 1.

### 1.1 Legal & finance
- [ ] **BRELA** — reserve name "Pamoja Plus Tanzania Limited" (or alt)
- [ ] **BRELA** — incorporate as private limited company, obtain Certificate of Incorporation
- [ ] **TRA** — obtain Taxpayer Identification Number (TIN)
- [ ] **LGA/BRELA** — apply for business licence (correct class: digital platform / advertising service)
- [ ] **Bank** — open business account (CRDB / NMB / Stanbic / Equity)
- [ ] **Mobile money merchant accounts** — M-Pesa Tanzania, Mixx by Yas, Airtel Money (minimum)
- [ ] **BRELA** — file trademark application for *Pamoja+* word mark + logo + tagline
- [ ] **Counsel** — engage a TZ lawyer for retainer (target TZS 500k–1.5M/month)

### 1.2 Legal documents (drafts ready, reviewed by counsel)
- [ ] Terms & Conditions
- [ ] Privacy Policy
- [ ] Seller Agreement
- [ ] Refund & Dispute Policy
- [ ] Prohibited Products Policy
- [ ] Ambassador Agreement (with WHT clause)
- [ ] Paid Promotion Agreement
- [ ] Cookie Policy

### 1.3 Brand & assets
- [ ] Logo variants exported (full, mark-only, monochrome, social avatars)
- [ ] Brand tokens locked in `brand/tokens.json`
- [ ] 1-page brand guideline PDF
- [ ] Email signature, WhatsApp profile, IG/TikTok/FB handles claimed
- [ ] Domain registered: `pamojaplus.co.tz` (primary), `.com` (defensive)

### 1.4 Product
- [ ] Next.js + Tailwind + Framer Motion scaffold pushed to GitHub
- [ ] Vercel preview deploy working
- [ ] Theme tokens applied
- [ ] Placeholder routes for all 10 modules

### 1.5 Ops
- [ ] WhatsApp Business number live with auto-reply
- [ ] Google Workspace (or similar): pamojaplus.co.tz emails
- [ ] Notion/ClickUp workspace, channels in Slack/WhatsApp
- [ ] Seller pipeline tracker (Google Sheets / Airtable)
- [ ] KPI weekly tracker template

**Exit gate:** Company exists, bank works, T&Cs ready, internal system loads at `localhost:3000`.

---

## 2. Month 1 — Foundation (Weeks 1–4)

**Scope discipline:** **Dar es Salaam only** (Kinondoni, Ilala, Ubungo). Do not chase Mwanza/Arusha yet.

### Week 1 — Internal setup
| Owner | Task | Output |
|---|---|---|
| MD | Approve final pricing & seller pitch | Locked pricing card |
| Ops Mgr | Build seller onboarding form (web + WhatsApp template) | Form live |
| BD Mgr | Draft pitch deck (5 slides) | PDF + Slidev |
| Marketing | Brand stories template, IG/TikTok/FB pages active | 1st post |
| Tech | Internal dashboard mock with seed data | `/dashboard` works |
| Finance | Invoice template, receipt template, expense tracker | Templates in Drive |

### Week 2 — Seller preparation
- Compile **lead list of 50 businesses** across food, wellness, beauty, fashion, home, services
- Send first 10 cold pitches via WhatsApp + email
- Build seller verification checklist (per Section 13 of legal doc)

### Week 3 — First onboarding
- **Target: 10–15 verified sellers, 30–50 listings live**
- Photo standards enforced (min 3 product images, 1080×1080)
- Test the inquiry flow end-to-end with 2 friendly sellers

### Week 4 — Soft launch
- Announce on IG/TikTok/FB, Swahili-first captions
- 5 "Deal of the Day" posts
- 3 brand spotlights
- Collect feedback from first 5 shoppers + 5 sellers

**Exit gate (Month 1 KPIs):** 15–20 sellers · 50+ listings · active social pages · 5+ recorded shopper inquiries.

---

## 3. Month 2 — Market Testing (Weeks 5–8)

**Theme:** quality up, ambassadors in, first paid pilot.

### Week 5 — Clean up
- Audit all listings: descriptions, prices, photos, deal expiry
- Remove anything weak; archive non-responsive sellers
- Lock weekly content calendar (M planning, T–Th execution, F review)

### Week 6 — Grow supply
- Contact 20–30 more businesses; target 10–15 onboardings
- Focus categories that pulled inquiries in Month 1
- Tag 5 candidates for paid boost

### Week 7 — Ambassador pilot
- Recruit 5–10 ambassadors (digital + campus + field mix)
- Sign Ambassador Agreements
- Launch referral tracking sheet
- First payout cycle (target end of Week 8)

### Week 8 — Paid boost pilot + review
- Run paid deal boost (TZS 25,000/week) for 3–5 sellers
- Run featured-slot pilot (TZS 50,000/week) for 1–2 sellers
- Measure: inquiries-per-boost, conversion to paid plan
- Quarterly mid-point review

**Exit gate (Month 2 KPIs):** 25–35 sellers · 100+ listings · 5+ active ambassadors · 3+ paid boost trials · ≥1 verified inquiry-to-sale story.

---

## 4. Month 3 — Stabilization & Monetization (Weeks 9–12)

**Theme:** turn the test into recurring revenue.

### Week 9 — Paid plans live
- Launch Pamoja Growth (TZS 15,000) and Pamoja Plus (TZS 35,000)
- Pitch upgrade to top 10 sellers from Month 2
- Recurring billing via mobile money push or manual confirm

### Week 10 — Trust system
- Verified Seller badge live
- Response-rate stars / "Responds within 24h" labels
- Collect 5+ written testimonials with consent

### Week 11 — Brand spotlight partnerships
- Pitch 5 brands (wellness, food, beauty) for Brand Spotlight (TZS 100k–200k)
- Aim for 1–2 signed campaigns
- Brand story + marketplace feature + social post + ambassador push

### Week 12 — Review & plan Q2
- Revenue review vs target TZS 300k–1.5M cumulative
- Decide: stay in Dar or pilot Arusha/Mwanza in Q2?
- Decide: introduce aggregator + checkout in Q2?
- Decide: hire next role (Operations Coordinator? Content Creator?)

**Exit gate (Month 3 KPIs):** 40–60 sellers · 150+ listings · 5–15 paying sellers · ≥1 brand spotlight signed · written Q2 plan.

---

## 5. Cross-Cutting Workstreams

### 5.1 Legal & finance heartbeat
| Cadence | Action |
|---|---|
| Weekly | Reconcile mobile money inflows to invoices |
| Weekly | Update seller pipeline tracker |
| Monthly | Check turnover vs VAT threshold (TZS 200M) |
| Monthly | File PAYE, NSSF, WCF if employees onboard |
| Monthly | Counsel review of any new content category |
| Quarterly | TRA filings as required |

### 5.2 Data protection
- Week 2: assess PDPC registration scope, file as data controller
- Week 4: privacy notice live on all forms
- Week 8: data retention policy circulated to team
- Week 12: first internal data-access audit

### 5.3 Product cadence
- Daily: bug triage on internal system (15 min)
- Weekly: 1 feature ship, 1 polish ship
- Bi-weekly: deploy to production behind auth
- Monthly: usability check with 1 founder + 1 ops user

---

## 6. Risk Register & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Sellers list but don't respond to inquiries | High | High | Response-rate stars; suspend non-responders after 2 strikes |
| R2 | Wellness/cosmetic seller publishes regulated claim | Medium | High | Pre-publish content approval; TMDA-aware checklist |
| R3 | Mobile money MDR eats commission margin | High | Medium | Negotiate merchant rates at scale; structure commission net |
| R4 | PDPC complaint from a shopper | Low | High | Privacy policy live Day 1; consent on all forms |
| R5 | Ambassador misrepresents the brand | Medium | Medium | Ambassador Agreement + content approval rule |
| R6 | Fake/counterfeit goods listed | Medium | High | Prohibited Products Policy + verification checklist |
| R7 | Internal team burns out from scope creep | High | High | Strict weekly cadence; "what not to do" list from Timeline doc |
| R8 | Aggregator integration takes longer than 1 sprint | Medium | Medium | Start integration spike in Week 8, not Week 12 |
| R9 | Founder bottleneck on approvals | Medium | Medium | Pre-agreed approval matrix (see Team doc §18) |
| R10 | Trademark refused | Low | Medium | File alternative marks early; have fallback name |

---

## 7. Budget Indicators (TZS, indicative)

> Validate with your accountant. Numbers are starter ranges.

| Line item | Pre-launch | Per month (M1–M3) |
|---|---|---|
| BRELA registration + trademark | 500,000 – 1,200,000 | — |
| Legal retainer | — | 500,000 – 1,500,000 |
| Accountant | — | 300,000 – 800,000 |
| Domain + email + hosting | 200,000 | 50,000 |
| Mobile money merchant fees | — | variable (MDR ~1.5–2.5%) |
| Founder + 2 core staff stipend | — | 3,000,000 – 6,000,000 |
| Marketing (ads, content) | 300,000 | 500,000 – 1,500,000 |
| Ambassador rewards | — | 100,000 – 500,000 |
| Misc (transport, meetings) | 200,000 | 300,000 |
| **Indicative total** | **1.2M – 1.9M** | **4.75M – 11M / month** |

**3-month indicative cash need: TZS 16M – 35M.** Refine with real salaries and bootstrap appetite.

---

## 8. Hiring Plan

| Month | Hire | Type |
|---|---|---|
| Pre-launch | Operations Manager | Full-time |
| Pre-launch | BD Manager | Full-time |
| Pre-launch | Marketing & Community Manager | Full-time |
| Pre-launch | Tech Lead / Developer | Full-time or contract |
| Month 1 | Content Creator | Full-time or contract |
| Month 1 | Customer Support Officer | Part-time |
| Month 2 | Finance/Admin Officer | Part-time |
| Month 2 | 5–10 Ambassadors | Commission |
| Month 3 | Seller Onboarding Officer | Full-time (if growth justifies) |

---

## 9. Definition of "Quarter 1 Success"

By end of Week 12, all of these are true:

- [ ] 40–60 verified sellers live
- [ ] 150+ listings live, ≥80% with complete profile
- [ ] 5–15 paying sellers (mix of Growth + Plus)
- [ ] ≥1 brand spotlight campaign signed
- [ ] TZS 300k–1.5M cumulative revenue
- [ ] 5+ active ambassadors with paid referrals
- [ ] Internal system in daily use by ops team
- [ ] Public website live on `pamojaplus.co.tz`
- [ ] No outstanding regulator issue (PDPC, TRA, BRELA)
- [ ] Written Q2 plan signed by founders

If 8 of 10 are true, you ship Q2. If fewer than 6 are true, hold and fix the operating rhythm before scaling.

---

## 10. What Not to Do (the discipline list)

Reproduced and expanded from the Timeline doc — pin this above every desk.

- ❌ Don't expand outside Dar es Salaam in Q1
- ❌ Don't launch checkout/payment-holding in Q1
- ❌ Don't host TMDA-regulated wellness claims
- ❌ Don't hire more than 6–8 core people in Q1
- ❌ Don't create more than 6 categories
- ❌ Don't run more than 2 campaigns at once
- ❌ Don't pay ambassadors in cash without WHT consideration
- ❌ Don't accept seller listings without verification
- ❌ Don't promise delivery you can't fulfill
- ❌ Don't skip the Friday review

---

**Sign-off:** Founders + Ops Manager initial this plan before Week 1.
