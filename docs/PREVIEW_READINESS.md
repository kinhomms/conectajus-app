# Preview readiness — ConectaJus

Data: 2026-07-13

Branch pronta para preview:

```text
ui-v6-premium
```

Repositório:

```text
https://github.com/kinhomms/conectajus-app.git
```

## Estado do código

- `npm run validate` passando localmente, incluindo `preflight:preview`.
- Build Next.js gerando 16 rotas.
- Branch `ui-v6-premium` publicada no GitHub.
- Arquitetura por features preservada.
- Dados sensíveis do Marketplace mantidos atrás do fluxo de desbloqueio por créditos.
- Cadastro de advogado exige OAB/UF.
- Marketplace/Financeiro ficam bloqueados para advogado com OAB pendente.
- Configurações de conta possuem preferências e solicitação/cancelamento de exclusão.
- Admin possui filas para:
  - verificar/rejeitar OAB;
  - aprovar/rejeitar créditos;
  - aprovar/rejeitar solicitação de exclusão de conta.
- Decisões administrativas de OAB, créditos e exclusão possuem trilha de auditoria.

## Bloqueadores externos para o link de teste

Este ambiente local não possui CLI da Vercel, Supabase ou GitHub disponível. Portanto, o link de teste precisa ser gerado pelo painel da Vercel ou por outro ambiente autenticado.

Antes de testar o preview, confirmar:

- `npm run validate` aprovado, incluindo `preflight:preview`;
- migrations aplicadas no Supabase alvo, preferencialmente via `supabase/APPLY_ALL_MIGRATIONS.sql`;
- `docs/SUPABASE_POST_APPLY_VALIDATION.sql` retornando `ok`;
- perfis de teste preparados conforme `docs/SUPABASE_TEST_PROFILES.md`;
- `supabase/TEST_PROFILE_CHECKS.sql` executado após criar cidadão, advogado e admin de teste;
- variáveis configuradas na Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`;
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`;
- branch selecionada na Vercel: `ui-v6-premium`;
- root directory do projeto na Vercel apontando para a raiz onde está o `package.json`.
- `vercel.json` reconhecido com framework `nextjs`, install `npm install` e build `npm run validate`.

## Roteiro mínimo assim que o link existir

1. Visitante:
   - `/`;
   - `/login`;
   - `/cadastro`.
2. Cidadão:
   - criar conta;
   - triagem;
   - envio de documento;
   - configurações;
   - solicitação/cancelamento de exclusão.
3. Advogado:
   - cadastro com OAB/UF;
   - bloqueio enquanto OAB estiver pendente;
   - Marketplace após OAB verificada;
   - desbloqueio por créditos;
   - envio para CRM.
4. Admin:
   - verificar/rejeitar OAB;
   - confirmar `verified_by` e `verified_at`;
   - aprovar/rejeitar créditos;
   - confirmar `decided_by` e `decided_at` em créditos;
   - aprovar/rejeitar exclusão de conta.
   - confirmar `decided_by` e `decided_at` em exclusão.

## Documentos de apoio

```text
docs/VERCEL_DEPLOYMENT.md
docs/APPLY_SUPABASE_MIGRATIONS.md
docs/SUPABASE_MIGRATION_ORDER.md
supabase/APPLY_ALL_MIGRATIONS.sql
docs/SUPABASE_POST_APPLY_VALIDATION.sql
docs/SUPABASE_TEST_PROFILES.md
supabase/TEST_PROFILE_CHECKS.sql
docs/ADMIN_AUDIT_TRAIL.md
docs/MANUAL_TEST_REPORT_TEMPLATE.md
docs/MVP_HANDOFF.md
```
