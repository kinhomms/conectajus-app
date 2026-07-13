alter table public.lawyer_profiles
add column if not exists verified_at timestamptz,
add column if not exists verified_by uuid references auth.users(id) on delete set null,
add column if not exists verification_notes text;

create or replace function public.decide_lawyer_oab_verification(
  target_user_id uuid,
  target_status text,
  target_notes text default null
)
returns table (
  user_id uuid,
  full_name text,
  email text,
  oab_number text,
  oab_state text,
  verification_status text,
  created_at timestamptz,
  updated_at timestamptz,
  verified_at timestamptz,
  verified_by uuid,
  verification_notes text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  if not public.is_current_user_admin() then
    raise exception 'Acesso administrativo necessario.';
  end if;

  if target_status not in ('verified', 'rejected') then
    raise exception 'Status de verificacao OAB invalido.';
  end if;

  return query
  update public.lawyer_profiles profile
  set
    verification_status = target_status,
    verified_at = now(),
    verified_by = current_user_id,
    verification_notes = nullif(btrim(target_notes), '')
  where profile.user_id = target_user_id
    and profile.verification_status = 'pending'
  returning
    profile.user_id,
    profile.full_name,
    profile.email,
    profile.oab_number,
    profile.oab_state,
    profile.verification_status,
    profile.created_at,
    profile.updated_at,
    profile.verified_at,
    profile.verified_by,
    profile.verification_notes;
end;
$$;

grant execute on function public.decide_lawyer_oab_verification(uuid, text, text) to authenticated;

drop policy if exists "Admins can update lawyer OAB verification" on public.lawyer_profiles;

notify pgrst, 'reload schema';
