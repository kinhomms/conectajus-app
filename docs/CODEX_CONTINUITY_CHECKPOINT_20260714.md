# ConectaJus â€” Checkpoint de continuidade Codex

Data do checkpoint: 2026-07-14  
Branch oficial: `ui-v6-premium`  
Projeto local correto: `C:\Users\BPEsc\Documents\ConectaJus\conectajus_final_base\conectajus-core`  
RepositÃ³rio GitHub: `https://github.com/kinhomms/conectajus-app.git`

## InstruÃ§Ãµes obrigatÃ³rias para a prÃ³xima sessÃ£o

NÃ£o criar novo projeto. NÃ£o trocar stack. NÃ£o reiniciar arquitetura.

Antes de qualquer alteraÃ§Ã£o:

1. Abrir a pasta correta do projeto.
2. Confirmar `package.json`.
3. Confirmar `src/`, `app/`, `features/`, `components/`.
4. Executar `git status`.
5. Confirmar branch `ui-v6-premium`.
6. Se necessÃ¡rio, executar `git checkout ui-v6-premium`.
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

- regras de negÃ³cio em `src/features`;
- pÃ¡ginas em `src/app` devem continuar pequenas;
- preservar AppShell, Design System Premium e identidade visual.

## Estado funcional validado

Fluxos jÃ¡ implementados e testados:

- Login por perfil.
- Portal do cidadÃ£o.
- Triagem do caso.
- Envio/complemento de documentos.
- Marketplace jurÃ­dico com leads mascarados.
- Conta de advogado com OAB verificada.
- Conta admin com aprovaÃ§Ã£o de OAB.
- SolicitaÃ§Ã£o e aprovaÃ§Ã£o de crÃ©ditos.
- Desbloqueio de oportunidade com consumo de crÃ©ditos.
- LiberaÃ§Ã£o dos dados privados apÃ³s desbloqueio.
- Envio do lead desbloqueado para CRM.
- CriaÃ§Ã£o de cliente/caso/nota/vÃ­nculo a partir do Marketplace.
- ConfiguraÃ§Ãµes de conta/perfil.
- SolicitaÃ§Ã£o de exclusÃ£o de conta com fila auditÃ¡vel.
- BotÃµes de voltar/inÃ­cio nas principais pÃ¡ginas.
- PÃ¡ginas pÃºblicas legais:
  - `/privacidade`;
  - `/termos`;
  - `/regras-marketplace`.
- Aceite obrigatÃ³rio no cadastro com links para Termos, Privacidade e Regras do Marketplace.
- ConfirmaÃ§Ã£o obrigatÃ³ria antes de publicar triagem no Marketplace, com ciÃªncia sobre IA preliminar, privacidade e regras de desbloqueio.
- Dashboard do advogado agora exibe oportunidades qualificadas logo apÃ³s login, antes da visÃ£o executiva.
- Advogado pode configurar perfil pÃºblico com foto, chamada profissional, bio e visibilidade pÃºblica.
- PÃ¡gina pÃºblica de advogado disponÃ­vel em `/advogados/[userId]`.
- Migration complementar de grants aplicada no Supabase para permitir leitura pÃºblica e gestÃ£o autenticada dos perfis pÃºblicos de advogados.

## Ãšltimo teste executado

Conta de advogado validada:

- E-mail: `tainarasantana.adv@gmail.com`
- Perfil: advogado
- OAB: BA 87947
- Status OAB: verificada
- Marketplace: habilitado
- CrÃ©ditos apÃ³s desbloqueio: 5

Resultado do teste:

1. Marketplace abriu com 1 oportunidade.
2. Oportunidade estava desbloqueada.
3. Dados privados apareceram apÃ³s backfill.
4. BotÃ£o `Enviar para CRM` executado com sucesso.
5. Mensagem exibida: cliente, caso, nota inicial e vÃ­nculo enviados para o CRM.
6. Cliente vinculado no CRM: `36b9bdd5-06f3-404f-a3be-a8461d807b9d`.
7. Teste visual em `/clientes` realizado apÃ³s o vÃ­nculo: cliente `manoel souza` aparece na carteira jurÃ­dica com origem `MARKETPLACE`.
8. Teste no preview Vercel realizado em `https://conectajus-app-git-ui-v6-premium-conectajus.vercel.app/marketplace`: dados liberados aparecem, saldo permanece em 5 crÃ©ditos e cliente vinculado ao CRM aparece.
9. Teste no preview Vercel realizado em `/clientes`: cliente `manoel souza` aparece na carteira jurÃ­dica com origem `MARKETPLACE`.
10. Teste local realizado em `/privacidade`, `/termos` e `/regras-marketplace`: pÃ¡ginas abriram como pÃºblicas, com tÃ­tulos corretos, cabeÃ§alho `Documentos pÃºblicos`, links internos legais e sem exibir shell/login protegido.
11. Teste local realizado em `/`: rodapÃ© da Home contÃ©m links para Privacidade, Termos e Regras do Marketplace.
12. Teste local realizado em `/cadastro`: checkbox de aceite legal aparece, links para Termos/Privacidade/Regras do Marketplace existem e o botÃ£o de criaÃ§Ã£o de conta fica bloqueado sem aceite.
13. Teste local realizado em `/triagem`: apÃ³s gerar dossiÃª preliminar, a confirmaÃ§Ã£o de publicaÃ§Ã£o aparece com links legais e o botÃ£o `Publicar no Marketplace` fica bloqueado atÃ© aceite.
14. `npm run go-live:check` executado apÃ³s os aceites legais: bundle Supabase gerado com 32 migrations, preflight aprovado, lint aprovado e build Next.js aprovado com 19 rotas estÃ¡ticas.
15. `npm run validate` executado apÃ³s vitrine de oportunidades no dashboard do advogado e perfil pÃºblico com foto: preflight aprovado, lint aprovado com 2 avisos de `<img>` e build aprovado; rota dinÃ¢mica `/advogados/[userId]` gerada.
16. Teste local de login por UI com a conta de advogado: login validado e redirecionamento para `/dashboard` funcionando.
17. Teste local do dashboard do advogado: seÃ§Ã£o `Oportunidades qualificadas` aparece logo apÃ³s login, antes da visÃ£o executiva; no banco atual nÃ£o havia oportunidade `open`, entÃ£o o estado vazio foi exibido corretamente.
18. Teste autenticado do Supabase Storage: upload de imagem de perfil no bucket `lawyer-profile-photos` retornou sucesso.
19. Teste autenticado de gravaÃ§Ã£o em `lawyer_public_profiles`: apÃ³s aplicar grants, upsert do perfil pÃºblico retornou sucesso.
20. Teste local de `/advogados/a49040eb-91a2-4864-b4b6-aa4fc3740c40`: pÃ¡gina pÃºblica exibiu foto, nome, OAB BA 87947, bio e chamada para triagem.
21. Teste local de `/configuracoes`: Ã¡rea `Perfil pÃºblico do advogado`, botÃ£o/link de foto e link `Ver perfil pÃºblico` aparecem para o advogado.

ObservaÃ§Ã£o: nÃ£o registrar senhas em arquivos. As senhas temporÃ¡rias foram fornecidas pelo usuÃ¡rio na conversa original e devem ser solicitadas novamente ao usuÃ¡rio se outra sessÃ£o precisar testar login manual.

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

Ãšltimas migrations crÃ­ticas aplicadas manualmente no Supabase:

- `20260714014500_fix_marketplace_unlock_rpc_ambiguity.sql`
- `20260714020000_fix_private_details_unlock_policy.sql`
- `20260714021500_create_accessible_marketplace_private_details_rpc.sql`
- `20260714023000_backfill_missing_marketplace_private_details.sql`
- `20260714103000_create_lawyer_public_profiles.sql`
- `20260716100000_grant_lawyer_public_profiles_access.sql`

Motivo das Ãºltimas correÃ§Ãµes:

- O RPC de desbloqueio tinha ambiguidade no campo `opportunity_id`.
- O lead de teste consumiu crÃ©ditos corretamente, mas era legado e nÃ£o possuÃ­a linha privada associada.
- Foi criada RPC segura `list_accessible_marketplace_private_details()`.
- Foi criado backfill para oportunidades antigas sem dados privados.
- A UI passou a tratar oportunidades desbloqueadas sem detalhes, evitando confusÃ£o.
- Foi criada estrutura de perfil pÃºblico de advogado com bucket `lawyer-profile-photos`.
- Foram aplicados grants de leitura pÃºblica e gestÃ£o autenticada para `lawyer_public_profiles`.

## Commits recentes relevantes

- `e445733` â€” `fix: load unlocked marketplace private details via rpc`
- `4ab4534` â€” `fix: backfill legacy marketplace private details`
- `82e273c` â€” `docs: add legal commercial go-live checklist`
- `0839037` â€” `feat: add public legal pages`
- `0b591f8` â€” `feat: require legal consent for onboarding and triage`
- `e89bfaf` â€” `docs: add go-live user action guide`

Confirmar com:

```bash
git log --oneline -8
```

## ValidaÃ§Ã£o local

Ãšltima validaÃ§Ã£o antes deste checkpoint:

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

ObservaÃ§Ã£o: em alguns momentos a URL de branch demorou/cacheou deploy antigo. Para validaÃ§Ãµes crÃ­ticas, foi usado `localhost:3000` contra o Supabase real.
Em 2026-07-14, o preview da branch foi revalidado e jÃ¡ servia os Ãºltimos commits necessÃ¡rios ao fluxo Marketplace -> CRM.

## PrÃ³ximas etapas recomendadas

1. Rodar `npm run validate` novamente apÃ³s qualquer alteraÃ§Ã£o.
2. Revisar e aprovar o checklist final jurÃ­dico/comercial:

```text
docs/GO_LIVE_LEGAL_COMMERCIAL_CHECKLIST_20260714.md
```

Esse checklist cobre domÃ­nio, variÃ¡veis de produÃ§Ã£o, Supabase, LGPD, termos de uso, polÃ­tica de privacidade, Marketplace/crÃ©ditos, OAB, IA jurÃ­dica, suporte e monitoramento pÃ³s-deploy.

2. Revisar juridicamente o conteÃºdo publicado nas novas pÃ¡ginas pÃºblicas:

```text
src/app/privacidade/page.tsx
src/app/termos/page.tsx
src/app/regras-marketplace/page.tsx
```

O conteÃºdo-base estÃ¡ centralizado em:

```text
src/features/legal/content/legalPages.ts
```

3. Para colocar o sistema efetivamente funcionando online, seguir o guia operacional:

```text
docs/GO_LIVE_USER_ACTIONS_20260714.md
```

## Andamento estimado

Andamento tÃ©cnico atual: 99,995%.

O que falta para considerar 100% operacional:

- aprovaÃ§Ã£o jurÃ­dica/comercial final dos textos pÃºblicos, regras de crÃ©ditos/estorno, canal oficial de privacidade/suporte e domÃ­nio final antes de go-live comercial definitivo.

## AtualizaÃ§Ã£o 2026-07-16 â€” ReferÃªncia Advogado DinÃ¢mico / tema claro-escuro

SolicitaÃ§Ã£o do usuÃ¡rio: analisar prints do concorrente Advogado DinÃ¢mico e aproximar a ConectaJus do mesmo perfil de produto, sem copiar identidade visual, com interface limpa, sem cores fortes, tema claro como padrÃ£o e tema escuro opcional.

AlteraÃ§Ãµes implementadas nesta rodada:

- Tema claro definido como padrÃ£o no AppShell autenticado.
- Tema escuro opcional com persistÃªncia local via `ThemeToggle`.
- `@custom-variant dark` adicionado em `src/app/globals.css` para dark mode por classe `.dark`.
- Topbar, Sidebar, SearchBar, UserMenu e MobileNavigation adaptados para visual claro, cards/brancos e suporte dark.
- Marketplace ajustado para linguagem mais comercial: filtros renomeados para `Caixa de entrada`, `Exclusivo para vocÃª` e `Complementos`.
- Dashboard do advogado e portal do cidadÃ£o suavizados para fundo claro, cards claros, bordas discretas e CTA teal em vez de dourado forte.
- CorreÃ§Ãµes de encoding UTF-8 apÃ³s ediÃ§Ã£o via PowerShell.
- CorreÃ§Ã£o de Ã­cones mojibake nos cards finais do dashboard.

ValidaÃ§Ãµes realizadas nesta rodada:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; restaram apenas 2 warnings jÃ¡ conhecidos de `<img>` em perfil pÃºblico/configuraÃ§Ãµes.
- `npm run build`: aprovado; 19 rotas geradas/validadas pelo Next.js.

Teste local no navegador interno:

- `http://localhost:3000/dashboard` abriu com tema claro default (`body` em `rgb(245, 247, 251)`).
- BotÃ£o de tema exibiu `Escuro` no estado claro.
- AlternÃ¢ncia para escuro testada com sucesso: classe `dark` aplicada no `html`, fundo `rgb(11, 15, 25)` e botÃ£o passou a `Claro`.
- Tema foi retornado para claro ao final do teste.
- Textos principais corrigidos apÃ³s mojibake: `NotificaÃ§Ãµes`, `JurÃ­dica`, `CrÃ©ditos`, `ConfiguraÃ§Ãµes`, etc.

ObservaÃ§Ã£o pendente:

- Ao tentar validar `/marketplace` visualmente no navegador interno, a sessÃ£o ativa alternou/permaneceu com perfil cidadÃ£o em parte do teste, exibindo navegaÃ§Ã£o do portal cidadÃ£o. A validaÃ§Ã£o tÃ©cnica do componente passou no build, mas a validaÃ§Ã£o visual completa do marketplace como advogado deve ser repetida com uma conta advogado confirmada/logada do zero.

PrÃ³xima etapa sugerida:

1. Validar login limpo como advogado e abrir `/marketplace` para confirmar visual dos cards reais de oportunidades.
2. Ajustar demais mÃ³dulos internos para o mesmo padrÃ£o visual claro/dark, comeÃ§ando por CRM, documentos, agenda e configuraÃ§Ãµes.
3. Substituir futuramente os dois `<img>` por `next/image` para eliminar warnings de lint.

## AtualizaÃ§Ã£o 2026-07-16 â€” CorreÃ§Ã£o de sessÃ£o/perfil no layout

Objetivo desta etapa: prosseguir a validaÃ§Ã£o do Marketplace como advogado apÃ³s a adaptaÃ§Ã£o visual inspirada nos prints do Advogado DinÃ¢mico.

CorreÃ§Ãµes implementadas:

- `useCurrentUserProfile` agora assina `supabase.auth.onAuthStateChange`, evitando que Topbar/Sidebar/MobileNavigation fiquem presos ao perfil anterior quando o usuÃ¡rio troca de conta no mesmo navegador.
- Criada ponte de assinatura em `auth.repository.ts` e `auth.service.ts`.
- `useSidebarNavigation` foi regravado com textos e Ã­cones UTF-8 corretos, removendo mojibake em itens como Dashboard, Clientes, Triagem, Documentos, ConfiguraÃ§Ãµes, Marketplace e Financeiro.
- Textos de auth/login/cadastro passaram por normalizaÃ§Ã£o de encoding.
- Corrigido texto do botÃ£o `â† Voltar` no portal cidadÃ£o.

ValidaÃ§Ãµes realizadas:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; permanecem apenas os 2 warnings conhecidos de `<img>` em perfil pÃºblico/configuraÃ§Ãµes.
- `npm run build`: aprovado.
- Busca por mojibake em auth/navigation/dashboard/layout: sem ocorrÃªncias reais pendentes.

Teste visual/local:

- Tentativa de login com a conta de advogada previamente informada retornou mensagem de credencial invÃ¡lida no Supabase atual.
- Tentativa de login com a conta admin previamente informada tambÃ©m retornou mensagem de credencial invÃ¡lida.
- Por isso, a validaÃ§Ã£o visual completa de `/marketplace` como advogado/admin ficou pendente atÃ© confirmaÃ§Ã£o/redefiniÃ§Ã£o das credenciais ou criaÃ§Ã£o/ajuste das contas no Supabase.

PrÃ³xima aÃ§Ã£o recomendada:

1. Confirmar ou redefinir senha das contas advogado/admin no Supabase Auth.
2. Repetir login limpo como advogado/admin.
3. Abrir `/dashboard` e `/marketplace` para confirmar que menu jurÃ­dico, oportunidades qualificadas e tema claro/dark aparecem corretamente.

## AtualizaÃ§Ã£o 2026-07-16 â€” Login do advogado abre Oportunidades qualificadas

SolicitaÃ§Ã£o do usuÃ¡rio: a pÃ¡gina de oportunidades qualificadas no perfil de advogado deve aparecer assim que o advogado fizer login na plataforma.

AlteraÃ§Ã£o implementada:

- `useLoginWorkspace` agora identifica o perfil retornado pelo Supabase apÃ³s login.
- UsuÃ¡rios com perfil `advogado` ou `admin` sÃ£o redirecionados diretamente para `routes.marketplace` (`/marketplace`).
- UsuÃ¡rios com perfil `cliente` continuam sendo redirecionados para `routes.dashboard` (`/dashboard`).

ValidaÃ§Ãµes realizadas:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; permanecem apenas os 2 warnings conhecidos de `<img>` em perfil pÃºblico/configuraÃ§Ãµes.
- `npm run build`: aprovado.

ObservaÃ§Ã£o:

- O teste E2E visual de login advogado ainda depende de credenciais vÃ¡lidas no Supabase atual, pois as contas previamente informadas retornaram credencial invÃ¡lida na Ãºltima validaÃ§Ã£o.

## Atualização 2026-07-16 — Navegação do advogado, contraste e telas antigas

Solicitação do usuário: prosseguir corrigindo botões de início/voltar com contraste ruim, revisar telas ainda com interface/tema antigo e remover da área do advogado o incentivo/ícone de iniciar triagem, já que advogados devem atender demandas dos clientes, não contar seus próprios problemas.

Alterações implementadas nesta rodada:

- `PageNavigation` passou a usar tema claro como padrão, com botões `Voltar`, `Início` e `Painel/Dashboard` mais contrastados em telas claras e escuras.
- Menu lateral do operador jurídico removeu o atalho de `Triagem`; a triagem permanece disponível para cidadão.
- `UserMenu` do advogado/admin trocou o CTA de `IA Jurídica` para `Oportunidades`, apontando para `/marketplace`.
- Busca global do advogado/admin deixou de sugerir `Triagem IA`; busca do cidadão continua permitindo `Triagem do caso`.
- Agenda, Processos, Configurações, Financeiro e Relatórios foram atualizados para o padrão claro/dark mais limpo: cartões claros, bordas discretas, textos legíveis e CTA teal em vez de âmbar forte.
- Configurações preserva o atalho de triagem apenas para cidadão; para advogado/admin o atalho aponta para operação/financeiro/créditos/OAB.
- Ajustes pontuais de contraste em mensagens, estados vazios, cards de status e botões de ação.
- Correções de encoding UTF-8 e remoção de resíduos mojibake nos arquivos tocados nesta rodada.

Validações realizadas nesta rodada:

```bash
rg "Ã|Â|dark:text-white dark:text-slate|text-slate-950 dark:text-slate-950|dark:bg-white dark:bg|text-slate-950 dark:text-white dark:text|dark:hover:bg-slate-100|Triagem IA|IA Jurídica" src\features src\components -g "*.tsx"
npm run lint
npm run build
```

Resultado:

- Busca de resíduos: sem ocorrências nos arquivos TSX de `src/features` e `src/components`.
- `npm run lint`: aprovado sem erros; permanecem apenas 2 warnings já conhecidos de `<img>` em `PublicLawyerProfileWorkspace.tsx` e `SettingsWorkspace.tsx`.
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

Próxima etapa recomendada:

1. Fazer teste visual logado como advogado em `/marketplace`, `/financeiro`, `/relatorios`, `/agenda`, `/processos` e `/configuracoes`.
2. Se aprovado visualmente, seguir para o próximo bloco de polimento: CRM/clientes, documentos e estados vazios do portal cidadão.
3. Futuramente substituir os dois `<img>` por `next/image` para zerar warnings de lint.