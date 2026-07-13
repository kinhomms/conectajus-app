-- Harden CRM operational data so citizen accounts cannot read office/client records.
-- New CRM clients receive owner_user_id automatically. Legacy rows with no owner remain visible
-- to legal operators during migration to avoid hiding existing data unexpectedly.

create or replace function public.is_current_user_legal_operator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_current_user_admin()
  or coalesce((
    select coalesce(
      users.raw_app_meta_data ->> 'profile',
      users.raw_user_meta_data ->> 'profile'
    ) = 'advogado'
    from auth.users users
    where users.id = auth.uid()
  ), false);
$$;

grant execute on function public.is_current_user_legal_operator() to authenticated;

alter table if exists public.clients
  add column if not exists owner_user_id uuid default auth.uid() references auth.users(id) on delete set null;

create index if not exists clients_owner_user_id_idx on public.clients(owner_user_id);

alter table if exists public.clients enable row level security;
alter table if exists public.client_notes enable row level security;
alter table if exists public.client_cases enable row level security;
alter table if exists public.client_documents enable row level security;

drop policy if exists "Legal operators can read accessible clients" on public.clients;
create policy "Legal operators can read accessible clients"
  on public.clients for select
  to authenticated
  using (
    public.is_current_user_admin()
    or (
      public.is_current_user_legal_operator()
      and (owner_user_id = auth.uid() or owner_user_id is null)
    )
  );

drop policy if exists "Legal operators can insert own clients" on public.clients;
create policy "Legal operators can insert own clients"
  on public.clients for insert
  to authenticated
  with check (
    public.is_current_user_legal_operator()
    and coalesce(owner_user_id, auth.uid()) = auth.uid()
  );

drop policy if exists "Legal operators can update accessible clients" on public.clients;
create policy "Legal operators can update accessible clients"
  on public.clients for update
  to authenticated
  using (
    public.is_current_user_admin()
    or (
      public.is_current_user_legal_operator()
      and (owner_user_id = auth.uid() or owner_user_id is null)
    )
  )
  with check (
    public.is_current_user_admin()
    or (
      public.is_current_user_legal_operator()
      and (owner_user_id = auth.uid() or owner_user_id is null)
    )
  );

drop policy if exists "Legal operators can delete accessible clients" on public.clients;
create policy "Legal operators can delete accessible clients"
  on public.clients for delete
  to authenticated
  using (
    public.is_current_user_admin()
    or (
      public.is_current_user_legal_operator()
      and (owner_user_id = auth.uid() or owner_user_id is null)
    )
  );

drop policy if exists "Legal operators can read accessible client notes" on public.client_notes;
create policy "Legal operators can read accessible client notes"
  on public.client_notes for select
  to authenticated
  using (
    exists (
      select 1 from public.clients client
      where client.id = client_notes.client_id
    )
  );

drop policy if exists "Legal operators can insert accessible client notes" on public.client_notes;
create policy "Legal operators can insert accessible client notes"
  on public.client_notes for insert
  to authenticated
  with check (
    exists (
      select 1 from public.clients client
      where client.id = client_notes.client_id
    )
  );

drop policy if exists "Legal operators can read accessible client cases" on public.client_cases;
create policy "Legal operators can read accessible client cases"
  on public.client_cases for select
  to authenticated
  using (
    exists (
      select 1 from public.clients client
      where client.id = client_cases.client_id
    )
  );

drop policy if exists "Legal operators can insert accessible client cases" on public.client_cases;
create policy "Legal operators can insert accessible client cases"
  on public.client_cases for insert
  to authenticated
  with check (
    exists (
      select 1 from public.clients client
      where client.id = client_cases.client_id
    )
  );

drop policy if exists "Legal operators can read accessible client documents" on public.client_documents;
create policy "Legal operators can read accessible client documents"
  on public.client_documents for select
  to authenticated
  using (
    exists (
      select 1 from public.clients client
      where client.id = client_documents.client_id
    )
  );

drop policy if exists "Legal operators can insert accessible client documents" on public.client_documents;
create policy "Legal operators can insert accessible client documents"
  on public.client_documents for insert
  to authenticated
  with check (
    exists (
      select 1 from public.clients client
      where client.id = client_documents.client_id
    )
  );

notify pgrst, 'reload schema';