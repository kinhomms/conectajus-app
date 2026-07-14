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

  if raw_profile is distinct from 'advogado' then
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

notify pgrst, 'reload schema';
