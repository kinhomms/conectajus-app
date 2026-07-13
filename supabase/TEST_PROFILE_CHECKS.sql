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

with expected_admin(email) as (
  values ('admin.teste@example.com')
)
select
  'admin_user' as check_group,
  expected_admin.email,
  case
    when users.id is null then 'missing_auth_user'
    when admin_users.user_id is not null then 'ok'
    else 'missing_admin_marker'
  end as status
from expected_admin
left join auth.users users on users.email = expected_admin.email
left join public.admin_users admin_users on admin_users.user_id = users.id
order by expected_admin.email;

with expected_lawyer(email) as (
  values ('advogado.teste@example.com')
)
select
  'lawyer_oab' as check_group,
  expected_lawyer.email,
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
from expected_lawyer
left join public.lawyer_profiles on lawyer_profiles.email = expected_lawyer.email
order by expected_lawyer.email;

with expected_lawyer(email) as (
  values ('advogado.teste@example.com')
)
select
  'credit_requests' as check_group,
  expected_lawyer.email,
  requests.status,
  requests.requested_credits,
  requests.decided_by,
  requests.decided_at,
  case
    when users.id is null then 'missing_auth_user'
    when requests.id is null then 'no_request_yet'
    when requests.status = 'pending' then 'pending_expected_before_admin_decision'
    when requests.status in ('approved', 'rejected')
      and requests.decided_by is not null
      and requests.decided_at is not null then 'ok'
    when requests.status in ('approved', 'rejected') then 'missing_audit_fields'
    else requests.status
  end as status
from expected_lawyer
left join auth.users users on users.email = expected_lawyer.email
left join public.lawyer_credit_purchase_requests requests on requests.user_id = users.id
order by expected_lawyer.email, requests.created_at desc nulls last;

with expected_emails(email) as (
  values
    ('cidadao.teste@example.com'),
    ('advogado.teste@example.com'),
    ('admin.teste@example.com')
)
select
  'account_deletion_requests' as check_group,
  expected_emails.email,
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
from expected_emails
left join public.account_deletion_requests requests on requests.user_email = expected_emails.email
order by expected_emails.email, requests.requested_at desc nulls last;
