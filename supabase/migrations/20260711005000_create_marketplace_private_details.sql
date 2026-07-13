-- Private personal/contact data for marketplace opportunities.
-- This table stores protected data and must never be exposed in the public lead list.

create table if not exists public.marketplace_opportunity_private_details (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null unique references public.marketplace_opportunities(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  whatsapp text,
  email text,
  document_notes text,
  case_history text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists marketplace_opportunity_private_details_created_by_idx
  on public.marketplace_opportunity_private_details (created_by, created_at desc);

create or replace function public.set_marketplace_opportunity_private_details_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_marketplace_opportunity_private_details_updated_at on public.marketplace_opportunity_private_details;

create trigger set_marketplace_opportunity_private_details_updated_at
before update on public.marketplace_opportunity_private_details
for each row
execute function public.set_marketplace_opportunity_private_details_updated_at();

alter table public.marketplace_opportunity_private_details enable row level security;

grant select, insert on public.marketplace_opportunity_private_details to authenticated;

drop policy if exists "Users can create private details for own opportunities" on public.marketplace_opportunity_private_details;
create policy "Users can create private details for own opportunities"
on public.marketplace_opportunity_private_details
for insert
to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1
    from public.marketplace_opportunities opportunity
    where opportunity.id = opportunity_id
      and opportunity.created_by = auth.uid()
  )
);

drop policy if exists "Users can view private details after unlock or ownership" on public.marketplace_opportunity_private_details;
create policy "Users can view private details after unlock or ownership"
on public.marketplace_opportunity_private_details
for select
to authenticated
using (
  created_by = auth.uid()
  or exists (
    select 1
    from public.marketplace_opportunities opportunity
    where opportunity.id = opportunity_id
      and opportunity.unlocked_by = auth.uid()
  )
);

notify pgrst, 'reload schema';