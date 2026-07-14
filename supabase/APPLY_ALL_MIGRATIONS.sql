-- ConectaJus — bundle manual de migrations Supabase
-- Gerado por: npm run supabase:bundle
-- Uso recomendado:
-- 1. Abra o Supabase Dashboard do projeto correto.
-- 2. Acesse SQL Editor.
-- 3. Execute este arquivo em um banco de teste ou preview antes de produção.
-- 4. Depois execute docs/SUPABASE_POST_APPLY_VALIDATION.sql.
--
-- Observação: as migrations originais continuam sendo a fonte de verdade.
-- Este bundle existe apenas para reduzir erro manual de ordem no SQL Editor.


-- =========================================================
-- 01/32 — 20260710120000_create_marketplace_opportunities.sql
-- =========================================================

-- Marketplace Jurídico: oportunidades mascaradas geradas pela triagem por IA.
-- Esta tabela NÃO deve armazenar nome, telefone, e-mail, WhatsApp, documentos ou histórico pessoal completo.
-- Dados pessoais devem permanecer em tabelas privadas e só serem liberados por fluxo auditado de créditos.

create extension if not exists pgcrypto;

create table if not exists public.marketplace_opportunities (
  id uuid primary key default gen_random_uuid(),
  practice_area text,
  city text,
  state text,
  urgency text,
  summary text not null,
  complexity text,
  credit_cost integer not null default 1 check (credit_cost >= 0),
  status text not null default 'open' check (status in ('open', 'reserved', 'unlocked', 'closed', 'archived')),
  source_triage_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  unlocked_by uuid references auth.users(id) on delete set null,
  unlocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists marketplace_opportunities_status_idx
  on public.marketplace_opportunities (status);

create index if not exists marketplace_opportunities_city_idx
  on public.marketplace_opportunities (city);

create index if not exists marketplace_opportunities_practice_area_idx
  on public.marketplace_opportunities (practice_area);

create index if not exists marketplace_opportunities_created_at_idx
  on public.marketplace_opportunities (created_at desc);

create or replace function public.set_marketplace_opportunities_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_marketplace_opportunities_updated_at on public.marketplace_opportunities;

create trigger set_marketplace_opportunities_updated_at
before update on public.marketplace_opportunities
for each row
execute function public.set_marketplace_opportunities_updated_at();

alter table public.marketplace_opportunities enable row level security;

-- Advogados/autenticados podem visualizar somente oportunidades sem dados pessoais.
drop policy if exists "Authenticated users can view open marketplace opportunities" on public.marketplace_opportunities;

create policy "Authenticated users can view open marketplace opportunities"
on public.marketplace_opportunities
for select
to authenticated
using (status in ('open', 'reserved'));

-- Escrita fica reservada ao backend/service role por enquanto.
-- Não criar policies públicas de insert/update/delete sem definir papéis de admin/advogado.


-- =========================================================
-- 02/32 — 20260710123000_allow_authenticated_marketplace_opportunity_insert.sql
-- =========================================================

-- Allow authenticated users to publish masked marketplace opportunities created from triage.
-- The row must point to the authenticated user as created_by.

drop policy if exists "Authenticated users can create marketplace opportunities" on public.marketplace_opportunities;

create policy "Authenticated users can create marketplace opportunities"
on public.marketplace_opportunities
for insert
to authenticated
with check (
  created_by = auth.uid()
  and status = 'open'
  and summary is not null
);


-- =========================================================
-- 03/32 — 20260710130000_create_marketplace_credit_unlock_flow.sql
-- =========================================================

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


-- =========================================================
-- 04/32 — 20260711001000_create_ensure_lawyer_credit_account_rpc.sql
-- =========================================================

-- Initializes a zero-balance credit account for the authenticated user when needed.

create or replace function public.ensure_lawyer_credit_account()
returns table (
  user_id uuid,
  balance integer,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  insert into public.lawyer_credit_accounts (user_id, balance)
  values (current_user_id, 0)
  on conflict (user_id) do nothing;

  return query
  select account.user_id, account.balance, account.updated_at
  from public.lawyer_credit_accounts account
  where account.user_id = current_user_id;
end;
$$;

grant execute on function public.ensure_lawyer_credit_account() to authenticated;

notify pgrst, 'reload schema';


-- =========================================================
-- 05/32 — 20260711003000_create_credit_purchase_requests.sql
-- =========================================================

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


-- =========================================================
-- 06/32 — 20260711005000_create_marketplace_private_details.sql
-- =========================================================

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


-- =========================================================
-- 07/32 — 20260711010000_create_admin_credit_request_approval.sql
-- =========================================================

-- Admin approval flow for credit purchase requests.
-- Admin is inferred from JWT user_metadata.profile or app_metadata.profile = 'admin'.

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    auth.jwt() -> 'user_metadata' ->> 'profile',
    auth.jwt() -> 'app_metadata' ->> 'profile'
  ) = 'admin';
$$;

create or replace function public.list_pending_credit_purchase_requests()
returns table (
  id uuid,
  user_id uuid,
  requested_credits integer,
  amount_cents integer,
  currency text,
  status text,
  notes text,
  created_at timestamptz,
  updated_at timestamptz,
  requester_email text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_user_admin() then
    raise exception 'Acesso administrativo necessario.';
  end if;

  return query
  select
    request.id,
    request.user_id,
    request.requested_credits,
    request.amount_cents,
    request.currency,
    request.status,
    request.notes,
    request.created_at,
    request.updated_at,
    user_account.email::text as requester_email
  from public.lawyer_credit_purchase_requests request
  left join auth.users user_account on user_account.id = request.user_id
  where request.status = 'pending'
  order by request.created_at asc;
end;
$$;

drop function if exists public.approve_credit_purchase_request(uuid);

create function public.approve_credit_purchase_request(target_request_id uuid)
returns table (
  ok boolean,
  message text,
  request_id uuid,
  credited_balance integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  request_record public.lawyer_credit_purchase_requests%rowtype;
  new_balance integer;
begin
  if not public.is_current_user_admin() then
    return query select false, 'Acesso administrativo necessario.', target_request_id, null::integer;
    return;
  end if;

  select *
    into request_record
  from public.lawyer_credit_purchase_requests
  where id = target_request_id
  for update;

  if not found then
    return query select false, 'Solicitacao nao encontrada.', target_request_id, null::integer;
    return;
  end if;

  if request_record.status <> 'pending' then
    return query select false, 'Solicitacao nao esta pendente.', target_request_id, null::integer;
    return;
  end if;

  insert into public.lawyer_credit_accounts (user_id, balance)
  values (request_record.user_id, 0)
  on conflict (user_id) do nothing;

  update public.lawyer_credit_accounts
  set balance = balance + request_record.requested_credits
  where user_id = request_record.user_id
  returning balance into new_balance;

  insert into public.lawyer_credit_transactions (user_id, amount, transaction_type, metadata)
  values (
    request_record.user_id,
    request_record.requested_credits,
    'purchase',
    jsonb_build_object('purchase_request_id', request_record.id, 'approved_by', auth.uid())
  );

  update public.lawyer_credit_purchase_requests
  set status = 'approved',
      notes = coalesce(notes, '') || case when notes is null or notes = '' then '' else E'\n' end || 'Aprovada administrativamente.',
      updated_at = now()
  where id = request_record.id;

  return query select true, 'Solicitacao aprovada e creditos adicionados.', request_record.id, new_balance;
end;
$$;

drop function if exists public.reject_credit_purchase_request(uuid);

create function public.reject_credit_purchase_request(target_request_id uuid)
returns table (
  ok boolean,
  message text,
  request_id uuid,
  credited_balance integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  request_record public.lawyer_credit_purchase_requests%rowtype;
begin
  if not public.is_current_user_admin() then
    return query select false, 'Acesso administrativo necessario.', target_request_id, null::integer;
    return;
  end if;

  select *
    into request_record
  from public.lawyer_credit_purchase_requests
  where id = target_request_id
  for update;

  if not found then
    return query select false, 'Solicitacao nao encontrada.', target_request_id, null::integer;
    return;
  end if;

  if request_record.status <> 'pending' then
    return query select false, 'Solicitacao nao esta pendente.', target_request_id, null::integer;
    return;
  end if;

  update public.lawyer_credit_purchase_requests
  set status = 'rejected',
      notes = coalesce(notes, '') || case when notes is null or notes = '' then '' else E'\n' end || 'Rejeitada administrativamente.',
      updated_at = now()
  where id = request_record.id;

  return query select true, 'Solicitacao rejeitada.', request_record.id, null::integer;
end;
$$;

grant execute on function public.is_current_user_admin() to authenticated;
grant execute on function public.list_pending_credit_purchase_requests() to authenticated;
grant execute on function public.approve_credit_purchase_request(uuid) to authenticated;
grant execute on function public.reject_credit_purchase_request(uuid) to authenticated;

notify pgrst, 'reload schema';


-- =========================================================
-- 08/32 — 20260711013000_harden_admin_credit_approval.sql
-- =========================================================

-- Harden administrative credit approvals.
-- Admin access is no longer inferred directly from user_metadata.
-- Existing users previously marked as admin are migrated once into public.admin_users.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

insert into public.admin_users (user_id)
select users.id
from auth.users users
where coalesce(
  users.raw_app_meta_data ->> 'profile',
  users.raw_user_meta_data ->> 'profile'
) = 'admin'
on conflict (user_id) do nothing;

drop policy if exists "Admin users can view own admin marker" on public.admin_users;
create policy "Admin users can view own admin marker"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users admin_user
    where admin_user.user_id = auth.uid()
  );
$$;

grant select on public.admin_users to authenticated;
grant execute on function public.is_current_user_admin() to authenticated;

notify pgrst, 'reload schema';


-- =========================================================
-- 09/32 — 20260711014500_cancel_credit_purchase_request.sql
-- =========================================================

-- Allow users to cancel their own pending credit purchase requests.

create or replace function public.cancel_credit_purchase_request(target_request_id uuid)
returns table (
  ok boolean,
  message text,
  request_id uuid,
  credited_balance integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  request_record public.lawyer_credit_purchase_requests%rowtype;
begin
  select *
    into request_record
  from public.lawyer_credit_purchase_requests
  where id = target_request_id
  for update;

  if not found then
    return query select false, 'Solicitacao nao encontrada.', target_request_id, null::integer;
    return;
  end if;

  if request_record.user_id <> auth.uid() then
    return query select false, 'Solicitacao nao pertence ao usuario autenticado.', target_request_id, null::integer;
    return;
  end if;

  if request_record.status <> 'pending' then
    return query select false, 'Somente solicitacoes pendentes podem ser canceladas.', target_request_id, null::integer;
    return;
  end if;

  update public.lawyer_credit_purchase_requests
  set status = 'canceled',
      notes = coalesce(notes, '') || case when notes is null or notes = '' then '' else E'\n' end || 'Cancelada pelo usuario.',
      updated_at = now()
  where id = request_record.id;

  return query select true, 'Solicitacao cancelada.', request_record.id, null::integer;
end;
$$;

grant execute on function public.cancel_credit_purchase_request(uuid) to authenticated;

notify pgrst, 'reload schema';


-- =========================================================
-- 10/32 — 20260711020000_restrict_marketplace_to_lawyers.sql
-- =========================================================

-- Restrict marketplace browsing/unlocking to lawyers and administrators.
-- Administrators are controlled by public.admin_users.
-- Lawyers are inferred from the authenticated user's profile metadata for the current MVP registration flow.

create or replace function public.is_current_user_marketplace_actor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    exists (
      select 1
      from public.admin_users admin_user
      where admin_user.user_id = auth.uid()
    ),
    false
  )
  or coalesce((
    select coalesce(
      users.raw_app_meta_data ->> 'profile',
      users.raw_user_meta_data ->> 'profile'
    ) = 'advogado'
    from auth.users users
    where users.id = auth.uid()
  ), false);
$$;

drop policy if exists "Authenticated users can view open marketplace opportunities" on public.marketplace_opportunities;
drop policy if exists "Marketplace actors can view marketplace opportunities" on public.marketplace_opportunities;
create policy "Marketplace actors can view marketplace opportunities"
  on public.marketplace_opportunities
  for select
  to authenticated
  using (
    public.is_current_user_marketplace_actor()
    and (
      status in ('open', 'reserved')
      or unlocked_by = auth.uid()
    )
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

  if not public.is_current_user_marketplace_actor() then
    return query select false, 'Apenas advogados parceiros podem desbloquear oportunidades.', null::uuid, null::integer;
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

grant execute on function public.is_current_user_marketplace_actor() to authenticated;
grant execute on function public.unlock_marketplace_opportunity(uuid) to authenticated;

notify pgrst, 'reload schema';


-- =========================================================
-- 11/32 — 20260711021500_restrict_finance_to_marketplace_actors.sql
-- =========================================================

-- Restrict credit account initialization and credit purchase requests to marketplace actors.
-- Marketplace actors are lawyers or administrators.

create or replace function public.ensure_lawyer_credit_account()
returns table (
  user_id uuid,
  balance integer,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  if not public.is_current_user_marketplace_actor() then
    raise exception 'Apenas advogados parceiros podem inicializar conta de creditos.';
  end if;

  insert into public.lawyer_credit_accounts (user_id, balance)
  values (current_user_id, 0)
  on conflict (user_id) do nothing;

  return query
  select account.user_id, account.balance, account.updated_at
  from public.lawyer_credit_accounts account
  where account.user_id = current_user_id;
end;
$$;

drop policy if exists "Users can create own pending credit purchase requests" on public.lawyer_credit_purchase_requests;
drop policy if exists "Marketplace actors can create own pending credit purchase requests" on public.lawyer_credit_purchase_requests;
create policy "Marketplace actors can create own pending credit purchase requests"
  on public.lawyer_credit_purchase_requests
  for insert
  to authenticated
  with check (
    public.is_current_user_marketplace_actor()
    and user_id = auth.uid()
    and status = 'pending'
    and requested_credits > 0
  );

grant execute on function public.ensure_lawyer_credit_account() to authenticated;

notify pgrst, 'reload schema';


-- =========================================================
-- 12/32 — 20260711023000_create_agenda_events.sql
-- =========================================================

create table if not exists public.agenda_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id uuid null references public.clients(id) on delete set null,
  case_id uuid null references public.client_cases(id) on delete set null,
  title text not null,
  description text null,
  event_type text not null default 'task' check (event_type in ('deadline', 'hearing', 'task', 'meeting', 'other')),
  status text not null default 'pending' check (status in ('pending', 'completed', 'canceled')),
  starts_at timestamptz not null,
  ends_at timestamptz null,
  location text null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists agenda_events_user_id_idx on public.agenda_events(user_id);
create index if not exists agenda_events_client_id_idx on public.agenda_events(client_id);
create index if not exists agenda_events_case_id_idx on public.agenda_events(case_id);
create index if not exists agenda_events_starts_at_idx on public.agenda_events(starts_at);
create index if not exists agenda_events_status_idx on public.agenda_events(status);

alter table public.agenda_events enable row level security;

drop policy if exists "Users can read own agenda events" on public.agenda_events;
create policy "Users can read own agenda events"
  on public.agenda_events for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own agenda events" on public.agenda_events;
create policy "Users can insert own agenda events"
  on public.agenda_events for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own agenda events" on public.agenda_events;
create policy "Users can update own agenda events"
  on public.agenda_events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own agenda events" on public.agenda_events;
create policy "Users can delete own agenda events"
  on public.agenda_events for delete
  using (auth.uid() = user_id);


-- =========================================================
-- 13/32 — 20260711024500_harden_crm_citizen_data_access.sql
-- =========================================================

-- Harden CRM operational data so citizen accounts cannot read office/client records.
-- New CRM clients receive owner_user_id automatically. Legacy rows with no owner remain visible
-- to legal operators during migration to avoid hiding existing data unexpectedly.

create or replace function public.is_current_user_legal_operator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_current_user_admin()
  or coalesce((
    select coalesce(
      users.raw_app_meta_data ->> 'profile',
      users.raw_user_meta_data ->> 'profile'
    ) = 'advogado'
    from auth.users users
    where users.id = auth.uid()
  ), false);
$$;

grant execute on function public.is_current_user_legal_operator() to authenticated;

alter table if exists public.clients
  add column if not exists owner_user_id uuid default auth.uid() references auth.users(id) on delete set null;

create index if not exists clients_owner_user_id_idx on public.clients(owner_user_id);

alter table if exists public.clients enable row level security;
alter table if exists public.client_notes enable row level security;
alter table if exists public.client_cases enable row level security;
alter table if exists public.client_documents enable row level security;

drop policy if exists "Legal operators can read accessible clients" on public.clients;
create policy "Legal operators can read accessible clients"
  on public.clients for select
  to authenticated
  using (
    public.is_current_user_admin()
    or (
      public.is_current_user_legal_operator()
      and (owner_user_id = auth.uid() or owner_user_id is null)
    )
  );

drop policy if exists "Legal operators can insert own clients" on public.clients;
create policy "Legal operators can insert own clients"
  on public.clients for insert
  to authenticated
  with check (
    public.is_current_user_legal_operator()
    and coalesce(owner_user_id, auth.uid()) = auth.uid()
  );

drop policy if exists "Legal operators can update accessible clients" on public.clients;
create policy "Legal operators can update accessible clients"
  on public.clients for update
  to authenticated
  using (
    public.is_current_user_admin()
    or (
      public.is_current_user_legal_operator()
      and (owner_user_id = auth.uid() or owner_user_id is null)
    )
  )
  with check (
    public.is_current_user_admin()
    or (
      public.is_current_user_legal_operator()
      and (owner_user_id = auth.uid() or owner_user_id is null)
    )
  );

drop policy if exists "Legal operators can delete accessible clients" on public.clients;
create policy "Legal operators can delete accessible clients"
  on public.clients for delete
  to authenticated
  using (
    public.is_current_user_admin()
    or (
      public.is_current_user_legal_operator()
      and (owner_user_id = auth.uid() or owner_user_id is null)
    )
  );

drop policy if exists "Legal operators can read accessible client notes" on public.client_notes;
create policy "Legal operators can read accessible client notes"
  on public.client_notes for select
  to authenticated
  using (
    exists (
      select 1 from public.clients client
      where client.id = client_notes.client_id
    )
  );

drop policy if exists "Legal operators can insert accessible client notes" on public.client_notes;
create policy "Legal operators can insert accessible client notes"
  on public.client_notes for insert
  to authenticated
  with check (
    exists (
      select 1 from public.clients client
      where client.id = client_notes.client_id
    )
  );

drop policy if exists "Legal operators can read accessible client cases" on public.client_cases;
create policy "Legal operators can read accessible client cases"
  on public.client_cases for select
  to authenticated
  using (
    exists (
      select 1 from public.clients client
      where client.id = client_cases.client_id
    )
  );

drop policy if exists "Legal operators can insert accessible client cases" on public.client_cases;
create policy "Legal operators can insert accessible client cases"
  on public.client_cases for insert
  to authenticated
  with check (
    exists (
      select 1 from public.clients client
      where client.id = client_cases.client_id
    )
  );

drop policy if exists "Legal operators can read accessible client documents" on public.client_documents;
create policy "Legal operators can read accessible client documents"
  on public.client_documents for select
  to authenticated
  using (
    exists (
      select 1 from public.clients client
      where client.id = client_documents.client_id
    )
  );

drop policy if exists "Legal operators can insert accessible client documents" on public.client_documents;
create policy "Legal operators can insert accessible client documents"
  on public.client_documents for insert
  to authenticated
  with check (
    exists (
      select 1 from public.clients client
      where client.id = client_documents.client_id
    )
  );

notify pgrst, 'reload schema';


-- =========================================================
-- 14/32 — 20260711030000_create_citizen_document_uploads.sql
-- =========================================================

-- Citizen document uploads are separated from CRM client_documents.
-- Files are stored in a private Supabase Storage bucket and metadata is owned by auth.uid().

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'citizen-documents',
  'citizen-documents',
  false,
  10485760,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.citizen_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null unique,
  file_size bigint null,
  mime_type text null,
  notes text null,
  status text not null default 'uploaded' check (status in ('uploaded', 'reviewed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists citizen_documents_user_id_idx on public.citizen_documents(user_id);
create index if not exists citizen_documents_created_at_idx on public.citizen_documents(created_at);

alter table public.citizen_documents enable row level security;

drop policy if exists "Citizens can read own documents" on public.citizen_documents;
create policy "Citizens can read own documents"
  on public.citizen_documents for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Citizens can insert own documents" on public.citizen_documents;
create policy "Citizens can insert own documents"
  on public.citizen_documents for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Citizens can update own documents" on public.citizen_documents;
create policy "Citizens can update own documents"
  on public.citizen_documents for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Citizens can delete own documents" on public.citizen_documents;
create policy "Citizens can delete own documents"
  on public.citizen_documents for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Citizens can read own storage documents" on storage.objects;
create policy "Citizens can read own storage documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'citizen-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Citizens can upload own storage documents" on storage.objects;
create policy "Citizens can upload own storage documents"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'citizen-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Citizens can update own storage documents" on storage.objects;
create policy "Citizens can update own storage documents"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'citizen-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'citizen-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Citizens can delete own storage documents" on storage.objects;
create policy "Citizens can delete own storage documents"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'citizen-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

notify pgrst, 'reload schema';


-- =========================================================
-- 15/32 — 20260711031500_link_citizen_documents_to_marketplace.sql
-- =========================================================

-- Link private citizen documents to marketplace opportunities.
-- Lawyers can read/open linked documents only after unlocking the related opportunity.

alter table if exists public.marketplace_opportunity_private_details
  add column if not exists citizen_document_ids uuid[] not null default '{}';

create index if not exists marketplace_private_details_citizen_document_ids_gin_idx
  on public.marketplace_opportunity_private_details using gin (citizen_document_ids);

drop policy if exists "Lawyers can read unlocked citizen documents" on public.citizen_documents;
create policy "Lawyers can read unlocked citizen documents"
  on public.citizen_documents for select
  to authenticated
  using (
    exists (
      select 1
      from public.marketplace_opportunity_private_details details
      join public.marketplace_opportunities opportunity
        on opportunity.id = details.opportunity_id
      where citizen_documents.id = any(details.citizen_document_ids)
        and opportunity.unlocked_by = auth.uid()
    )
  );

drop policy if exists "Citizens can read own storage documents" on storage.objects;
drop policy if exists "Citizens and unlocked lawyers can read citizen storage documents" on storage.objects;
create policy "Citizens and unlocked lawyers can read citizen storage documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'citizen-documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1
        from public.citizen_documents document
        join public.marketplace_opportunity_private_details details
          on document.id = any(details.citizen_document_ids)
        join public.marketplace_opportunities opportunity
          on opportunity.id = details.opportunity_id
        where document.file_path = storage.objects.name
          and opportunity.unlocked_by = auth.uid()
      )
    )
  );

notify pgrst, 'reload schema';


-- =========================================================
-- 16/32 — 20260711033000_allow_citizens_to_track_own_opportunities.sql
-- =========================================================

-- Allow citizens to track only the marketplace opportunities created by themselves.
-- This complements the marketplace actor policy without exposing other citizens' cases.

drop policy if exists "Citizens can view own marketplace opportunities" on public.marketplace_opportunities;

create policy "Citizens can view own marketplace opportunities"
  on public.marketplace_opportunities
  for select
  to authenticated
  using (created_by = auth.uid());


-- =========================================================
-- 17/32 — 20260711034500_create_marketplace_opportunity_crm_links.sql
-- =========================================================

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


-- =========================================================
-- 18/32 — 20260712090000_allow_citizen_document_complements.sql
-- =========================================================

-- Allow citizens to safely attach complementary documents to their own published marketplace opportunities.
-- This keeps the original demand immutable while allowing post-publication evidence uploads.

grant update (citizen_document_ids) on public.marketplace_opportunity_private_details to authenticated;

drop policy if exists "Citizens can update own marketplace private document links" on public.marketplace_opportunity_private_details;
create policy "Citizens can update own marketplace private document links"
on public.marketplace_opportunity_private_details
for update
to authenticated
using (
  created_by = auth.uid()
  and exists (
    select 1
    from public.marketplace_opportunities opportunity
    where opportunity.id = opportunity_id
      and opportunity.created_by = auth.uid()
  )
)
with check (
  created_by = auth.uid()
  and exists (
    select 1
    from public.marketplace_opportunities opportunity
    where opportunity.id = opportunity_id
      and opportunity.created_by = auth.uid()
  )
);

notify pgrst, 'reload schema';


-- =========================================================
-- 19/32 — 20260712093000_link_complementary_marketplace_opportunities.sql
-- =========================================================

-- Track complementary marketplace opportunities with a structured parent relationship.
-- The original opportunity remains immutable; complementary triages become separate leads linked to the original case.

alter table if exists public.marketplace_opportunities
  add column if not exists parent_opportunity_id uuid null references public.marketplace_opportunities(id) on delete set null;

create index if not exists marketplace_opportunities_parent_opportunity_id_idx
  on public.marketplace_opportunities(parent_opportunity_id);

notify pgrst, 'reload schema';


-- =========================================================
-- 20/32 — 20260713100000_harden_complement_parent_ownership.sql
-- =========================================================

-- Harden complementary triage publishing.
-- A citizen can publish a primary opportunity, or a complementary opportunity linked only
-- to another opportunity created by the same authenticated user.

drop policy if exists "Authenticated users can create marketplace opportunities" on public.marketplace_opportunities;

create policy "Authenticated users can create marketplace opportunities"
on public.marketplace_opportunities
for insert
to authenticated
with check (
  created_by = auth.uid()
  and status = 'open'
  and summary is not null
  and (
    parent_opportunity_id is null
    or exists (
      select 1
      from public.marketplace_opportunities parent
      where parent.id = parent_opportunity_id
        and parent.created_by = auth.uid()
    )
  )
);

notify pgrst, 'reload schema';


-- =========================================================
-- 21/32 — 20260713113000_create_lawyer_profiles_oab_validation.sql
-- =========================================================

create table if not exists public.lawyer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  oab_number text not null,
  oab_state text not null,
  verification_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lawyer_profiles_oab_number_format check (oab_number ~ '^[0-9]{3,8}$'),
  constraint lawyer_profiles_oab_state_format check (oab_state ~ '^[A-Z]{2}$'),
  constraint lawyer_profiles_verification_status_check check (verification_status in ('pending', 'verified', 'rejected'))
);

create unique index if not exists lawyer_profiles_oab_unique_idx
on public.lawyer_profiles(oab_state, oab_number);

create index if not exists lawyer_profiles_verification_status_idx
on public.lawyer_profiles(verification_status);

alter table public.lawyer_profiles enable row level security;

drop policy if exists "Lawyers can read own OAB profile" on public.lawyer_profiles;
create policy "Lawyers can read own OAB profile"
on public.lawyer_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can read lawyer OAB profiles" on public.lawyer_profiles;
create policy "Admins can read lawyer OAB profiles"
on public.lawyer_profiles
for select
to authenticated
using (public.is_current_user_admin());

drop policy if exists "Admins can update lawyer OAB verification" on public.lawyer_profiles;
create policy "Admins can update lawyer OAB verification"
on public.lawyer_profiles
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

create or replace function public.set_lawyer_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lawyer_profiles_updated_at on public.lawyer_profiles;
create trigger set_lawyer_profiles_updated_at
before update on public.lawyer_profiles
for each row execute function public.set_lawyer_profiles_updated_at();

create or replace function public.handle_new_lawyer_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_profile text;
  raw_oab_number text;
  raw_oab_state text;
begin
  raw_profile := new.raw_user_meta_data ->> 'profile';

  if raw_profile <> 'advogado' then
    return new;
  end if;

  raw_oab_number := regexp_replace(coalesce(new.raw_user_meta_data ->> 'lawyer_oab_number', ''), '\D', '', 'g');
  raw_oab_state := upper(trim(coalesce(new.raw_user_meta_data ->> 'lawyer_oab_state', '')));

  if raw_oab_number !~ '^[0-9]{3,8}$' or raw_oab_state !~ '^[A-Z]{2}$' then
    raise exception 'Cadastro de advogado exige OAB e UF válidas.';
  end if;

  insert into public.lawyer_profiles (
    user_id,
    full_name,
    email,
    oab_number,
    oab_state,
    verification_status
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Advogado'),
    coalesce(new.email, ''),
    raw_oab_number,
    raw_oab_state,
    'pending'
  )
  on conflict (user_id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    oab_number = excluded.oab_number,
    oab_state = excluded.oab_state,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_lawyer_profile on auth.users;
create trigger on_auth_user_created_create_lawyer_profile
after insert on auth.users
for each row execute function public.handle_new_lawyer_profile();

notify pgrst, 'reload schema';


-- =========================================================
-- 22/32 — 20260713114500_require_verified_oab_for_marketplace.sql
-- =========================================================

create or replace function public.is_current_user_marketplace_actor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    exists (
      select 1
      from public.admin_users admin_user
      where admin_user.user_id = auth.uid()
    ),
    false
  )
  or coalesce(
    exists (
      select 1
      from public.lawyer_profiles lawyer_profile
      where lawyer_profile.user_id = auth.uid()
        and lawyer_profile.verification_status = 'verified'
    ),
    false
  );
$$;

grant execute on function public.is_current_user_marketplace_actor() to authenticated;

notify pgrst, 'reload schema';


-- =========================================================
-- 23/32 — 20260713120000_create_account_deletion_requests.sql
-- =========================================================

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  profile text not null,
  reason text,
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users(id) on delete set null,
  decision_notes text,
  constraint account_deletion_requests_status_check check (status in ('pending', 'approved', 'rejected', 'canceled'))
);

create unique index if not exists account_deletion_requests_one_pending_per_user_idx
on public.account_deletion_requests(user_id)
where status = 'pending';

create index if not exists account_deletion_requests_status_idx
on public.account_deletion_requests(status);

alter table public.account_deletion_requests enable row level security;

drop policy if exists "Users can read own account deletion requests" on public.account_deletion_requests;
create policy "Users can read own account deletion requests"
on public.account_deletion_requests
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can create own pending account deletion request" on public.account_deletion_requests;
create policy "Users can create own pending account deletion request"
on public.account_deletion_requests
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
);

drop policy if exists "Users can cancel own pending account deletion request" on public.account_deletion_requests;
create policy "Users can cancel own pending account deletion request"
on public.account_deletion_requests
for update
to authenticated
using (
  user_id = auth.uid()
  and status = 'pending'
)
with check (
  user_id = auth.uid()
  and status = 'canceled'
);

drop policy if exists "Admins can read account deletion requests" on public.account_deletion_requests;
create policy "Admins can read account deletion requests"
on public.account_deletion_requests
for select
to authenticated
using (public.is_current_user_admin());

drop policy if exists "Admins can decide account deletion requests" on public.account_deletion_requests;
create policy "Admins can decide account deletion requests"
on public.account_deletion_requests
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

notify pgrst, 'reload schema';


-- =========================================================
-- 24/32 — 20260713123000_decide_account_deletion_request_rpc.sql
-- =========================================================

create or replace function public.decide_account_deletion_request(
  target_request_id uuid,
  target_status text,
  target_notes text default null
)
returns table (
  id uuid,
  user_id uuid,
  user_email text,
  profile text,
  reason text,
  status text,
  requested_at timestamptz,
  decided_at timestamptz,
  decided_by uuid,
  decision_notes text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  if not public.is_current_user_admin() then
    raise exception 'Acesso administrativo necessario.';
  end if;

  if target_status not in ('approved', 'rejected') then
    raise exception 'Status de decisao invalido.';
  end if;

  return query
  update public.account_deletion_requests request
  set
    status = target_status,
    decided_at = now(),
    decided_by = current_user_id,
    decision_notes = nullif(btrim(target_notes), '')
  where request.id = target_request_id
    and request.status = 'pending'
  returning
    request.id,
    request.user_id,
    request.user_email,
    request.profile,
    request.reason,
    request.status,
    request.requested_at,
    request.decided_at,
    request.decided_by,
    request.decision_notes;
end;
$$;

grant execute on function public.decide_account_deletion_request(uuid, text, text) to authenticated;

drop policy if exists "Admins can decide account deletion requests" on public.account_deletion_requests;

notify pgrst, 'reload schema';


-- =========================================================
-- 25/32 — 20260713124500_audit_lawyer_oab_verification.sql
-- =========================================================

alter table public.lawyer_profiles
add column if not exists verified_at timestamptz,
add column if not exists verified_by uuid references auth.users(id) on delete set null,
add column if not exists verification_notes text;

create or replace function public.decide_lawyer_oab_verification(
  target_user_id uuid,
  target_status text,
  target_notes text default null
)
returns table (
  user_id uuid,
  full_name text,
  email text,
  oab_number text,
  oab_state text,
  verification_status text,
  created_at timestamptz,
  updated_at timestamptz,
  verified_at timestamptz,
  verified_by uuid,
  verification_notes text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  if not public.is_current_user_admin() then
    raise exception 'Acesso administrativo necessario.';
  end if;

  if target_status not in ('verified', 'rejected') then
    raise exception 'Status de verificacao OAB invalido.';
  end if;

  return query
  update public.lawyer_profiles profile
  set
    verification_status = target_status,
    verified_at = now(),
    verified_by = current_user_id,
    verification_notes = nullif(btrim(target_notes), '')
  where profile.user_id = target_user_id
    and profile.verification_status = 'pending'
  returning
    profile.user_id,
    profile.full_name,
    profile.email,
    profile.oab_number,
    profile.oab_state,
    profile.verification_status,
    profile.created_at,
    profile.updated_at,
    profile.verified_at,
    profile.verified_by,
    profile.verification_notes;
end;
$$;

grant execute on function public.decide_lawyer_oab_verification(uuid, text, text) to authenticated;

drop policy if exists "Admins can update lawyer OAB verification" on public.lawyer_profiles;

notify pgrst, 'reload schema';


-- =========================================================
-- 26/32 — 20260713130000_audit_credit_purchase_request_decisions.sql
-- =========================================================

alter table public.lawyer_credit_purchase_requests
add column if not exists decided_at timestamptz,
add column if not exists decided_by uuid references auth.users(id) on delete set null,
add column if not exists decision_notes text;

drop function if exists public.list_pending_credit_purchase_requests();

create function public.list_pending_credit_purchase_requests()
returns table (
  id uuid,
  user_id uuid,
  requested_credits integer,
  amount_cents integer,
  currency text,
  status text,
  notes text,
  created_at timestamptz,
  updated_at timestamptz,
  decided_at timestamptz,
  decided_by uuid,
  decision_notes text,
  requester_email text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_user_admin() then
    raise exception 'Acesso administrativo necessario.';
  end if;

  return query
  select
    request.id,
    request.user_id,
    request.requested_credits,
    request.amount_cents,
    request.currency,
    request.status,
    request.notes,
    request.created_at,
    request.updated_at,
    request.decided_at,
    request.decided_by,
    request.decision_notes,
    user_account.email::text as requester_email
  from public.lawyer_credit_purchase_requests request
  left join auth.users user_account on user_account.id = request.user_id
  where request.status = 'pending'
  order by request.created_at asc;
end;
$$;

create or replace function public.approve_credit_purchase_request(target_request_id uuid)
returns table (
  ok boolean,
  message text,
  request_id uuid,
  credited_balance integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  request_record public.lawyer_credit_purchase_requests%rowtype;
  new_balance integer;
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    return query select false, 'Usuario nao autenticado.', target_request_id, null::integer;
    return;
  end if;

  if not public.is_current_user_admin() then
    return query select false, 'Acesso administrativo necessario.', target_request_id, null::integer;
    return;
  end if;

  select *
    into request_record
  from public.lawyer_credit_purchase_requests
  where id = target_request_id
  for update;

  if not found then
    return query select false, 'Solicitacao nao encontrada.', target_request_id, null::integer;
    return;
  end if;

  if request_record.status <> 'pending' then
    return query select false, 'Solicitacao nao esta pendente.', target_request_id, null::integer;
    return;
  end if;

  insert into public.lawyer_credit_accounts (user_id, balance)
  values (request_record.user_id, 0)
  on conflict (user_id) do nothing;

  update public.lawyer_credit_accounts
  set balance = balance + request_record.requested_credits
  where user_id = request_record.user_id
  returning balance into new_balance;

  insert into public.lawyer_credit_transactions (user_id, amount, transaction_type, metadata)
  values (
    request_record.user_id,
    request_record.requested_credits,
    'purchase',
    jsonb_build_object(
      'purchase_request_id', request_record.id,
      'approved_by', current_user_id
    )
  );

  update public.lawyer_credit_purchase_requests
  set
    status = 'approved',
    notes = coalesce(notes, '') || case when notes is null or notes = '' then '' else E'\n' end || 'Aprovada administrativamente.',
    decided_at = now(),
    decided_by = current_user_id,
    decision_notes = 'Aprovada administrativamente.',
    updated_at = now()
  where id = request_record.id;

  return query select true, 'Solicitacao aprovada e creditos adicionados.', request_record.id, new_balance;
end;
$$;

create or replace function public.reject_credit_purchase_request(target_request_id uuid)
returns table (
  ok boolean,
  message text,
  request_id uuid,
  credited_balance integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  request_record public.lawyer_credit_purchase_requests%rowtype;
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    return query select false, 'Usuario nao autenticado.', target_request_id, null::integer;
    return;
  end if;

  if not public.is_current_user_admin() then
    return query select false, 'Acesso administrativo necessario.', target_request_id, null::integer;
    return;
  end if;

  select *
    into request_record
  from public.lawyer_credit_purchase_requests
  where id = target_request_id
  for update;

  if not found then
    return query select false, 'Solicitacao nao encontrada.', target_request_id, null::integer;
    return;
  end if;

  if request_record.status <> 'pending' then
    return query select false, 'Solicitacao nao esta pendente.', target_request_id, null::integer;
    return;
  end if;

  update public.lawyer_credit_purchase_requests
  set
    status = 'rejected',
    notes = coalesce(notes, '') || case when notes is null or notes = '' then '' else E'\n' end || 'Rejeitada administrativamente.',
    decided_at = now(),
    decided_by = current_user_id,
    decision_notes = 'Rejeitada administrativamente.',
    updated_at = now()
  where id = request_record.id;

  return query select true, 'Solicitacao rejeitada.', request_record.id, null::integer;
end;
$$;

grant execute on function public.approve_credit_purchase_request(uuid) to authenticated;
grant execute on function public.reject_credit_purchase_request(uuid) to authenticated;
grant execute on function public.list_pending_credit_purchase_requests() to authenticated;

notify pgrst, 'reload schema';


-- =========================================================
-- 27/32 — 20260714010000_harden_lawyer_profile_trigger_null_profile.sql
-- =========================================================

create or replace function public.handle_new_lawyer_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_profile text;
  raw_oab_number text;
  raw_oab_state text;
begin
  raw_profile := new.raw_user_meta_data ->> 'profile';

  if raw_profile is distinct from 'advogado' then
    return new;
  end if;

  raw_oab_number := regexp_replace(coalesce(new.raw_user_meta_data ->> 'lawyer_oab_number', ''), '\D', '', 'g');
  raw_oab_state := upper(trim(coalesce(new.raw_user_meta_data ->> 'lawyer_oab_state', '')));

  if raw_oab_number !~ '^[0-9]{3,8}$' or raw_oab_state !~ '^[A-Z]{2}$' then
    raise exception 'Cadastro de advogado exige OAB e UF válidas.';
  end if;

  insert into public.lawyer_profiles (
    user_id,
    full_name,
    email,
    oab_number,
    oab_state,
    verification_status
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Advogado'),
    coalesce(new.email, ''),
    raw_oab_number,
    raw_oab_state,
    'pending'
  )
  on conflict (user_id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    oab_number = excluded.oab_number,
    oab_state = excluded.oab_state,
    updated_at = now();

  return new;
end;
$$;

notify pgrst, 'reload schema';


-- =========================================================
-- 28/32 — 20260714013000_harden_marketplace_unlock_rpc.sql
-- =========================================================

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
  required_credits integer;
  updated_balance integer;
begin
  if current_user_id is null then
    return query select false, 'Usuário não autenticado.', null::uuid, null::integer;
    return;
  end if;

  if not public.is_current_user_marketplace_actor() then
    return query select false, 'Apenas advogados parceiros podem desbloquear oportunidades.', null::uuid, null::integer;
    return;
  end if;

  select *
    into opportunity_record
  from public.marketplace_opportunities
  where id = target_opportunity_id
  for update;

  if not found then
    return query select false, 'Oportunidade não encontrada.', null::uuid, null::integer;
    return;
  end if;

  if opportunity_record.unlocked_by = current_user_id then
    select balance
      into updated_balance
    from public.lawyer_credit_accounts
    where user_id = current_user_id;

    return query select true, 'Oportunidade já estava desbloqueada para este usuário.', opportunity_record.id, updated_balance;
    return;
  end if;

  if opportunity_record.status not in ('open', 'reserved') then
    return query select false, 'Oportunidade indisponível para desbloqueio.', opportunity_record.id, null::integer;
    return;
  end if;

  if opportunity_record.created_by = current_user_id then
    return query select false, 'Você não pode desbloquear uma oportunidade criada por você.', opportunity_record.id, null::integer;
    return;
  end if;

  required_credits := greatest(coalesce(opportunity_record.credit_cost, 1), 0);

  insert into public.lawyer_credit_accounts (user_id, balance)
  values (current_user_id, 0)
  on conflict (user_id) do nothing;

  update public.lawyer_credit_accounts
  set balance = balance - required_credits
  where user_id = current_user_id
    and balance >= required_credits
  returning balance into updated_balance;

  if updated_balance is null then
    return query select false, 'Saldo de créditos insuficiente.', opportunity_record.id, (
      select balance
      from public.lawyer_credit_accounts
      where user_id = current_user_id
    );
    return;
  end if;

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

  return query select true, 'Oportunidade desbloqueada com sucesso.', opportunity_record.id, updated_balance;
exception
  when others then
    return query select false, 'Falha técnica ao desbloquear oportunidade: ' || sqlerrm, target_opportunity_id, null::integer;
end;
$$;

grant execute on function public.unlock_marketplace_opportunity(uuid) to authenticated;

notify pgrst, 'reload schema';


-- =========================================================
-- 29/32 — 20260714014500_fix_marketplace_unlock_rpc_ambiguity.sql
-- =========================================================

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
  required_credits integer;
  updated_balance integer;
begin
  if current_user_id is null then
    return query select false, 'Usuario nao autenticado.', null::uuid, null::integer;
    return;
  end if;

  if not public.is_current_user_marketplace_actor() then
    return query select false, 'Apenas advogados parceiros podem desbloquear oportunidades.', null::uuid, null::integer;
    return;
  end if;

  select *
    into opportunity_record
  from public.marketplace_opportunities mo
  where mo.id = target_opportunity_id
  for update;

  if not found then
    return query select false, 'Oportunidade nao encontrada.', null::uuid, null::integer;
    return;
  end if;

  if opportunity_record.unlocked_by = current_user_id then
    select lca.balance
      into updated_balance
    from public.lawyer_credit_accounts lca
    where lca.user_id = current_user_id;

    return query select true, 'Oportunidade ja estava desbloqueada para este usuario.', opportunity_record.id, updated_balance;
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

  insert into public.lawyer_credit_accounts (user_id, balance)
  values (current_user_id, 0)
  on conflict (user_id) do nothing;

  update public.lawyer_credit_accounts lca
  set balance = lca.balance - required_credits
  where lca.user_id = current_user_id
    and lca.balance >= required_credits
  returning lca.balance into updated_balance;

  if updated_balance is null then
    return query select false, 'Saldo de creditos insuficiente.', opportunity_record.id, (
      select lca.balance
      from public.lawyer_credit_accounts lca
      where lca.user_id = current_user_id
    );
    return;
  end if;

  insert into public.lawyer_credit_transactions (user_id, amount, transaction_type, metadata)
  values (
    current_user_id,
    required_credits * -1,
    'consume',
    jsonb_build_object('opportunity_id', opportunity_record.id)
  );

  insert into public.marketplace_opportunity_unlocks (opportunity_id, lawyer_id, credit_cost)
  values (opportunity_record.id, current_user_id, required_credits)
  on conflict on constraint marketplace_opportunity_unlocks_opportunity_id_lawyer_id_key do nothing;

  update public.marketplace_opportunities mo
  set status = 'unlocked',
      unlocked_by = current_user_id,
      unlocked_at = now()
  where mo.id = opportunity_record.id;

  return query select true, 'Oportunidade desbloqueada com sucesso.', opportunity_record.id, updated_balance;
exception
  when others then
    return query select false, 'Falha tecnica ao desbloquear oportunidade: ' || sqlerrm, target_opportunity_id, null::integer;
end;
$$;

grant execute on function public.unlock_marketplace_opportunity(uuid) to authenticated;

notify pgrst, 'reload schema';


-- =========================================================
-- 30/32 — 20260714020000_fix_private_details_unlock_policy.sql
-- =========================================================

drop policy if exists "Users can view private details after unlock or ownership" on public.marketplace_opportunity_private_details;

create policy "Users can view private details after unlock or ownership"
on public.marketplace_opportunity_private_details
for select
to authenticated
using (
  marketplace_opportunity_private_details.created_by = auth.uid()
  or exists (
    select 1
    from public.marketplace_opportunities opportunity
    where opportunity.id = marketplace_opportunity_private_details.opportunity_id
      and opportunity.unlocked_by = auth.uid()
  )
);

notify pgrst, 'reload schema';


-- =========================================================
-- 31/32 — 20260714021500_create_accessible_marketplace_private_details_rpc.sql
-- =========================================================

create or replace function public.list_accessible_marketplace_private_details()
returns table (
  id uuid,
  opportunity_id uuid,
  full_name text,
  phone text,
  whatsapp text,
  email text,
  document_notes text,
  citizen_document_ids uuid[],
  case_history text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    details.id,
    details.opportunity_id,
    details.full_name,
    details.phone,
    details.whatsapp,
    details.email,
    details.document_notes,
    details.citizen_document_ids,
    details.case_history,
    details.created_at
  from public.marketplace_opportunity_private_details details
  where auth.uid() is not null
    and (
      details.created_by = auth.uid()
      or exists (
        select 1
        from public.marketplace_opportunities opportunity
        where opportunity.id = details.opportunity_id
          and opportunity.unlocked_by = auth.uid()
      )
      or public.is_current_user_admin()
    )
  order by details.created_at desc;
$$;

grant execute on function public.list_accessible_marketplace_private_details() to authenticated;

notify pgrst, 'reload schema';


-- =========================================================
-- 32/32 — 20260714023000_backfill_missing_marketplace_private_details.sql
-- =========================================================

insert into public.marketplace_opportunity_private_details (
  opportunity_id,
  created_by,
  full_name,
  phone,
  whatsapp,
  email,
  document_notes,
  citizen_document_ids,
  case_history
)
select
  opportunity.id,
  opportunity.created_by,
  coalesce(
    nullif(trim(created_user.raw_user_meta_data->>'name'), ''),
    nullif(trim(created_user.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(created_user.email), ''),
    'Cidadao ConectaJus'
  ) as full_name,
  nullif(trim(created_user.raw_user_meta_data->>'phone'), '') as phone,
  nullif(trim(created_user.raw_user_meta_data->>'whatsapp'), '') as whatsapp,
  nullif(trim(created_user.email), '') as email,
  'Registro privado reconstruido automaticamente para oportunidade legada sem detalhes vinculados.' as document_notes,
  '{}'::uuid[] as citizen_document_ids,
  concat(
    'Historico reconstruido a partir do resumo mascarado da oportunidade: ',
    opportunity.summary
  ) as case_history
from public.marketplace_opportunities opportunity
left join auth.users created_user
  on created_user.id = opportunity.created_by
where not exists (
  select 1
  from public.marketplace_opportunity_private_details details
  where details.opportunity_id = opportunity.id
);

notify pgrst, 'reload schema';


-- =========================================================
-- Fim do bundle
-- Próximo passo: executar docs/SUPABASE_POST_APPLY_VALIDATION.sql
-- =========================================================
