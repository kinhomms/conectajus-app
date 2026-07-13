create or replace function public.is_current_user_marketplace_actor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    exists (
      select 1
      from public.admin_users admin_user
      where admin_user.user_id = auth.uid()
    ),
    false
  )
  or coalesce(
    exists (
      select 1
      from public.lawyer_profiles lawyer_profile
      where lawyer_profile.user_id = auth.uid()
        and lawyer_profile.verification_status = 'verified'
    ),
    false
  );
$$;

grant execute on function public.is_current_user_marketplace_actor() to authenticated;

notify pgrst, 'reload schema';
