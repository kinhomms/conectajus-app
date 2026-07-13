# Plano de commit — ConectaJus

Data: 2026-07-13

Branch atual:

```text
ui-v6-premium
```

## Objetivo

Organizar as mudanças antes de versionar, evitando misturar:

- implementação funcional;
- migrations/documentação;
- limpeza destrutiva de legados.

## Estado atual

Validações recentes:

```bash
npm run lint
npm run build
```

Ambas passaram.

Build atual confirma 16 rotas:

```text
/
/agenda
/cadastro
/clientes
/configuracoes
/dashboard
/documentos
/financeiro
/login
/marketplace
/processos
/relatorios
/triagem
```

## Commit recomendado 1 — Plataforma funcional pré-MVP

Mensagem sugerida:

```text
feat: consolidate ConectaJus ecosystem MVP
```

Conteúdo:

- arquitetura por features;
- AppShell, Topbar, Sidebar, MobileNavigation;
- Portal do cidadão;
- triagem e complementos;
- Marketplace jurídico;
- CRM jurídico;
- Financeiro/créditos;
- Agenda;
- Processos;
- Documentos;
- Relatórios;
- Configurações;
- busca global funcional;
- proteção por perfil na interface.

Arquivos principais:

```text
src/app
src/components
src/features
src/lib/routes.ts
src/lib/supabase.ts
```

## Commit recomendado 2 — Supabase e segurança

Mensagem sugerida:

```text
feat: add Supabase marketplace and RLS migrations
```

Conteúdo:

- migrations em `supabase/migrations`;
- Marketplace;
- dados privados;
- créditos;
- documentos privados;
- Storage;
- CRM hardening;
- perfil/admin;
- hardening de triagem complementar.

Arquivo/pasta:

```text
supabase/migrations
```

## Commit recomendado 3 — Documentação de entrega

Mensagem sugerida:

```text
docs: document deploy, roadmap and access audits
```

Conteúdo:

```text
docs/CHANGELOG.md
docs/CHECKLIST_DEPLOY.md
docs/CODING_STANDARDS.md
docs/ROADMAP.md
docs/APPLY_SUPABASE_MIGRATIONS.md
docs/LEGACY_AUDIT.md
docs/PRE_COMMIT_AUDIT.md
docs/PROFILE_ACCESS_AUDIT.md
docs/SUPABASE_RLS_AUDIT.md
```

## Commit opcional 4 — Limpeza de legados

Executar somente com autorização explícita.

Mensagem sugerida:

```text
chore: remove legacy duplicate files
```

Itens candidatos:

```text
conectajus-core/conectajus-core
src/app/clientes/page.backup.v5.tsx
server.js
data/db.json
```

Observação:

- Esta etapa é destrutiva.
- Deve ser feita separadamente.
- Depois da remoção, rodar `npm run lint` e `npm run build`.

## Antes de qualquer push

1. Confirmar migrations aplicadas no Supabase alvo.
2. Testar perfis reais:
   - cidadão;
   - advogado;
   - admin.
3. Validar preview deploy.
4. Conferir se `.env.local` não entrou no commit.

## Status estimado

Andamento estimado: 94%.
