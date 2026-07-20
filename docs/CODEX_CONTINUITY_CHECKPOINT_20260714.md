# ConectaJus ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Checkpoint de continuidade Codex

Data do checkpoint: 2026-07-14  
Branch oficial: `ui-v6-premium`  
Projeto local correto: `C:\Users\BPEsc\Documents\ConectaJus\conectajus_final_base\conectajus-core`  
RepositÃƒÆ’Ã‚Â³rio GitHub: `https://github.com/kinhomms/conectajus-app.git`

## InstruÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes obrigatÃƒÆ’Ã‚Â³rias para a prÃƒÆ’Ã‚Â³xima sessÃƒÆ’Ã‚Â£o

NÃƒÆ’Ã‚Â£o criar novo projeto. NÃƒÆ’Ã‚Â£o trocar stack. NÃƒÆ’Ã‚Â£o reiniciar arquitetura.

Antes de qualquer alteraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o:

1. Abrir a pasta correta do projeto.
2. Confirmar `package.json`.
3. Confirmar `src/`, `app/`, `features/`, `components/`.
4. Executar `git status`.
5. Confirmar branch `ui-v6-premium`.
6. Se necessÃƒÆ’Ã‚Â¡rio, executar `git checkout ui-v6-premium`.
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

- regras de negÃƒÆ’Ã‚Â³cio em `src/features`;
- pÃƒÆ’Ã‚Â¡ginas em `src/app` devem continuar pequenas;
- preservar AppShell, Design System Premium e identidade visual.

## Estado funcional validado

Fluxos jÃƒÆ’Ã‚Â¡ implementados e testados:

- Login por perfil.
- Portal do cidadÃƒÆ’Ã‚Â£o.
- Triagem do caso.
- Envio/complemento de documentos.
- Marketplace jurÃƒÆ’Ã‚Â­dico com leads mascarados.
- Conta de advogado com OAB verificada.
- Conta admin com aprovaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de OAB.
- SolicitaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o e aprovaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de crÃƒÆ’Ã‚Â©ditos.
- Desbloqueio de oportunidade com consumo de crÃƒÆ’Ã‚Â©ditos.
- LiberaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o dos dados privados apÃƒÆ’Ã‚Â³s desbloqueio.
- Envio do lead desbloqueado para CRM.
- CriaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de cliente/caso/nota/vÃƒÆ’Ã‚Â­nculo a partir do Marketplace.
- ConfiguraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes de conta/perfil.
- SolicitaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de exclusÃƒÆ’Ã‚Â£o de conta com fila auditÃƒÆ’Ã‚Â¡vel.
- BotÃƒÆ’Ã‚Âµes de voltar/inÃƒÆ’Ã‚Â­cio nas principais pÃƒÆ’Ã‚Â¡ginas.
- PÃƒÆ’Ã‚Â¡ginas pÃƒÆ’Ã‚Âºblicas legais:
  - `/privacidade`;
  - `/termos`;
  - `/regras-marketplace`.
- Aceite obrigatÃƒÆ’Ã‚Â³rio no cadastro com links para Termos, Privacidade e Regras do Marketplace.
- ConfirmaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o obrigatÃƒÆ’Ã‚Â³ria antes de publicar triagem no Marketplace, com ciÃƒÆ’Ã‚Âªncia sobre IA preliminar, privacidade e regras de desbloqueio.
- Dashboard do advogado agora exibe oportunidades qualificadas logo apÃƒÆ’Ã‚Â³s login, antes da visÃƒÆ’Ã‚Â£o executiva.
- Advogado pode configurar perfil pÃƒÆ’Ã‚Âºblico com foto, chamada profissional, bio e visibilidade pÃƒÆ’Ã‚Âºblica.
- PÃƒÆ’Ã‚Â¡gina pÃƒÆ’Ã‚Âºblica de advogado disponÃƒÆ’Ã‚Â­vel em `/advogados/[userId]`.
- Migration complementar de grants aplicada no Supabase para permitir leitura pÃƒÆ’Ã‚Âºblica e gestÃƒÆ’Ã‚Â£o autenticada dos perfis pÃƒÆ’Ã‚Âºblicos de advogados.

## ÃƒÆ’Ã…Â¡ltimo teste executado

Conta de advogado validada:

- E-mail: `tainarasantana.adv@gmail.com`
- Perfil: advogado
- OAB: BA 87947
- Status OAB: verificada
- Marketplace: habilitado
- CrÃƒÆ’Ã‚Â©ditos apÃƒÆ’Ã‚Â³s desbloqueio: 5

Resultado do teste:

1. Marketplace abriu com 1 oportunidade.
2. Oportunidade estava desbloqueada.
3. Dados privados apareceram apÃƒÆ’Ã‚Â³s backfill.
4. BotÃƒÆ’Ã‚Â£o `Enviar para CRM` executado com sucesso.
5. Mensagem exibida: cliente, caso, nota inicial e vÃƒÆ’Ã‚Â­nculo enviados para o CRM.
6. Cliente vinculado no CRM: `36b9bdd5-06f3-404f-a3be-a8461d807b9d`.
7. Teste visual em `/clientes` realizado apÃƒÆ’Ã‚Â³s o vÃƒÆ’Ã‚Â­nculo: cliente `manoel souza` aparece na carteira jurÃƒÆ’Ã‚Â­dica com origem `MARKETPLACE`.
8. Teste no preview Vercel realizado em `https://conectajus-app-git-ui-v6-premium-conectajus.vercel.app/marketplace`: dados liberados aparecem, saldo permanece em 5 crÃƒÆ’Ã‚Â©ditos e cliente vinculado ao CRM aparece.
9. Teste no preview Vercel realizado em `/clientes`: cliente `manoel souza` aparece na carteira jurÃƒÆ’Ã‚Â­dica com origem `MARKETPLACE`.
10. Teste local realizado em `/privacidade`, `/termos` e `/regras-marketplace`: pÃƒÆ’Ã‚Â¡ginas abriram como pÃƒÆ’Ã‚Âºblicas, com tÃƒÆ’Ã‚Â­tulos corretos, cabeÃƒÆ’Ã‚Â§alho `Documentos pÃƒÆ’Ã‚Âºblicos`, links internos legais e sem exibir shell/login protegido.
11. Teste local realizado em `/`: rodapÃƒÆ’Ã‚Â© da Home contÃƒÆ’Ã‚Â©m links para Privacidade, Termos e Regras do Marketplace.
12. Teste local realizado em `/cadastro`: checkbox de aceite legal aparece, links para Termos/Privacidade/Regras do Marketplace existem e o botÃƒÆ’Ã‚Â£o de criaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de conta fica bloqueado sem aceite.
13. Teste local realizado em `/triagem`: apÃƒÆ’Ã‚Â³s gerar dossiÃƒÆ’Ã‚Âª preliminar, a confirmaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de publicaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o aparece com links legais e o botÃƒÆ’Ã‚Â£o `Publicar no Marketplace` fica bloqueado atÃƒÆ’Ã‚Â© aceite.
14. `npm run go-live:check` executado apÃƒÆ’Ã‚Â³s os aceites legais: bundle Supabase gerado com 32 migrations, preflight aprovado, lint aprovado e build Next.js aprovado com 19 rotas estÃƒÆ’Ã‚Â¡ticas.
15. `npm run validate` executado apÃƒÆ’Ã‚Â³s vitrine de oportunidades no dashboard do advogado e perfil pÃƒÆ’Ã‚Âºblico com foto: preflight aprovado, lint aprovado com 2 avisos de `<img>` e build aprovado; rota dinÃƒÆ’Ã‚Â¢mica `/advogados/[userId]` gerada.
16. Teste local de login por UI com a conta de advogado: login validado e redirecionamento para `/dashboard` funcionando.
17. Teste local do dashboard do advogado: seÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o `Oportunidades qualificadas` aparece logo apÃƒÆ’Ã‚Â³s login, antes da visÃƒÆ’Ã‚Â£o executiva; no banco atual nÃƒÆ’Ã‚Â£o havia oportunidade `open`, entÃƒÆ’Ã‚Â£o o estado vazio foi exibido corretamente.
18. Teste autenticado do Supabase Storage: upload de imagem de perfil no bucket `lawyer-profile-photos` retornou sucesso.
19. Teste autenticado de gravaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o em `lawyer_public_profiles`: apÃƒÆ’Ã‚Â³s aplicar grants, upsert do perfil pÃƒÆ’Ã‚Âºblico retornou sucesso.
20. Teste local de `/advogados/a49040eb-91a2-4864-b4b6-aa4fc3740c40`: pÃƒÆ’Ã‚Â¡gina pÃƒÆ’Ã‚Âºblica exibiu foto, nome, OAB BA 87947, bio e chamada para triagem.
21. Teste local de `/configuracoes`: ÃƒÆ’Ã‚Â¡rea `Perfil pÃƒÆ’Ã‚Âºblico do advogado`, botÃƒÆ’Ã‚Â£o/link de foto e link `Ver perfil pÃƒÆ’Ã‚Âºblico` aparecem para o advogado.

ObservaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o: nÃƒÆ’Ã‚Â£o registrar senhas em arquivos. As senhas temporÃƒÆ’Ã‚Â¡rias foram fornecidas pelo usuÃƒÆ’Ã‚Â¡rio na conversa original e devem ser solicitadas novamente ao usuÃƒÆ’Ã‚Â¡rio se outra sessÃƒÆ’Ã‚Â£o precisar testar login manual.

## Supabase

Projeto Supabase usado: `wsrejostavinqobxljbn`.

Migrations locais no checkpoint: 34.

Migration mais recente:

```text
supabase/migrations/20260716100000_grant_lawyer_public_profiles_access.sql
```

Bundle consolidado:

```text
supabase/APPLY_ALL_MIGRATIONS.sql
```

ÃƒÆ’Ã…Â¡ltimas migrations crÃƒÆ’Ã‚Â­ticas aplicadas manualmente no Supabase:

- `20260714014500_fix_marketplace_unlock_rpc_ambiguity.sql`
- `20260714020000_fix_private_details_unlock_policy.sql`
- `20260714021500_create_accessible_marketplace_private_details_rpc.sql`
- `20260714023000_backfill_missing_marketplace_private_details.sql`
- `20260714103000_create_lawyer_public_profiles.sql`
- `20260716100000_grant_lawyer_public_profiles_access.sql`

Motivo das ÃƒÆ’Ã‚Âºltimas correÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes:

- O RPC de desbloqueio tinha ambiguidade no campo `opportunity_id`.
- O lead de teste consumiu crÃƒÆ’Ã‚Â©ditos corretamente, mas era legado e nÃƒÆ’Ã‚Â£o possuÃƒÆ’Ã‚Â­a linha privada associada.
- Foi criada RPC segura `list_accessible_marketplace_private_details()`.
- Foi criado backfill para oportunidades antigas sem dados privados.
- A UI passou a tratar oportunidades desbloqueadas sem detalhes, evitando confusÃƒÆ’Ã‚Â£o.
- Foi criada estrutura de perfil pÃƒÆ’Ã‚Âºblico de advogado com bucket `lawyer-profile-photos`.
- Foram aplicados grants de leitura pÃƒÆ’Ã‚Âºblica e gestÃƒÆ’Ã‚Â£o autenticada para `lawyer_public_profiles`.

## Commits recentes relevantes

- `e445733` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â `fix: load unlocked marketplace private details via rpc`
- `4ab4534` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â `fix: backfill legacy marketplace private details`
- `82e273c` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â `docs: add legal commercial go-live checklist`
- `0839037` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â `feat: add public legal pages`
- `0b591f8` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â `feat: require legal consent for onboarding and triage`
- `e89bfaf` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â `docs: add go-live user action guide`

Confirmar com:

```bash
git log --oneline -8
```

## ValidaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o local

ÃƒÆ’Ã…Â¡ltima validaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o antes deste checkpoint:

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

ObservaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o: em alguns momentos a URL de branch demorou/cacheou deploy antigo. Para validaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes crÃƒÆ’Ã‚Â­ticas, foi usado `localhost:3000` contra o Supabase real.
Em 2026-07-14, o preview da branch foi revalidado e jÃƒÆ’Ã‚Â¡ servia os ÃƒÆ’Ã‚Âºltimos commits necessÃƒÆ’Ã‚Â¡rios ao fluxo Marketplace -> CRM.

## PrÃƒÆ’Ã‚Â³ximas etapas recomendadas

1. Rodar `npm run validate` novamente apÃƒÆ’Ã‚Â³s qualquer alteraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.
2. Revisar e aprovar o checklist final jurÃƒÆ’Ã‚Â­dico/comercial:

```text
docs/GO_LIVE_LEGAL_COMMERCIAL_CHECKLIST_20260714.md
```

Esse checklist cobre domÃƒÆ’Ã‚Â­nio, variÃƒÆ’Ã‚Â¡veis de produÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o, Supabase, LGPD, termos de uso, polÃƒÆ’Ã‚Â­tica de privacidade, Marketplace/crÃƒÆ’Ã‚Â©ditos, OAB, IA jurÃƒÆ’Ã‚Â­dica, suporte e monitoramento pÃƒÆ’Ã‚Â³s-deploy.

2. Revisar juridicamente o conteÃƒÆ’Ã‚Âºdo publicado nas novas pÃƒÆ’Ã‚Â¡ginas pÃƒÆ’Ã‚Âºblicas:

```text
src/app/privacidade/page.tsx
src/app/termos/page.tsx
src/app/regras-marketplace/page.tsx
```

O conteÃƒÆ’Ã‚Âºdo-base estÃƒÆ’Ã‚Â¡ centralizado em:

```text
src/features/legal/content/legalPages.ts
```

3. Para colocar o sistema efetivamente funcionando online, seguir o guia operacional:

```text
docs/GO_LIVE_USER_ACTIONS_20260714.md
```

## Andamento estimado

Andamento tÃƒÆ’Ã‚Â©cnico atual: 99,995%.

O que falta para considerar 100% operacional:

- aprovaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o jurÃƒÆ’Ã‚Â­dica/comercial final dos textos pÃƒÆ’Ã‚Âºblicos, regras de crÃƒÆ’Ã‚Â©ditos/estorno, canal oficial de privacidade/suporte e domÃƒÆ’Ã‚Â­nio final antes de go-live comercial definitivo.

## AtualizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o 2026-07-16 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ReferÃƒÆ’Ã‚Âªncia Advogado DinÃƒÆ’Ã‚Â¢mico / tema claro-escuro

SolicitaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o do usuÃƒÆ’Ã‚Â¡rio: analisar prints do concorrente Advogado DinÃƒÆ’Ã‚Â¢mico e aproximar a ConectaJus do mesmo perfil de produto, sem copiar identidade visual, com interface limpa, sem cores fortes, tema claro como padrÃƒÆ’Ã‚Â£o e tema escuro opcional.

AlteraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes implementadas nesta rodada:

- Tema claro definido como padrÃƒÆ’Ã‚Â£o no AppShell autenticado.
- Tema escuro opcional com persistÃƒÆ’Ã‚Âªncia local via `ThemeToggle`.
- `@custom-variant dark` adicionado em `src/app/globals.css` para dark mode por classe `.dark`.
- Topbar, Sidebar, SearchBar, UserMenu e MobileNavigation adaptados para visual claro, cards/brancos e suporte dark.
- Marketplace ajustado para linguagem mais comercial: filtros renomeados para `Caixa de entrada`, `Exclusivo para vocÃƒÆ’Ã‚Âª` e `Complementos`.
- Dashboard do advogado e portal do cidadÃƒÆ’Ã‚Â£o suavizados para fundo claro, cards claros, bordas discretas e CTA teal em vez de dourado forte.
- CorreÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes de encoding UTF-8 apÃƒÆ’Ã‚Â³s ediÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o via PowerShell.
- CorreÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de ÃƒÆ’Ã‚Â­cones mojibake nos cards finais do dashboard.

ValidaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes realizadas nesta rodada:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; restaram apenas 2 warnings jÃƒÆ’Ã‚Â¡ conhecidos de `<img>` em perfil pÃƒÆ’Ã‚Âºblico/configuraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes.
- `npm run build`: aprovado; 19 rotas geradas/validadas pelo Next.js.

Teste local no navegador interno:

- `http://localhost:3000/dashboard` abriu com tema claro default (`body` em `rgb(245, 247, 251)`).
- BotÃƒÆ’Ã‚Â£o de tema exibiu `Escuro` no estado claro.
- AlternÃƒÆ’Ã‚Â¢ncia para escuro testada com sucesso: classe `dark` aplicada no `html`, fundo `rgb(11, 15, 25)` e botÃƒÆ’Ã‚Â£o passou a `Claro`.
- Tema foi retornado para claro ao final do teste.
- Textos principais corrigidos apÃƒÆ’Ã‚Â³s mojibake: `NotificaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes`, `JurÃƒÆ’Ã‚Â­dica`, `CrÃƒÆ’Ã‚Â©ditos`, `ConfiguraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes`, etc.

ObservaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o pendente:

- Ao tentar validar `/marketplace` visualmente no navegador interno, a sessÃƒÆ’Ã‚Â£o ativa alternou/permaneceu com perfil cidadÃƒÆ’Ã‚Â£o em parte do teste, exibindo navegaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o do portal cidadÃƒÆ’Ã‚Â£o. A validaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o tÃƒÆ’Ã‚Â©cnica do componente passou no build, mas a validaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o visual completa do marketplace como advogado deve ser repetida com uma conta advogado confirmada/logada do zero.

PrÃƒÆ’Ã‚Â³xima etapa sugerida:

1. Validar login limpo como advogado e abrir `/marketplace` para confirmar visual dos cards reais de oportunidades.
2. Ajustar demais mÃƒÆ’Ã‚Â³dulos internos para o mesmo padrÃƒÆ’Ã‚Â£o visual claro/dark, comeÃƒÆ’Ã‚Â§ando por CRM, documentos, agenda e configuraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes.
3. Substituir futuramente os dois `<img>` por `next/image` para eliminar warnings de lint.

## AtualizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o 2026-07-16 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â CorreÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de sessÃƒÆ’Ã‚Â£o/perfil no layout

Objetivo desta etapa: prosseguir a validaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o do Marketplace como advogado apÃƒÆ’Ã‚Â³s a adaptaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o visual inspirada nos prints do Advogado DinÃƒÆ’Ã‚Â¢mico.

CorreÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes implementadas:

- `useCurrentUserProfile` agora assina `supabase.auth.onAuthStateChange`, evitando que Topbar/Sidebar/MobileNavigation fiquem presos ao perfil anterior quando o usuÃƒÆ’Ã‚Â¡rio troca de conta no mesmo navegador.
- Criada ponte de assinatura em `auth.repository.ts` e `auth.service.ts`.
- `useSidebarNavigation` foi regravado com textos e ÃƒÆ’Ã‚Â­cones UTF-8 corretos, removendo mojibake em itens como Dashboard, Clientes, Triagem, Documentos, ConfiguraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes, Marketplace e Financeiro.
- Textos de auth/login/cadastro passaram por normalizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de encoding.
- Corrigido texto do botÃƒÆ’Ã‚Â£o `ÃƒÂ¢Ã¢â‚¬Â Ã‚Â Voltar` no portal cidadÃƒÆ’Ã‚Â£o.

ValidaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes realizadas:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; permanecem apenas os 2 warnings conhecidos de `<img>` em perfil pÃƒÆ’Ã‚Âºblico/configuraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes.
- `npm run build`: aprovado.
- Busca por mojibake em auth/navigation/dashboard/layout: sem ocorrÃƒÆ’Ã‚Âªncias reais pendentes.

Teste visual/local:

- Tentativa de login com a conta de advogada previamente informada retornou mensagem de credencial invÃƒÆ’Ã‚Â¡lida no Supabase atual.
- Tentativa de login com a conta admin previamente informada tambÃƒÆ’Ã‚Â©m retornou mensagem de credencial invÃƒÆ’Ã‚Â¡lida.
- Por isso, a validaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o visual completa de `/marketplace` como advogado/admin ficou pendente atÃƒÆ’Ã‚Â© confirmaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o/redefiniÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o das credenciais ou criaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o/ajuste das contas no Supabase.

PrÃƒÆ’Ã‚Â³xima aÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o recomendada:

1. Confirmar ou redefinir senha das contas advogado/admin no Supabase Auth.
2. Repetir login limpo como advogado/admin.
3. Abrir `/dashboard` e `/marketplace` para confirmar que menu jurÃƒÆ’Ã‚Â­dico, oportunidades qualificadas e tema claro/dark aparecem corretamente.

## AtualizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o 2026-07-16 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Login do advogado abre Oportunidades qualificadas

SolicitaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o do usuÃƒÆ’Ã‚Â¡rio: a pÃƒÆ’Ã‚Â¡gina de oportunidades qualificadas no perfil de advogado deve aparecer assim que o advogado fizer login na plataforma.

AlteraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o implementada:

- `useLoginWorkspace` agora identifica o perfil retornado pelo Supabase apÃƒÆ’Ã‚Â³s login.
- UsuÃƒÆ’Ã‚Â¡rios com perfil `advogado` ou `admin` sÃƒÆ’Ã‚Â£o redirecionados diretamente para `routes.marketplace` (`/marketplace`).
- UsuÃƒÆ’Ã‚Â¡rios com perfil `cliente` continuam sendo redirecionados para `routes.dashboard` (`/dashboard`).

ValidaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes realizadas:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; permanecem apenas os 2 warnings conhecidos de `<img>` em perfil pÃƒÆ’Ã‚Âºblico/configuraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes.
- `npm run build`: aprovado.

ObservaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o:

- O teste E2E visual de login advogado ainda depende de credenciais vÃƒÆ’Ã‚Â¡lidas no Supabase atual, pois as contas previamente informadas retornaram credencial invÃƒÆ’Ã‚Â¡lida na ÃƒÆ’Ã‚Âºltima validaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.

## AtualizaÃƒÂ§ÃƒÂ£o 2026-07-16 Ã¢â‚¬â€ NavegaÃƒÂ§ÃƒÂ£o do advogado, contraste e telas antigas

SolicitaÃƒÂ§ÃƒÂ£o do usuÃƒÂ¡rio: prosseguir corrigindo botÃƒÂµes de inÃƒÂ­cio/voltar com contraste ruim, revisar telas ainda com interface/tema antigo e remover da ÃƒÂ¡rea do advogado o incentivo/ÃƒÂ­cone de iniciar triagem, jÃƒÂ¡ que advogados devem atender demandas dos clientes, nÃƒÂ£o contar seus prÃƒÂ³prios problemas.

AlteraÃƒÂ§ÃƒÂµes implementadas nesta rodada:

- `PageNavigation` passou a usar tema claro como padrÃƒÂ£o, com botÃƒÂµes `Voltar`, `InÃƒÂ­cio` e `Painel/Dashboard` mais contrastados em telas claras e escuras.
- Menu lateral do operador jurÃƒÂ­dico removeu o atalho de `Triagem`; a triagem permanece disponÃƒÂ­vel para cidadÃƒÂ£o.
- `UserMenu` do advogado/admin trocou o CTA de `IA JurÃƒÂ­dica` para `Oportunidades`, apontando para `/marketplace`.
- Busca global do advogado/admin deixou de sugerir `Triagem IA`; busca do cidadÃƒÂ£o continua permitindo `Triagem do caso`.
- Agenda, Processos, ConfiguraÃƒÂ§ÃƒÂµes, Financeiro e RelatÃƒÂ³rios foram atualizados para o padrÃƒÂ£o claro/dark mais limpo: cartÃƒÂµes claros, bordas discretas, textos legÃƒÂ­veis e CTA teal em vez de ÃƒÂ¢mbar forte.
- ConfiguraÃƒÂ§ÃƒÂµes preserva o atalho de triagem apenas para cidadÃƒÂ£o; para advogado/admin o atalho aponta para operaÃƒÂ§ÃƒÂ£o/financeiro/crÃƒÂ©ditos/OAB.
- Ajustes pontuais de contraste em mensagens, estados vazios, cards de status e botÃƒÂµes de aÃƒÂ§ÃƒÂ£o.
- CorreÃƒÂ§ÃƒÂµes de encoding UTF-8 e remoÃƒÂ§ÃƒÂ£o de resÃƒÂ­duos mojibake nos arquivos tocados nesta rodada.

ValidaÃƒÂ§ÃƒÂµes realizadas nesta rodada:

```bash
rg "ÃƒÆ’|Ãƒâ€š|dark:text-white dark:text-slate|text-slate-950 dark:text-slate-950|dark:bg-white dark:bg|text-slate-950 dark:text-white dark:text|dark:hover:bg-slate-100|Triagem IA|IA JurÃƒÂ­dica" src\features src\components -g "*.tsx"
npm run lint
npm run build
```

Resultado:

- Busca de resÃƒÂ­duos: sem ocorrÃƒÂªncias nos arquivos TSX de `src/features` e `src/components`.
- `npm run lint`: aprovado sem erros; permanecem apenas 2 warnings jÃƒÂ¡ conhecidos de `<img>` em `PublicLawyerProfileWorkspace.tsx` e `SettingsWorkspace.tsx`.
- `npm run build`: aprovado; Next.js compilou e gerou 19 rotas, incluindo `/marketplace`, `/financeiro`, `/relatorios`, `/configuracoes`, `/agenda`, `/processos` e `/advogados/[userId]`.

Arquivos principais alterados:

- `src/components/navigation/PageNavigation.tsx`
- `src/components/layout/UserMenu.tsx`
- `src/components/layout/SearchBar.tsx`
- `src/features/navigation/hooks/useSidebarNavigation.ts`
- `src/features/agenda/components/AgendaWorkspace.tsx`
- `src/features/processes/components/ProcessesWorkspace.tsx`
- `src/features/settings/components/SettingsWorkspace.tsx`
- `src/features/finance/components/FinanceWorkspace.tsx`
- `src/features/reports/components/ReportsWorkspace.tsx`
- `src/features/dashboard/components/DashboardWorkspace.tsx`
- `src/features/marketplace/components/MarketplaceWorkspace.tsx`

PrÃƒÂ³xima etapa recomendada:

1. Fazer teste visual logado como advogado em `/marketplace`, `/financeiro`, `/relatorios`, `/agenda`, `/processos` e `/configuracoes`.
2. Se aprovado visualmente, seguir para o prÃƒÂ³ximo bloco de polimento: CRM/clientes, documentos e estados vazios do portal cidadÃƒÂ£o.
3. Futuramente substituir os dois `<img>` por `next/image` para zerar warnings de lint.
## AtualizaÃ§Ã£o 2026-07-19 â€” Polimento visual de CRM e Documentos

SolicitaÃ§Ã£o do usuÃ¡rio: prosseguir com as prÃ³ximas etapas do projeto, mantendo a linha de conclusÃ£o real e corrigindo telas que ainda preservavam interface/tema antigo.

AlteraÃ§Ãµes implementadas nesta rodada:

- CRM/clientes adaptado ao padrÃ£o claro/dark do AppShell:
  - `ClientsWorkspace`
  - `ClientListPanel`
  - `ClientDetailsPanel`
  - `ClientCreateDrawer`
  - `ClientQuickActions`
  - `ClientCard`
  - `ClientPremiumHeader`
- Documentos adaptado ao padrÃ£o claro/dark, tanto para advogado/admin quanto para cidadÃ£o:
  - cards claros com fallback dark;
  - inputs claros com foco teal;
  - botÃµes primÃ¡rios em teal;
  - estados vazios com fundo claro;
  - upload seguro e lista privada do cidadÃ£o com contraste revisado.
- CorreÃ§Ã£o de textos mojibake/UTF-8 em CRM e Documentos, incluindo labels como `dossiÃª`, `jurÃ­dico`, `observaÃ§Ã£o`, `cidadÃ£o`, `notificaÃ§Ãµes`, `temporÃ¡rio`, `vÃ­nculo`, `conversÃµes`, `PrÃ³ximo passo`, `TÃ­tulo`, `MÃ©dia`, `CrÃ­tica`, etc.
- RemoÃ§Ã£o de resÃ­duos visuais fortes do padrÃ£o antigo escuro/Ã¢mbar nesses mÃ³dulos.

ValidaÃ§Ãµes realizadas nesta rodada:

```bash
rg 'Ãƒ|Ã‚|Ã…|Ã†|dark:text-white dark:text-slate|text-slate-950 dark:text-slate-950|dark:bg-white dark:bg|dark:bg-slate-50 dark:bg|dark:border-slate|dark:text-slate-950 dark:text-white|file:bg.*dark:bg' src\features\clients src\features\documents -g '*.tsx'
npm run lint
npm run build
git diff --check
```

Resultado:

- Busca de resÃ­duos: sem ocorrÃªncias em CRM/Documentos.
- `npm run lint`: aprovado sem erros; permanecem apenas os 2 warnings conhecidos de `<img>` em perfil pÃºblico/configuraÃ§Ãµes.
- `npm run build`: aprovado; Next.js compilou e gerou 19 rotas.
- `git diff --check`: aprovado.

PrÃ³xima etapa recomendada:

1. Teste visual logado em `/clientes` e `/documentos` nos perfis advogado/admin e cidadÃ£o.
2. Depois disso, revisar pÃ¡ginas pÃºblicas/Home/Triagem para garantir consistÃªncia visual completa antes do go-live final.
## Atualização 2026-07-19 — Consistência final de Home, Triagem e páginas legais

Solicitação do usuário: prosseguir rumo à conclusão, revisando telas que ainda preservavam tema antigo e botões/cores com contraste ruim.

Alterações implementadas nesta rodada:

- Home pública suavizada para substituir CTAs/selos âmbar por teal, mantendo o azul institucional apenas como base de marca.
- Triagem revisada:
  - textos mojibake corrigidos (`Voltar`, `Portal do cidadão`, `Início`, `Triagem Jurídica`, `dossiê`, `publicação`, `créditos`, etc.);
  - foco dos campos alterado de âmbar para teal;
  - checkboxes/accent e seleção de documentos alterados para teal;
  - botões principais e publicação do Marketplace revisados para melhor contraste;
  - caixas informativas âmbar trocadas por teal suave.
- Páginas legais revisadas:
  - textos mojibake corrigidos (`Documentos públicos`, `Última atualização`, `Contato e solicitações`, etc.);
  - selo/alerta jurídico trocado de âmbar para teal suave.

Validações realizadas nesta rodada:

```bash
rg "Ã|Â|Å|Æ|â†|â€œ|â€|#C9A227|bg-amber|text-amber|border-amber|focus:border-\[#C9A227\]|Triagem IA|IA Jurídica" src\features\home src\features\triage src\features\legal -g "*.tsx"
npm run lint
npm run build
git diff --check
```

Resultado:

- Busca de resíduos: sem ocorrências em Home/Triagem/Legal.
- `npm run lint`: aprovado sem erros; permanecem apenas os 2 warnings conhecidos de `<img>`.
- `npm run build`: aprovado; 19 rotas geradas.
- `git diff --check`: aprovado.

Próxima etapa recomendada:

1. Teste visual final no navegador em `/`, `/triagem`, `/privacidade`, `/termos` e `/regras-marketplace`.
2. Se visualmente aprovado, executar uma rodada final de `npm run validate` e preparar checkpoint final de go-live/teste online.
## Atualização 2026-07-20 — Validação final e correção de Configurações

Solicitação do usuário: prosseguir com a revisão das telas, manter o padrão visual claro/dark, garantir que advogados não recebam atalhos indevidos de triagem e atualizar o checkpoint a cada novo teste.

O que foi verificado nesta rodada:

- Status Git inicial limpo na branch `ui-v6-premium`, exceto logs temporários criados pelo servidor de teste local.
- Servidor local iniciado em `http://localhost:3000` para teste visual.
- Teste visual no navegador em:
  - `/`
  - `/triagem`
  - `/privacidade`
  - `/termos`
  - `/regras-marketplace`
- Confirmação de que a rota `/triagem` renderiza `TriageWorkspace` corretamente.
- Confirmação de que o texto “Portal do cidadão” visto na triagem é parte do cabeçalho/atalho da própria tela, não uma troca indevida pela dashboard.
- Encerramento do servidor dev aberto durante o teste e remoção dos logs temporários `.codex-dev-server.log` e `.codex-dev-server.err.log`.

Correção implementada nesta rodada:

- Correção de textos mojibake reais em `src/features/settings/components/SettingsWorkspace.tsx`, incluindo:
  - `Configurações`
  - `Conta, privacidade e operação`
  - `Perfil público do advogado`
  - `Foto e apresentação para clientes`
  - `Dados e preferências`
  - `Notificações por e-mail`
  - `Exclusão da conta`
  - `Proteção de dados`
  - `Segurança da sessão`
  - `Créditos/OAB`
  - marcador visual `✓` no checklist.

Validações realizadas:

```bash
rg "Ã|�|â€|â†|âœ" src\features\triage src\features\settings -g "*.tsx" -g "*.ts"
npm run validate
```

Resultado:

- Busca precisa de mojibake em Triagem/Configurações: sem ocorrências após a correção.
- `npm run validate`: aprovado.
  - `preflight:preview`: aprovado; 34 migrations conferidas; migration mais recente `20260716100000_grant_lawyer_public_profiles_access.sql`.
  - `npm run lint`: aprovado com 0 erros e 2 warnings conhecidos de `<img>` em perfil público/configurações.
  - `npm run build`: aprovado; 19 rotas geradas.

Andamento atualizado estimado:

- Plataforma funcional em desenvolvimento: ~86%.
- Núcleo marketplace/triagem/CRM/documentos/configurações/autenticação: implementado e validado em build.
- Restante para chegar a 100%: testes manuais completos com contas reais nos três perfis, revisão fina de responsividade/mobile em todo o fluxo, testes Supabase em produção/preview, fluxo real de créditos/pagamento, endurecimento final de políticas/RLS e deploy final em ambiente online.

Próxima etapa recomendada:

1. Testar login real de cidadão, advogado e admin no ambiente local/preview.
2. Confirmar visual da página inicial do advogado com oportunidades qualificadas como primeira tela pós-login.
3. Testar envio de triagem, publicação mascarada, visualização pelo advogado, desbloqueio com créditos e abertura dos dados privados.
4. Depois disso, preparar checklist de go-live e deploy para teste online.

## Atualização 2026-07-20 — Remoção dos warnings finais de imagem e ajuste do perfil público

Solicitação do usuário: prosseguir com as etapas restantes, mantendo a ConectaJus alinhada visualmente ao padrão novo e atualizando o checkpoint a cada teste realizado.

Alterações implementadas nesta rodada:

- Substituição das tags `<img>` por `next/image` em:
  - `src/features/lawyers/components/PublicLawyerProfileWorkspace.tsx`
  - `src/features/settings/components/SettingsWorkspace.tsx`
- Inclusão de `images.remotePatterns` em `next.config.ts` para aceitar imagens públicas do Supabase Storage (`*.supabase.co/storage/v1/object/public/**`).
- Remoção de resíduos visuais âmbar no perfil público do advogado, trocando por teal institucional:
  - selo “Perfil público”;
  - botão “Iniciar triagem”;
  - selo “Advogado ConectaJus”;
  - borda/anel da foto;
  - badge OAB;
  - título “Apresentação”.
- Ajuste de feedback visual em Configurações:
  - mensagens passaram de âmbar para teal suave;
  - checklist pendente trocado de âmbar para teal.

Validações realizadas:

```bash
rg "#C9A227|bg-amber|text-amber|border-amber|<img|Ã|�|â€|â†|âœ" src\features\lawyers src\features\settings -g "*.tsx"
npm run lint
npm run validate
```

Resultado:

- Busca de resíduos em Advogados/Configurações: sem ocorrências relevantes.
- `npm run lint`: aprovado com 0 erros e 0 warnings.
- `npm run validate`: aprovado.
  - `preflight:preview`: aprovado; 34 migrations conferidas.
  - `lint`: limpo.
  - `build`: aprovado; 19 rotas geradas.

Andamento atualizado estimado:

- Plataforma funcional em desenvolvimento: ~87%.
- Ganho desta rodada: remoção de warnings técnicos finais e limpeza visual do perfil público do advogado.
- Próximo foco recomendado: teste manual completo com contas reais de cidadão, advogado e admin, especialmente o pós-login do advogado abrindo diretamente oportunidades qualificadas.

## Atualização 2026-07-20 — Correção do botão Voltar pós-login

Solicitação do usuário: no painel do advogado, ao clicar em Voltar, o sistema estava retornando para `/login` e pedindo e-mail/senha novamente. Verificar e prosseguir com a próxima etapa.

Causa encontrada:

- O botão Voltar usava `window.history.back()` diretamente.
- Após login, o histórico anterior do navegador pode ser `/login` ou `/cadastro`, então o botão levava o usuário de volta para a autenticação.
- Isso afetava especialmente páginas do painel do advogado que usam a navegação comum `PageNavigation`.

Correção implementada:

- Criado utilitário `src/lib/navigation.ts` com `navigateBackSafely(fallbackHref)`.
- A navegação segura verifica:
  - se existe referrer da mesma origem;
  - se o referrer é `/login` ou `/cadastro`;
  - se o histórico está vazio/insuficiente.
- Quando o histórico não é seguro, o usuário é enviado para o fallback do painel, em vez de voltar para login.
- Substituídos os usos diretos de `window.history.back()` em:
  - `src/components/navigation/PageNavigation.tsx`
  - `src/features/dashboard/components/DashboardWorkspace.tsx`
  - `src/features/triage/components/TriageWorkspace.tsx`

Validações realizadas:

```bash
rg "window.history.back|router.back\(" src\app src\features src\components -g "*.tsx" -g "*.ts"
rg "Ã|�|â€|â†|âœ|#C9A227|<img" src\features\marketplace src\features\dashboard src\components\navigation -g "*.tsx" -g "*.ts"
npm run validate
```

Resultado:

- Nenhum `window.history.back()`/`router.back()` inseguro restante.
- Nenhum resíduo relevante de mojibake/tema antigo encontrado na navegação e no painel do advogado pela busca precisa.
- `npm run validate`: aprovado.
  - `preflight:preview`: aprovado; 34 migrations conferidas.
  - `lint`: 0 erros e 0 warnings.
  - `build`: aprovado; 19 rotas geradas.

Andamento atualizado estimado:

- Plataforma funcional em desenvolvimento: ~88%.
- Próximo foco recomendado: teste manual real com login de advogado para confirmar o fluxo pós-login em `/marketplace`, incluindo botão Voltar, botão Início e acesso ao painel sem retorno indevido para `/login`.

## Atualização 2026-07-20 — Go-live check e alinhamento documental

Solicitação do usuário: prosseguir com as etapas de conclusão do projeto.

Etapa executada:

- Rodado `npm run go-live:check`, que executa:
  - `npm run supabase:bundle`;
  - `npm run validate`;
  - `preflight:preview`;
  - `lint`;
  - `build`.

Resultado do go-live check:

- Bundle Supabase gerado com sucesso.
- Migrations incluídas: 34.
- Arquivo consolidado: `supabase/APPLY_ALL_MIGRATIONS.sql`.
- `preflight:preview`: aprovado.
- Migration mais recente conferida: `20260716100000_grant_lawyer_public_profiles_access.sql`.
- `lint`: 0 erros e 0 warnings.
- `build`: aprovado.
- Rotas geradas: 19.

Ajustes documentais feitos nesta rodada:

- `docs/PREVIEW_READINESS.md` atualizado para 2026-07-20, 19 rotas e go-live check aprovado com 34 migrations.
- `docs/CHECKLIST_DEPLOY.md` atualizado com:
  - rota dinâmica `/advogados/[userId]`;
  - rotas legais `/privacidade`, `/termos`, `/regras-marketplace`;
  - migration mais recente `20260716100000_grant_lawyer_public_profiles_access.sql`;
  - percentual executivo atual ajustado para 88%.
- `docs/PROJECT_COMPLETION_STATUS.md` atualizado para refletir o estado real atual:
  - 88% de conclusão estimada;
  - 34 migrations;
  - 19 rotas;
  - dependência explícita de teste real com cidadão, advogado e admin no ambiente alvo.

Validações documentais:

```bash
rg "99,7|26 migrations|16 rotas|20260713130000|Status atual estimado: 98|Supabase real j|preview Vercel pronto|smoke test online|1/3|100% \\| Preview|100% \\| Bundle|status = ok|count = 100" docs\PREVIEW_READINESS.md docs\CHECKLIST_DEPLOY.md docs\PROJECT_COMPLETION_STATUS.md
git diff --check
```

Resultado:

- Sem dados antigos críticos nos documentos principais.
- `git diff --check`: aprovado.

Próxima etapa recomendada:

1. Abrir/validar o preview online atual da branch `ui-v6-premium`.
2. Testar login real com as contas finais de cidadão, advogado e admin.
3. Corrigir somente falhas encontradas no teste real.
4. Depois disso, decidir limpeza de legados e promoção para produção.
