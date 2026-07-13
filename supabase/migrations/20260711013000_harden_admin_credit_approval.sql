-- Harden administrative credit approvals.
-- Admin access is no longer inferred directly from user_metadata.
-- Existing users previously marked as admin are migrated once into public.admin_users.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

insert into public.admin_users (user_id)
select users.id
from auth.users users
where coalesce(
  users.raw_app_meta_data ->> 'profile',
  users.raw_user_meta_data ->> 'profile'
) = 'admin'
on conflict (user_id) do nothing;

drop policy if exists "Admin users can view own admin marker" on public.admin_users;
create policy "Admin users can view own admin marker"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users admin_user
    where admin_user.user_id = auth.uid()
  );
$$;

grant select on public.admin_users to authenticated;
grant execute on function public.is_current_user_admin() to authenticated;

notify pgrst, 'reload schema';