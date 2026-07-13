# Perfis de teste no Supabase — ConectaJus

Use este roteiro depois de aplicar as migrations no Supabase alvo e antes de validar o preview Vercel.

Não registre senhas, tokens, documentos reais ou dados pessoais sensíveis neste arquivo.

## Perfis mínimos

Para testar o MVP, preparar pelo menos:

- 1 usuário cidadão;
- 1 usuário advogado com OAB pendente;
- 1 usuário admin;
- opcionalmente, 1 advogado já verificado para acelerar testes de Marketplace/Financeiro.

## 1. Criar usuários pela aplicação

Preferencialmente, crie os usuários pelo próprio fluxo da ConectaJus:

```text
/cadastro
```

Critérios:

- cidadão deve usar perfil `cliente`;
- advogado deve usar perfil `advogado`;
- advogado deve informar OAB/UF;
- não reutilizar o mesmo e-mail entre perfis.

## 2. Confirmar usuários no Supabase

No SQL Editor do Supabase, consulte apenas os e-mails de teste:

```sql
select
  id,
  email,
  raw_user_meta_data ->> 'profile' as profile,
  created_at
from auth.users
where email in (
  'cidadao.teste@example.com',
  'advogado.teste@example.com',
  'admin.teste@example.com'
)
order by created_at desc;
```

Troque os e-mails acima pelos e-mails reais de teste.

## 3. Promover usuário admin

Depois de criar o usuário admin pela aplicação, inserir o `id` dele em `public.admin_users`.

Importante: o perfil visual `admin` no metadata não basta para as ações sensíveis. As RPCs administrativas usam `public.admin_users` como fonte de autorização.

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'admin.teste@example.com'
on conflict (user_id) do nothing;
```

Valide:

```sql
select
  admin_users.user_id,
  users.email
from public.admin_users
join auth.users users on users.id = admin_users.user_id
where users.email = 'admin.teste@example.com';
```

## 4. Conferir fila de OAB

Após cadastro do advogado:

```sql
select
  user_id,
  full_name,
  email,
  oab_number,
  oab_state,
  verification_status,
  verified_by,
  verified_at,
  created_at
from public.lawyer_profiles
order by created_at desc;
```

O status esperado após cadastro é:

```text
pending
```

O admin deve validar pelo painel `/financeiro`.

Evite marcar OAB como verificada diretamente pelo SQL Editor, porque isso contorna a RPC administrativa e pode deixar `verified_by`/`verified_at` vazios. Para validar a auditoria real, faça a decisão pelo painel admin.

Quando a decisão for feita pelo painel admin, os campos `verified_by` e `verified_at` devem registrar quem decidiu e quando.

## 5. Confirmar solicitações de exclusão de conta

Depois de o usuário solicitar exclusão em `/configuracoes`:

```sql
select
  id,
  user_email,
  profile,
  status,
  requested_at,
  decided_at
from public.account_deletion_requests
order by requested_at desc;
```

Status esperados:

- `pending`: aguardando admin;
- `approved`: aprovado para tratamento administrativo;
- `rejected`: rejeitado pelo admin;
- `canceled`: cancelado pelo próprio usuário antes da decisão.

Quando a decisão for tomada pelo painel admin, o campo `decided_by` deve registrar o `auth.uid()` do administrador que decidiu.

## 6. Confirmar decisões de crédito

Depois de o admin aprovar ou rejeitar créditos em `/financeiro`:

```sql
select
  id,
  user_id,
  requested_credits,
  status,
  decided_by,
  decided_at,
  decision_notes
from public.lawyer_credit_purchase_requests
order by created_at desc;
```

Quando a decisão for feita pelo painel admin, os campos `decided_by` e `decided_at` devem registrar quem decidiu e quando.

## 7. Validação final

Depois de preparar os perfis:

1. executar `docs/SUPABASE_POST_APPLY_VALIDATION.sql`;
2. confirmar todos os grupos críticos como `ok`;
3. executar `supabase/TEST_PROFILE_CHECKS.sql`, trocando os e-mails de exemplo pelos e-mails reais;
4. abrir o preview Vercel;
5. preencher `docs/MANUAL_TEST_REPORT_TEMPLATE.md`.

## Observação LGPD

A aprovação de exclusão no painel admin registra uma decisão administrativa. Ela não remove automaticamente o usuário do Supabase Auth, porque a remoção efetiva pode exigir análise de retenção legal, documentos, créditos, marketplace e histórico de atendimento.
