# Ordem de aplicação das migrations Supabase

Use este arquivo quando for aplicar as migrations manualmente pelo SQL Editor do Supabase ou validar a ordem antes de usar `supabase db push`.

## Ordem cronológica

1. `20260710120000_create_marketplace_opportunities.sql`
2. `20260710123000_allow_authenticated_marketplace_opportunity_insert.sql`
3. `20260710130000_create_marketplace_credit_unlock_flow.sql`
4. `20260711001000_create_ensure_lawyer_credit_account_rpc.sql`
5. `20260711003000_create_credit_purchase_requests.sql`
6. `20260711005000_create_marketplace_private_details.sql`
7. `20260711010000_create_admin_credit_request_approval.sql`
8. `20260711013000_harden_admin_credit_approval.sql`
9. `20260711014500_cancel_credit_purchase_request.sql`
10. `20260711020000_restrict_marketplace_to_lawyers.sql`
11. `20260711021500_restrict_finance_to_marketplace_actors.sql`
12. `20260711023000_create_agenda_events.sql`
13. `20260711024500_harden_crm_citizen_data_access.sql`
14. `20260711030000_create_citizen_document_uploads.sql`
15. `20260711031500_link_citizen_documents_to_marketplace.sql`
16. `20260711033000_allow_citizens_to_track_own_opportunities.sql`
17. `20260711034500_create_marketplace_opportunity_crm_links.sql`
18. `20260712090000_allow_citizen_document_complements.sql`
19. `20260712093000_link_complementary_marketplace_opportunities.sql`
20. `20260713100000_harden_complement_parent_ownership.sql`
21. `20260713113000_create_lawyer_profiles_oab_validation.sql`
22. `20260713114500_require_verified_oab_for_marketplace.sql`
23. `20260713120000_create_account_deletion_requests.sql`
24. `20260713123000_decide_account_deletion_request_rpc.sql`
25. `20260713124500_audit_lawyer_oab_verification.sql`
26. `20260713130000_audit_credit_purchase_request_decisions.sql`

## Observações importantes

- A migration `20260713100000_harden_complement_parent_ownership.sql` protege `parent_opportunity_id` para impedir que uma triagem complementar seja vinculada a oportunidade de outro cidadão.
- A migration de OAB cria `lawyer_profiles`, registra advogados a partir do cadastro Auth e impede duplicidade de OAB/UF.
- A migration de acesso exige `lawyer_profiles.verification_status = 'verified'` para advogado acessar Marketplace, Financeiro e desbloqueios; administradores continuam liberados.
- A migration de exclusão cria fila auditável `account_deletion_requests`; a exclusão não é instantânea para preservar análise jurídica, auditoria e retenções obrigatórias.
- A RPC de decisão de exclusão registra `decided_by = auth.uid()` e evita update administrativo direto pela API pública.
- A RPC de verificação OAB registra `verified_by = auth.uid()` e evita update administrativo direto pela API pública.
- As RPCs de aprovação/rejeição de créditos registram `decided_by` e `decided_at` na solicitação administrativa.
- Todas as migrations devem ser aplicadas no projeto Supabase alvo antes do deploy final.
- Se uma migration já tiver sido aplicada, o SQL foi escrito para ser majoritariamente idempotente, usando `if not exists`, `drop policy if exists` e `add column if not exists` quando aplicável.
- Após aplicar, confirmar no app:
  - cidadão cria triagem principal;
  - cidadão cria complemento para caso próprio;
  - cidadão não acessa áreas internas por URL direta;
  - advogado desbloqueia oportunidade;
  - advogado abre documento privado apenas após desbloqueio;
  - admin aprova/rejeita créditos.

## Validação após aplicar

No SQL Editor do Supabase, executar o checklist somente-leitura:

```text
docs/SUPABASE_POST_APPLY_VALIDATION.sql
```

Todos os grupos devem retornar `ok` para os objetos esperados.

No projeto local:

```bash
npm run lint
npm run build
```

No app:

- testar login como cidadão;
- testar login como advogado;
- testar login como admin;
- testar `/dashboard`, `/triagem`, `/documentos`, `/marketplace`, `/financeiro`, `/relatorios` e `/configuracoes`.
