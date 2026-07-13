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