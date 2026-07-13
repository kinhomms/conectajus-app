# Pendências finais para teste online — ConectaJus

Data: 2026-07-13

Status estimado do projeto:

```text
99,5%
```

## Resposta objetiva

Não falta muita coisa de desenvolvimento para concluir o MVP.

O código local está validado, versionado e publicado na branch `ui-v6-premium`. O Supabase real foi aplicado/validado e o preview Vercel está pronto. O que falta para considerar o projeto 100% pronto é a validação logada dos perfis reais:

1. Confirmar usuários de teste no Supabase ou usar contas reais já confirmadas.
2. Teste manual com cidadão, advogado e admin.
3. Decisão final sobre legados documentados.

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

```text
Concluído.
Validação compacta retornou status ok / count 100.
```

### 2. Preview Vercel

```text
Concluído.
Preview pronto:
https://conectajus-app-git-ui-v6-premium-conectajus.vercel.app
```

Smoke test online aprovado para:

- `/`;
- `/login`;
- `/cadastro`;
- `/triagem`;
- redirecionamento de rotas protegidas para `/login`.

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
| Supabase real validado | concluído |
| Preview Vercel validado | concluído |
| Teste manual dos 3 perfis | pendente |

## Próxima ação recomendada

Seguir a execução acelerada:

```text
docs/GO_LIVE_EXECUTION.md
```

Como o cadastro online exige confirmação por e-mail, a próxima etapa é confirmar usuários de teste no Supabase ou usar contas reais confirmadas.

Após criar/confirmar os usuários de teste, executar:

```text
supabase/TEST_PROFILE_CHECKS.sql
```

Se o resultado retornar `ok`, testar os três painéis no preview Vercel.
