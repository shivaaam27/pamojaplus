# Pamoja+ — Operations Runbook

> Day-to-day playbook for the ops team. Pin this in your Slack/WhatsApp ops channel.

---

## Daily cadence

| Time | What | Where |
|---|---|---|
| 09:00 | Open **Dashboard** — clear anything in *Needs attention* | `/dashboard` |
| 09:15 | Triage **Onboarding queue** — move new pitches to Reviewing | `/dashboard/applications` |
| 10:00 | Review **KYC queue** — approve or request fix | `/dashboard/kyc` |
| 11:00 | Review **Listings moderation** — approve or request changes | `/dashboard/listings` |
| Throughout | Nudge sellers in **Inquiries → stale >48h** | `/dashboard/inquiries?f=stale` |
| 16:00 | Spot-check **Compliance** — clear any new flags | `/dashboard/compliance` |
| 17:00 | Friday only: build the **weekly payouts batch** | `/dashboard/payouts` |

---

## Common tasks

### Onboard a new seller (from cold pitch)

1. **`/dashboard/applications`** → click the row to read the full pitch.
2. Decide:
   - **Approve** → creates a `sellers` row (status: unverified, plan: free, tier: none).
   - **Reject** → archives the application.
3. Tell the seller their account exists. Send them `/seller/signup` with the same email.
4. Seller signs up → portal auto-links (via `claimSellerProfile()`).
5. Ask them to upload KYC docs in `/seller/kyc`.

### Verify a seller (move to Bronze/Silver/Gold)

KYC tier auto-promotes when these docs are approved:

| Tier | Required approved documents |
|---|---|
| Bronze | Any one |
| Silver | id_front + id_back + selfie |
| Gold   | Silver + business_licence |

To approve:

1. **`/dashboard/kyc`** → filter `pending`.
2. Click **eye** to preview the doc (signed URL, valid 5 min).
3. Click **check** to approve or **X** to reject (you'll be prompted for a reason).
4. Tier auto-updates via `bump_seller_tier()` RPC; check on `/dashboard/sellers/[id]`.

### Approve a listing

1. **`/dashboard/listings`** → filter `pending` (oldest first by default).
2. Read title + description; check for compliance flag count in red.
3. Decide:
   - **Approve** → status='live', appears on `/marketplace`.
   - **Request changes** → status='draft', seller can edit and re-submit.
   - **Reject** → status='removed'.
4. (Re-edits re-queue automatically via the autoflag trigger.)

### Handle a compliance flag

1. **`/dashboard/compliance`** → flags are pre-prioritized by oldest.
2. Click into the entity (linked to listings page for now).
3. Either:
   - Edit the listing yourself via the seller drilldown, or
   - Request changes via `/dashboard/listings`.
4. Then **Mark cleared** or **Action taken** on the flag.

### Handle a PDPC data-subject request

Tanzania's PDPC requires a response within 30 days.

1. Receive request (via email/form).
2. Insert into `data_subject_requests` (manually in SQL or build a small intake form — TODO).
3. **`/dashboard/compliance`** → DSR table.
4. Click **Start** → status='in_progress'.
5. Fulfil the request (export their data / delete their rows). Reference the `audit_log` for evidence.
6. Click **Fulfil** with a closing note.

### Run the weekly payout batch (Fridays)

1. **`/dashboard/payouts`** → filter `open`.
2. For each ambassador whose referrals matured in the last week:
   - Schedule a payout. Pamoja+ auto-deducts **5% WHT** (Tanzanian withholding tax on resident service fees).
3. Review the *Pending payouts total* banner.
4. Approve each → status='approved'.
5. Pay out via M-Pesa / Mixx by Yas / Airtel Money merchant portal.
6. Click **Mark paid**, paste the MMO reference.

### Send a broadcast

1. **`/dashboard/broadcasts`** → Composer.
2. Pick a channel (WhatsApp / SMS / Email).
3. Pick segment filters (plan / tier / location / verified). Click **Preview count**.
4. Compose the message — keep WhatsApp templates pre-approved (per Meta policy).
5. **Send**. Rows are queued in the `notifications` table.

> ⚠️ **Phase 1 caveat:** Delivery is not yet wired to Beem / 360dialog / Resend. The `notifications` queue is the system of record; an Inngest worker (Phase 3) will drain it.

### Mediate a dispute

1. **`/dashboard/disputes`** → list sorted by oldest. Red badge = SLA breach.
2. Click into the dispute → read message thread.
3. Post a team reply (counts as the official Pamoja+ position).
4. Move state:
   - **Mediation** when both sides are talking.
   - **Resolved (buyer/seller)** with a resolution note.
   - **Escalated** for legal/founder attention.
   - **Closed** for stale / withdrawn cases.

### Reconcile revenue (weekly)

1. Pull mobile-money merchant statement (M-Pesa, Mixx, Airtel) for the week.
2. **`/dashboard/revenue`** → "Record a revenue event" for each settled inflow.
3. Tag the seller, type (subscription / boost / spotlight / commission), MM ref.
4. Cross-check the **VAT threshold** bar — orange at 80%, file VAT registration before red.

### Add a team member

See [MIGRATIONS.md → Bootstrapping the first team member](./MIGRATIONS.md#bootstrapping-the-first-team-member).
The `/dashboard/team` page lets a founder change a member's role or remove them once they exist.

---

## SLA targets

| What | Target |
|---|---|
| Onboarding queue: new → reviewing | < 24h |
| KYC pending → decision | < 24h |
| Listing pending → decision | < 24h |
| Inquiry (seller side): unresponded > 48h | nudge automatically (Inngest, Phase 3) |
| Dispute: first reply | 24h |
| Dispute: decision | 72h |
| PDPC DSR | 30 days |
| Ambassador payout | weekly (Friday) |

---

## Escalation matrix

| Trigger | Notify |
|---|---|
| Compliance flag kind = `prohibited` or `copyright` | Founder + Counsel |
| Compliance flag kind = `tmda_term` on a wellness/cosmetic listing | Ops Manager → TMDA-aware reviewer |
| Dispute escalated | Founder |
| PDPC DSR > 25 days old | Founder + Counsel |
| Revenue rolling-12m > 80% of TZS 200M | Finance Manager (start VAT registration) |
| Payout fails twice | Finance + Ops |
| Authentication outage | Tech Lead (re-check Supabase status page) |

---

## When something looks off

| Symptom | First check |
|---|---|
| "Bucket not found" on KYC upload | Migration 0004 not applied — see MIGRATIONS.md |
| New listings don't appear in moderation | Migration 0005 not applied (trigger missing) |
| Login loops back to /login | No `team_users` row for your auth.uid — see bootstrap snippet |
| Marketplace is empty | No verified sellers OR no `live` listings exist |
| Dashboard KPIs all zero | Supabase env vars missing in Vercel |
| Audit log empty | Either no edits happened yet OR triggers in 0002 didn't attach (re-run 0002) |
| `claimSellerProfile()` didn't link | No `sellers` row exists with that email — approve their application first |

---

## Backups

Supabase takes daily automatic backups (7-day retention on free tier, 30+ on pro). Founder responsibility:

- Every Monday, in Supabase Dashboard → Database → Backups, confirm the latest backup is < 24h old.
- Quarterly: download a manual `pg_dump` and store off-platform.

---

## Phase 1 boundaries (don't break these)

- ❌ No public checkout in Phase 1. Buyers contact sellers via WhatsApp (logged in `inquiries`).
- ❌ No public reviews until verified-buyer flagging is wired (Phase 3).
- ❌ No SMS/WhatsApp send to non-consented recipients. The `consent_log` is the source of truth.
- ❌ No data export to non-EU/US/AF endpoints (PDPC).
