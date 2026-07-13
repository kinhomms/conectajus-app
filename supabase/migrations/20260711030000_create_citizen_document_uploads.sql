-- Citizen document uploads are separated from CRM client_documents.
-- Files are stored in a private Supabase Storage bucket and metadata is owned by auth.uid().

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'citizen-documents',
  'citizen-documents',
  false,
  10485760,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.citizen_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null unique,
  file_size bigint null,
  mime_type text null,
  notes text null,
  status text not null default 'uploaded' check (status in ('uploaded', 'reviewed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists citizen_documents_user_id_idx on public.citizen_documents(user_id);
create index if not exists citizen_documents_created_at_idx on public.citizen_documents(created_at);

alter table public.citizen_documents enable row level security;

drop policy if exists "Citizens can read own documents" on public.citizen_documents;
create policy "Citizens can read own documents"
  on public.citizen_documents for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Citizens can insert own documents" on public.citizen_documents;
create policy "Citizens can insert own documents"
  on public.citizen_documents for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Citizens can update own documents" on public.citizen_documents;
create policy "Citizens can update own documents"
  on public.citizen_documents for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Citizens can delete own documents" on public.citizen_documents;
create policy "Citizens can delete own documents"
  on public.citizen_documents for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Citizens can read own storage documents" on storage.objects;
create policy "Citizens can read own storage documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'citizen-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Citizens can upload own storage documents" on storage.objects;
create policy "Citizens can upload own storage documents"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'citizen-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Citizens can update own storage documents" on storage.objects;
create policy "Citizens can update own storage documents"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'citizen-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'citizen-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Citizens can delete own storage documents" on storage.objects;
create policy "Citizens can delete own storage documents"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'citizen-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

notify pgrst, 'reload schema';