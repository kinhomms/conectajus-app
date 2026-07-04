# ConectaJus - Architecture

Versão: V5.5

Status: Em evolução

Última atualização: Julho/2026

---

# Visão Geral

O ConectaJus é uma plataforma SaaS jurídica desenvolvida para atender escritórios de advocacia de pequeno, médio e grande porte.

O objetivo do sistema é fornecer uma plataforma única para gestão jurídica, automação de processos, inteligência artificial aplicada ao Direito e relacionamento com clientes.

O projeto é desenvolvido para suportar crescimento contínuo durante muitos anos, mantendo alta escalabilidade, baixo acoplamento e facilidade de manutenção.

---

# Princípios Arquiteturais

Toda evolução do sistema deverá respeitar obrigatoriamente os seguintes princípios:

- Clean Architecture
- SOLID
- Clean Code
- DRY
- KISS
- Separation of Concerns
- Componentização
- Responsabilidade Única
- Reutilização de Código
- Escalabilidade
- Segurança
- Performance

Nenhuma implementação deverá violar esses princípios apenas para acelerar entregas.

---

# Arquitetura Atual (AS-IS)

Atualmente o sistema encontra-se na versão V5.

Principais módulos implementados:

- Login
- Cadastro
- Dashboard
- Clientes
- Dossiê Jurídico
- Documentos
- Processos
- Histórico de Atendimentos
- Triagem com IA

Tecnologias utilizadas:

- Next.js
- React
- TypeScript
- Supabase
- Tailwind CSS
- Vercel

A camada de persistência está centralizada no Supabase.

Grande parte da lógica ainda está concentrada em arquivos `page.tsx`, especialmente no módulo de Clientes.

Essa concentração será eliminada gradualmente durante a V5.5.

---

# Arquitetura Alvo (TO-BE)

A arquitetura futura deverá seguir a seguinte organização:

src/

app/

components/

features/

hooks/

services/

repositories/

contexts/

providers/

lib/

types/

utils/

styles/

config/

Cada camada possui responsabilidade única.

---

# Responsabilidades

## app/

Responsável exclusivamente pelas rotas da aplicação.

As páginas deverão atuar apenas como orquestradoras.

Não deverão conter regras de negócio.

---

## components/

Componentes reutilizáveis da interface.

Não devem acessar banco de dados.

Não devem possuir regras de negócio.

---

## features/

Organização por domínio de negócio.

Exemplo:

features/

clients/

dashboard/

auth/

cases/

finance/

Cada feature poderá possuir:

components/

hooks/

services/

repositories/

types/

utils/

---

## hooks/

Toda lógica reutilizável da interface.

Exemplos:

useClients()

useDashboard()

useAuth()

---

## services/

Camada responsável pelas regras de negócio.

Nenhum componente deverá acessar diretamente o banco.

---

## repositories/

Camada responsável pela persistência.

Toda comunicação com Supabase deverá passar pelos repositories.

---

## contexts/

Estados globais.

Autenticação.

Tema.

Preferências.

Permissões.

---

## providers/

Registro de Providers React.

---

## lib/

Bibliotecas compartilhadas.

Supabase.

Rotas.

Helpers.

---

## utils/

Funções auxiliares puras.

Sem efeitos colaterais.

---

## types/

Tipos TypeScript compartilhados.

---

## styles/

Arquivos globais de estilo.

---

## config/

Configurações centralizadas.

---

# Fluxo Arquitetural

O fluxo oficial da aplicação deverá ser:

Page

↓

Hook

↓

Service

↓

Repository

↓

Supabase

Nenhuma página deverá acessar diretamente o banco de dados.

---

# Evolução da V5.5

A V5.5 NÃO adicionará funcionalidades.

Seu objetivo é exclusivamente:

- separar responsabilidades
- reduzir acoplamento
- aumentar reutilização
- preparar o sistema para dezenas de módulos

---

# Objetivo Final

O ConectaJus deverá suportar futuramente:

CRM Jurídico

Financeiro

Agenda

Portal do Cliente

OCR

Banco de Teses

IA Jurídica

Automações

Aplicativo Mobile

API Pública

Marketplace

Business Intelligence

Analytics

Integrações

sem necessidade de reescrever sua arquitetura.