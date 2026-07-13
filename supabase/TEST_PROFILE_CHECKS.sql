-- ConectaJus — conferência de perfis de teste no Supabase
--
-- Use depois de:
-- 1. aplicar supabase/APPLY_ALL_MIGRATIONS.sql;
-- 2. criar os usuários pela rota /cadastro;
-- 3. promover o usuário admin em public.admin_users.
--
-- Troque os e-mails abaixo pelos e-mails reais usados no preview.

with expected_emails(email, expected_profile) as (
  values
    ('cidadao.teste@example.com', 'cliente'),
    ('advogado.teste@example.com', 'advogado'),
    ('admin.teste@example.com', 'admin')
),
auth_snapshot as (
  select
    users.id,
    users.email,
    users.raw_user_meta_data ->> 'profile' as profile,
    users.created_at
  from auth.users users
  where users.email in (select email from expected_emails)
)
select
  'auth_user' as check_group,
  expected.email,
  expected.expected_profile,
  coalesce(auth_snapshot.profile, 'missing') as actual_profile,
  case
    when auth_snapshot.id is null then 'missing'
    when auth_snapshot.profile = expected.expected_profile then 'ok'
    else 'unexpected_profile'
  end as status
from expected_emails expected
left join auth_snapshot on auth_snapshot.email = expected.email
order by expected.email;

select
  'admin_user' as check_group,
  users.email,
  case
    when admin_users.user_id is not null then 'ok'
    else 'missing_admin_marker'
  end as status
from auth.users users
left join public.admin_users admin_users on admin_users.user_id = users.id
where users.email = 'admin.teste@example.com';

select
  'lawyer_oab' as check_group,
  lawyer_profiles.email,
  lawyer_profiles.oab_state,
  lawyer_profiles.oab_number,
  lawyer_profiles.verification_status,
  lawyer_profiles.verified_by,
  lawyer_profiles.verified_at,
  case
    when lawyer_profiles.user_id is null then 'missing'
    when lawyer_profiles.verification_status = 'pending' then 'pending_expected_before_admin_decision'
    when lawyer_profiles.verification_status in ('verified', 'rejected')
      and lawyer_profiles.verified_by is not null
      and lawyer_profiles.verified_at is not null then 'ok'
    when lawyer_profiles.verification_status in ('verified', 'rejected') then 'missing_audit_fields'
    else 'unexpected_status'
  end as status
from public.lawyer_profiles
where lawyer_profiles.email = 'advogado.teste@example.com';

select
  'credit_requests' as check_group,
  users.email,
  requests.status,
  requests.requested_credits,
  requests.decided_by,
  requests.decided_at,
  case
    when requests.id is null then 'no_request_yet'
    when requests.status = 'pending' then 'pending_expected_before_admin_decision'
    when requests.status in ('approved', 'rejected')
      and requests.decided_by is not null
      and requests.decided_at is not null then 'ok'
    when requests.status in ('approved', 'rejected') then 'missing_audit_fields'
    else requests.status
  end as status
from auth.users users
left join public.lawyer_credit_purchase_requests requests on requests.user_id = users.id
where users.email = 'advogado.teste@example.com'
order by requests.created_at desc nulls last;

select
  'account_deletion_requests' as check_group,
  requests.user_email,
  requests.profile,
  requests.status,
  requests.decided_by,
  requests.decided_at,
  case
    when requests.id is null then 'no_request_yet'
    when requests.status in ('pending', 'canceled') then requests.status
    when requests.status in ('approved', 'rejected')
      and requests.decided_by is not null
      and requests.decided_at is not null then 'ok'
    when requests.status in ('approved', 'rejected') then 'missing_audit_fields'
    else requests.status
  end as status
from public.account_deletion_requests requests
where requests.user_email in (
  'cidadao.teste@example.com',
  'advogado.teste@example.com',
  'admin.teste@example.com'
)
order by requests.requested_at desc;
