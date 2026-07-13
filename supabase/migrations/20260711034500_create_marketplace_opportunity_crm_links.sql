-- Persist the operational handoff from an unlocked marketplace opportunity to CRM records.
-- This prevents duplicate conversions after refresh and keeps an audit trail per lawyer/admin.

create table if not exists public.marketplace_opportunity_crm_links (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.marketplace_opportunities(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  case_id uuid null references public.client_cases(id) on delete set null,
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (opportunity_id, created_by)
);

create index if not exists marketplace_opportunity_crm_links_created_by_idx
  on public.marketplace_opportunity_crm_links (created_by, created_at desc);

create index if not exists marketplace_opportunity_crm_links_client_id_idx
  on public.marketplace_opportunity_crm_links (client_id);

alter table public.marketplace_opportunity_crm_links enable row level security;

drop policy if exists "Legal operators can read own marketplace CRM links" on public.marketplace_opportunity_crm_links;
create policy "Legal operators can read own marketplace CRM links"
  on public.marketplace_opportunity_crm_links
  for select
  to authenticated
  using (
    public.is_current_user_legal_operator()
    and created_by = auth.uid()
  );

drop policy if exists "Legal operators can insert own marketplace CRM links" on public.marketplace_opportunity_crm_links;
create policy "Legal operators can insert own marketplace CRM links"
  on public.marketplace_opportunity_crm_links
  for insert
  to authenticated
  with check (
    public.is_current_user_legal_operator()
    and created_by = auth.uid()
    and exists (
      select 1
      from public.marketplace_opportunities opportunity
      where opportunity.id = marketplace_opportunity_crm_links.opportunity_id
        and opportunity.unlocked_by = auth.uid()
    )
    and exists (
      select 1
      from public.clients client
      where client.id = marketplace_opportunity_crm_links.client_id
        and (client.owner_user_id = auth.uid() or public.is_current_user_admin())
    )
  );

notify pgrst, 'reload schema';