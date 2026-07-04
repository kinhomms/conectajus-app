# ConectaJus - Architecture Discovery

Versão: V5.5  
Status: Em levantamento  
Última atualização: Julho/2026

---

# Objetivo

Este documento registra o estado atual da arquitetura do ConectaJus antes da refatoração da V5.5.

A finalidade é mapear o sistema real, identificar responsabilidades concentradas, riscos técnicos, dependências e oportunidades de reorganização arquitetural.

---

# Estado Atual

Versão atual: V5

Funcionalidades já implementadas:

- Login
- Cadastro
- Autenticação
- Dashboard
- Cadastro de clientes
- Dossiê jurídico
- Cadastro de documentos
- Cadastro de processos
- Histórico de atendimentos
- Triagem com IA
- Supabase
- GitHub
- Vercel
- Build funcional
- Deploy funcional

---

# Estrutura atual do src

```text
src/
├── app/
├── components/
├── config/
├── lib/
├── modules/
└── types/