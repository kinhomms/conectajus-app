# Trilha de auditoria administrativa — ConectaJus

Data: 2026-07-13

Este documento consolida os fluxos administrativos que alteram permissões, créditos ou decisões sensíveis na plataforma.

## Objetivo

Garantir que ações administrativas críticas sejam feitas por RPCs protegidas e deixem rastros mínimos de auditoria:

- quem decidiu;
- quando decidiu;
- qual status foi aplicado;
- qual registro foi afetado.

## Fluxos cobertos

### 1. Verificação de OAB

Tabela:

```text
public.lawyer_profiles
```

RPC:

```text
public.decide_lawyer_oab_verification
```

Campos de auditoria:

- `verification_status`;
- `verified_at`;
- `verified_by`;
- `verification_notes`.

Regra:

- apenas admin em `public.admin_users` pode decidir;
- apenas status `verified` ou `rejected` são aceitos;
- somente registros `pending` são decididos;
- o acesso Marketplace/Financeiro do advogado depende de `verification_status = 'verified'`.

### 2. Compra de créditos

Tabela:

```text
public.lawyer_credit_purchase_requests
```

RPCs:

```text
public.approve_credit_purchase_request
public.reject_credit_purchase_request
public.list_pending_credit_purchase_requests
```

Campos de auditoria:

- `status`;
- `decided_at`;
- `decided_by`;
- `decision_notes`.

Regra:

- apenas admin em `public.admin_users` pode aprovar/rejeitar;
- aprovar adiciona créditos e cria transação;
- rejeitar não altera saldo;
- decisões só podem ocorrer em solicitações `pending`.

### 3. Exclusão de conta

Tabela:

```text
public.account_deletion_requests
```

RPC:

```text
public.decide_account_deletion_request
```

Campos de auditoria:

- `status`;
- `decided_at`;
- `decided_by`;
- `decision_notes`.

Regra:

- apenas admin em `public.admin_users` pode aprovar/rejeitar;
- aprovar não remove automaticamente o usuário do Supabase Auth;
- a decisão registra a análise administrativa para retenções legais, documentos, créditos, Marketplace e histórico de atendimento;
- decisões só podem ocorrer em solicitações `pending`.

## Validação pós-migration

Depois de aplicar as migrations no Supabase alvo, executar:

```text
docs/SUPABASE_POST_APPLY_VALIDATION.sql
```

O checklist deve confirmar:

- tabelas essenciais;
- colunas de auditoria;
- RPCs administrativas;
- policies RLS;
- RLS habilitado.

## Teste manual

Usar:

```text
docs/SUPABASE_TEST_PROFILES.md
docs/MANUAL_TEST_REPORT_TEMPLATE.md
```

Validar que:

- OAB aprovada/rejeitada registra `verified_by` e `verified_at`;
- crédito aprovado/rejeitado registra `decided_by` e `decided_at`;
- exclusão aprovada/rejeitada registra `decided_by` e `decided_at`;
- usuário não-admin não consegue executar ações administrativas.

## Observação de segurança

As decisões administrativas críticas devem continuar centralizadas em RPCs `security definer` com validação interna de `public.is_current_user_admin()`.

Evite recriar policies de update direto para administradores nessas tabelas sem revisar o impacto de auditoria e RLS.
