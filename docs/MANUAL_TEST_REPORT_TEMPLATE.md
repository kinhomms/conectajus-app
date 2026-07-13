# Relatório de teste manual — ConectaJus

Use este arquivo como modelo para registrar a validação manual do Preview ou Produção.

Não registre senhas, tokens, documentos reais ou dados pessoais sensíveis neste relatório.

## Identificação

Data:

```text
AAAA-MM-DD
```

Ambiente:

```text
Local / Vercel Preview / Produção
```

URL testada:

```text
https://...
```

Branch/commit:

```text
ui-v6-premium / <commit>
```

Responsável pelo teste:

```text
Nome
```

## Pré-condições

- [ ] Migrations aplicadas no Supabase alvo.
- [ ] `docs/SUPABASE_POST_APPLY_VALIDATION.sql` executado.
- [ ] Todos os grupos críticos retornaram `ok`.
- [ ] Variáveis configuradas no ambiente:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Bucket `citizen-documents` confirmado como privado.
- [ ] Usuário cidadão disponível.
- [ ] Usuário advogado disponível.
- [ ] Usuário admin disponível em `public.admin_users`.

## Resultado resumido

Marcar um status geral:

- [ ] Aprovado
- [ ] Aprovado com ressalvas
- [ ] Reprovado

Resumo:

```text
Descrever em poucas linhas o resultado geral.
```

## Teste — Visitante

- [ ] Abrir `/`.
- [ ] Abrir `/login`.
- [ ] Abrir `/cadastro`.
- [ ] Confirmar que a proposta do ConectaJus aparece como ecossistema jurídico inteligente.
- [ ] Confirmar que não há erro visual, tela branca ou erro de console crítico.

Observações:

```text

```

## Teste — Cidadão

- [ ] Fazer login como cidadão.
- [ ] Tentar criar nova conta como advogado usando o mesmo e-mail do cidadão.
- [ ] Confirmar que o sistema bloqueia o e-mail já cadastrado.
- [ ] Abrir `/dashboard`.
- [ ] Confirmar que o portal não mostra áreas internas indevidas.
- [ ] Abrir `/triagem`.
- [ ] Criar uma triagem principal.
- [ ] Confirmar publicação da oportunidade mascarada.
- [ ] Confirmar que a demanda publicada não é editável diretamente.
- [ ] Criar complemento de relato, se aplicável.
- [ ] Abrir `/documentos`.
- [ ] Enviar documento complementar.
- [ ] Confirmar botões de voltar/início/painel nas telas do portal.
- [ ] Tentar acessar `/marketplace` por URL direta.
- [ ] Tentar acessar `/financeiro` por URL direta.
- [ ] Tentar acessar `/relatorios` por URL direta.
- [ ] Confirmar bloqueio, redirecionamento ou experiência restrita para áreas internas.

Dados pessoais permanecem ocultos antes do desbloqueio?

- [ ] Sim
- [ ] Não

Observações:

```text

```

## Teste — Advogado

- [ ] Fazer login como advogado.
- [ ] Confirmar que cadastro de advogado exige número da OAB.
- [ ] Confirmar que cadastro de advogado exige UF da OAB.
- [ ] Tentar cadastrar outro advogado com a mesma OAB/UF.
- [ ] Confirmar bloqueio de OAB/UF duplicada.
- [ ] Confirmar que advogado com OAB pendente não acessa `/marketplace`.
- [ ] Confirmar que advogado com OAB pendente não acessa `/financeiro`.
- [ ] Abrir `/dashboard`.
- [ ] Abrir `/marketplace`.
- [ ] Ver oportunidades mascaradas.
- [ ] Filtrar oportunidades.
- [ ] Identificar caso original e complemento.
- [ ] Solicitar créditos em `/financeiro`, se necessário.
- [ ] Desbloquear uma oportunidade com créditos.
- [ ] Confirmar baixa de créditos.
- [ ] Confirmar liberação de dados privados apenas após desbloqueio.
- [ ] Abrir documento privado por fluxo autorizado.
- [ ] Enviar oportunidade para CRM.
- [ ] Abrir `/clientes`.
- [ ] Confirmar cliente/caso criado ou vinculado.
- [ ] Criar acompanhamento em `/agenda`.
- [ ] Abrir `/relatorios`.

Dados privados só aparecem após desbloqueio?

- [ ] Sim
- [ ] Não

Observações:

```text

```

## Teste — Administrador

- [ ] Confirmar usuário admin em `public.admin_users`.
- [ ] Fazer login como admin.
- [ ] Abrir `/financeiro`.
- [ ] Visualizar fila de OABs pendentes.
- [ ] Aprovar OAB após conferência externa de nome/UF/número.
- [ ] Rejeitar OAB em massa de teste.
- [ ] Confirmar que advogado verificado acessa Marketplace/Financeiro.
- [ ] Visualizar solicitações pendentes de crédito.
- [ ] Aprovar uma solicitação.
- [ ] Confirmar atualização do saldo do advogado.
- [ ] Rejeitar uma solicitação, se houver massa de teste.
- [ ] Confirmar que usuário não-admin não acessa ações administrativas.

Observações:

```text

```

## Teste — Segurança e privacidade

- [ ] Usuário consegue editar nome em `/configuracoes`.
- [ ] Usuário consegue ajustar preferências em `/configuracoes`.
- [ ] Usuário consegue solicitar exclusão da conta.
- [ ] Usuário consegue cancelar solicitação pendente de exclusão.
- [ ] Marketplace não mostra nome do cidadão antes do desbloqueio.
- [ ] Marketplace não mostra telefone antes do desbloqueio.
- [ ] Marketplace não mostra WhatsApp antes do desbloqueio.
- [ ] Marketplace não mostra e-mail antes do desbloqueio.
- [ ] Marketplace não mostra documentos antes do desbloqueio.
- [ ] Documento privado não abre para advogado sem desbloqueio.
- [ ] Cidadão não acessa áreas internas por URL direta.
- [ ] Relatórios ficam restritos a perfis autorizados.
- [ ] Financeiro fica restrito a perfis autorizados.

Observações:

```text

```

## Evidências

Registrar links de prints, gravações ou anotações internas, sem dados sensíveis:

```text

```

## Defeitos encontrados

| Severidade | Área | Descrição | Status |
| --- | --- | --- | --- |
| Alta/Média/Baixa | Ex.: Marketplace | Descrever o problema | Aberto/Corrigido/Revalidado |

## Decisão

- [ ] Pode promover para produção.
- [ ] Pode promover após correções menores.
- [ ] Não pode promover.

Justificativa:

```text

```
