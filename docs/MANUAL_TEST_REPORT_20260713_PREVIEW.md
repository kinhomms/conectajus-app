# Relatório de teste manual — Preview ConectaJus

Data: 2026-07-13

Ambiente:

```text
Vercel Preview
```

URL testada:

```text
https://conectajus-app-git-ui-v6-premium-conectajus.vercel.app
```

Branch/commit:

```text
ui-v6-premium / 65a1308
```

## Resultado resumido

```text
Aprovado com ressalvas.
```

Ressalva:

```text
Visitante e cidadão foram testados com sucesso. Ainda falta testar advogado e administrador com contas reais/confirmadas.
```

## Pré-condições confirmadas

- Supabase real aplicado.
- Validação compacta do Supabase retornou `status ok / count 100`.
- Variáveis Vercel configuradas para Production and Preview.
- Preview Vercel gerado e marcado como `Ready`.
- Build local e Vercel aprovados com `npm run validate`.

## Teste — Visitante

- `/` carregou corretamente.
- `/login` carregou corretamente.
- `/cadastro` carregou corretamente.
- `/triagem` carregou corretamente.
- Rotas protegidas sem sessão redirecionaram para `/login`.

Status:

```text
ok
```

## Teste — Cidadão

Conta:

```text
Conta cidadã real informada pelo usuário, sem senha registrada neste relatório.
```

Resultados:

- Login como cidadão concluído com sucesso.
- `/dashboard` abriu o Portal do Cidadão.
- O portal exibiu casos publicados, aguardando análise, complementos e contato liberado.
- `/triagem` abriu com campos de dados protegidos e aviso de proteção no Marketplace.
- `/documentos` abriu com upload seguro, observação opcional e botões de navegação.
- `/configuracoes` abriu com dados de conta, privacidade, sessão e opção de exclusão de conta.
- Botões de voltar/início apareceram em dashboard, triagem, documentos e configurações.
- `/marketplace` por URL direta exibiu `ACESSO RESTRITO`.
- `/financeiro` por URL direta exibiu `ACESSO RESTRITO`.
- `/relatorios` por URL direta exibiu `ACESSO RESTRITO`.
- `/clientes` e `/processos` redirecionaram para `/dashboard`.
- Não houve erro de runtime, tela branca ou falha 500 durante o teste cidadão.

Status:

```text
ok
```

## Itens ainda pendentes

- Teste real de advogado.
- Teste de advogado com OAB pendente.
- Teste de advogado com OAB verificada.
- Teste de Marketplace com oportunidades mascaradas.
- Teste de desbloqueio por créditos.
- Teste de envio para CRM.
- Teste real de administrador.
- Teste de decisão administrativa de OAB.
- Teste de aprovação/rejeição de créditos.
- Teste de aprovação/rejeição de exclusão de conta.
- Execução de `supabase/TEST_PROFILE_CHECKS.sql` com e-mails reais de teste.

## Decisão

```text
Não promover para produção ainda.
```

Justificativa:

```text
O preview e o perfil cidadão estão validados. A promoção para produção deve aguardar a validação logada dos perfis advogado e administrador, além dos fluxos de créditos, OAB e auditoria.
```
