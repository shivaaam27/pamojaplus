# Pamoja+ Sync Workflow

> How edits flow through the project so docs, website, and guides stay aligned.

---

## The rule

After editing any file in `docs/v2/`, **tell me before doing anything else.** Even a short message:

> "Synced edits in Payment v2."

That triggers the sync loop below. Don't run `node scripts/generate-v2-docs.js` until I've absorbed your edits into the script — otherwise your edits get overwritten.

---

## The sync loop

```
You edit  docs/v2/<file>.docx in Word
                │
                ▼
You ping me:  "synced edits in X"
                │
                ▼
I read the edited v2 .docx
I update the SOURCE files (script, content, guides)
I regenerate v2 .docx files
Website hot-reloads automatically (dev server is running)
                │
                ▼
I report back which files changed
```

---

## Source of truth map

This is the canonical map of "where does each piece of information live."

| Topic | Canonical source | Synced to |
|---|---|---|
| **Brand identity / vision / personality** | `PAMOJA_PLUS_GUIDE.md` | `web/app/about/page.tsx`, `web/app/page.tsx`, `docs/v2/Company_Profile_v2.docx` |
| **Color & type tokens** | `brand/tokens.json` | `web/tailwind.config.ts` (auto-imports) |
| **90-day timeline** | `web/content/timeline.ts` | `docs/v2/3_Month_Timeline_v2.docx`, `docs/IMPLEMENTATION_PLAN.md` |
| **Pricing plans** | `web/content/pricing.ts` | `docs/v2/Payment_Structure_v2.docx`, `PAMOJA_PLUS_GUIDE.md` |
| **Team / departments** | `web/content/team.ts` | `docs/v2/Team_Structure_v2.docx` |
| **Milestones / achievements** | `web/content/milestones.ts` | `docs/v2/*.docx` references where relevant |
| **Presentation decks** | `web/content/decks.ts` | live on `/present/<slug>` |
| **Audit findings** | `PAMOJA_PLUS_GUIDE.md` § 3 + `scripts/generate-audit-docx.js` | `docs/Pamoja_Plus_Audit_and_Revisions.docx` |
| **V2 docs content** | `scripts/generate-v2-docs.js` | `docs/v2/*.docx` |
| **Implementation plan** | `docs/IMPLEMENTATION_PLAN.md` | (read-only doc) |
| **Architecture spec** | `docs/SYSTEM_ARCHITECTURE.md` | (read-only doc) |

**Generated files (don't hand-edit, or rename first):**
- Everything in `docs/v2/`
- `docs/Pamoja_Plus_Audit_and_Revisions.docx`
- `web/.next/`

---

## How to phrase common edits

### "Change a price"
> "Pamoja Growth is now TZS 20,000 (was 15,000). Sync everywhere."

I touch: pricing.ts → tailwind nothing → script → guide → regenerate docs.

### "Edit a section in the Legal doc"
> "I edited section 3 of Legal v2 — sync it."

I diff your edited .docx against the script, fold changes into `buildLegal()`, regenerate.

### "Add a new milestone"
> "Add a milestone: 2026-06-01, Reached 100 sellers, featured."

I add to `milestones.ts` (the website page reloads instantly). I don't touch v2 docs unless you want it referenced there too.

### "Change the brand color"
> "Make the green a bit darker."

I update `brand/tokens.json` → Tailwind picks it up on next dev rebuild → entire site updates.

### "Rewrite the vision statement"
> "New vision: '...'. Update the website and the Company Profile v2."

I update PAMOJA_PLUS_GUIDE.md, `web/app/about/page.tsx` (and home if shown), and `buildCompanyProfile()` in the v2 script.

---

## Renaming convention for files you want to keep

If you make hand edits in a v2 docx that should **not** be lost on regen:

1. Rename: `Pamoja_Plus_Payment_Structure_v2.docx` → `Pamoja_Plus_Payment_Structure_FINAL_2026-MM-DD.docx`
2. The renamed file is yours forever.
3. The `_v2.docx` original keeps regenerating cleanly.

Or: ping me with the edits and I'll fold them into the script so v3 has them permanently.

---

## Safety net — git

Git is initialised. Every sync I do becomes a commit, so:

- Mess up a sync? `git checkout -- <file>` reverts that file.
- Want to see what changed? `git diff HEAD~1`
- Want to roll back the whole sync? `git revert HEAD`

I'll commit after each sync with a message like `sync: Payment v2 price change` so the history is readable.

---

## Quick reference

| Want to do | Say to me |
|---|---|
| Sync edits from a v2 doc | "I edited `<file>` — sync it." |
| Apply a one-line change everywhere | "Change X to Y everywhere." |
| Regenerate v2 docs from current script | "Regenerate v2." |
| Roll back the last sync | "Revert the last sync." |
| See current state | "What's the project state?" |
| Add something new | "Add `<thing>` to `<where>`." |

---

**TL;DR — Edit in Word → ping me → I sync everywhere → git commits the change. Don't run the generator scripts yourself until you've pinged me.**
