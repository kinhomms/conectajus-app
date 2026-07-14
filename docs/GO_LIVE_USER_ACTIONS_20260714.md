# ConectaJus — O que falta para ver o sistema funcionando online

Data: 2026-07-14  
Branch: `ui-v6-premium`  
Status técnico: `npm run go-live:check` aprovado.

## 1. Link para testar agora

Use o preview da branch enquanto o domínio final não estiver configurado:

```text
https://conectajus-app-git-ui-v6-premium-conectajus.vercel.app
```

Esse link deve permitir testar:

- Home;
- Login;
- Cadastro;
- Portal do cidadão;
- Triagem;
- Documentos;
- Marketplace;
- CRM;
- Financeiro/créditos;
- Configurações;
- páginas públicas de Privacidade, Termos e Regras do Marketplace.

## 2. Para virar ambiente oficial de produção

Você ainda precisa definir ou confirmar:

1. Domínio oficial da plataforma.
2. Domínio configurado na Vercel.
3. HTTPS ativo.
4. Variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no ambiente Production da Vercel.
5. Confirmação de que Production aponta para o Supabase correto.
6. Aplicação/validação das migrations no Supabase alvo.
7. Bucket privado `citizen-documents` criado e restrito.
8. Backups automáticos do Supabase habilitados.

## 3. Para operar com usuários reais

Antes de divulgar para cidadãos e advogados, definir:

1. Canal oficial de suporte.
2. Canal oficial de privacidade/LGPD.
3. Responsável por aprovar/rejeitar OAB.
4. Regra comercial de créditos.
5. Política de estorno/reembolso de créditos.
6. Validade dos créditos, se existir.
7. Processo para lead incompleto, duplicado ou inválido.
8. Processo para pedido de exclusão de conta.
9. Rotina diária de checagem das filas:
   - OAB pendente;
   - créditos pendentes;
   - exclusões pendentes;
   - leads incompletos.

## 4. Teste final recomendado no domínio oficial

Quando o domínio final estiver no ar:

1. Criar conta cidadão.
2. Fazer triagem.
3. Publicar oportunidade mascarada.
4. Enviar documento.
5. Criar conta advogado.
6. Confirmar bloqueio do advogado sem OAB verificada.
7. Entrar como admin.
8. Aprovar OAB.
9. Aprovar créditos.
10. Entrar como advogado.
11. Desbloquear oportunidade.
12. Confirmar que dados privados aparecem somente após desbloqueio.
13. Enviar lead para CRM.
14. Confirmar cliente em `/clientes`.
15. Confirmar histórico/auditoria administrativa.

## 5. Critério prático

O sistema já está tecnicamente pronto para teste online em preview.

Para uso comercial real, ainda depende de:

- domínio final;
- produção Vercel configurada;
- Supabase de produção conferido;
- suporte/privacidade definidos;
- regras comerciais aprovadas;
- revisão jurídica final.
