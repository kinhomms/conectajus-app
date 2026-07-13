# Variáveis de ambiente — ConectaJus

Este guia documenta as variáveis necessárias para rodar e publicar o ConectaJus.

Não coloque valores reais neste arquivo.

## Variáveis obrigatórias

### `NEXT_PUBLIC_SUPABASE_URL`

URL pública do projeto Supabase.

Exemplo de formato:

```text
https://xxxxxxxxxxxxxxxxxxxx.supabase.co
```

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Chave pública `anon` do projeto Supabase.

Essa chave é usada pelo frontend com RLS habilitado. Ela não substitui políticas de segurança no banco.

## Onde configurar

### Local

Criar `.env.local` na raiz do projeto:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Use `.env.example` como modelo, sem colocar valores reais no arquivo de exemplo.

O arquivo `.env.local` não deve ser commitado.

### Vercel

Configurar em:

```text
Project Settings > Environment Variables
```

Ambientes recomendados:

- Preview;
- Production;
- Development, se usado.

## Variáveis proibidas no frontend

Não configurar no frontend:

```text
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
POSTGRES_PASSWORD
JWT_SECRET
```

Esses valores, se forem usados no futuro, devem ficar apenas em ambiente server-side controlado.

## Comportamento da aplicação

O cliente Supabase ativo está em:

```text
src/lib/supabase.ts
```

Ele exige:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Se alguma estiver ausente, a aplicação falha explicitamente para evitar um deploy aparentemente funcional, mas quebrado.

## Checklist de segurança

Antes de commit/deploy:

- Confirmar que `.env.local` não aparece no `git status`.
- Confirmar que `.env*` está no `.gitignore`.
- Confirmar que apenas `.env.example` pode ser versionado.
- Confirmar que nenhuma service role key foi copiada para documentação, código ou issue pública.
- Confirmar que o Supabase está protegido por RLS nas tabelas críticas.
- Confirmar que o bucket `citizen-documents` é privado.

## Validação relacionada

Supabase:

```text
docs/SUPABASE_POST_APPLY_VALIDATION.sql
```

Vercel:

```text
docs/VERCEL_DEPLOYMENT.md
```

Deploy:

```text
docs/CHECKLIST_DEPLOY.md
```
