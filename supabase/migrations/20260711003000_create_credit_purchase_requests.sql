-- Credit purchase requests.
-- Requests do not add credits automatically and do not charge the user.

create table if not exists public.lawyer_credit_purchase_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  requested_credits integer not null check (requested_credits > 0),
  amount_cents integer check (amount_cents is null or amount_cents >= 0),
  currency text not null default 'BRL',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'canceled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lawyer_credit_purchase_requests_user_id_idx
  on public.lawyer_credit_purchase_requests (user_id, created_at desc);

create index if not exists lawyer_credit_purchase_requests_status_idx
  on public.lawyer_credit_purchase_requests (status);

create or replace function public.set_lawyer_credit_purchase_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lawyer_credit_purchase_requests_updated_at on public.lawyer_credit_purchase_requests;

create trigger set_lawyer_credit_purchase_requests_updated_at
before update on public.lawyer_credit_purchase_requests
for each row
execute function public.set_lawyer_credit_purchase_requests_updated_at();

alter table public.lawyer_credit_purchase_requests enable row level security;

grant select, insert on public.lawyer_credit_purchase_requests to authenticated;

drop policy if exists "Users can view own credit purchase requests" on public.lawyer_credit_purchase_requests;
create policy "Users can view own credit purchase requests"
on public.lawyer_credit_purchase_requests
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can create own pending credit purchase requests" on public.lawyer_credit_purchase_requests;
create policy "Users can create own pending credit purchase requests"
on public.lawyer_credit_purchase_requests
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
  and requested_credits > 0
);

notify pgrst, 'reload schema';