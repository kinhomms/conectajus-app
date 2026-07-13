# Evolução e status de conclusão — ConectaJus

Data: 2026-07-13

Branch:

```text
ui-v6-premium
```

## Percentual executivo

Status geral estimado:

```text
98,5%
```

Leitura correta desse percentual:

- a aplicação local está validada e pronta para preview;
- o código principal do MVP está praticamente fechado;
- os artefatos de Supabase/Vercel estão preparados;
- o que falta para 100% é aplicar e validar em ambiente externo autenticado.

## Evolução por área

| Área | Percentual | Situação |
| --- | ---: | --- |
| Código local Next.js/React/TypeScript | 99% | Validado com build, lint e preflight. |
| Arquitetura por features | 99% | Preservada em `src/features`, `src/app` e `src/components`. |
| Portal do Cidadão | 98% | Triagem, documentos, dashboard, configurações e navegação revisados. |
| Portal do Advogado | 98% | Marketplace, Financeiro, CRM e bloqueio por OAB implementados. |
| Admin operacional | 97% | Filas de OAB, créditos e exclusão com auditoria. |
| Marketplace jurídico | 98% | Leads mascarados, desbloqueio por créditos e envio para CRM. |
| Supabase schema/migrations | 99% local / pendente externo | Bundle pronto; falta aplicar/confirmar no Supabase real. |
| RLS e proteção de dados | 98% planejado/implementado | Falta validação no banco real. |
| Vercel preview | 95% preparado / pendente externo | `vercel.json` pronto; falta gerar link no painel. |
| Testes reais dos 3 perfis | pendente | Exige Supabase/Vercel reais. |

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

### 1. Supabase real

Executar no Supabase Dashboard:

```text
supabase/APPLY_ALL_MIGRATIONS.sql
```

Depois executar:

```text
docs/SUPABASE_POST_APPLY_VALIDATION.sql
```

### 2. Perfis de teste reais

Criar:

- cidadão;
- advogado;
- admin.

Promover o admin em `public.admin_users` e executar:

```text
supabase/TEST_PROFILE_CHECKS.sql
```

### 3. Vercel preview

Configurar:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Gerar preview pela branch:

```text
ui-v6-premium
```

### 4. Smoke test final

Testar:

- visitante;
- cidadão;
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

1. aplicar Supabase;
2. validar Supabase;
3. gerar preview Vercel;
4. testar três perfis;
5. corrigir somente falhas encontradas no teste real;
6. depois decidir limpeza de legados;
7. promover para produção se aprovado.

## Comando local obrigatório antes de qualquer nova tentativa de go-live

```bash
npm run go-live:check
```

Esse comando precisa passar antes de qualquer nova aplicação Supabase/Vercel.
