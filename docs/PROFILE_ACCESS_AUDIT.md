# Auditoria de acesso por perfil

Data da auditoria: 2026-07-13

## Objetivo

Garantir que a experiência do ConectaJus respeite a separação entre:

- cidadão;
- advogado parceiro;
- administrador.

O foco desta etapa foi impedir que áreas internas da operação jurídica apareçam para cidadãos por navegação direta ou menu.

## Matriz de acesso atual

| Rota | Cidadão | Advogado/Admin | Comportamento |
| --- | --- | --- | --- |
| `/dashboard` | Sim | Sim | Renderiza portal do cidadão ou dashboard executivo conforme perfil. |
| `/triagem` | Sim | Sim | Cidadão publica/acompanha demandas; operador pode usar triagem IA. |
| `/documentos` | Sim | Sim | Interface muda conforme perfil: documentos do cidadão ou dossiês jurídicos. |
| `/agenda` | Sim | Sim | Mantida acessível aos dois perfis por ser parte do acompanhamento. |
| `/configuracoes` | Sim | Sim | Mostra conta, sessão, privacidade e atalhos conforme perfil. |
| `/marketplace` | Restrito | Sim, se habilitado | Cidadão vê tela de acesso restrito com caminho para triagem/portal. |
| `/financeiro` | Restrito | Sim, se habilitado | Cidadão vê tela restrita; advogado/admin acessa créditos. |
| `/clientes` | Não | Sim | Cidadão é redirecionado para `/dashboard`. |
| `/processos` | Não | Sim | Cidadão é redirecionado para `/dashboard`. |
| `/relatorios` | Restrito | Sim | Cidadão vê tela restrita; operador vê indicadores executivos. |

## Ajuste realizado nesta etapa

A rota `/relatorios` foi reforçada:

- antes, cidadão recebia mensagem, mas a tela ainda renderizava indicadores vazios;
- agora, cidadão recebe uma tela clara de acesso restrito;
- a tela restrita aponta para:
  - portal do cidadão;
  - triagem;
  - documentos.

Arquivos alterados:

```text
src/features/reports/hooks/useReportsWorkspace.ts
src/features/reports/components/ReportsWorkspace.tsx
```

## Situação dos menus

O menu lateral é profile-aware:

- cidadão vê portal, triagem, documentos, agenda e configurações;
- advogado/admin vê dashboard, clientes, triagem IA, processos, documentos, agenda, relatórios e configurações;
- Marketplace e Financeiro aparecem somente quando o usuário tem acesso ao marketplace.

Mesmo quando uma rota não aparece no menu, as rotas internas críticas também verificam perfil no hook da própria feature.

## Validação

Comandos executados com sucesso:

```bash
npm run lint
npm run build
```

O build confirmou as rotas:

```text
/
/agenda
/cadastro
/clientes
/configuracoes
/dashboard
/documentos
/financeiro
/login
/marketplace
/processos
/relatorios
/triagem
```

## Próximos cuidados recomendados

1. Se forem criadas novas rotas internas, verificar perfil no hook da feature.
2. Evitar depender apenas do menu para esconder áreas.
3. Em produção, manter RLS do Supabase alinhado com as permissões da interface.
4. Criar testes manuais de perfil antes do deploy:
   - login como cidadão;
   - login como advogado;
   - login como admin;
   - tentativa de acesso direto por URL às rotas internas.
