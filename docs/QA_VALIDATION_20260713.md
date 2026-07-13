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

## Observacao sobre smoke test visual

A tentativa de validar visualmente pelo navegador embutido do Codex foi interrompida por instabilidade de sessao/aba do proprio navegador de teste.

Por isso, esta rodada considera como evidencias confiaveis:

- verificacao de branch/status pelo Git;
- lint;
- build de producao;
- documentacao de checklist/manual para teste humano.

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

Andamento estimado apos esta validacao: 97%.

O projeto esta tecnicamente consistente para seguir para validacao externa, mas ainda nao deve ser considerado 100% concluido enquanto Supabase, perfis reais e Vercel nao forem confirmados no ambiente alvo.
