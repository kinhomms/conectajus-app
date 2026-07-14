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
