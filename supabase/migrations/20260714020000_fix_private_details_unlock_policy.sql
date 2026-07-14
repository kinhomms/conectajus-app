drop policy if exists "Users can view private details after unlock or ownership" on public.marketplace_opportunity_private_details;

create policy "Users can view private details after unlock or ownership"
on public.marketplace_opportunity_private_details
for select
to authenticated
using (
  marketplace_opportunity_private_details.created_by = auth.uid()
  or exists (
    select 1
    from public.marketplace_opportunities opportunity
    where opportunity.id = marketplace_opportunity_private_details.opportunity_id
      and opportunity.unlocked_by = auth.uid()
  )
);

notify pgrst, 'reload schema';
