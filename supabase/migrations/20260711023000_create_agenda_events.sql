create table if not exists public.agenda_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id uuid null references public.clients(id) on delete set null,
  case_id uuid null references public.client_cases(id) on delete set null,
  title text not null,
  description text null,
  event_type text not null default 'task' check (event_type in ('deadline', 'hearing', 'task', 'meeting', 'other')),
  status text not null default 'pending' check (status in ('pending', 'completed', 'canceled')),
  starts_at timestamptz not null,
  ends_at timestamptz null,
  location text null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists agenda_events_user_id_idx on public.agenda_events(user_id);
create index if not exists agenda_events_client_id_idx on public.agenda_events(client_id);
create index if not exists agenda_events_case_id_idx on public.agenda_events(case_id);
create index if not exists agenda_events_starts_at_idx on public.agenda_events(starts_at);
create index if not exists agenda_events_status_idx on public.agenda_events(status);

alter table public.agenda_events enable row level security;

drop policy if exists "Users can read own agenda events" on public.agenda_events;
create policy "Users can read own agenda events"
  on public.agenda_events for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own agenda events" on public.agenda_events;
create policy "Users can insert own agenda events"
  on public.agenda_events for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own agenda events" on public.agenda_events;
create policy "Users can update own agenda events"
  on public.agenda_events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own agenda events" on public.agenda_events;
create policy "Users can delete own agenda events"
  on public.agenda_events for delete
  using (auth.uid() = user_id);