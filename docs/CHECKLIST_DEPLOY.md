# Checklist de produção — ConectaJus

Este checklist consolida o estado atual do ConectaJus antes de publicação em produção.

## 1. Status técnico atual

- Next.js, React e TypeScript configurados.
- Arquitetura por features preservada:
  - `src/features`
  - `src/app`
  - `src/components`
- Páginas em `src/app` seguem pequenas, delegando regra de negócio para features.
- `src/lib/supabase.ts` exige variáveis reais de ambiente e não usa fallback placeholder.
- `npm run lint` passando.
- `npm run build` passando.

## 2. Rotas ativas no build

- `/`
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

## 3. Variáveis obrigatórias

Configurar no ambiente de produção:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Se essas variáveis faltarem, a aplicação falhará explicitamente para evitar deploy silenciosamente quebrado.

## 4. Supabase

Antes do deploy final, confirmar que todas as migrations foram aplicadas no projeto Supabase de produção.

Áreas cobertas pelas migrations:

- Marketplace de oportunidades mascaradas.
- Detalhes privados das oportunidades.
- Fluxo de créditos e desbloqueio.
- Solicitação, aprovação, rejeição e cancelamento de compra de créditos.
- Restrição de Marketplace e Financeiro para atores autorizados.
- Agenda.
- Upload privado de documentos do cidadão.
- Vínculo de documentos do cidadão com oportunidades.
- Rastreamento de oportunidades próprias do cidadão.
- Vínculo Marketplace → CRM.
- Complementos de documentos pós-triagem.
- Relação estruturada entre oportunidade original e triagem complementar.
- Hardening de propriedade da oportunidade original em triagens complementares.

Migration mais recente a confirmar/aplicar:

```text
supabase/migrations/20260713100000_harden_complement_parent_ownership.sql
```

Guia de aplicação:

```text
docs/APPLY_SUPABASE_MIGRATIONS.md
```

Ordem completa:

```text
docs/SUPABASE_MIGRATION_ORDER.md
```

## 5. Buckets e políticas de Storage

Confirmar no Supabase Storage:

- Bucket `citizen-documents` existente.
- Bucket privado.
- Políticas permitindo:
  - cidadão enviar, listar e abrir seus próprios documentos;
  - advogado abrir documentos apenas quando a oportunidade estiver desbloqueada;
  - acesso por link assinado quando aplicável.

## 6. Fluxos principais para teste manual

### Cidadão

- Criar conta como cidadão.
- Fazer login.
- Ver Portal do Cidadão em `/dashboard`.
- Iniciar triagem.
- Publicar oportunidade no Marketplace.
- Confirmar que dados pessoais não aparecem no Marketplace público.
- Ver caso publicado no Portal do Cidadão.
- Enviar documento complementar.
- Iniciar triagem complementar.
- Confirmar que relato original não é editado diretamente.
- Tentar acessar `/marketplace`, `/financeiro` e `/relatorios` por URL direta e confirmar tela restrita/redirecionamento correto.

### Advogado

- Criar/login como advogado.
- Acessar Dashboard executivo.
- Ver Marketplace.
- Filtrar oportunidades por original/complemento.
- Solicitar créditos.
- Desbloquear oportunidade com créditos.
- Ver dados privados liberados apenas após desbloqueio.
- Abrir documento privado por link seguro.
- Enviar oportunidade para CRM.
- Criar acompanhamento na Agenda.
- Consultar Processos, Documentos, Financeiro e Relatórios.

### Administrador

- Confirmar presença na tabela `admin_users`.
- Login como admin.
- Ver solicitações pendentes de crédito.
- Aprovar e rejeitar solicitações.
- Confirmar que saldo do advogado é atualizado após aprovação.

## 7. Vercel

Antes de publicar:

- Conectar repositório `kinhomms/conectajus-app`.
- Selecionar branch correta: `ui-v6-premium`.
- Configurar `NEXT_PUBLIC_SUPABASE_URL`.
- Configurar `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Garantir comando de instalação: `npm install`.
- Garantir comando de build: `npm run build`.
- Validar preview deploy antes de promover para produção.

## 8. Atenções antes de commit/deploy

- Existe uma pasta aninhada `conectajus-core/conectajus-core` com aparência de cópia antiga. Não remover sem autorização explícita.
- Existe `src/app/clientes/page.backup.v5.tsx`, identificado como backup legado. Não remover sem autorização explícita.
- Existem `server.js` e `data/db.json`, identificados como mock/backend antigo. Não remover sem autorização explícita.
- Não commitar `.env.local`.
- Conferir `docs/LEGACY_AUDIT.md` antes de uma limpeza final.

## 9. Critério mínimo de pronto para MVP

- `npm run lint` passando.
- `npm run build` passando.
- Migrations aplicadas no Supabase alvo.
- Variáveis configuradas no Vercel.
- Teste manual dos fluxos cidadão, advogado e admin concluído.
- Deploy preview validado.

## 10. Percentual estimado

Status atual estimado: 97%.

O projeto está funcional em build local, com lint e build passando, e próximo de readiness para preview/deploy. Ainda depende de:

- aplicação/validação das migrations no Supabase alvo;
- teste manual com perfis reais;
- decisão sobre limpeza de legados antes do commit final.
