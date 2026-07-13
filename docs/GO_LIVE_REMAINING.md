# Pendências finais para teste online — ConectaJus

Data: 2026-07-13

Status estimado do projeto:

```text
98%
```

## Resposta objetiva

Não falta muita coisa de desenvolvimento para concluir o MVP.

O código local está validado, versionado e publicado na branch `ui-v6-premium`. O que falta para considerar o projeto 100% pronto é principalmente validação externa em ambiente real:

1. Supabase alvo com migrations aplicadas.
2. SQL de validação pós-migrations retornando `ok`.
3. Variáveis configuradas na Vercel.
4. Preview deploy gerado.
5. Teste manual com cidadão, advogado e admin.
6. Decisão final sobre legados documentados.

## Já pronto localmente

- `npm run validate` aprovado.
- `npm run preflight:preview` integrado ao validate.
- Lint aprovado.
- Build aprovado.
- 16 rotas geradas.
- 26 migrations conferidas no repositório.
- Arquitetura por features preservada.
- Marketplace com dados mascarados.
- Desbloqueio por créditos.
- Documentos privados protegidos.
- Cadastro de advogado com OAB/UF.
- Bloqueio de Marketplace/Financeiro enquanto OAB não estiver verificada.
- Admin com filas de OAB, créditos e exclusão de conta.
- Auditoria administrativa com `verified_by`, `verified_at`, `decided_by` e `decided_at`.

## O que impede dizer 100%

### 1. Supabase real

Ainda precisa confirmar no projeto Supabase alvo:

- migrations aplicadas em ordem;
- bucket `citizen-documents`;
- policies de Storage;
- tabela `admin_users`;
- funções RPC administrativas;
- RLS nas tabelas críticas;
- colunas de auditoria.

Comando/documento de referência:

```text
docs/SUPABASE_POST_APPLY_VALIDATION.sql
```

### 2. Preview Vercel

Ainda precisa confirmar:

- repositório `kinhomms/conectajus-app`;
- branch `ui-v6-premium`;
- variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`;
- build na Vercel;
- link de preview.

Guia:

```text
docs/VERCEL_DEPLOYMENT.md
```

### 3. Teste manual real

Fluxos mínimos:

- cidadão cria conta, faz triagem, publica demanda e envia documento;
- advogado cadastra OAB, fica bloqueado até validação, acessa Marketplace após aprovação e desbloqueia lead;
- admin aprova/rejeita OAB, crédito e exclusão de conta;
- dados pessoais não aparecem antes do desbloqueio;
- documentos privados só abrem após autorização/desbloqueio.

Modelo:

```text
docs/MANUAL_TEST_REPORT_TEMPLATE.md
```

## Percentual estimado por área

| Área | Status |
| --- | ---: |
| Código local | 99% |
| Arquitetura/features | 99% |
| Segurança visual/RLS planejada | 98% |
| Auditoria administrativa | 98% |
| Documentação de deploy/testes | 99% |
| Supabase real validado | pendente |
| Preview Vercel validado | pendente |
| Teste manual dos 3 perfis | pendente |

## Próxima ação recomendada

Seguir a execução acelerada:

```text
docs/GO_LIVE_EXECUTION.md
```

Aplicar ou confirmar as migrations no Supabase alvo e executar:

```text
supabase/APPLY_ALL_MIGRATIONS.sql
```

Depois executar:

```text
docs/SUPABASE_POST_APPLY_VALIDATION.sql
```

Após criar os usuários de teste, executar também:

```text
supabase/TEST_PROFILE_CHECKS.sql
```

Se o resultado retornar `ok`, a próxima etapa é gerar o preview na Vercel e testar os três perfis.
