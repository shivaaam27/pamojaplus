-- =====================================================================
-- Pamoja+ — Listing auto-flag + moderation queue trigger
-- =====================================================================
-- On insert/update of a listing:
--   1. Scan title + description against prohibited_keywords (active rows).
--      For each hit, write a compliance_flags row (entity_table='listings').
--   2. Create a pending listing_reviews row if none exists for this listing,
--      OR if the listing was edited after the last review.
-- =====================================================================

create or replace function listings_autoflag_and_queue()
returns trigger language plpgsql as $$
declare
  kw  record;
  txt text := lower(coalesce(new.title,'') || ' ' || coalesce(new.description,''));
begin
  -- Auto-flag against the prohibited_keywords dictionary
  for kw in select term, kind from prohibited_keywords where active loop
    if position(lower(kw.term) in txt) > 0 then
      insert into compliance_flags (entity_table, entity_id, kind, detail, source, status)
      values ('listings', new.id, kw.kind, 'Matched keyword: ' || kw.term, 'auto', 'open');
    end if;
  end loop;

  -- Queue for moderation: insert a pending listing_reviews row if there isn't
  -- already an undecided one for this listing.
  if not exists (
    select 1 from listing_reviews
    where listing_id = new.id and status = 'pending'
  ) then
    insert into listing_reviews (listing_id, status) values (new.id, 'pending');
  end if;

  return new;
end $$;

drop trigger if exists trg_listings_autoflag on listings;
create trigger trg_listings_autoflag
  after insert or update of title, description on listings
  for each row execute function listings_autoflag_and_queue();
