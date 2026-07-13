# Validacao tecnica — 2026-07-13

Este documento registra a rodada mais recente de validacao do ConectaJus na branch `ui-v6-premium`.

## Projeto validado

Pasta:

```text
C:\Users\BPEsc\Documents\ConectaJus\conectajus_final_base\conectajus-core
```

Branch:

```text
ui-v6-premium
```

Status Git antes desta anotacao:

```text
## ui-v6-premium...origin/ui-v6-premium
```

## Validacoes executadas

### Lint

Comando:

```bash
npm run lint
```

Resultado:

```text
Passou sem erros.
```

### Build de producao

Comando:

```bash
npm run build
```

Resultado:

```text
Passou sem erros.
```

Rotas confirmadas no build:

- `/`
- `/_not-found`
- `/agenda`
- `/cadastro`
- `/clientes`
- `/configuracoes`
- `/dashboard`
- `/documentos`
- `/financeiro`
- `/login`
- `/marketplace`
- `/processos`
- `/relatorios`
- `/triagem`

## Smoke test visual local

Foi executada uma checagem local pelo navegador embutido do Codex em `http://localhost:3000`.

Rotas verificadas:

- `/triagem`
  - botao `Voltar` presente;
  - link `Inicio` presente;
  - link para Portal/Painel presente;
  - sem erros de console capturados.
- `/documentos`
  - botao `Voltar` presente;
  - link `Inicio` presente;
  - link para Portal/Painel presente;
  - sem erros de console capturados.
- `/dashboard`
  - conteudo do Portal do cidadao renderizado;
  - botao `Voltar` presente;
  - link `Inicio` presente;
  - atalho `Nova triagem` presente.
- `/configuracoes`
  - botao `Voltar` presente;
  - link `Inicio` presente;
  - link `Dashboard` presente;
  - preferencias de conta presentes;
  - solicitacao de exclusao de conta presente.

Observacao:

```text
A validacao local confirma a presenca dos controles de navegacao e dos blocos principais.
Ela nao substitui o teste manual completo no preview Vercel com Supabase alvo.
```

## Pendencias externas

Estas etapas ainda dependem do ambiente externo correto:

1. Aplicar ou confirmar todas as migrations no Supabase alvo.
2. Confirmar variaveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no ambiente de deploy.
3. Executar teste manual com perfis reais:
   - cidadao;
   - advogado;
   - admin.
4. Validar preview/deploy na Vercel.
5. Decidir explicitamente sobre a remocao dos arquivos/pastas legados listados em `docs/LEGACY_AUDIT.md`.

## Percentual estimado

Andamento estimado apos esta validacao: 98%.

O projeto esta tecnicamente consistente para seguir para validacao externa, mas ainda nao deve ser considerado 100% concluido enquanto Supabase, perfis reais e Vercel nao forem confirmados no ambiente alvo.
