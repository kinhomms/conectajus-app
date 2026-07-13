# Auditoria pré-commit — ConectaJus

Data: 2026-07-13

## Objetivo

Organizar o estado atual do repositório antes de qualquer commit, limpeza destrutiva ou deploy.

Esta auditoria não remove arquivos e não altera histórico Git. Ela apenas separa:

- mudanças funcionais;
- documentação;
- migrations;
- arquivos legados que precisam de decisão explícita.

## Mudanças funcionais principais

### Arquitetura por features

O projeto foi consolidado na arquitetura oficial:

- páginas pequenas em `src/app`;
- regra de negócio, hooks, componentes e services em `src/features`;
- componentes compartilhados em `src/components`.

### Portal do cidadão

Inclui:

- dashboard do cidadão;
- triagem;
- complementos de relato;
- documentos complementares;
- mensagens explicando por que a demanda publicada não é editável diretamente;
- proteção para não expor áreas internas ao cidadão.

### Marketplace jurídico

Inclui:

- oportunidades mascaradas;
- filtros por caso original/complemento;
- desbloqueio por créditos;
- dados privados liberados apenas após desbloqueio;
- integração com CRM;
- documentos privados vinculados à oportunidade.

### CRM jurídico

Inclui:

- workspace premium;
- lista e painel de cliente;
- criação de cliente;
- notas, casos e documentos;
- vínculo de oportunidade desbloqueada com CRM;
- criação de acompanhamento na Agenda.

### Financeiro

Inclui:

- conta de créditos;
- histórico;
- pacotes;
- solicitações;
- aprovação/rejeição administrativa;
- indicadores de saúde do saldo.

### Agenda

Inclui:

- prazos, audiências, reuniões, tarefas e outros eventos;
- filtros por tipo/status;
- ações de concluir, reabrir e cancelar;
- métricas de atrasados e próximos eventos.

### Processos

Inclui:

- listagem;
- filtros por status;
- alerta de dados pendentes;
- indicadores operacionais.

### Documentos

Inclui:

- visão do cidadão;
- visão do operador jurídico;
- filtros por status;
- upload de documentos do cidadão;
- vínculo com oportunidade do Marketplace.

### Relatórios

Nova rota:

```text
/relatorios
```

Inclui indicadores de:

- Marketplace;
- conversão para CRM;
- créditos;
- processos;
- documentos;
- agenda;
- áreas jurídicas em destaque.

### Configurações

Nova rota:

```text
/configuracoes
```

Inclui:

- conta;
- perfil;
- privacidade;
- segurança;
- atalhos por perfil;
- logout.

### Navegação e UX

Inclui:

- `PageNavigation` com voltar/início/painel;
- busca global funcional no Topbar;
- menu lateral por perfil;
- navegação mobile;
- botões do `UserMenu` com destino real.

## Migrations Supabase adicionadas

Diretório:

```text
supabase/migrations
```

Inclui migrations para:

- Marketplace;
- créditos;
- compra/aprovação de créditos;
- dados privados de oportunidades;
- RLS de Marketplace/Financeiro;
- Agenda;
- hardening de CRM;
- documentos do cidadão e storage;
- vínculo de documentos com oportunidades;
- tracking de oportunidades próprias do cidadão;
- vínculo Marketplace → CRM;
- documentos complementares;
- parent/child de triagens complementares;
- hardening de ownership do `parent_opportunity_id`.

Migration mais recente:

```text
20260713100000_harden_complement_parent_ownership.sql
```

## Documentação adicionada/atualizada

- `docs/CHECKLIST_DEPLOY.md`
- `docs/APPLY_SUPABASE_MIGRATIONS.md`
- `docs/LEGACY_AUDIT.md`
- `docs/PROFILE_ACCESS_AUDIT.md`
- `docs/SUPABASE_RLS_AUDIT.md`
- `docs/PRE_COMMIT_AUDIT.md`

## Arquivos legados identificados

Não foram removidos.

Itens pendentes de decisão explícita:

```text
conectajus-core/conectajus-core
src/app/clientes/page.backup.v5.tsx
server.js
data/db.json
```

Resumo:

- `conectajus-core/conectajus-core`: cópia antiga aninhada do projeto.
- `src/app/clientes/page.backup.v5.tsx`: backup antigo da rota de clientes.
- `server.js` e `data/db.json`: mock/backend local antigo sem referência nos scripts atuais.

## Arquivos antigos substituídos

Removidos da estrutura ativa:

```text
src/components/triage/TriageResult.tsx
src/modules/ai/triage-engine.ts
```

Substituições ativas:

```text
src/features/triage/components/TriageResult.tsx
src/features/triage/services/triage-engine.ts
```

## Validação recorrente

Última validação executada com sucesso:

```bash
npm run lint
npm run build
```

Build atual confirma 16 rotas.

## Checagem de segredos

Verificações realizadas antes de preparar commit:

- `.env*` está listado no `.gitignore`.
- `git status --short -- .env .env.local .env.production .env.development` não retornou arquivos rastreados/pendentes.
- Busca por padrões óbvios de segredo fora de `.env*` não encontrou chave Supabase service role, `DATABASE_URL`, `sk-` real ou variáveis públicas atribuídas com valor sensível.

Observação:

- A busca retornou apenas URLs normais de registry em `package-lock.json` e na cópia legada aninhada, sem indício de segredo.

## Recomendação antes do commit

1. Aplicar/confirmar migrations no Supabase alvo.
2. Testar perfis reais:
   - cidadão;
   - advogado;
   - admin.
3. Decidir explicitamente se os legados serão removidos.
4. Se removidos, fazer limpeza em commit separado ou etapa claramente descrita.
5. Depois, preparar commit principal com as features atuais.

## Status estimado

Andamento estimado: 93%.

O projeto está próximo de preview/deploy, mas ainda depende de validação Supabase e decisão sobre limpeza de legados.
