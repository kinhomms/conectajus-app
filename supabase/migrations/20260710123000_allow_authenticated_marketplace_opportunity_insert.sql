-- Allow authenticated users to publish masked marketplace opportunities created from triage.
-- The row must point to the authenticated user as created_by.

drop policy if exists "Authenticated users can create marketplace opportunities" on public.marketplace_opportunities;

create policy "Authenticated users can create marketplace opportunities"
on public.marketplace_opportunities
for insert
to authenticated
with check (
  created_by = auth.uid()
  and status = 'open'
  and summary is not null
);