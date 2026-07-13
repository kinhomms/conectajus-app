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
