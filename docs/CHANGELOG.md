# Changelog — ConectaJus

Todas as mudanças relevantes deste ciclo estão agrupadas por área funcional.

## 2026-07-13 — Consolidação pré-MVP

### Readiness final para preview

- Adicionada configuração `vercel.json` para explicitar framework Next.js, install, build e dev commands.
- Removida dependência de download externo de Google Fonts no build, deixando fontes com fallback local/sistema.
- Criado guia `docs/PREVIEW_READINESS.md`.
- Criado runbook `docs/SUPABASE_TEST_PROFILES.md`.
- Criado documento `docs/ADMIN_AUDIT_TRAIL.md`.
- Atualizado roteiro de teste manual com checks de auditoria administrativa.
- Status de readiness sincronizado para 98%.

### Adicionado

- Portal do cidadão com acompanhamento de casos publicados.
- Fluxo de triagem com publicação de oportunidade mascarada no Marketplace.
- Complemento de relato sem editar a demanda original.
- Complemento de documentos vinculado à oportunidade.
- Marketplace jurídico com oportunidades mascaradas, filtros e desbloqueio por créditos.
- Tabela e fluxo de detalhes privados da oportunidade.
- Integração Marketplace → CRM.
- Sistema de créditos para advogados.
- Solicitação, aprovação, rejeição e cancelamento de compra de créditos.
- Financeiro com saldo, histórico, pedidos e painel administrativo.
- Agenda com prazos, audiências, reuniões, tarefas e ações de status.
- Processos com filtros, métricas e alertas de dados pendentes.
- Documentos com visão por perfil.
- Relatórios executivos em `/relatorios`.
- Configurações de conta, privacidade e operação em `/configuracoes`.
- Preferências de conta e solicitação/cancelamento auditável de exclusão de conta.
- Navegação mobile.
- `PageNavigation` com voltar, início e painel.
- Busca global funcional no topo.
- Cadastro de advogado com OAB/UF obrigatórios.
- Fila administrativa de verificação de OAB.
- Fila administrativa de exclusão de conta.
- Trilha auditável para decisões administrativas de OAB, créditos e exclusão.
- Auditorias documentadas:
  - legados;
  - acesso por perfil;
  - Supabase/RLS;
  - decisões administrativas;
  - pré-commit.

### Alterado

- Páginas em `src/app` foram reduzidas para delegar regra de negócio a `src/features`.
- `src/lib/supabase.ts` passou a exigir variáveis reais de ambiente.
- Menu lateral passou a ser orientado por perfil.
- Topbar e UserMenu foram ajustados para links reais e textos limpos.
- Home passou a comunicar o ConectaJus como ecossistema jurídico inteligente, não apenas CRM.
- Fluxos administrativos de OAB, créditos e exclusão passaram a usar RPCs com auditoria.

### Segurança

- RLS para Marketplace, dados privados, documentos, CRM, créditos e agenda.
- Proteção de perfil na interface.
- Restrição de relatórios para advogado/admin.
- Hardening de `parent_opportunity_id` para impedir complemento em oportunidade de outro cidadão.
- Bloqueio de Marketplace/Financeiro para advogado com OAB pendente.
- Auditoria de decisão OAB com `verified_by` e `verified_at`.
- Auditoria de decisão de crédito com `decided_by` e `decided_at`.
- Auditoria de decisão de exclusão de conta com `decided_by` e `decided_at`.
- Remoção de updates administrativos diretos em fluxos sensíveis, centralizando decisões em RPCs protegidas.

### Validação

- `npm run validate` passando.
- Build atual com 16 rotas.
- GitHub Actions configurado para validar `main` e `ui-v6-premium`.

## Pendências conhecidas

- Aplicar/confirmar migrations no Supabase alvo.
- Executar `docs/SUPABASE_POST_APPLY_VALIDATION.sql`.
- Gerar e validar preview Vercel.
- Testar fluxos com perfis reais: cidadão, advogado e admin.
- Validar trilha administrativa em OAB, créditos e exclusão.
- Decidir limpeza de legados:
  - `conectajus-core/conectajus-core`;
  - `src/app/clientes/page.backup.v5.tsx`;
  - `server.js`;
  - `data/db.json`.
