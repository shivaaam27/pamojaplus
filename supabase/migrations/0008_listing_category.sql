-- =====================================================================
-- Pamoja+ — Per-listing category (overrides seller.category if set)
-- =====================================================================
-- Sellers may sell across categories. Default behaviour: listing inherits
-- seller's category. Setting listings.category lets them override per item.
-- =====================================================================

alter table listings add column if not exists category text;
create index if not exists idx_listings_category on listings(category);

-- Update the public view to prefer listing.category, fall back to seller.category
create or replace view v_public_listings as
select
  l.id              as listing_id,
  l.title,
  l.description,
  l.price_tzs,
  l.photos,
  l.deal_type,
  l.deal_expires_at,
  l.created_at      as listed_at,
  s.id              as seller_id,
  s.business_name,
  coalesce(l.category, s.category) as category,
  s.location,
  s.tier,
  s.verified,
  s.whatsapp,
  s.response_rate
from listings l
join sellers s on s.id = l.seller_id
where l.status = 'live' and s.verified = true;
