# Execução acelerada do go-live — ConectaJus

Data: 2026-07-13

Branch:

```text
ui-v6-premium
```

Repositório:

```text
https://github.com/kinhomms/conectajus-app.git
```

## Objetivo

Executar a menor sequência segura para sair do código local validado e chegar ao link de preview testável.

Este ambiente local não possui CLIs `vercel`, `supabase` ou `gh` instaladas. Portanto, as etapas externas devem ser feitas pelo Supabase Dashboard, Vercel Dashboard ou por outro ambiente autenticado.

## 0. Checagem local final

Na raiz do projeto:

```bash
npm run go-live:check
```

Esse comando:

1. regenera `supabase/APPLY_ALL_MIGRATIONS.sql`;
2. roda `npm run preflight:preview`;
3. roda lint;
4. roda build.

Resultado esperado:

```text
Preflight de preview aprovado.
Migrations conferidas: 26
Compiled successfully
```

## 1. Supabase — aplicar schema

No Supabase Dashboard do projeto correto:

1. Abrir SQL Editor.
2. Executar:

```text
supabase/APPLY_ALL_MIGRATIONS.sql
```

3. Confirmar que não houve erro.
4. Executar:

```text
docs/SUPABASE_POST_APPLY_VALIDATION.sql
```

Resultado esperado:

- tabelas essenciais: `ok`;
- colunas essenciais: `ok`;
- funções RPC: `ok`;
- policies RLS: `ok`;
- bucket `citizen-documents`: `ok`;
- RLS habilitado: `ok`;
- policies administrativas diretas proibidas: ausentes/ok.

## 2. Supabase — preparar perfis reais de teste

Criar pela rota `/cadastro`:

- cidadão;
- advogado;
- admin.

Depois, no SQL Editor, promover o admin:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'admin.teste@example.com'
on conflict (user_id) do nothing;
```

Trocar o e-mail pelo e-mail real usado no teste.

Depois executar:

```text
supabase/TEST_PROFILE_CHECKS.sql
```

Antes de executar, trocar os e-mails de exemplo pelos e-mails reais.

## 3. Vercel — configurar preview

No painel da Vercel:

- Repositório: `kinhomms/conectajus-app`;
- Branch: `ui-v6-premium`;
- Root directory: raiz onde está o `package.json`;
- Install command: `npm install`;
- Build command: `npm run validate`;
- Framework: Next.js.

Variáveis obrigatórias:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Configurar pelo menos no ambiente `Preview`.

## 4. Teste mínimo do link

### Visitante

- `/`
- `/login`
- `/cadastro`

### Cidadão

- criar/login;
- abrir `/dashboard`;
- fazer triagem em `/triagem`;
- publicar demanda;
- enviar documento em `/documentos`;
- abrir `/configuracoes`;
- solicitar/cancelar exclusão;
- confirmar botões de voltar/início.

### Advogado

- criar com OAB/UF;
- confirmar bloqueio enquanto OAB está pendente;
- após admin verificar OAB, abrir `/marketplace`;
- solicitar crédito em `/financeiro`;
- desbloquear oportunidade;
- confirmar dados privados só depois do desbloqueio;
- enviar oportunidade ao CRM.

### Admin

- abrir `/financeiro`;
- verificar/rejeitar OAB;
- aprovar/rejeitar crédito;
- aprovar/rejeitar exclusão de conta;
- confirmar `verified_by`, `verified_at`, `decided_by` e `decided_at`.

## 5. Critério de aprovado

O preview pode ser considerado aprovado quando:

- `npm run go-live:check` passou;
- SQL de validação pós-migrations retornou `ok`;
- perfis de teste foram conferidos;
- Vercel gerou preview sem erro;
- três perfis foram testados;
- Marketplace não expôs dados pessoais antes do desbloqueio;
- documento privado só abriu depois de autorização/desbloqueio;
- auditoria administrativa foi preenchida.

## 6. Se algo falhar

- Falha no Supabase: copiar a mensagem exata do SQL Editor e conferir a migration indicada.
- Falha na Vercel: abrir o log de build e verificar se faltam variáveis ou se `npm run validate` falhou.
- Falha de perfil admin: confirmar `public.admin_users`.
- Falha de OAB: confirmar `public.lawyer_profiles` e decidir pelo painel admin, não por update direto.
- Falha de documentos: confirmar bucket privado `citizen-documents` e policies de Storage.
