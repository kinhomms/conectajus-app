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
