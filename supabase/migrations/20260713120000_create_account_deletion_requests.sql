create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  profile text not null,
  reason text,
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users(id) on delete set null,
  decision_notes text,
  constraint account_deletion_requests_status_check check (status in ('pending', 'approved', 'rejected', 'canceled'))
);

create unique index if not exists account_deletion_requests_one_pending_per_user_idx
on public.account_deletion_requests(user_id)
where status = 'pending';

create index if not exists account_deletion_requests_status_idx
on public.account_deletion_requests(status);

alter table public.account_deletion_requests enable row level security;

drop policy if exists "Users can read own account deletion requests" on public.account_deletion_requests;
create policy "Users can read own account deletion requests"
on public.account_deletion_requests
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can create own pending account deletion request" on public.account_deletion_requests;
create policy "Users can create own pending account deletion request"
on public.account_deletion_requests
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
);

drop policy if exists "Users can cancel own pending account deletion request" on public.account_deletion_requests;
create policy "Users can cancel own pending account deletion request"
on public.account_deletion_requests
for update
to authenticated
using (
  user_id = auth.uid()
  and status = 'pending'
)
with check (
  user_id = auth.uid()
  and status = 'canceled'
);

drop policy if exists "Admins can read account deletion requests" on public.account_deletion_requests;
create policy "Admins can read account deletion requests"
on public.account_deletion_requests
for select
to authenticated
using (public.is_current_user_admin());

drop policy if exists "Admins can decide account deletion requests" on public.account_deletion_requests;
create policy "Admins can decide account deletion requests"
on public.account_deletion_requests
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

notify pgrst, 'reload schema';
