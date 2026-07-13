# Changelog — ConectaJus

Todas as mudanças relevantes deste ciclo estão agrupadas por área funcional.

## 2026-07-13 — Consolidação pré-MVP

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
- Navegação mobile.
- `PageNavigation` com voltar, início e painel.
- Busca global funcional no topo.
- Auditorias documentadas:
  - legados;
  - acesso por perfil;
  - Supabase/RLS;
  - pré-commit.

### Alterado

- Páginas em `src/app` foram reduzidas para delegar regra de negócio a `src/features`.
- `src/lib/supabase.ts` passou a exigir variáveis reais de ambiente.
- Menu lateral passou a ser orientado por perfil.
- Topbar e UserMenu foram ajustados para links reais e textos limpos.
- Home passou a comunicar o ConectaJus como ecossistema jurídico inteligente, não apenas CRM.

### Segurança

- RLS para Marketplace, dados privados, documentos, CRM, créditos e agenda.
- Proteção de perfil na interface.
- Restrição de relatórios para advogado/admin.
- Hardening de `parent_opportunity_id` para impedir complemento em oportunidade de outro cidadão.

### Validação

- `npm run lint` passando.
- `npm run build` passando.
- Build atual com 16 rotas.

## Pendências conhecidas

- Aplicar/confirmar migrations no Supabase alvo.
- Testar fluxos com perfis reais: cidadão, advogado e admin.
- Decidir limpeza de legados:
  - `conectajus-core/conectajus-core`;
  - `src/app/clientes/page.backup.v5.tsx`;
  - `server.js`;
  - `data/db.json`.
