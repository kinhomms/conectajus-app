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
