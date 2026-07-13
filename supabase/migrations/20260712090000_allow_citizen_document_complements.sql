-- Allow citizens to safely attach complementary documents to their own published marketplace opportunities.
-- This keeps the original demand immutable while allowing post-publication evidence uploads.

grant update (citizen_document_ids) on public.marketplace_opportunity_private_details to authenticated;

drop policy if exists "Citizens can update own marketplace private document links" on public.marketplace_opportunity_private_details;
create policy "Citizens can update own marketplace private document links"
on public.marketplace_opportunity_private_details
for update
to authenticated
using (
  created_by = auth.uid()
  and exists (
    select 1
    from public.marketplace_opportunities opportunity
    where opportunity.id = opportunity_id
      and opportunity.created_by = auth.uid()
  )
)
with check (
  created_by = auth.uid()
  and exists (
    select 1
    from public.marketplace_opportunities opportunity
    where opportunity.id = opportunity_id
      and opportunity.created_by = auth.uid()
  )
);

notify pgrst, 'reload schema';