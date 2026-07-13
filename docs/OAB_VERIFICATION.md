# Verificação de OAB — ConectaJus

## Objetivo

Evitar que qualquer pessoa se cadastre como advogado e acesse Marketplace, Financeiro ou desbloqueio de oportunidades sem validação prévia.

## Estado implementado

O cadastro de advogado exige:

- número da OAB;
- UF da OAB.

O sistema:

- normaliza número da OAB para dígitos;
- normaliza UF para maiúsculas;
- impede OAB/UF duplicada;
- cria registro em `public.lawyer_profiles`;
- marca o cadastro como `pending`;
- bloqueia Marketplace, Financeiro e desbloqueios até `verification_status = 'verified'`;
- permite que admin aprove ou rejeite a OAB pelo painel Financeiro;
- registra `verified_at` e `verified_by` quando a OAB é decidida pelo admin.

## Sobre consulta oficial externa

A consulta pública do Cadastro Nacional dos Advogados existe em:

```text
https://cna.oab.org.br/
```

Até esta etapa, não foi identificada API pública oficial e estável, documentada para integração direta.

Por isso, a ConectaJus não faz scraping nem simula acesso automatizado ao site da OAB. Essa escolha evita fragilidade técnica, risco jurídico e dependência de uma interface pública que pode mudar.

## Fluxo atual

1. Advogado cria conta e informa OAB/UF.
2. Sistema cria perfil com status `pending`.
3. Advogado fica bloqueado de Marketplace/Financeiro.
4. Admin acessa `/financeiro`.
5. Admin confere nome, UF e número em fonte externa confiável.
6. Admin marca como:
   - `verified`: libera Marketplace/Financeiro;
   - `rejected`: mantém bloqueio.

## Próxima integração possível

Se a ConectaJus obtiver acesso a uma API oficial/confiável de validação OAB, o fluxo pode evoluir para:

1. chamada server-side para API de validação;
2. comparação de nome/OAB/UF;
3. atualização automática de `verification_status`;
4. manutenção de fallback administrativo para divergências.

Essa integração deve ser feita apenas server-side, nunca expondo chaves no frontend.
