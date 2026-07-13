# Auditoria de arquivos legados e duplicados

Data da auditoria: 2026-07-12

## Objetivo

Registrar arquivos e pastas que parecem ser sobras históricas do projeto ConectaJus, sem remover nada automaticamente.

Esta auditoria existe para evitar dois riscos:

- apagar algo que ainda tenha valor de referência;
- manter no repositório arquivos antigos que confundem manutenção, deploy ou futuras revisões.

## Projeto ativo

O projeto ativo continua sendo:

```text
C:\Users\BPEsc\Documents\ConectaJus\conectajus_final_base\conectajus-core
```

O código atual usa a arquitetura oficial:

- páginas pequenas em `src/app`;
- regras e telas principais organizadas em `src/features`;
- componentes compartilhados em `src/components`;
- integração Supabase em `src/lib` e repositórios/services por feature.

## Achados principais

### 1. Pasta duplicada aninhada

Existe uma segunda aplicação dentro da aplicação principal:

```text
conectajus-core/conectajus-core
```

Ela contém arquivos como:

- `package.json`
- `package-lock.json`
- `src/app/page.tsx`
- `src/lib/supabase.ts`
- `src/modules/ai/triage-engine.ts`
- `src/components/triage/TriageResult.tsx`

Essa pasta parece ser uma cópia antiga do projeto, anterior à organização atual por features.

Risco:

- confundir agentes ou desenvolvedores sobre qual aplicação é a correta;
- manter versões antigas de Supabase, triagem e layout;
- gerar dúvidas no deploy ou em auditorias futuras.

Status recomendado:

- não usar como fonte ativa;
- remover ou mover para um arquivo externo de backup somente após autorização explícita.

### 2. Backup antigo da página de clientes

Arquivo encontrado:

```text
src/app/clientes/page.backup.v5.tsx
```

A rota ativa de clientes é:

```text
src/app/clientes/page.tsx
```

O fluxo atual de CRM está organizado em:

```text
src/features/clients
```

Risco:

- manter lógica antiga fora da arquitetura oficial;
- gerar confusão entre a página ativa e o backup.

Status recomendado:

- preservar por enquanto;
- remover após validação visual final do CRM Premium.

### 3. Mock server local antigo

Arquivos encontrados:

```text
server.js
data/db.json
```

O `package.json` ativo não possui script chamando esse servidor. A busca por referências no código ativo não encontrou uso em `src`.

Risco:

- sugerir que existe um backend local paralelo;
- confundir o papel do Supabase como backend oficial.

Status recomendado:

- considerar legado;
- remover após autorização, se não houver dependência externa/manual.

### 4. Arquivos antigos removidos da estrutura ativa

O `git status` mostra remoção de arquivos antigos:

```text
src/components/triage/TriageResult.tsx
src/modules/ai/triage-engine.ts
```

Substituições ativas:

```text
src/features/triage/components/TriageResult.tsx
src/features/triage/services/triage-engine.ts
```

Status recomendado:

- manter a nova localização em `src/features/triage`;
- não restaurar os arquivos antigos.

### 5. Rotas futuras/desabilitadas

O projeto mantém referências planejadas para áreas como relatórios e configurações.

Status recomendado:

- manter como planejamento de produto;
- só ativar navegação quando as páginas estiverem implementadas.

## Itens que não são problema

Os itens abaixo são normais em ambiente local e não devem ser tratados como erro:

- `.next`
- `node_modules`
- `.git`
- `.env.local`

Eles devem permanecer fora de commits/deploys conforme `.gitignore`.

## Recomendação de limpeza segura

Antes de remover qualquer coisa, validar com o usuário.

Ordem sugerida de limpeza:

1. Remover `conectajus-core/conectajus-core`.
2. Remover `src/app/clientes/page.backup.v5.tsx`.
3. Remover `server.js` e `data/db.json`, caso confirmado que não são usados.
4. Rodar:

```bash
npm run lint
npm run build
```

5. Fazer commit da limpeza em uma etapa isolada.

## Situação atual

Nenhum arquivo legado foi apagado nesta auditoria.

O projeto ativo segue preservado e funcional.
