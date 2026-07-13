create table if not exists public.lawyer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  oab_number text not null,
  oab_state text not null,
  verification_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lawyer_profiles_oab_number_format check (oab_number ~ '^[0-9]{3,8}$'),
  constraint lawyer_profiles_oab_state_format check (oab_state ~ '^[A-Z]{2}$'),
  constraint lawyer_profiles_verification_status_check check (verification_status in ('pending', 'verified', 'rejected'))
);

create unique index if not exists lawyer_profiles_oab_unique_idx
on public.lawyer_profiles(oab_state, oab_number);

create index if not exists lawyer_profiles_verification_status_idx
on public.lawyer_profiles(verification_status);

alter table public.lawyer_profiles enable row level security;

drop policy if exists "Lawyers can read own OAB profile" on public.lawyer_profiles;
create policy "Lawyers can read own OAB profile"
on public.lawyer_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can read lawyer OAB profiles" on public.lawyer_profiles;
create policy "Admins can read lawyer OAB profiles"
on public.lawyer_profiles
for select
to authenticated
using (public.is_current_user_admin());

drop policy if exists "Admins can update lawyer OAB verification" on public.lawyer_profiles;
create policy "Admins can update lawyer OAB verification"
on public.lawyer_profiles
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

create or replace function public.set_lawyer_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lawyer_profiles_updated_at on public.lawyer_profiles;
create trigger set_lawyer_profiles_updated_at
before update on public.lawyer_profiles
for each row execute function public.set_lawyer_profiles_updated_at();

create or replace function public.handle_new_lawyer_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_profile text;
  raw_oab_number text;
  raw_oab_state text;
begin
  raw_profile := new.raw_user_meta_data ->> 'profile';

  if raw_profile <> 'advogado' then
    return new;
  end if;

  raw_oab_number := regexp_replace(coalesce(new.raw_user_meta_data ->> 'lawyer_oab_number', ''), '\D', '', 'g');
  raw_oab_state := upper(trim(coalesce(new.raw_user_meta_data ->> 'lawyer_oab_state', '')));

  if raw_oab_number !~ '^[0-9]{3,8}$' or raw_oab_state !~ '^[A-Z]{2}$' then
    raise exception 'Cadastro de advogado exige OAB e UF válidas.';
  end if;

  insert into public.lawyer_profiles (
    user_id,
    full_name,
    email,
    oab_number,
    oab_state,
    verification_status
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Advogado'),
    coalesce(new.email, ''),
    raw_oab_number,
    raw_oab_state,
    'pending'
  )
  on conflict (user_id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    oab_number = excluded.oab_number,
    oab_state = excluded.oab_state,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_lawyer_profile on auth.users;
create trigger on_auth_user_created_create_lawyer_profile
after insert on auth.users
for each row execute function public.handle_new_lawyer_profile();

notify pgrst, 'reload schema';
