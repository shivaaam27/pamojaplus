-- =====================================================================
-- Pamoja+ — Seller portal
-- =====================================================================
-- Link auth.users to sellers, and add row-level policies so a signed-in
-- seller can read & manage their own row, listings, KYC docs, inquiries.
-- Team policies still apply (is_team_member()).
-- =====================================================================

alter table sellers add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists idx_sellers_user on sellers(user_id);

-- Helper: is the caller the owner of seller X?
create or replace function is_seller_owner(p_seller uuid)
returns boolean language sql security definer stable as $$
  select exists (select 1 from sellers where id = p_seller and user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- Sellers: a seller can read & update their own row (limited columns
-- via app logic; RLS just gates row access).
-- ---------------------------------------------------------------------
drop policy if exists sellers_self_read on sellers;
create policy sellers_self_read on sellers
  for select using (verified = true or is_team_member() or auth.uid() = user_id);

drop policy if exists sellers_self_update on sellers;
create policy sellers_self_update on sellers
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- Listings: a seller can CRUD their own listings; public sees live ones
-- from verified sellers (already covered). Insert/update goes through the
-- existing autoflag trigger.
-- ---------------------------------------------------------------------
drop policy if exists listings_self_all on listings;
create policy listings_self_all on listings
  for all
  using (is_seller_owner(seller_id) or is_team_member()
         or (status = 'live' and exists (select 1 from sellers s where s.id = seller_id and s.verified = true)))
  with check (is_seller_owner(seller_id) or is_team_member());

-- ---------------------------------------------------------------------
-- KYC: a seller can read their own docs (status) and insert new ones.
-- Only team can approve/reject (review_note, status, reviewer_id).
-- We separate read+insert from update via per-action policies.
-- ---------------------------------------------------------------------
drop policy if exists seller_docs_self_read on seller_documents;
create policy seller_docs_self_read on seller_documents
  for select using (is_seller_owner(seller_id) or is_team_member());

drop policy if exists seller_docs_self_insert on seller_documents;
create policy seller_docs_self_insert on seller_documents
  for insert with check (is_seller_owner(seller_id) or is_team_member());

-- Team-only review (status changes)
drop policy if exists seller_docs_team_review on seller_documents;
create policy seller_docs_team_review on seller_documents
  for update using (is_team_member()) with check (is_team_member());

-- ---------------------------------------------------------------------
-- Inquiries: a seller can read inquiries for their listings, and update
-- 'responded'/'converted' to maintain their response rate.
-- ---------------------------------------------------------------------
drop policy if exists inquiries_self_read on inquiries;
create policy inquiries_self_read on inquiries
  for select using (is_team_member() or is_seller_owner(seller_id));

drop policy if exists inquiries_self_update on inquiries;
create policy inquiries_self_update on inquiries
  for update using (is_seller_owner(seller_id) or is_team_member())
  with check (is_seller_owner(seller_id) or is_team_member());

-- ---------------------------------------------------------------------
-- Storage: sellers can upload to seller-docs *within their own folder*
-- (path prefix = their seller_id). Read is still team-only via existing
-- policy (sellers should not see their KYC images after upload; they see
-- the status badge).
-- ---------------------------------------------------------------------
drop policy if exists "seller-docs self upload" on storage.objects;
create policy "seller-docs self upload"
  on storage.objects for insert
  with check (
    bucket_id = 'seller-docs'
    and (
      is_team_member()
      or exists (
        select 1 from sellers s
        where s.user_id = auth.uid()
          and split_part(storage.objects.name, '/', 1) = s.id::text
      )
    )
  );
