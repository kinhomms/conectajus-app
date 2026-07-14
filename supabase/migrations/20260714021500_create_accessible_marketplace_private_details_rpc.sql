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
