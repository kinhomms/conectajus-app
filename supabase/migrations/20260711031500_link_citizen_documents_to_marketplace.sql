-- Link private citizen documents to marketplace opportunities.
-- Lawyers can read/open linked documents only after unlocking the related opportunity.

alter table if exists public.marketplace_opportunity_private_details
  add column if not exists citizen_document_ids uuid[] not null default '{}';

create index if not exists marketplace_private_details_citizen_document_ids_gin_idx
  on public.marketplace_opportunity_private_details using gin (citizen_document_ids);

drop policy if exists "Lawyers can read unlocked citizen documents" on public.citizen_documents;
create policy "Lawyers can read unlocked citizen documents"
  on public.citizen_documents for select
  to authenticated
  using (
    exists (
      select 1
      from public.marketplace_opportunity_private_details details
      join public.marketplace_opportunities opportunity
        on opportunity.id = details.opportunity_id
      where citizen_documents.id = any(details.citizen_document_ids)
        and opportunity.unlocked_by = auth.uid()
    )
  );

drop policy if exists "Citizens can read own storage documents" on storage.objects;
create policy "Citizens and unlocked lawyers can read citizen storage documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'citizen-documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1
        from public.citizen_documents document
        join public.marketplace_opportunity_private_details details
          on document.id = any(details.citizen_document_ids)
        join public.marketplace_opportunities opportunity
          on opportunity.id = details.opportunity_id
        where document.file_path = storage.objects.name
          and opportunity.unlocked_by = auth.uid()
      )
    )
  );

notify pgrst, 'reload schema';