# Coding Standards — ConectaJus

Este documento define padrões mínimos para manter o projeto consistente.

## Arquitetura

O projeto usa arquitetura baseada em features.

Regras:

- páginas em `src/app` devem ser pequenas;
- regras de negócio ficam em `src/features`;
- componentes compartilhados ficam em `src/components`;
- integrações com Supabase devem passar por repositories/services da feature;
- evitar lógica complexa diretamente em páginas.

Exemplo esperado:

```text
src/app/marketplace/page.tsx
src/features/marketplace/components/MarketplaceWorkspace.tsx
src/features/marketplace/hooks/useMarketplaceWorkspace.ts
src/features/marketplace/services/marketplace.service.ts
src/features/marketplace/repositories/marketplace.repository.ts
src/features/marketplace/types/marketplace.types.ts
```

## TypeScript

- Preferir tipos explícitos para entidades de domínio.
- Evitar `any`.
- Centralizar tipos da feature em `types`.
- Não duplicar tipos se já existirem em outra camada da mesma feature.

## React

- Componentes de tela ficam em `components`.
- Estado e carregamento ficam em hooks.
- Chamadas externas ficam em services/repositories.
- Componentes devem receber props claras e pequenas.
- Evitar botões sem ação; se parecer clicável, deve navegar ou executar algo.

## Supabase

- Nunca expor dados pessoais em `marketplace_opportunities`.
- Dados privados devem ficar em tabelas protegidas por RLS.
- Toda migration deve ser incremental e idempotente quando possível:
  - `create table if not exists`;
  - `add column if not exists`;
  - `drop policy if exists` antes de recriar policy.
- Toda alteração de policy deve terminar com:

```sql
notify pgrst, 'reload schema';
```

## Segurança e perfis

Perfis atuais:

- `cliente`;
- `advogado`;
- `admin`.

Regras:

- cidadão não deve acessar áreas internas de operação jurídica;
- advogado/admin podem acessar operação conforme permissões;
- Marketplace e Financeiro dependem de ator autorizado;
- dados pessoais do cidadão só aparecem após desbloqueio controlado.

## UI/UX

- Preservar identidade premium:
  - fundo escuro;
  - dourado/amber como destaque;
  - cards arredondados;
  - linguagem clara e segura.
- Toda página privada deve ter navegação de retorno quando fizer sentido.
- Textos devem explicar o fluxo para o usuário, especialmente no Portal do Cidadão.

## Documentação

Atualizar documentos quando houver mudança relevante:

- `docs/CHANGELOG.md`;
- `docs/CHECKLIST_DEPLOY.md`;
- `docs/PRE_COMMIT_AUDIT.md`;
- migrations em `supabase/migrations`.

## Validação

Antes de considerar uma etapa concluída:

```bash
npm run lint
npm run build
```

Se houver alteração de banco:

- criar migration;
- documentar no checklist;
- testar no Supabase alvo antes do deploy.
