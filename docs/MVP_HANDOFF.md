# Handoff do MVP — ConectaJus

Data: 2026-07-13

Branch:

```text
ui-v6-premium
```

Repositório:

```text
https://github.com/kinhomms/conectajus-app.git
```

Status estimado:

```text
97%
```

## Estado atual

O ConectaJus está consolidado como Ecossistema Jurídico Inteligente, não apenas CRM.

O projeto ativo usa:

- Next.js;
- React;
- TypeScript;
- Supabase;
- PostgreSQL;
- Vercel.

Arquitetura preservada:

```text
src/features
src/app
src/components
```

Regra de negócio permanece em `src/features`.

Páginas em `src/app` permanecem pequenas e delegam para workspaces/features.

## O que está pronto

### Portal do Cidadão

- Dashboard do cidadão.
- Triagem.
- Publicação de demanda como oportunidade mascarada.
- Complemento de relato sem editar a demanda original.
- Envio de documentos complementares.
- Navegação com voltar/início/painel nas telas revisadas.
- Proteção visual para não expor áreas internas ao cidadão.

### Marketplace Jurídico

- Oportunidades mascaradas.
- Filtros.
- Diferenciação entre caso original e complemento.
- Desbloqueio por créditos.
- Dados privados liberados apenas após desbloqueio.
- Documentos privados vinculados à oportunidade.
- Integração Marketplace → CRM.

### CRM Jurídico

- Lista/painel premium.
- Criação e acompanhamento de cliente.
- Notas, casos e documentos.
- Vínculo com oportunidade desbloqueada.
- Criação de acompanhamento na Agenda.

### Financeiro

- Conta de créditos.
- Histórico.
- Pacotes.
- Solicitação de compra de créditos.
- Aprovação/rejeição administrativa.
- Cancelamento de solicitação.

### Agenda

- Eventos jurídicos.
- Filtros.
- Concluir, reabrir e cancelar.
- Métricas de atrasados e próximos eventos.

### Documentos

- Visão do cidadão.
- Visão jurídica.
- Upload de documentos.
- Status/filtros.
- Vínculo com Marketplace.

### Relatórios e Configurações

- `/relatorios` com indicadores executivos.
- `/configuracoes` com conta, perfil, privacidade, segurança e logout.

### Navegação e UX

- AppShell Premium.
- Sidebar por perfil.
- Topbar.
- UserMenu com links reais.
- SearchBar funcional.
- MobileNavigation.
- PageNavigation.

## Validação local

Últimas validações executadas com sucesso:

```bash
npm run validate
```

Esse comando executa lint e build de produção.

Build atual confirma 16 rotas:

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

Referência:

```text
docs/QA_VALIDATION_20260713.md
```

## O que falta para 100%

### 1. Supabase

Aplicar/confirmar migrations no projeto Supabase alvo.

Ordem:

```text
docs/SUPABASE_MIGRATION_ORDER.md
```

Guia:

```text
docs/APPLY_SUPABASE_MIGRATIONS.md
```

Checklist SQL pós-aplicação:

```text
docs/SUPABASE_POST_APPLY_VALIDATION.sql
```

Resultado esperado:

- tabelas essenciais: `ok`;
- colunas essenciais: `ok`;
- funções RPC: `ok`;
- policies RLS: `ok`;
- bucket `citizen-documents`: `ok`;
- RLS habilitado: `ok`.

### 2. Perfis reais

Testar com:

- cidadão;
- advogado;
- admin.

Modelo de registro:

```text
docs/MANUAL_TEST_REPORT_TEMPLATE.md
```

Fluxos mínimos:

- cidadão cria triagem;
- cidadão acompanha demanda publicada;
- cidadão envia documento complementar;
- advogado vê oportunidade mascarada;
- advogado desbloqueia oportunidade com créditos;
- advogado acessa dados privados apenas após desbloqueio;
- advogado envia oportunidade para CRM;
- admin aprova/rejeita solicitação de créditos.

### 3. Vercel

Configurar variáveis:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Guia:

```text
docs/VERCEL_DEPLOYMENT.md
```

Variáveis:

```text
docs/ENVIRONMENT_VARIABLES.md
```

### 4. Preview deploy

Gerar preview na Vercel a partir da branch:

```text
ui-v6-premium
```

Validar rotas principais e fluxos dos três perfis.

### 5. Legados

Itens identificados, não removidos:

```text
conectajus-core/conectajus-core
src/app/clientes/page.backup.v5.tsx
server.js
data/db.json
```

Eles exigem decisão explícita antes de remoção.

Referência:

```text
docs/LEGACY_AUDIT.md
```

## Ordem recomendada para fechar o MVP

1. Aplicar migrations no Supabase.
2. Executar `docs/SUPABASE_POST_APPLY_VALIDATION.sql`.
3. Configurar variáveis na Vercel.
4. Gerar preview deploy.
5. Testar cidadão, advogado e admin.
6. Decidir limpeza dos legados.
7. Se aprovado, promover preview para produção.

## Critério de conclusão

Considerar o MVP como 100% apenas quando:

- Supabase estiver validado;
- preview Vercel estiver validado;
- três perfis reais estiverem testados;
- nenhum dado pessoal aparecer no Marketplace antes do desbloqueio;
- documentos privados estiverem acessíveis apenas após autorização/desbloqueio;
- decisão sobre legados estiver registrada.
