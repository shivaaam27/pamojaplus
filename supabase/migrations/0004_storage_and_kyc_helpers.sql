-- =====================================================================
-- Pamoja+ — Storage bucket for KYC docs + tier-bump helper
-- =====================================================================

-- Private bucket; we serve docs to ops via signed URLs only.
insert into storage.buckets (id, name, public)
  values ('seller-docs', 'seller-docs', false)
  on conflict (id) do nothing;

-- Storage policies: only team can read/write seller-docs.
drop policy if exists "seller-docs team read"  on storage.objects;
create policy "seller-docs team read"
  on storage.objects for select
  using (bucket_id = 'seller-docs' and is_team_member());

drop policy if exists "seller-docs team write" on storage.objects;
create policy "seller-docs team write"
  on storage.objects for insert
  with check (bucket_id = 'seller-docs' and is_team_member());

drop policy if exists "seller-docs team update" on storage.objects;
create policy "seller-docs team update"
  on storage.objects for update
  using (bucket_id = 'seller-docs' and is_team_member());

drop policy if exists "seller-docs team delete" on storage.objects;
create policy "seller-docs team delete"
  on storage.objects for delete
  using (bucket_id = 'seller-docs' and is_team_member());

-- Auto-promote tier when KYC doc set looks complete.
-- Bronze: any approved doc.
-- Silver: id_front + id_back + selfie approved.
-- Gold:   silver + business_licence approved.
create or replace function bump_seller_tier(p_seller uuid)
returns void language plpgsql as $$
declare
  has_id_front       boolean;
  has_id_back        boolean;
  has_selfie         boolean;
  has_business_lic   boolean;
  any_approved       boolean;
  current_tier       verify_tier;
  next_tier          verify_tier;
begin
  select tier into current_tier from sellers where id = p_seller;

  select
    bool_or(kind = 'id_front'         and status = 'approved'),
    bool_or(kind = 'id_back'          and status = 'approved'),
    bool_or(kind = 'selfie'           and status = 'approved'),
    bool_or(kind = 'business_licence' and status = 'approved'),
    bool_or(status = 'approved')
  into has_id_front, has_id_back, has_selfie, has_business_lic, any_approved
  from seller_documents where seller_id = p_seller;

  if has_id_front and has_id_back and has_selfie and has_business_lic then
    next_tier := 'gold';
  elsif has_id_front and has_id_back and has_selfie then
    next_tier := 'silver';
  elsif any_approved then
    next_tier := 'bronze';
  else
    next_tier := 'none';
  end if;

  if next_tier is distinct from current_tier then
    update sellers
      set tier = next_tier,
          tier_granted_at = case when next_tier <> 'none' then now() else null end,
          verified = (next_tier <> 'none')
      where id = p_seller;

    insert into verification_events (seller_id, actor_id, event, from_tier, to_tier, reason)
    values (p_seller,
            nullif(current_setting('request.jwt.claims', true)::jsonb->>'sub','')::uuid,
            'tier_changed', current_tier, next_tier, 'auto-bump from KYC approvals');
  end if;
end $$;
