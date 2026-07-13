-- Track complementary marketplace opportunities with a structured parent relationship.
-- The original opportunity remains immutable; complementary triages become separate leads linked to the original case.

alter table if exists public.marketplace_opportunities
  add column if not exists parent_opportunity_id uuid null references public.marketplace_opportunities(id) on delete set null;

create index if not exists marketplace_opportunities_parent_opportunity_id_idx
  on public.marketplace_opportunities(parent_opportunity_id);

notify pgrst, 'reload schema';