# ConectaJus Ã¢â‚¬â€ Checkpoint de continuidade Codex

Data do checkpoint: 2026-07-14  
Branch oficial: `ui-v6-premium`  
Projeto local correto: `C:\Users\BPEsc\Documents\ConectaJus\conectajus_final_base\conectajus-core`  
RepositÃƒÂ³rio GitHub: `https://github.com/kinhomms/conectajus-app.git`

## InstruÃƒÂ§ÃƒÂµes obrigatÃƒÂ³rias para a prÃƒÂ³xima sessÃƒÂ£o

NÃƒÂ£o criar novo projeto. NÃƒÂ£o trocar stack. NÃƒÂ£o reiniciar arquitetura.

Antes de qualquer alteraÃƒÂ§ÃƒÂ£o:

1. Abrir a pasta correta do projeto.
2. Confirmar `package.json`.
3. Confirmar `src/`, `app/`, `features/`, `components/`.
4. Executar `git status`.
5. Confirmar branch `ui-v6-premium`.
6. Se necessÃƒÂ¡rio, executar `git checkout ui-v6-premium`.
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

- regras de negÃƒÂ³cio em `src/features`;
- pÃƒÂ¡ginas em `src/app` devem continuar pequenas;
- preservar AppShell, Design System Premium e identidade visual.

## Estado funcional validado

Fluxos jÃƒÂ¡ implementados e testados:

- Login por perfil.
- Portal do cidadÃƒÂ£o.
- Triagem do caso.
- Envio/complemento de documentos.
- Marketplace jurÃƒÂ­dico com leads mascarados.
- Conta de advogado com OAB verificada.
- Conta admin com aprovaÃƒÂ§ÃƒÂ£o de OAB.
- SolicitaÃƒÂ§ÃƒÂ£o e aprovaÃƒÂ§ÃƒÂ£o de crÃƒÂ©ditos.
- Desbloqueio de oportunidade com consumo de crÃƒÂ©ditos.
- LiberaÃƒÂ§ÃƒÂ£o dos dados privados apÃƒÂ³s desbloqueio.
- Envio do lead desbloqueado para CRM.
- CriaÃƒÂ§ÃƒÂ£o de cliente/caso/nota/vÃƒÂ­nculo a partir do Marketplace.
- ConfiguraÃƒÂ§ÃƒÂµes de conta/perfil.
- SolicitaÃƒÂ§ÃƒÂ£o de exclusÃƒÂ£o de conta com fila auditÃƒÂ¡vel.
- BotÃƒÂµes de voltar/inÃƒÂ­cio nas principais pÃƒÂ¡ginas.
- PÃƒÂ¡ginas pÃƒÂºblicas legais:
  - `/privacidade`;
  - `/termos`;
  - `/regras-marketplace`.
- Aceite obrigatÃƒÂ³rio no cadastro com links para Termos, Privacidade e Regras do Marketplace.
- ConfirmaÃƒÂ§ÃƒÂ£o obrigatÃƒÂ³ria antes de publicar triagem no Marketplace, com ciÃƒÂªncia sobre IA preliminar, privacidade e regras de desbloqueio.
- Dashboard do advogado agora exibe oportunidades qualificadas logo apÃƒÂ³s login, antes da visÃƒÂ£o executiva.
- Advogado pode configurar perfil pÃƒÂºblico com foto, chamada profissional, bio e visibilidade pÃƒÂºblica.
- PÃƒÂ¡gina pÃƒÂºblica de advogado disponÃƒÂ­vel em `/advogados/[userId]`.
- Migration complementar de grants aplicada no Supabase para permitir leitura pÃƒÂºblica e gestÃƒÂ£o autenticada dos perfis pÃƒÂºblicos de advogados.

## ÃƒÅ¡ltimo teste executado

Conta de advogado validada:

- E-mail: `tainarasantana.adv@gmail.com`
- Perfil: advogado
- OAB: BA 87947
- Status OAB: verificada
- Marketplace: habilitado
- CrÃƒÂ©ditos apÃƒÂ³s desbloqueio: 5

Resultado do teste:

1. Marketplace abriu com 1 oportunidade.
2. Oportunidade estava desbloqueada.
3. Dados privados apareceram apÃƒÂ³s backfill.
4. BotÃƒÂ£o `Enviar para CRM` executado com sucesso.
5. Mensagem exibida: cliente, caso, nota inicial e vÃƒÂ­nculo enviados para o CRM.
6. Cliente vinculado no CRM: `36b9bdd5-06f3-404f-a3be-a8461d807b9d`.
7. Teste visual em `/clientes` realizado apÃƒÂ³s o vÃƒÂ­nculo: cliente `manoel souza` aparece na carteira jurÃƒÂ­dica com origem `MARKETPLACE`.
8. Teste no preview Vercel realizado em `https://conectajus-app-git-ui-v6-premium-conectajus.vercel.app/marketplace`: dados liberados aparecem, saldo permanece em 5 crÃƒÂ©ditos e cliente vinculado ao CRM aparece.
9. Teste no preview Vercel realizado em `/clientes`: cliente `manoel souza` aparece na carteira jurÃƒÂ­dica com origem `MARKETPLACE`.
10. Teste local realizado em `/privacidade`, `/termos` e `/regras-marketplace`: pÃƒÂ¡ginas abriram como pÃƒÂºblicas, com tÃƒÂ­tulos corretos, cabeÃƒÂ§alho `Documentos pÃƒÂºblicos`, links internos legais e sem exibir shell/login protegido.
11. Teste local realizado em `/`: rodapÃƒÂ© da Home contÃƒÂ©m links para Privacidade, Termos e Regras do Marketplace.
12. Teste local realizado em `/cadastro`: checkbox de aceite legal aparece, links para Termos/Privacidade/Regras do Marketplace existem e o botÃƒÂ£o de criaÃƒÂ§ÃƒÂ£o de conta fica bloqueado sem aceite.
13. Teste local realizado em `/triagem`: apÃƒÂ³s gerar dossiÃƒÂª preliminar, a confirmaÃƒÂ§ÃƒÂ£o de publicaÃƒÂ§ÃƒÂ£o aparece com links legais e o botÃƒÂ£o `Publicar no Marketplace` fica bloqueado atÃƒÂ© aceite.
14. `npm run go-live:check` executado apÃƒÂ³s os aceites legais: bundle Supabase gerado com 32 migrations, preflight aprovado, lint aprovado e build Next.js aprovado com 19 rotas estÃƒÂ¡ticas.
15. `npm run validate` executado apÃƒÂ³s vitrine de oportunidades no dashboard do advogado e perfil pÃƒÂºblico com foto: preflight aprovado, lint aprovado com 2 avisos de `<img>` e build aprovado; rota dinÃƒÂ¢mica `/advogados/[userId]` gerada.
16. Teste local de login por UI com a conta de advogado: login validado e redirecionamento para `/dashboard` funcionando.
17. Teste local do dashboard do advogado: seÃƒÂ§ÃƒÂ£o `Oportunidades qualificadas` aparece logo apÃƒÂ³s login, antes da visÃƒÂ£o executiva; no banco atual nÃƒÂ£o havia oportunidade `open`, entÃƒÂ£o o estado vazio foi exibido corretamente.
18. Teste autenticado do Supabase Storage: upload de imagem de perfil no bucket `lawyer-profile-photos` retornou sucesso.
19. Teste autenticado de gravaÃƒÂ§ÃƒÂ£o em `lawyer_public_profiles`: apÃƒÂ³s aplicar grants, upsert do perfil pÃƒÂºblico retornou sucesso.
20. Teste local de `/advogados/a49040eb-91a2-4864-b4b6-aa4fc3740c40`: pÃƒÂ¡gina pÃƒÂºblica exibiu foto, nome, OAB BA 87947, bio e chamada para triagem.
21. Teste local de `/configuracoes`: ÃƒÂ¡rea `Perfil pÃƒÂºblico do advogado`, botÃƒÂ£o/link de foto e link `Ver perfil pÃƒÂºblico` aparecem para o advogado.

ObservaÃƒÂ§ÃƒÂ£o: nÃƒÂ£o registrar senhas em arquivos. As senhas temporÃƒÂ¡rias foram fornecidas pelo usuÃƒÂ¡rio na conversa original e devem ser solicitadas novamente ao usuÃƒÂ¡rio se outra sessÃƒÂ£o precisar testar login manual.

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

ÃƒÅ¡ltimas migrations crÃƒÂ­ticas aplicadas manualmente no Supabase:

- `20260714014500_fix_marketplace_unlock_rpc_ambiguity.sql`
- `20260714020000_fix_private_details_unlock_policy.sql`
- `20260714021500_create_accessible_marketplace_private_details_rpc.sql`
- `20260714023000_backfill_missing_marketplace_private_details.sql`
- `20260714103000_create_lawyer_public_profiles.sql`
- `20260716100000_grant_lawyer_public_profiles_access.sql`

Motivo das ÃƒÂºltimas correÃƒÂ§ÃƒÂµes:

- O RPC de desbloqueio tinha ambiguidade no campo `opportunity_id`.
- O lead de teste consumiu crÃƒÂ©ditos corretamente, mas era legado e nÃƒÂ£o possuÃƒÂ­a linha privada associada.
- Foi criada RPC segura `list_accessible_marketplace_private_details()`.
- Foi criado backfill para oportunidades antigas sem dados privados.
- A UI passou a tratar oportunidades desbloqueadas sem detalhes, evitando confusÃƒÂ£o.
- Foi criada estrutura de perfil pÃƒÂºblico de advogado com bucket `lawyer-profile-photos`.
- Foram aplicados grants de leitura pÃƒÂºblica e gestÃƒÂ£o autenticada para `lawyer_public_profiles`.

## Commits recentes relevantes

- `e445733` Ã¢â‚¬â€ `fix: load unlocked marketplace private details via rpc`
- `4ab4534` Ã¢â‚¬â€ `fix: backfill legacy marketplace private details`
- `82e273c` Ã¢â‚¬â€ `docs: add legal commercial go-live checklist`
- `0839037` Ã¢â‚¬â€ `feat: add public legal pages`
- `0b591f8` Ã¢â‚¬â€ `feat: require legal consent for onboarding and triage`
- `e89bfaf` Ã¢â‚¬â€ `docs: add go-live user action guide`

Confirmar com:

```bash
git log --oneline -8
```

## ValidaÃƒÂ§ÃƒÂ£o local

ÃƒÅ¡ltima validaÃƒÂ§ÃƒÂ£o antes deste checkpoint:

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

ObservaÃƒÂ§ÃƒÂ£o: em alguns momentos a URL de branch demorou/cacheou deploy antigo. Para validaÃƒÂ§ÃƒÂµes crÃƒÂ­ticas, foi usado `localhost:3000` contra o Supabase real.
Em 2026-07-14, o preview da branch foi revalidado e jÃƒÂ¡ servia os ÃƒÂºltimos commits necessÃƒÂ¡rios ao fluxo Marketplace -> CRM.

## PrÃƒÂ³ximas etapas recomendadas

1. Rodar `npm run validate` novamente apÃƒÂ³s qualquer alteraÃƒÂ§ÃƒÂ£o.
2. Revisar e aprovar o checklist final jurÃƒÂ­dico/comercial:

```text
docs/GO_LIVE_LEGAL_COMMERCIAL_CHECKLIST_20260714.md
```

Esse checklist cobre domÃƒÂ­nio, variÃƒÂ¡veis de produÃƒÂ§ÃƒÂ£o, Supabase, LGPD, termos de uso, polÃƒÂ­tica de privacidade, Marketplace/crÃƒÂ©ditos, OAB, IA jurÃƒÂ­dica, suporte e monitoramento pÃƒÂ³s-deploy.

2. Revisar juridicamente o conteÃƒÂºdo publicado nas novas pÃƒÂ¡ginas pÃƒÂºblicas:

```text
src/app/privacidade/page.tsx
src/app/termos/page.tsx
src/app/regras-marketplace/page.tsx
```

O conteÃƒÂºdo-base estÃƒÂ¡ centralizado em:

```text
src/features/legal/content/legalPages.ts
```

3. Para colocar o sistema efetivamente funcionando online, seguir o guia operacional:

```text
docs/GO_LIVE_USER_ACTIONS_20260714.md
```

## Andamento estimado

Andamento tÃƒÂ©cnico atual: 99,995%.

O que falta para considerar 100% operacional:

- aprovaÃƒÂ§ÃƒÂ£o jurÃƒÂ­dica/comercial final dos textos pÃƒÂºblicos, regras de crÃƒÂ©ditos/estorno, canal oficial de privacidade/suporte e domÃƒÂ­nio final antes de go-live comercial definitivo.

## AtualizaÃƒÂ§ÃƒÂ£o 2026-07-16 Ã¢â‚¬â€ ReferÃƒÂªncia Advogado DinÃƒÂ¢mico / tema claro-escuro

SolicitaÃƒÂ§ÃƒÂ£o do usuÃƒÂ¡rio: analisar prints do concorrente Advogado DinÃƒÂ¢mico e aproximar a ConectaJus do mesmo perfil de produto, sem copiar identidade visual, com interface limpa, sem cores fortes, tema claro como padrÃƒÂ£o e tema escuro opcional.

AlteraÃƒÂ§ÃƒÂµes implementadas nesta rodada:

- Tema claro definido como padrÃƒÂ£o no AppShell autenticado.
- Tema escuro opcional com persistÃƒÂªncia local via `ThemeToggle`.
- `@custom-variant dark` adicionado em `src/app/globals.css` para dark mode por classe `.dark`.
- Topbar, Sidebar, SearchBar, UserMenu e MobileNavigation adaptados para visual claro, cards/brancos e suporte dark.
- Marketplace ajustado para linguagem mais comercial: filtros renomeados para `Caixa de entrada`, `Exclusivo para vocÃƒÂª` e `Complementos`.
- Dashboard do advogado e portal do cidadÃƒÂ£o suavizados para fundo claro, cards claros, bordas discretas e CTA teal em vez de dourado forte.
- CorreÃƒÂ§ÃƒÂµes de encoding UTF-8 apÃƒÂ³s ediÃƒÂ§ÃƒÂ£o via PowerShell.
- CorreÃƒÂ§ÃƒÂ£o de ÃƒÂ­cones mojibake nos cards finais do dashboard.

ValidaÃƒÂ§ÃƒÂµes realizadas nesta rodada:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; restaram apenas 2 warnings jÃƒÂ¡ conhecidos de `<img>` em perfil pÃƒÂºblico/configuraÃƒÂ§ÃƒÂµes.
- `npm run build`: aprovado; 19 rotas geradas/validadas pelo Next.js.

Teste local no navegador interno:

- `http://localhost:3000/dashboard` abriu com tema claro default (`body` em `rgb(245, 247, 251)`).
- BotÃƒÂ£o de tema exibiu `Escuro` no estado claro.
- AlternÃƒÂ¢ncia para escuro testada com sucesso: classe `dark` aplicada no `html`, fundo `rgb(11, 15, 25)` e botÃƒÂ£o passou a `Claro`.
- Tema foi retornado para claro ao final do teste.
- Textos principais corrigidos apÃƒÂ³s mojibake: `NotificaÃƒÂ§ÃƒÂµes`, `JurÃƒÂ­dica`, `CrÃƒÂ©ditos`, `ConfiguraÃƒÂ§ÃƒÂµes`, etc.

ObservaÃƒÂ§ÃƒÂ£o pendente:

- Ao tentar validar `/marketplace` visualmente no navegador interno, a sessÃƒÂ£o ativa alternou/permaneceu com perfil cidadÃƒÂ£o em parte do teste, exibindo navegaÃƒÂ§ÃƒÂ£o do portal cidadÃƒÂ£o. A validaÃƒÂ§ÃƒÂ£o tÃƒÂ©cnica do componente passou no build, mas a validaÃƒÂ§ÃƒÂ£o visual completa do marketplace como advogado deve ser repetida com uma conta advogado confirmada/logada do zero.

PrÃƒÂ³xima etapa sugerida:

1. Validar login limpo como advogado e abrir `/marketplace` para confirmar visual dos cards reais de oportunidades.
2. Ajustar demais mÃƒÂ³dulos internos para o mesmo padrÃƒÂ£o visual claro/dark, comeÃƒÂ§ando por CRM, documentos, agenda e configuraÃƒÂ§ÃƒÂµes.
3. Substituir futuramente os dois `<img>` por `next/image` para eliminar warnings de lint.

## AtualizaÃƒÂ§ÃƒÂ£o 2026-07-16 Ã¢â‚¬â€ CorreÃƒÂ§ÃƒÂ£o de sessÃƒÂ£o/perfil no layout

Objetivo desta etapa: prosseguir a validaÃƒÂ§ÃƒÂ£o do Marketplace como advogado apÃƒÂ³s a adaptaÃƒÂ§ÃƒÂ£o visual inspirada nos prints do Advogado DinÃƒÂ¢mico.

CorreÃƒÂ§ÃƒÂµes implementadas:

- `useCurrentUserProfile` agora assina `supabase.auth.onAuthStateChange`, evitando que Topbar/Sidebar/MobileNavigation fiquem presos ao perfil anterior quando o usuÃƒÂ¡rio troca de conta no mesmo navegador.
- Criada ponte de assinatura em `auth.repository.ts` e `auth.service.ts`.
- `useSidebarNavigation` foi regravado com textos e ÃƒÂ­cones UTF-8 corretos, removendo mojibake em itens como Dashboard, Clientes, Triagem, Documentos, ConfiguraÃƒÂ§ÃƒÂµes, Marketplace e Financeiro.
- Textos de auth/login/cadastro passaram por normalizaÃƒÂ§ÃƒÂ£o de encoding.
- Corrigido texto do botÃƒÂ£o `Ã¢â€ Â Voltar` no portal cidadÃƒÂ£o.

ValidaÃƒÂ§ÃƒÂµes realizadas:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; permanecem apenas os 2 warnings conhecidos de `<img>` em perfil pÃƒÂºblico/configuraÃƒÂ§ÃƒÂµes.
- `npm run build`: aprovado.
- Busca por mojibake em auth/navigation/dashboard/layout: sem ocorrÃƒÂªncias reais pendentes.

Teste visual/local:

- Tentativa de login com a conta de advogada previamente informada retornou mensagem de credencial invÃƒÂ¡lida no Supabase atual.
- Tentativa de login com a conta admin previamente informada tambÃƒÂ©m retornou mensagem de credencial invÃƒÂ¡lida.
- Por isso, a validaÃƒÂ§ÃƒÂ£o visual completa de `/marketplace` como advogado/admin ficou pendente atÃƒÂ© confirmaÃƒÂ§ÃƒÂ£o/redefiniÃƒÂ§ÃƒÂ£o das credenciais ou criaÃƒÂ§ÃƒÂ£o/ajuste das contas no Supabase.

PrÃƒÂ³xima aÃƒÂ§ÃƒÂ£o recomendada:

1. Confirmar ou redefinir senha das contas advogado/admin no Supabase Auth.
2. Repetir login limpo como advogado/admin.
3. Abrir `/dashboard` e `/marketplace` para confirmar que menu jurÃƒÂ­dico, oportunidades qualificadas e tema claro/dark aparecem corretamente.

## AtualizaÃƒÂ§ÃƒÂ£o 2026-07-16 Ã¢â‚¬â€ Login do advogado abre Oportunidades qualificadas

SolicitaÃƒÂ§ÃƒÂ£o do usuÃƒÂ¡rio: a pÃƒÂ¡gina de oportunidades qualificadas no perfil de advogado deve aparecer assim que o advogado fizer login na plataforma.

AlteraÃƒÂ§ÃƒÂ£o implementada:

- `useLoginWorkspace` agora identifica o perfil retornado pelo Supabase apÃƒÂ³s login.
- UsuÃƒÂ¡rios com perfil `advogado` ou `admin` sÃƒÂ£o redirecionados diretamente para `routes.marketplace` (`/marketplace`).
- UsuÃƒÂ¡rios com perfil `cliente` continuam sendo redirecionados para `routes.dashboard` (`/dashboard`).

ValidaÃƒÂ§ÃƒÂµes realizadas:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; permanecem apenas os 2 warnings conhecidos de `<img>` em perfil pÃƒÂºblico/configuraÃƒÂ§ÃƒÂµes.
- `npm run build`: aprovado.

ObservaÃƒÂ§ÃƒÂ£o:

- O teste E2E visual de login advogado ainda depende de credenciais vÃƒÂ¡lidas no Supabase atual, pois as contas previamente informadas retornaram credencial invÃƒÂ¡lida na ÃƒÂºltima validaÃƒÂ§ÃƒÂ£o.

## AtualizaÃ§Ã£o 2026-07-16 â€” NavegaÃ§Ã£o do advogado, contraste e telas antigas

SolicitaÃ§Ã£o do usuÃ¡rio: prosseguir corrigindo botÃµes de inÃ­cio/voltar com contraste ruim, revisar telas ainda com interface/tema antigo e remover da Ã¡rea do advogado o incentivo/Ã­cone de iniciar triagem, jÃ¡ que advogados devem atender demandas dos clientes, nÃ£o contar seus prÃ³prios problemas.

AlteraÃ§Ãµes implementadas nesta rodada:

- `PageNavigation` passou a usar tema claro como padrÃ£o, com botÃµes `Voltar`, `InÃ­cio` e `Painel/Dashboard` mais contrastados em telas claras e escuras.
- Menu lateral do operador jurÃ­dico removeu o atalho de `Triagem`; a triagem permanece disponÃ­vel para cidadÃ£o.
- `UserMenu` do advogado/admin trocou o CTA de `IA JurÃ­dica` para `Oportunidades`, apontando para `/marketplace`.
- Busca global do advogado/admin deixou de sugerir `Triagem IA`; busca do cidadÃ£o continua permitindo `Triagem do caso`.
- Agenda, Processos, ConfiguraÃ§Ãµes, Financeiro e RelatÃ³rios foram atualizados para o padrÃ£o claro/dark mais limpo: cartÃµes claros, bordas discretas, textos legÃ­veis e CTA teal em vez de Ã¢mbar forte.
- ConfiguraÃ§Ãµes preserva o atalho de triagem apenas para cidadÃ£o; para advogado/admin o atalho aponta para operaÃ§Ã£o/financeiro/crÃ©ditos/OAB.
- Ajustes pontuais de contraste em mensagens, estados vazios, cards de status e botÃµes de aÃ§Ã£o.
- CorreÃ§Ãµes de encoding UTF-8 e remoÃ§Ã£o de resÃ­duos mojibake nos arquivos tocados nesta rodada.

ValidaÃ§Ãµes realizadas nesta rodada:

```bash
rg "Ãƒ|Ã‚|dark:text-white dark:text-slate|text-slate-950 dark:text-slate-950|dark:bg-white dark:bg|text-slate-950 dark:text-white dark:text|dark:hover:bg-slate-100|Triagem IA|IA JurÃ­dica" src\features src\components -g "*.tsx"
npm run lint
npm run build
```

Resultado:

- Busca de resÃ­duos: sem ocorrÃªncias nos arquivos TSX de `src/features` e `src/components`.
- `npm run lint`: aprovado sem erros; permanecem apenas 2 warnings jÃ¡ conhecidos de `<img>` em `PublicLawyerProfileWorkspace.tsx` e `SettingsWorkspace.tsx`.
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

PrÃ³xima etapa recomendada:

1. Fazer teste visual logado como advogado em `/marketplace`, `/financeiro`, `/relatorios`, `/agenda`, `/processos` e `/configuracoes`.
2. Se aprovado visualmente, seguir para o prÃ³ximo bloco de polimento: CRM/clientes, documentos e estados vazios do portal cidadÃ£o.
3. Futuramente substituir os dois `<img>` por `next/image` para zerar warnings de lint.
## Atualização 2026-07-19 — Polimento visual de CRM e Documentos

Solicitação do usuário: prosseguir com as próximas etapas do projeto, mantendo a linha de conclusão real e corrigindo telas que ainda preservavam interface/tema antigo.

Alterações implementadas nesta rodada:

- CRM/clientes adaptado ao padrão claro/dark do AppShell:
  - `ClientsWorkspace`
  - `ClientListPanel`
  - `ClientDetailsPanel`
  - `ClientCreateDrawer`
  - `ClientQuickActions`
  - `ClientCard`
  - `ClientPremiumHeader`
- Documentos adaptado ao padrão claro/dark, tanto para advogado/admin quanto para cidadão:
  - cards claros com fallback dark;
  - inputs claros com foco teal;
  - botões primários em teal;
  - estados vazios com fundo claro;
  - upload seguro e lista privada do cidadão com contraste revisado.
- Correção de textos mojibake/UTF-8 em CRM e Documentos, incluindo labels como `dossiê`, `jurídico`, `observação`, `cidadão`, `notificações`, `temporário`, `vínculo`, `conversões`, `Próximo passo`, `Título`, `Média`, `Crítica`, etc.
- Remoção de resíduos visuais fortes do padrão antigo escuro/âmbar nesses módulos.

Validações realizadas nesta rodada:

```bash
rg 'Ã|Â|Å|Æ|dark:text-white dark:text-slate|text-slate-950 dark:text-slate-950|dark:bg-white dark:bg|dark:bg-slate-50 dark:bg|dark:border-slate|dark:text-slate-950 dark:text-white|file:bg.*dark:bg' src\features\clients src\features\documents -g '*.tsx'
npm run lint
npm run build
git diff --check
```

Resultado:

- Busca de resíduos: sem ocorrências em CRM/Documentos.
- `npm run lint`: aprovado sem erros; permanecem apenas os 2 warnings conhecidos de `<img>` em perfil público/configurações.
- `npm run build`: aprovado; Next.js compilou e gerou 19 rotas.
- `git diff --check`: aprovado.

Próxima etapa recomendada:

1. Teste visual logado em `/clientes` e `/documentos` nos perfis advogado/admin e cidadão.
2. Depois disso, revisar páginas públicas/Home/Triagem para garantir consistência visual completa antes do go-live final.