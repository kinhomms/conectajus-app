# Roadmap — ConectaJus

O ConectaJus é um Ecossistema Jurídico Inteligente, não apenas um CRM.

## Fase atual — Pré-MVP funcional

Status estimado: 98%.

Objetivo desta fase:

- consolidar portal do cidadão;
- consolidar operação jurídica;
- validar Marketplace com créditos;
- proteger dados pessoais;
- consolidar auditoria administrativa;
- preparar preview/deploy.

## Prioridade 1 — Validação Supabase e perfis reais

- Aplicar migrations pendentes no Supabase alvo.
- Usar `supabase/APPLY_ALL_MIGRATIONS.sql` para reduzir erro manual de ordem, quando aplicar pelo SQL Editor.
- Confirmar bucket `citizen-documents`.
- Confirmar policies de Storage.
- Confirmar tabela `admin_users`.
- Executar `docs/SUPABASE_POST_APPLY_VALIDATION.sql`.
- Executar `supabase/TEST_PROFILE_CHECKS.sql` após criar os usuários de teste.
- Confirmar trilha auditável de OAB, créditos e exclusão.
- Testar usuário cidadão.
- Testar usuário advogado.
- Testar usuário admin.
- Testar bloqueio de rotas por URL direta.
- Testar desbloqueio de oportunidade e abertura de documento privado.
- Testar decisões administrativas com `verified_by`, `decided_by`, `verified_at` e `decided_at`.

## Prioridade 2 — Preview deploy

- Conectar Vercel ao repositório `kinhomms/conectajus-app`.
- Usar branch `ui-v6-premium`.
- Configurar variáveis:
  - `NEXT_PUBLIC_SUPABASE_URL`;
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Confirmar que a Vercel usa `npm run validate` como build command.
- Rodar preview deploy.
- Validar rotas principais.

## Prioridade 3 — Limpeza controlada de legados

Remover apenas com autorização explícita:

- pasta aninhada `conectajus-core/conectajus-core`;
- backup `src/app/clientes/page.backup.v5.tsx`;
- mock antigo `server.js`;
- base mock `data/db.json`.

Recomendação:

- fazer limpeza em commit separado;
- rodar `npm run validate`;
- conferir diff antes do push.

## Prioridade 4 — Pós-MVP

### IA Jurídica

- Evoluir triagem para integração com modelo real.
- Classificar riscos, documentos necessários e próximos passos.
- Criar sumário jurídico por área.

### Marketplace

- Ranking de oportunidades por urgência/complexidade.
- Reserva temporária de lead.
- Histórico de disputa/desbloqueio.
- Notificações para advogados.

### Financeiro

- Integração com gateway de pagamento.
- Nota/recibo de compra de créditos.
- Painel financeiro administrativo.

### CRM

- Timeline completa por cliente.
- Status customizáveis.
- Funil comercial/jurídico.
- Exportação de dossiê.

### Portal do cidadão

- Notificações de andamento.
- Linha do tempo do caso.
- Mensagens controladas com advogado.
- Consentimentos e aceite de termos.

### Administração

- Gestão de usuários.
- Gestão de advogados parceiros.
- Auditoria de desbloqueios.
- Relatórios administrativos de decisões sensíveis.
- Métricas globais de conversão.

## Critério de pronto para MVP

- Build aprovado.
- Lint aprovado.
- Supabase validado.
- Perfis reais testados.
- Preview deploy validado.
- Auditoria administrativa validada.
- Legados decididos ou documentados.
