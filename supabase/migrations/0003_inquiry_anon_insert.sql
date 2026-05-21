-- =====================================================================
-- Pamoja+ — Allow anonymous inquiry inserts (powers /api/inquiry)
-- =====================================================================
-- The /api/inquiry route runs with the anon key (no user). It records the
-- buyer's click before redirecting to WhatsApp. We accept any insert from
-- anon, but reads remain team-only (existing inquiries_team_all policy).
-- =====================================================================

drop policy if exists inquiries_anon_insert on inquiries;
create policy inquiries_anon_insert on inquiries
  for insert
  with check (true);
