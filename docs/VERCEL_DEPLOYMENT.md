# Deploy Vercel — ConectaJus

Este guia prepara o deploy da branch `ui-v6-premium` na Vercel sem alterar a arquitetura do projeto.

## Projeto

Repositório:

```text
https://github.com/kinhomms/conectajus-app.git
```

Branch:

```text
ui-v6-premium
```

Diretório raiz esperado na Vercel:

```text
.
```

O `package.json` ativo deve estar na raiz do projeto `conectajus-core`.

## Variáveis obrigatórias

Configurar no painel da Vercel em Project Settings > Environment Variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Localmente, use `.env.example` como modelo e copie para `.env.local`.

Essas variáveis devem existir nos ambientes necessários:

- Preview;
- Production;
- Development, se a Vercel for usada para builds de desenvolvimento.

Importante:

- Não usar `SUPABASE_SERVICE_ROLE_KEY` no frontend.
- Não commitar `.env.local`.
- A aplicação ativa falha o build/runtime de forma explícita se `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` estiverem ausentes.

## Comandos esperados

Install command:

```bash
npm install
```

Build command:

```bash
npm run build
```

Output:

```text
Next.js default
```

## Pré-deploy local

Antes de publicar:

```bash
npm run validate
```

Última validação local registrada:

```text
docs/QA_VALIDATION_20260713.md
```

## Pré-deploy Supabase

Antes de validar o preview:

1. Aplicar migrations em ordem:

```text
docs/SUPABASE_MIGRATION_ORDER.md
```

2. Executar o checklist SQL somente-leitura:

```text
docs/SUPABASE_POST_APPLY_VALIDATION.sql
```

3. Confirmar que os grupos principais retornam `ok`.

## Smoke test do preview

Após a Vercel gerar o Preview Deployment, testar:

### Visitante

- Abrir `/`.
- Abrir `/login`.
- Abrir `/cadastro`.

### Cidadão

- Fazer login como cidadão.
- Abrir `/dashboard`.
- Iniciar triagem em `/triagem`.
- Publicar uma demanda.
- Confirmar que a demanda publicada não expõe dados pessoais no Marketplace.
- Enviar documento complementar em `/documentos`.
- Abrir `/configuracoes`.
- Editar nome/preferências.
- Solicitar exclusão de conta por fluxo auditável.
- Cancelar solicitação pendente de exclusão, se aplicável.
- Confirmar que há botões de voltar/início nas páginas do portal.
- Tentar abrir `/marketplace`, `/financeiro` e `/relatorios` por URL direta e confirmar bloqueio ou experiência restrita.

### Advogado

- Criar/login como advogado.
- Confirmar que o cadastro exige número e UF da OAB.
- Confirmar que advogado com OAB pendente não acessa `/marketplace` nem `/financeiro`.
- Abrir `/marketplace`.
- Ver oportunidades mascaradas.
- Desbloquear uma oportunidade usando créditos.
- Confirmar liberação de dados privados apenas após desbloqueio.
- Enviar oportunidade para CRM.
- Ver cliente em `/clientes`.
- Criar acompanhamento em `/agenda`.

### Administrador

- Confirmar que o usuário admin existe em `public.admin_users`.
- Abrir `/financeiro`.
- Verificar ou rejeitar OAB pendente.
- Aprovar/rejeitar solicitação de crédito.
- Confirmar atualização de saldo do advogado.
- Aprovar/rejeitar solicitação pendente de exclusão de conta.

## Critério de pronto para produção

O deploy pode ser promovido para produção quando:

- Preview build passar na Vercel.
- Migrations estiverem aplicadas no Supabase alvo.
- Checklist SQL pós-aplicação retornar `ok`.
- Smoke test dos três perfis for concluído.
- Nenhum dado pessoal aparecer em oportunidade bloqueada do Marketplace.
- Variáveis de produção estiverem configuradas.

## Pontos que não bloqueiam o preview, mas exigem decisão

Arquivos/pastas legados identificados:

```text
conectajus-core/conectajus-core
src/app/clientes/page.backup.v5.tsx
server.js
data/db.json
```

Eles não devem ser removidos sem autorização explícita. Ver:

```text
docs/LEGACY_AUDIT.md
```
