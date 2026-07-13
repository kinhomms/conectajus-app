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

- `npm run validate` passando localmente.
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

## Bloqueadores externos para o link de teste

Este ambiente local não possui CLI da Vercel, Supabase ou GitHub disponível. Portanto, o link de teste precisa ser gerado pelo painel da Vercel ou por outro ambiente autenticado.

Antes de testar o preview, confirmar:

- migrations aplicadas no Supabase alvo;
- `docs/SUPABASE_POST_APPLY_VALIDATION.sql` retornando `ok`;
- variáveis configuradas na Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`;
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`;
- branch selecionada na Vercel: `ui-v6-premium`;
- root directory do projeto na Vercel apontando para a raiz onde está o `package.json`.
- `vercel.json` reconhecido com framework `nextjs`, install `npm install` e build `npm run build`.

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
   - aprovar/rejeitar créditos;
   - aprovar/rejeitar exclusão de conta.

## Documentos de apoio

```text
docs/VERCEL_DEPLOYMENT.md
docs/APPLY_SUPABASE_MIGRATIONS.md
docs/SUPABASE_MIGRATION_ORDER.md
docs/SUPABASE_POST_APPLY_VALIDATION.sql
docs/MANUAL_TEST_REPORT_TEMPLATE.md
docs/MVP_HANDOFF.md
```
