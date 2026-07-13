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