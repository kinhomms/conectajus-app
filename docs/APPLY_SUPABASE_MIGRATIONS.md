# Aplicação das migrations Supabase

Este projeto ainda não possui `supabase/config.toml` nem Supabase CLI disponível no ambiente local verificado.

Enquanto o projeto não estiver linkado ao Supabase CLI, aplique as migrations pelo Supabase Dashboard.

## Opção A — Supabase Dashboard

1. Abrir o projeto Supabase correto.
2. Acessar SQL Editor.
3. Executar as migrations pendentes em ordem cronológica.
4. Confirmar que não houve erro.
5. Testar os fluxos principais no app.

Migration mais recente pendente:

```text
supabase/migrations/20260713123000_decide_account_deletion_request_rpc.sql
```

Ordem completa de execução:

```text
docs/SUPABASE_MIGRATION_ORDER.md
```

## Opção B — Supabase CLI

Quando o projeto estiver linkado:

```bash
supabase link --project-ref <PROJECT_REF>
supabase db push
```

## SQL da migration de hardening complementar

```sql
drop policy if exists "Authenticated users can create marketplace opportunities" on public.marketplace_opportunities;

create policy "Authenticated users can create marketplace opportunities"
on public.marketplace_opportunities
for insert
to authenticated
with check (
  created_by = auth.uid()
  and status = 'open'
  and summary is not null
  and (
    parent_opportunity_id is null
    or exists (
      select 1
      from public.marketplace_opportunities parent
      where parent.id = parent_opportunity_id
        and parent.created_by = auth.uid()
    )
  )
);

notify pgrst, 'reload schema';
```

## Teste após aplicar

No SQL Editor do Supabase, executar:

```text
docs/SUPABASE_POST_APPLY_VALIDATION.sql
```

Esse script não altera o banco. Ele apenas confirma se tabelas, colunas, funções, policies RLS e bucket privado essenciais existem.

Validar:

- cidadão cria triagem principal;
- cidadão cria complemento para caso próprio;
- cidadão não consegue criar complemento apontando para oportunidade de outro usuário;
- e-mail já cadastrado não gera nova conta em outro perfil;
- advogado informa OAB/UF no cadastro;
- OAB/UF duplicada é bloqueada para outro advogado;
- advogado com OAB pendente não acessa Marketplace/Financeiro;
- admin consegue verificar ou rejeitar OAB pendente;
- usuário consegue editar preferências e solicitar/cancelar exclusão de conta;
- advogado continua conseguindo visualizar/desbloquear oportunidades conforme permissões;
- `npm run lint`;
- `npm run build`.
