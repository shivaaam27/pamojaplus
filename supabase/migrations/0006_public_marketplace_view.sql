-- =====================================================================
-- Pamoja+ — Public marketplace view
-- =====================================================================
-- Pre-joined view used by the public /marketplace pages so we don't need
-- a foreign-key embed at every render. Respects RLS automatically because
-- views inherit from their base tables' policies.
-- =====================================================================

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
  s.category,
  s.location,
  s.tier,
  s.verified,
  s.whatsapp,
  s.response_rate
from listings l
join sellers s on s.id = l.seller_id
where l.status = 'live' and s.verified = true;

-- Also expose a public-safe sellers view (no PII columns)
create or replace view v_public_sellers as
select
  s.id,
  s.business_name,
  s.category,
  s.location,
  s.tier,
  s.verified,
  s.response_rate,
  s.created_at,
  (select count(*) from listings l where l.seller_id = s.id and l.status = 'live') as live_listings
from sellers s
where s.verified = true;
