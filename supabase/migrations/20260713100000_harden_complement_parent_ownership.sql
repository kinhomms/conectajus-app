-- Harden complementary triage publishing.
-- A citizen can publish a primary opportunity, or a complementary opportunity linked only
-- to another opportunity created by the same authenticated user.

drop policy if exists "Authenticated users can create marketplace opportunities" on public.marketplace_opportunities;

create policy "Authenticated users can create marketplace opportunities"
on public.marketplace_opportunities
for insert
to authenticated
with check (
  created_by = auth.uid()
  and status = 'open'
  and summary is not null
  and (
    parent_opportunity_id is null
    or exists (
      select 1
      from public.marketplace_opportunities parent
      where parent.id = parent_opportunity_id
        and parent.created_by = auth.uid()
    )
  )
);

notify pgrst, 'reload schema';
