# Auditoria Supabase RLS e permissões

Data da auditoria: 2026-07-13

## Objetivo

Comparar as permissões da interface com as permissões do Supabase, especialmente nas áreas com risco de exposição de dados pessoais:

- Marketplace;
- dados privados da oportunidade;
- documentos do cidadão;
- CRM;
- créditos;
- agenda.

## Resultado geral

O projeto já possui RLS estruturado para as principais tabelas.

Pontos confirmados:

- cidadãos conseguem acompanhar apenas oportunidades criadas por eles;
- advogados/admin acessam o Marketplace via `is_current_user_marketplace_actor()`;
- dados privados da oportunidade só aparecem para o dono da demanda ou para o advogado que desbloqueou;
- documentos do cidadão ficam em bucket privado;
- advogados só leem documentos vinculados após desbloqueio da oportunidade;
- CRM possui policies voltadas a operadores jurídicos;
- créditos e transações são lidos por dono da conta;
- aprovação administrativa de créditos passa por RPCs protegidas.

## Hardening aplicado nesta etapa

Foi criada a migration:

```text
supabase/migrations/20260713100000_harden_complement_parent_ownership.sql
```

Motivo:

- a policy de insert em `marketplace_opportunities` já exigia `created_by = auth.uid()` e `status = 'open'`;
- porém, com a chegada de `parent_opportunity_id`, era necessário impedir que um cidadão criasse complemento apontando para uma oportunidade de outro cidadão.

Nova regra:

- oportunidade principal pode ter `parent_opportunity_id = null`;
- oportunidade complementar só pode apontar para uma oportunidade em que `parent.created_by = auth.uid()`.

## Matriz RLS resumida

| Área | Proteção atual |
| --- | --- |
| `marketplace_opportunities` | Cidadão lê próprias; advogado/admin lê oportunidades via função de ator do Marketplace. |
| `marketplace_opportunity_private_details` | Dono da demanda ou advogado que desbloqueou. |
| `citizen_documents` | Dono lê próprios; advogado lê vinculados após desbloqueio. |
| `storage.objects` / `citizen-documents` | Dono lê próprios; advogado lê arquivo vinculado após desbloqueio. |
| `clients` | Operador jurídico dono ou admin. |
| `client_notes`, `client_cases`, `client_documents` | Acesso condicionado à visibilidade do cliente relacionado. |
| `lawyer_credit_accounts` | Usuário lê a própria conta. |
| `lawyer_credit_transactions` | Usuário lê o próprio histórico. |
| `lawyer_credit_purchase_requests` | Usuário cria/lê pedidos próprios; admin decide via RPC. |
| `agenda_events` | Usuário lê/altera eventos próprios. |

## Pontos de atenção para produção

1. Aplicar a migration `20260713100000_harden_complement_parent_ownership.sql` no Supabase.
2. Confirmar que `admin_users` contém os administradores reais.
3. Confirmar que usuários advogados possuem `profile = 'advogado'` em `raw_user_meta_data` ou `raw_app_meta_data`.
4. Testar manualmente:
   - cidadão tentando acessar Marketplace;
   - cidadão tentando abrir relatório executivo;
   - cidadão criando complemento de caso próprio;
   - cidadão tentando complementar caso que não é seu;
   - advogado desbloqueando oportunidade;
   - advogado abrindo documentos apenas após desbloqueio.

## Validação local

Após criação da migration, validar:

```bash
npm run lint
npm run build
```
