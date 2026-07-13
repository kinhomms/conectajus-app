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