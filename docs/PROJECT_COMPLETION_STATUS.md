# Evolução e status de conclusão — ConectaJus

Data: 2026-07-13

Branch:

```text
ui-v6-premium
```

## Percentual executivo

Status geral estimado após aplicação/validação do Supabase real, preview Vercel pronto e perfil cidadão testado:

```text
99,7%
```

Leitura correta desse percentual:

- a aplicação local está validada;
- o código principal do MVP está praticamente fechado;
- o Supabase real já foi aplicado e validado;
- o preview Vercel da branch `ui-v6-premium` está pronto;
- o smoke test de rotas online passou;
- o perfil cidadão foi testado com conta real confirmada;
- o que falta para 100% é concluir o teste logado de advogado e administrador.

## Evolução por área

| Área | Percentual | Situação |
| --- | ---: | --- |
| Código local Next.js/React/TypeScript | 99% | Validado com build, lint e preflight. |
| Arquitetura por features | 99% | Preservada em `src/features`, `src/app` e `src/components`. |
| Portal do Cidadão | 100% | Testado em preview com conta real: dashboard, triagem, documentos, configurações, navegação e bloqueios. |
| Portal do Advogado | 98% | Marketplace, Financeiro, CRM e bloqueio por OAB implementados. |
| Admin operacional | 97% | Filas de OAB, créditos e exclusão com auditoria. |
| Marketplace jurídico | 98% | Leads mascarados, desbloqueio por créditos e envio para CRM. |
| Supabase schema/migrations | 100% | Bundle aplicado no Supabase real e validação compacta retornou `ok = 100`. |
| RLS e proteção de dados | 99% | Validação estrutural real aprovada; falta smoke test dos perfis. |
| Vercel preview | 100% | Preview da branch `ui-v6-premium` pronto e smoke test de rotas aprovado. |
| Testes reais dos 3 perfis | 1/3 | Cidadão validado; faltam advogado e administrador com contas reais/confirmadas. |

## Já concluído e validado localmente

- `npm run go-live:check` aprovado.
- `npm run validate` aprovado.
- `npm run preflight:preview` aprovado.
- Bundle Supabase gerado com 26 migrations.
- Build Next.js aprovado.
- 16 rotas geradas.
- GitHub branch `ui-v6-premium` sincronizada.
- Vercel configurada para usar `npm run validate`.
- `.env.example` e `.gitignore` protegidos por preflight.
- Documentação de go-live consolidada.
- Supabase real aplicado.
- Validação compacta do Supabase real retornou:

```text
status = ok
count = 100
```
- Preview Vercel pronto:

```text
https://conectajus-app-git-ui-v6-premium-conectajus.vercel.app
```

- Smoke test online aprovado para rotas públicas e redirecionamento de rotas protegidas.
- Teste logado do cidadão aprovado em preview.
- Relatório registrado em `docs/MANUAL_TEST_REPORT_20260713_PREVIEW.md`.

## Rotas confirmadas no build

- `/`
- `/_not-found`
- `/agenda`
- `/cadastro`
- `/clientes`
- `/configuracoes`
- `/dashboard`
- `/documentos`
- `/financeiro`
- `/login`
- `/marketplace`
- `/processos`
- `/relatorios`
- `/triagem`

## O que falta para 100%

### 1. Perfis de teste reais logados

Preparar:

- advogado;
- admin.

O cidadão já foi testado com conta real confirmada. Para os perfis restantes, o cadastro online pode exigir confirmação por e-mail.

Para concluir o teste automatizado dos painéis, é necessário:

- confirmar manualmente os usuários de teste no Supabase; ou
- usar contas reais já confirmadas; ou
- criar usuários pelo painel Auth do Supabase.

Depois, promover o admin em `public.admin_users` e executar:

```text
supabase/TEST_PROFILE_CHECKS.sql
```

### 2. Smoke test final logado

Testar:

- advogado;
- admin.

Critérios críticos:

- cidadão não acessa áreas internas indevidas;
- advogado com OAB pendente não acessa Marketplace/Financeiro;
- dados pessoais não aparecem antes do desbloqueio;
- documentos privados só abrem após autorização/desbloqueio;
- decisões de OAB, créditos e exclusão registram auditoria.

## Postura de conclusão

A próxima etapa não deve ser criar novas features.

A postura correta agora é:

1. fazer login na Vercel;
2. configurar variáveis de ambiente;
3. gerar preview Vercel;
4. confirmar usuários de teste no Supabase ou usar contas reais confirmadas;
5. testar três perfis;
6. corrigir somente falhas encontradas no teste real;
7. depois decidir limpeza de legados;
8. promover para produção se aprovado.

## Comando local obrigatório antes de qualquer nova tentativa de go-live

```bash
npm run go-live:check
```

Esse comando precisa passar antes de qualquer nova aplicação Supabase/Vercel.
