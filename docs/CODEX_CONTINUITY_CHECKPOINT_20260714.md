# ConectaJus — Checkpoint de continuidade Codex

Data do checkpoint: 2026-07-14  
Branch oficial: `ui-v6-premium`  
Projeto local correto: `C:\Users\BPEsc\Documents\ConectaJus\conectajus_final_base\conectajus-core`  
Repositório GitHub: `https://github.com/kinhomms/conectajus-app.git`

## Instruções obrigatórias para a próxima sessão

Não criar novo projeto. Não trocar stack. Não reiniciar arquitetura.

Antes de qualquer alteração:

1. Abrir a pasta correta do projeto.
2. Confirmar `package.json`.
3. Confirmar `src/`, `app/`, `features/`, `components/`.
4. Executar `git status`.
5. Confirmar branch `ui-v6-premium`.
6. Se necessário, executar `git checkout ui-v6-premium`.
7. Executar `npm install` apenas se `node_modules` estiver ausente ou inconsistente.
8. Executar `npm run validate`.

## Stack e arquitetura oficial

- Next.js
- React
- TypeScript
- Supabase
- PostgreSQL
- Vercel

Arquitetura baseada em features:

- regras de negócio em `src/features`;
- páginas em `src/app` devem continuar pequenas;
- preservar AppShell, Design System Premium e identidade visual.

## Estado funcional validado

Fluxos já implementados e testados:

- Login por perfil.
- Portal do cidadão.
- Triagem do caso.
- Envio/complemento de documentos.
- Marketplace jurídico com leads mascarados.
- Conta de advogado com OAB verificada.
- Conta admin com aprovação de OAB.
- Solicitação e aprovação de créditos.
- Desbloqueio de oportunidade com consumo de créditos.
- Liberação dos dados privados após desbloqueio.
- Envio do lead desbloqueado para CRM.
- Criação de cliente/caso/nota/vínculo a partir do Marketplace.
- Configurações de conta/perfil.
- Solicitação de exclusão de conta com fila auditável.
- Botões de voltar/início nas principais páginas.

## Último teste executado

Conta de advogado validada:

- E-mail: `tainarasantana.adv@gmail.com`
- Perfil: advogado
- OAB: BA 87947
- Status OAB: verificada
- Marketplace: habilitado
- Créditos após desbloqueio: 5

Resultado do teste:

1. Marketplace abriu com 1 oportunidade.
2. Oportunidade estava desbloqueada.
3. Dados privados apareceram após backfill.
4. Botão `Enviar para CRM` executado com sucesso.
5. Mensagem exibida: cliente, caso, nota inicial e vínculo enviados para o CRM.
6. Cliente vinculado no CRM: `36b9bdd5-06f3-404f-a3be-a8461d807b9d`.
7. Teste visual em `/clientes` realizado após o vínculo: cliente `manoel souza` aparece na carteira jurídica com origem `MARKETPLACE`.

Observação: não registrar senhas em arquivos. As senhas temporárias foram fornecidas pelo usuário na conversa original e devem ser solicitadas novamente ao usuário se outra sessão precisar testar login manual.

## Supabase

Projeto Supabase usado: `wsrejostavinqobxljbn`.

Migrations locais no checkpoint: 32.

Migration mais recente:

```text
supabase/migrations/20260714023000_backfill_missing_marketplace_private_details.sql
```

Bundle consolidado:

```text
supabase/APPLY_ALL_MIGRATIONS.sql
```

Últimas migrations críticas aplicadas manualmente no Supabase:

- `20260714014500_fix_marketplace_unlock_rpc_ambiguity.sql`
- `20260714020000_fix_private_details_unlock_policy.sql`
- `20260714021500_create_accessible_marketplace_private_details_rpc.sql`
- `20260714023000_backfill_missing_marketplace_private_details.sql`

Motivo das últimas correções:

- O RPC de desbloqueio tinha ambiguidade no campo `opportunity_id`.
- O lead de teste consumiu créditos corretamente, mas era legado e não possuía linha privada associada.
- Foi criada RPC segura `list_accessible_marketplace_private_details()`.
- Foi criado backfill para oportunidades antigas sem dados privados.
- A UI passou a tratar oportunidades desbloqueadas sem detalhes, evitando confusão.

## Commits recentes relevantes

- `e445733` — `fix: load unlocked marketplace private details via rpc`
- `4ab4534` — `fix: backfill legacy marketplace private details`

Confirmar com:

```bash
git log --oneline -8
```

## Validação local

Última validação antes deste checkpoint:

```bash
npm run validate
```

Resultado: aprovado.

Inclui:

- preflight de preview;
- lint;
- build Next.js.

## Preview online

URL de preview de branch usada anteriormente:

```text
https://conectajus-app-git-ui-v6-premium-conectajus.vercel.app
```

Observação: em alguns momentos a URL de branch demorou/cacheou deploy antigo. Para validações críticas, foi usado `localhost:3000` contra o Supabase real.

## Próximas etapas recomendadas

1. Rodar `npm run validate` novamente após qualquer alteração.
2. Testar fluxo completo em preview Vercel quando o deploy da branch estiver atualizado:
   - login advogado;
   - Marketplace;
   - oportunidade desbloqueada;
   - dados liberados;
   - abrir CRM.
3. Criar checklist final de go-live:
   - domínio;
   - variáveis Vercel;
   - política de privacidade;
   - retenção/exclusão de conta;
   - LGPD;
   - termos de Marketplace/créditos;
   - monitoramento pós-deploy.

## Andamento estimado

Andamento técnico atual: 99,9%.

O que falta para considerar 100% operacional:

- validação do preview Vercel atualizado com os últimos commits;
- checklist jurídico/comercial de go-live.
