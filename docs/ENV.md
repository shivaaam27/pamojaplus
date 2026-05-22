# Pamoja+ — Environment Variables

> Set these in **Vercel → Project → Settings → Environment Variables** (Production + Preview). For local, copy to `web/.env.local`.

---

## Required (Phase 1–2)

| Variable | Where to get it | Used by |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Browser + server clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` key | Browser + server clients |

These are enough to run everything in this repo today. The site gracefully no-ops if they're missing (no crashes, but no live data).

---

## Optional (Phase 3 — when real delivery is wired)

| Variable | Source | Used by |
|---|---|---|
| `SUPABASE_SERVICE_ROLE` | Supabase → Project Settings → API → `service_role` `secret` | Background jobs that need to bypass RLS (Inngest workers). **Never expose to the client.** |
| `RESEND_API_KEY` | resend.com | Transactional email |
| `BEEM_API_KEY` + `BEEM_API_SECRET` | beem.africa | SMS to TZ |
| `THREESIXTYDIALOG_API_KEY` | 360dialog.com | WhatsApp Business API |
| `SELCOM_API_KEY` + `SELCOM_API_SECRET` | selcommobile.com | Mobile-money checkout |
| `CLICKPESA_API_KEY` | clickpesa.com | Mobile-money checkout (alternative) |
| `FLUTTERWAVE_SECRET_KEY` | flutterwave.com | Card payments (diaspora) |
| `SENTRY_DSN` | sentry.io | Error monitoring |
| `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` | posthog.com | Product analytics + flags |
| `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` | inngest.com | Background jobs |
| `SMILE_ID_PARTNER_ID` + `SMILE_ID_API_KEY` | smileidentity.com | KYC verification (optional auto-verify) |
| `IP_HASH_SALT` | random 32-byte string | Hashes IPs in `ambassador_clicks` (don't reuse the default `pamoja` in prod) |

---

## Local development

```bash
# web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
IP_HASH_SALT=replace_me_with_a_random_string
```

Then:

```bash
cd web
npm install
npm run dev
```

Visit http://localhost:3000.

---

## Vercel deployment checklist

1. Connect the GitHub repo (`shivaaam27/pamojaplus`).
2. Root Directory: `web` (project lives in a subdirectory).
3. Framework Preset: Next.js (auto-detected).
4. Add the two required env vars above for **Production** AND **Preview**.
5. Deploy.

If you forget the env vars, the app still builds and runs — pages just show empty states or "Supabase env vars not set" messages.

---

## Rotating secrets

- Supabase `anon` key is safe to expose (read-only without auth, subject to RLS). Rotating it requires updating Vercel + redeploying.
- `service_role` key bypasses RLS — treat like a password. Rotate immediately if leaked: Supabase → Project Settings → API → "Reset" the service_role key.
- Beem / Resend / Selcom / Flutterwave keys: rotate via each provider's dashboard, then update Vercel.
