create table if not exists public.lawyer_public_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  headline text null,
  bio text null,
  profile_photo_url text null,
  oab_number text null,
  oab_state text null,
  is_public boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists lawyer_public_profiles_is_public_idx
on public.lawyer_public_profiles(is_public);

alter table public.lawyer_public_profiles enable row level security;

drop policy if exists "Public can read visible lawyer public profiles" on public.lawyer_public_profiles;
create policy "Public can read visible lawyer public profiles"
on public.lawyer_public_profiles
for select
using (is_public = true);

drop policy if exists "Lawyers can manage own public profile" on public.lawyer_public_profiles;
create policy "Lawyers can manage own public profile"
on public.lawyer_public_profiles
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create or replace function public.set_lawyer_public_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lawyer_public_profiles_updated_at on public.lawyer_public_profiles;
create trigger set_lawyer_public_profiles_updated_at
before update on public.lawyer_public_profiles
for each row execute function public.set_lawyer_public_profiles_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lawyer-profile-photos',
  'lawyer-profile-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read lawyer profile photos" on storage.objects;
create policy "Public can read lawyer profile photos"
on storage.objects
for select
using (bucket_id = 'lawyer-profile-photos');

drop policy if exists "Users can upload own lawyer profile photos" on storage.objects;
create policy "Users can upload own lawyer profile photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'lawyer-profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own lawyer profile photos" on storage.objects;
create policy "Users can update own lawyer profile photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'lawyer-profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'lawyer-profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own lawyer profile photos" on storage.objects;
create policy "Users can delete own lawyer profile photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'lawyer-profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
