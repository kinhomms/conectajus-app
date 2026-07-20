# Evolução e status de conclusão — ConectaJus

Data: 2026-07-20

Branch:

```text
ui-v6-premium
```

## Percentual executivo

Status geral estimado após validação local de go-live e antes da rodada final com perfis reais no ambiente alvo:

```text
90%
```

Leitura correta desse percentual:

- a aplicação local está validada;
- o código principal do MVP está praticamente fechado;
- a aplicação local está validada com `npm run go-live:check`;
- o código principal do MVP está próximo do fechamento;
- o bundle Supabase consolidado contém 34 migrations;
- o build atual gera 20 rotas;
- o que falta para 100% é aplicar/confirmar o Supabase alvo, validar o preview online atual e concluir testes logados de cidadão, advogado e administrador.

## Evolução por área

| Área | Percentual | Situação |
| --- | ---: | --- |
| Código local Next.js/React/TypeScript | 99% | Validado com build, lint e preflight. |
| Arquitetura por features | 99% | Preservada em `src/features`, `src/app` e `src/components`. |
| Portal do Cidadão | 100% | Testado em preview com conta real: dashboard, triagem, documentos, configurações, navegação e bloqueios. |
| Portal do Advogado | 98% | Marketplace, Financeiro, CRM e bloqueio por OAB implementados. |
| Admin operacional | 97% | Filas de OAB, créditos e exclusão com auditoria. |
| Marketplace jurídico | 98% | Leads mascarados, desbloqueio por créditos e envio para CRM. |
| Supabase schema/migrations | 92% | Bundle consolidado com 34 migrations; depende de confirmação/aplicação no Supabase alvo. |
| RLS e proteção de dados | 90% | Policies e bloqueios estruturais implementados; falta smoke test real dos perfis. |
| Vercel preview | 80% | Código pronto para preview; depende de variáveis e validação do link atual. |
| Testes reais dos 3 perfis | 0/3 nesta rodada | Precisam ser refeitos com as contas finais/confirmadas. |

## Já concluído e validado localmente

- `npm run go-live:check` aprovado.
- `npm run validate` aprovado.
- `npm run preflight:preview` aprovado.
- Bundle Supabase gerado com 34 migrations.
- Build Next.js aprovado.
- 20 rotas geradas.
- GitHub branch `ui-v6-premium` sincronizada.
- Vercel configurada para usar `npm run validate`.
- `.env.example` e `.gitignore` protegidos por preflight.
- Documentação de go-live consolidada.
- Último preview Vercel conhecido/documentado:

```text
https://conectajus-app-git-ui-v6-premium-conectajus.vercel.app
```

- Smoke test online aprovado para rotas públicas e redirecionamento de rotas protegidas.
- Teste logado do cidadão aprovado em preview.
- Relatório registrado em `docs/MANUAL_TEST_REPORT_20260713_PREVIEW.md`.

## Rotas confirmadas no build

- `/`
- `/_not-found`
- `/advogados/[userId]`
- `/agenda`
- `/cadastro`
- `/clientes`
- `/configuracoes`
- `/dashboard`
- `/documentos`
- `/financeiro`
- `/login`
- `/marketplace`
- `/privacidade`
- `/processos`
- `/redefinir-senha`
- `/regras-marketplace`
- `/relatorios`
- `/termos`
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
