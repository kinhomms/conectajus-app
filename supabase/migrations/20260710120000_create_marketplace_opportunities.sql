-- Marketplace Jurídico: oportunidades mascaradas geradas pela triagem por IA.
-- Esta tabela NÃO deve armazenar nome, telefone, e-mail, WhatsApp, documentos ou histórico pessoal completo.
-- Dados pessoais devem permanecer em tabelas privadas e só serem liberados por fluxo auditado de créditos.

create extension if not exists pgcrypto;

create table if not exists public.marketplace_opportunities (
  id uuid primary key default gen_random_uuid(),
  practice_area text,
  city text,
  state text,
  urgency text,
  summary text not null,
  complexity text,
  credit_cost integer not null default 1 check (credit_cost >= 0),
  status text not null default 'open' check (status in ('open', 'reserved', 'unlocked', 'closed', 'archived')),
  source_triage_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  unlocked_by uuid references auth.users(id) on delete set null,
  unlocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists marketplace_opportunities_status_idx
  on public.marketplace_opportunities (status);

create index if not exists marketplace_opportunities_city_idx
  on public.marketplace_opportunities (city);

create index if not exists marketplace_opportunities_practice_area_idx
  on public.marketplace_opportunities (practice_area);

create index if not exists marketplace_opportunities_created_at_idx
  on public.marketplace_opportunities (created_at desc);

create or replace function public.set_marketplace_opportunities_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_marketplace_opportunities_updated_at on public.marketplace_opportunities;

create trigger set_marketplace_opportunities_updated_at
before update on public.marketplace_opportunities
for each row
execute function public.set_marketplace_opportunities_updated_at();

alter table public.marketplace_opportunities enable row level security;

-- Advogados/autenticados podem visualizar somente oportunidades sem dados pessoais.
drop policy if exists "Authenticated users can view open marketplace opportunities" on public.marketplace_opportunities;

create policy "Authenticated users can view open marketplace opportunities"
on public.marketplace_opportunities
for select
to authenticated
using (status in ('open', 'reserved'));

-- Escrita fica reservada ao backend/service role por enquanto.
-- Não criar policies públicas de insert/update/delete sem definir papéis de admin/advogado.