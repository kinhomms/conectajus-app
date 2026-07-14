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
