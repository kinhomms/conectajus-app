# ConectaJus

Ecossistema jurídico inteligente construído com Next.js, React, TypeScript e Supabase.

O ConectaJus reúne:

- Portal do Cidadão;
- Portal do Advogado;
- CRM jurídico;
- Marketplace de oportunidades jurídicas;
- sistema de créditos;
- triagem inteligente;
- documentos;
- agenda;
- processos;
- relatórios executivos.

## Projeto correto

Este repositório deve ser trabalhado nesta pasta:

```text
C:\Users\BPEsc\Documents\ConectaJus\conectajus_final_base\conectajus-core
```

Branch principal deste ciclo:

```text
ui-v6-premium
```

## Stack

- Next.js
- React
- TypeScript
- Supabase
- PostgreSQL
- Vercel

## Arquitetura

A arquitetura oficial é baseada em features:

```text
src/features
src/app
src/components
```

Regra de negócio deve permanecer em `src/features`.

As páginas em `src/app` devem continuar pequenas, apenas compondo workspaces e componentes das features.

## Como rodar localmente

Instalar dependências:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

## Variáveis obrigatórias

Criar `.env.local` localmente com:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Você pode usar `.env.example` como base e copiar para `.env.local`.

Não commitar `.env.local`.

A aplicação ativa exige essas variáveis e falha explicitamente se elas não existirem.

Guia completo:

```text
docs/ENVIRONMENT_VARIABLES.md
```

## Validação local

Antes de commit/deploy:

```bash
npm run validate
```

Esse comando executa `npm run lint` e `npm run build`.

O mesmo comando é executado no GitHub Actions em `.github/workflows/validate.yml`.

Última rodada documentada:

```text
docs/QA_VALIDATION_20260713.md
```

## Supabase

As migrations estão em:

```text
supabase/migrations
```

Ordem de aplicação:

```text
docs/SUPABASE_MIGRATION_ORDER.md
```

Checklist SQL pós-aplicação:

```text
docs/SUPABASE_POST_APPLY_VALIDATION.sql
```

Perfis de teste:

```text
docs/SUPABASE_TEST_PROFILES.md
```

Guia operacional:

```text
docs/APPLY_SUPABASE_MIGRATIONS.md
```

## Deploy

Guia de deploy Vercel:

```text
docs/VERCEL_DEPLOYMENT.md
```

Readiness para preview:

```text
docs/PREVIEW_READINESS.md
```

Checklist de produção:

```text
docs/CHECKLIST_DEPLOY.md
```

## Documentação útil

- `docs/ADMIN_AUDIT_TRAIL.md`
- `docs/MVP_HANDOFF.md`
- `docs/CHANGELOG.md`
- `docs/ROADMAP.md`
- `docs/CODING_STANDARDS.md`
- `docs/PRE_COMMIT_AUDIT.md`
- `docs/PROFILE_ACCESS_AUDIT.md`
- `docs/SUPABASE_RLS_AUDIT.md`
- `docs/LEGACY_AUDIT.md`

## Atenção sobre arquivos legados

Foram identificados itens legados que não devem ser usados como entrada principal do projeto:

```text
conectajus-core/conectajus-core
server.js
data/db.json
src/app/clientes/page.backup.v5.tsx
```

Eles não foram removidos por segurança e exigem decisão explícita antes de qualquer limpeza.

O app ativo é o Next.js da raiz deste diretório, executado com `npm run dev`, `npm run lint` e `npm run build`.
