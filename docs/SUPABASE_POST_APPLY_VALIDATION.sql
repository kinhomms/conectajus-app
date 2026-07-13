-- ConectaJus — validacao pos-aplicacao das migrations Supabase
-- Data: 2026-07-13
--
-- Objetivo:
-- Executar este script no SQL Editor do Supabase depois de aplicar as migrations.
-- Ele NAO cria, altera ou remove objetos. Apenas consulta o catalogo para confirmar
-- se tabelas, colunas, funcoes, politicas RLS e bucket essenciais existem.

with expected_tables(table_schema, table_name) as (
  values
    ('public', 'marketplace_opportunities'),
    ('public', 'marketplace_opportunity_private_details'),
    ('public', 'marketplace_opportunity_unlocks'),
    ('public', 'marketplace_opportunity_crm_links'),
    ('public', 'lawyer_credit_accounts'),
    ('public', 'lawyer_credit_transactions'),
    ('public', 'lawyer_credit_purchase_requests'),
    ('public', 'agenda_events'),
    ('public', 'citizen_documents'),
    ('public', 'admin_users'),
    ('public', 'lawyer_profiles')
)
select
  'tables' as check_group,
  expected_tables.table_schema || '.' || expected_tables.table_name as object_name,
  case when information_schema.tables.table_name is null then 'missing' else 'ok' end as status
from expected_tables
left join information_schema.tables
  on information_schema.tables.table_schema = expected_tables.table_schema
 and information_schema.tables.table_name = expected_tables.table_name
order by object_name;

with expected_columns(table_name, column_name) as (
  values
    ('marketplace_opportunities', 'id'),
    ('marketplace_opportunities', 'created_by'),
    ('marketplace_opportunities', 'status'),
    ('marketplace_opportunities', 'summary'),
    ('marketplace_opportunities', 'city'),
    ('marketplace_opportunities', 'practice_area'),
    ('marketplace_opportunities', 'urgency'),
    ('marketplace_opportunities', 'complexity'),
    ('marketplace_opportunities', 'parent_opportunity_id'),
    ('marketplace_opportunity_private_details', 'opportunity_id'),
    ('marketplace_opportunity_private_details', 'full_name'),
    ('marketplace_opportunity_private_details', 'phone'),
    ('marketplace_opportunity_private_details', 'email'),
    ('marketplace_opportunity_private_details', 'citizen_document_ids'),
    ('lawyer_credit_accounts', 'user_id'),
    ('lawyer_credit_accounts', 'balance'),
    ('lawyer_credit_purchase_requests', 'status'),
    ('agenda_events', 'user_id'),
    ('agenda_events', 'starts_at'),
    ('citizen_documents', 'user_id'),
    ('citizen_documents', 'storage_path'),
    ('lawyer_profiles', 'user_id'),
    ('lawyer_profiles', 'oab_number'),
    ('lawyer_profiles', 'oab_state'),
    ('lawyer_profiles', 'verification_status')
)
select
  'columns' as check_group,
  expected_columns.table_name || '.' || expected_columns.column_name as object_name,
  case when information_schema.columns.column_name is null then 'missing' else 'ok' end as status
from expected_columns
left join information_schema.columns
  on information_schema.columns.table_schema = 'public'
 and information_schema.columns.table_name = expected_columns.table_name
 and information_schema.columns.column_name = expected_columns.column_name
order by object_name;

with expected_functions(function_name) as (
  values
    ('unlock_marketplace_opportunity'),
    ('ensure_lawyer_credit_account'),
    ('cancel_credit_purchase_request'),
    ('approve_credit_purchase_request'),
    ('reject_credit_purchase_request'),
    ('list_pending_credit_purchase_requests'),
    ('is_current_user_admin'),
    ('is_current_user_marketplace_actor'),
    ('is_current_user_legal_operator'),
    ('handle_new_lawyer_profile')
)
select
  'functions' as check_group,
  'public.' || expected_functions.function_name as object_name,
  case when routines.routine_name is null then 'missing' else 'ok' end as status
from expected_functions
left join information_schema.routines
  on routines.specific_schema = 'public'
 and routines.routine_name = expected_functions.function_name
order by object_name;

with expected_policies(table_name, policy_name) as (
  values
    ('marketplace_opportunities', 'Marketplace actors can view marketplace opportunities'),
    ('marketplace_opportunities', 'Citizens can view own marketplace opportunities'),
    ('marketplace_opportunities', 'Authenticated users can create marketplace opportunities'),
    ('marketplace_opportunity_private_details', 'Users can create private details for own opportunities'),
    ('marketplace_opportunity_private_details', 'Users can view private details after unlock or ownership'),
    ('marketplace_opportunity_private_details', 'Citizens can update own marketplace private document links'),
    ('marketplace_opportunity_unlocks', 'Users can view own marketplace unlocks'),
    ('marketplace_opportunity_crm_links', 'Legal operators can read own marketplace CRM links'),
    ('marketplace_opportunity_crm_links', 'Legal operators can insert own marketplace CRM links'),
    ('lawyer_credit_accounts', 'Users can view own credit account'),
    ('lawyer_credit_transactions', 'Users can view own credit transactions'),
    ('lawyer_credit_purchase_requests', 'Users can view own credit purchase requests'),
    ('lawyer_credit_purchase_requests', 'Marketplace actors can create own pending credit purchase requests'),
    ('agenda_events', 'Users can read own agenda events'),
    ('agenda_events', 'Users can insert own agenda events'),
    ('agenda_events', 'Users can update own agenda events'),
    ('agenda_events', 'Users can delete own agenda events'),
    ('citizen_documents', 'Citizens can read own documents'),
    ('citizen_documents', 'Citizens can insert own documents'),
    ('citizen_documents', 'Lawyers can read unlocked citizen documents'),
    ('admin_users', 'Admin users can view own admin marker'),
    ('lawyer_profiles', 'Lawyers can read own OAB profile'),
    ('lawyer_profiles', 'Admins can read lawyer OAB profiles'),
    ('lawyer_profiles', 'Admins can update lawyer OAB verification')
)
select
  'policies' as check_group,
  expected_policies.table_name || ' / ' || expected_policies.policy_name as object_name,
  case when pg_policies.policyname is null then 'missing' else 'ok' end as status
from expected_policies
left join pg_policies
  on pg_policies.schemaname = 'public'
 and pg_policies.tablename = expected_policies.table_name
 and pg_policies.policyname = expected_policies.policy_name
order by object_name;

select
  'storage' as check_group,
  'storage.buckets / citizen-documents' as object_name,
  case
    when exists (
      select 1
      from storage.buckets
      where id = 'citizen-documents'
        and public = false
    )
    then 'ok'
    else 'missing'
  end as status;

select
  'rls_enabled' as check_group,
  schemaname || '.' || tablename as object_name,
  case when rowsecurity then 'ok' else 'missing' end as status
from pg_tables
where schemaname = 'public'
  and tablename in (
    'marketplace_opportunities',
    'marketplace_opportunity_private_details',
    'marketplace_opportunity_unlocks',
    'marketplace_opportunity_crm_links',
    'lawyer_credit_accounts',
    'lawyer_credit_transactions',
    'lawyer_credit_purchase_requests',
    'agenda_events',
    'citizen_documents',
    'admin_users',
    'lawyer_profiles'
  )
order by object_name;
