-- Marketplace credit and unlock flow.
-- Personal/contact data is still not stored in marketplace_opportunities.

create table if not exists public.lawyer_credit_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lawyer_credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  transaction_type text not null check (transaction_type in ('purchase', 'consume', 'refund', 'adjustment')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_opportunity_unlocks (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.marketplace_opportunities(id) on delete cascade,
  lawyer_id uuid not null references auth.users(id) on delete cascade,
  credit_cost integer not null check (credit_cost >= 0),
  created_at timestamptz not null default now(),
  unique (opportunity_id, lawyer_id)
);

create index if not exists lawyer_credit_transactions_user_id_idx
  on public.lawyer_credit_transactions (user_id, created_at desc);

create index if not exists marketplace_opportunity_unlocks_lawyer_id_idx
  on public.marketplace_opportunity_unlocks (lawyer_id, created_at desc);

create or replace function public.set_lawyer_credit_accounts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lawyer_credit_accounts_updated_at on public.lawyer_credit_accounts;

create trigger set_lawyer_credit_accounts_updated_at
before update on public.lawyer_credit_accounts
for each row
execute function public.set_lawyer_credit_accounts_updated_at();

alter table public.lawyer_credit_accounts enable row level security;
alter table public.lawyer_credit_transactions enable row level security;
alter table public.marketplace_opportunity_unlocks enable row level security;

grant select on public.lawyer_credit_accounts to authenticated;
grant select on public.lawyer_credit_transactions to authenticated;
grant select on public.marketplace_opportunity_unlocks to authenticated;

drop policy if exists "Users can view own credit account" on public.lawyer_credit_accounts;
create policy "Users can view own credit account"
on public.lawyer_credit_accounts
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can view own credit transactions" on public.lawyer_credit_transactions;
create policy "Users can view own credit transactions"
on public.lawyer_credit_transactions
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can view own marketplace unlocks" on public.marketplace_opportunity_unlocks;
create policy "Users can view own marketplace unlocks"
on public.marketplace_opportunity_unlocks
for select
to authenticated
using (lawyer_id = auth.uid());

drop policy if exists "Authenticated users can view open marketplace opportunities" on public.marketplace_opportunities;
create policy "Authenticated users can view open marketplace opportunities"
on public.marketplace_opportunities
for select
to authenticated
using (
  status in ('open', 'reserved')
  or unlocked_by = auth.uid()
);

drop function if exists public.unlock_marketplace_opportunity(uuid);

create function public.unlock_marketplace_opportunity(target_opportunity_id uuid)
returns table (
  ok boolean,
  message text,
  opportunity_id uuid,
  remaining_credits integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  opportunity_record public.marketplace_opportunities%rowtype;
  current_balance integer;
  required_credits integer;
begin
  if current_user_id is null then
    return query select false, 'Usuario nao autenticado.', null::uuid, null::integer;
    return;
  end if;

  select *
    into opportunity_record
  from public.marketplace_opportunities
  where id = target_opportunity_id
  for update;

  if not found then
    return query select false, 'Oportunidade nao encontrada.', null::uuid, null::integer;
    return;
  end if;

  if opportunity_record.status not in ('open', 'reserved') then
    return query select false, 'Oportunidade indisponivel para desbloqueio.', opportunity_record.id, null::integer;
    return;
  end if;

  if opportunity_record.created_by = current_user_id then
    return query select false, 'Voce nao pode desbloquear uma oportunidade criada por voce.', opportunity_record.id, null::integer;
    return;
  end if;

  required_credits := greatest(coalesce(opportunity_record.credit_cost, 1), 0);

  select balance
    into current_balance
  from public.lawyer_credit_accounts
  where user_id = current_user_id
  for update;

  if not found then
    return query select false, 'Conta de creditos nao encontrada.', opportunity_record.id, null::integer;
    return;
  end if;

  if current_balance < required_credits then
    return query select false, 'Saldo de creditos insuficiente.', opportunity_record.id, current_balance;
    return;
  end if;

  update public.lawyer_credit_accounts
  set balance = balance - required_credits
  where user_id = current_user_id;

  insert into public.lawyer_credit_transactions (user_id, amount, transaction_type, metadata)
  values (
    current_user_id,
    required_credits * -1,
    'consume',
    jsonb_build_object('opportunity_id', opportunity_record.id)
  );

  insert into public.marketplace_opportunity_unlocks (opportunity_id, lawyer_id, credit_cost)
  values (opportunity_record.id, current_user_id, required_credits)
  on conflict (opportunity_id, lawyer_id) do nothing;

  update public.marketplace_opportunities
  set status = 'unlocked',
      unlocked_by = current_user_id,
      unlocked_at = now()
  where id = opportunity_record.id;

  return query select true, 'Oportunidade desbloqueada com sucesso.', opportunity_record.id, current_balance - required_credits;
end;
$$;

grant execute on function public.unlock_marketplace_opportunity(uuid) to authenticated;

notify pgrst, 'reload schema';