-- Allow citizens to track only the marketplace opportunities created by themselves.
-- This complements the marketplace actor policy without exposing other citizens' cases.

drop policy if exists "Citizens can view own marketplace opportunities" on public.marketplace_opportunities;

create policy "Citizens can view own marketplace opportunities"
  on public.marketplace_opportunities
  for select
  to authenticated
  using (created_by = auth.uid());