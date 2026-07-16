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
- Páginas públicas legais:
  - `/privacidade`;
  - `/termos`;
  - `/regras-marketplace`.
- Aceite obrigatório no cadastro com links para Termos, Privacidade e Regras do Marketplace.
- Confirmação obrigatória antes de publicar triagem no Marketplace, com ciência sobre IA preliminar, privacidade e regras de desbloqueio.
- Dashboard do advogado agora exibe oportunidades qualificadas logo após login, antes da visão executiva.
- Advogado pode configurar perfil público com foto, chamada profissional, bio e visibilidade pública.
- Página pública de advogado disponível em `/advogados/[userId]`.
- Migration complementar de grants aplicada no Supabase para permitir leitura pública e gestão autenticada dos perfis públicos de advogados.

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
8. Teste no preview Vercel realizado em `https://conectajus-app-git-ui-v6-premium-conectajus.vercel.app/marketplace`: dados liberados aparecem, saldo permanece em 5 créditos e cliente vinculado ao CRM aparece.
9. Teste no preview Vercel realizado em `/clientes`: cliente `manoel souza` aparece na carteira jurídica com origem `MARKETPLACE`.
10. Teste local realizado em `/privacidade`, `/termos` e `/regras-marketplace`: páginas abriram como públicas, com títulos corretos, cabeçalho `Documentos públicos`, links internos legais e sem exibir shell/login protegido.
11. Teste local realizado em `/`: rodapé da Home contém links para Privacidade, Termos e Regras do Marketplace.
12. Teste local realizado em `/cadastro`: checkbox de aceite legal aparece, links para Termos/Privacidade/Regras do Marketplace existem e o botão de criação de conta fica bloqueado sem aceite.
13. Teste local realizado em `/triagem`: após gerar dossiê preliminar, a confirmação de publicação aparece com links legais e o botão `Publicar no Marketplace` fica bloqueado até aceite.
14. `npm run go-live:check` executado após os aceites legais: bundle Supabase gerado com 32 migrations, preflight aprovado, lint aprovado e build Next.js aprovado com 19 rotas estáticas.
15. `npm run validate` executado após vitrine de oportunidades no dashboard do advogado e perfil público com foto: preflight aprovado, lint aprovado com 2 avisos de `<img>` e build aprovado; rota dinâmica `/advogados/[userId]` gerada.
16. Teste local de login por UI com a conta de advogado: login validado e redirecionamento para `/dashboard` funcionando.
17. Teste local do dashboard do advogado: seção `Oportunidades qualificadas` aparece logo após login, antes da visão executiva; no banco atual não havia oportunidade `open`, então o estado vazio foi exibido corretamente.
18. Teste autenticado do Supabase Storage: upload de imagem de perfil no bucket `lawyer-profile-photos` retornou sucesso.
19. Teste autenticado de gravação em `lawyer_public_profiles`: após aplicar grants, upsert do perfil público retornou sucesso.
20. Teste local de `/advogados/a49040eb-91a2-4864-b4b6-aa4fc3740c40`: página pública exibiu foto, nome, OAB BA 87947, bio e chamada para triagem.
21. Teste local de `/configuracoes`: área `Perfil público do advogado`, botão/link de foto e link `Ver perfil público` aparecem para o advogado.

Observação: não registrar senhas em arquivos. As senhas temporárias foram fornecidas pelo usuário na conversa original e devem ser solicitadas novamente ao usuário se outra sessão precisar testar login manual.

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

Últimas migrations críticas aplicadas manualmente no Supabase:

- `20260714014500_fix_marketplace_unlock_rpc_ambiguity.sql`
- `20260714020000_fix_private_details_unlock_policy.sql`
- `20260714021500_create_accessible_marketplace_private_details_rpc.sql`
- `20260714023000_backfill_missing_marketplace_private_details.sql`
- `20260714103000_create_lawyer_public_profiles.sql`
- `20260716100000_grant_lawyer_public_profiles_access.sql`

Motivo das últimas correções:

- O RPC de desbloqueio tinha ambiguidade no campo `opportunity_id`.
- O lead de teste consumiu créditos corretamente, mas era legado e não possuía linha privada associada.
- Foi criada RPC segura `list_accessible_marketplace_private_details()`.
- Foi criado backfill para oportunidades antigas sem dados privados.
- A UI passou a tratar oportunidades desbloqueadas sem detalhes, evitando confusão.
- Foi criada estrutura de perfil público de advogado com bucket `lawyer-profile-photos`.
- Foram aplicados grants de leitura pública e gestão autenticada para `lawyer_public_profiles`.

## Commits recentes relevantes

- `e445733` — `fix: load unlocked marketplace private details via rpc`
- `4ab4534` — `fix: backfill legacy marketplace private details`
- `82e273c` — `docs: add legal commercial go-live checklist`
- `0839037` — `feat: add public legal pages`
- `0b591f8` — `feat: require legal consent for onboarding and triage`
- `e89bfaf` — `docs: add go-live user action guide`

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
Em 2026-07-14, o preview da branch foi revalidado e já servia os últimos commits necessários ao fluxo Marketplace -> CRM.

## Próximas etapas recomendadas

1. Rodar `npm run validate` novamente após qualquer alteração.
2. Revisar e aprovar o checklist final jurídico/comercial:

```text
docs/GO_LIVE_LEGAL_COMMERCIAL_CHECKLIST_20260714.md
```

Esse checklist cobre domínio, variáveis de produção, Supabase, LGPD, termos de uso, política de privacidade, Marketplace/créditos, OAB, IA jurídica, suporte e monitoramento pós-deploy.

2. Revisar juridicamente o conteúdo publicado nas novas páginas públicas:

```text
src/app/privacidade/page.tsx
src/app/termos/page.tsx
src/app/regras-marketplace/page.tsx
```

O conteúdo-base está centralizado em:

```text
src/features/legal/content/legalPages.ts
```

3. Para colocar o sistema efetivamente funcionando online, seguir o guia operacional:

```text
docs/GO_LIVE_USER_ACTIONS_20260714.md
```

## Andamento estimado

Andamento técnico atual: 99,995%.

O que falta para considerar 100% operacional:

- aprovação jurídica/comercial final dos textos públicos, regras de créditos/estorno, canal oficial de privacidade/suporte e domínio final antes de go-live comercial definitivo.

## Atualização 2026-07-16 — Referência Advogado Dinâmico / tema claro-escuro

Solicitação do usuário: analisar prints do concorrente Advogado Dinâmico e aproximar a ConectaJus do mesmo perfil de produto, sem copiar identidade visual, com interface limpa, sem cores fortes, tema claro como padrão e tema escuro opcional.

Alterações implementadas nesta rodada:

- Tema claro definido como padrão no AppShell autenticado.
- Tema escuro opcional com persistência local via `ThemeToggle`.
- `@custom-variant dark` adicionado em `src/app/globals.css` para dark mode por classe `.dark`.
- Topbar, Sidebar, SearchBar, UserMenu e MobileNavigation adaptados para visual claro, cards/brancos e suporte dark.
- Marketplace ajustado para linguagem mais comercial: filtros renomeados para `Caixa de entrada`, `Exclusivo para você` e `Complementos`.
- Dashboard do advogado e portal do cidadão suavizados para fundo claro, cards claros, bordas discretas e CTA teal em vez de dourado forte.
- Correções de encoding UTF-8 após edição via PowerShell.
- Correção de ícones mojibake nos cards finais do dashboard.

Validações realizadas nesta rodada:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; restaram apenas 2 warnings já conhecidos de `<img>` em perfil público/configurações.
- `npm run build`: aprovado; 19 rotas geradas/validadas pelo Next.js.

Teste local no navegador interno:

- `http://localhost:3000/dashboard` abriu com tema claro default (`body` em `rgb(245, 247, 251)`).
- Botão de tema exibiu `Escuro` no estado claro.
- Alternância para escuro testada com sucesso: classe `dark` aplicada no `html`, fundo `rgb(11, 15, 25)` e botão passou a `Claro`.
- Tema foi retornado para claro ao final do teste.
- Textos principais corrigidos após mojibake: `Notificações`, `Jurídica`, `Créditos`, `Configurações`, etc.

Observação pendente:

- Ao tentar validar `/marketplace` visualmente no navegador interno, a sessão ativa alternou/permaneceu com perfil cidadão em parte do teste, exibindo navegação do portal cidadão. A validação técnica do componente passou no build, mas a validação visual completa do marketplace como advogado deve ser repetida com uma conta advogado confirmada/logada do zero.

Próxima etapa sugerida:

1. Validar login limpo como advogado e abrir `/marketplace` para confirmar visual dos cards reais de oportunidades.
2. Ajustar demais módulos internos para o mesmo padrão visual claro/dark, começando por CRM, documentos, agenda e configurações.
3. Substituir futuramente os dois `<img>` por `next/image` para eliminar warnings de lint.

## Atualização 2026-07-16 — Correção de sessão/perfil no layout

Objetivo desta etapa: prosseguir a validação do Marketplace como advogado após a adaptação visual inspirada nos prints do Advogado Dinâmico.

Correções implementadas:

- `useCurrentUserProfile` agora assina `supabase.auth.onAuthStateChange`, evitando que Topbar/Sidebar/MobileNavigation fiquem presos ao perfil anterior quando o usuário troca de conta no mesmo navegador.
- Criada ponte de assinatura em `auth.repository.ts` e `auth.service.ts`.
- `useSidebarNavigation` foi regravado com textos e ícones UTF-8 corretos, removendo mojibake em itens como Dashboard, Clientes, Triagem, Documentos, Configurações, Marketplace e Financeiro.
- Textos de auth/login/cadastro passaram por normalização de encoding.
- Corrigido texto do botão `← Voltar` no portal cidadão.

Validações realizadas:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; permanecem apenas os 2 warnings conhecidos de `<img>` em perfil público/configurações.
- `npm run build`: aprovado.
- Busca por mojibake em auth/navigation/dashboard/layout: sem ocorrências reais pendentes.

Teste visual/local:

- Tentativa de login com a conta de advogada previamente informada retornou mensagem de credencial inválida no Supabase atual.
- Tentativa de login com a conta admin previamente informada também retornou mensagem de credencial inválida.
- Por isso, a validação visual completa de `/marketplace` como advogado/admin ficou pendente até confirmação/redefinição das credenciais ou criação/ajuste das contas no Supabase.

Próxima ação recomendada:

1. Confirmar ou redefinir senha das contas advogado/admin no Supabase Auth.
2. Repetir login limpo como advogado/admin.
3. Abrir `/dashboard` e `/marketplace` para confirmar que menu jurídico, oportunidades qualificadas e tema claro/dark aparecem corretamente.

## Atualização 2026-07-16 — Login do advogado abre Oportunidades qualificadas

Solicitação do usuário: a página de oportunidades qualificadas no perfil de advogado deve aparecer assim que o advogado fizer login na plataforma.

Alteração implementada:

- `useLoginWorkspace` agora identifica o perfil retornado pelo Supabase após login.
- Usuários com perfil `advogado` ou `admin` são redirecionados diretamente para `routes.marketplace` (`/marketplace`).
- Usuários com perfil `cliente` continuam sendo redirecionados para `routes.dashboard` (`/dashboard`).

Validações realizadas:

```bash
npm run lint
npm run build
```

Resultado:

- `npm run lint`: aprovado sem erros; permanecem apenas os 2 warnings conhecidos de `<img>` em perfil público/configurações.
- `npm run build`: aprovado.

Observação:

- O teste E2E visual de login advogado ainda depende de credenciais válidas no Supabase atual, pois as contas previamente informadas retornaram credencial inválida na última validação.
