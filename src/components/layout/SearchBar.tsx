"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

type SearchBarProps = {
  isCitizen?: boolean;
  placeholder?: string;
};

type SearchTarget = {
  href: string;
  keywords: string[];
  label: string;
};

const citizenTargets: SearchTarget[] = [
  { href: routes.dashboard, keywords: ["portal", "painel", "casos", "caso", "acompanhar", "demanda"], label: "Portal do cidadão" },
  { href: routes.triage, keywords: ["triagem", "ia", "relato", "demanda", "caso", "complemento"], label: "Triagem do caso" },
  { href: routes.documents, keywords: ["documentos", "documento", "arquivo", "arquivos", "provas", "comprovante"], label: "Meus documentos" },
  { href: routes.agenda, keywords: ["agenda", "prazo", "prazos", "tarefa", "tarefas", "compromisso", "notificações"], label: "Minha agenda" },
  { href: routes.settings, keywords: ["configurações", "configuracoes", "conta", "perfil", "privacidade", "segurança"], label: "Configurações" },
];

const legalOperatorTargets: SearchTarget[] = [
  { href: routes.dashboard, keywords: ["dashboard", "painel", "visão", "visao", "executivo", "operação"], label: "Dashboard" },
  { href: routes.clients, keywords: ["clientes", "cliente", "crm", "atendimento", "contato"], label: "Clientes / CRM" },
  { href: routes.marketplace, keywords: ["marketplace", "oportunidades", "leads", "lead", "captação", "captacao"], label: "Marketplace" },
  { href: routes.finance, keywords: ["financeiro", "créditos", "creditos", "saldo", "compra", "faturamento"], label: "Financeiro" },
  { href: routes.processes, keywords: ["processos", "processo", "vara", "tribunal", "jurídico", "juridico"], label: "Processos" },
  { href: routes.documents, keywords: ["documentos", "documento", "dossiê", "dossie", "provas", "arquivos"], label: "Documentos" },
  { href: routes.agenda, keywords: ["agenda", "prazo", "prazos", "audiência", "audiencia", "tarefas", "notificações"], label: "Agenda" },
  { href: routes.triage, keywords: ["triagem", "ia", "inteligência", "inteligencia", "análise", "analise"], label: "Triagem IA" },
  { href: routes.reports, keywords: ["relatórios", "relatorios", "indicadores", "métricas", "metricas", "gestão", "gestao"], label: "Relatórios" },
  { href: routes.settings, keywords: ["configurações", "configuracoes", "conta", "perfil", "operação", "operacao"], label: "Configurações" },
];

export function SearchBar({ isCitizen = false, placeholder = "Buscar clientes, processos, documentos..." }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const targets = useMemo(() => (isCitizen ? citizenTargets : legalOperatorTargets), [isCitizen]);

  const suggestions = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    if (!normalizedQuery) {
      return targets.slice(0, 4);
    }

    return targets
      .filter((target) =>
        normalizeSearch(target.label).includes(normalizedQuery) ||
        target.keywords.some((keyword) => normalizeSearch(keyword).includes(normalizedQuery)),
      )
      .slice(0, 4);
  }, [query, targets]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = findBestTarget(normalizeSearch(query), targets);
    router.push(target?.href ?? (isCitizen ? routes.dashboard : routes.reports));
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <label htmlFor="global-search" className="sr-only">
        Buscar na plataforma
      </label>

      <input
        id="global-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        list="global-search-suggestions"
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-24 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/70 focus:bg-white/10"
      />

      <button
        type="submit"
        className="absolute right-1.5 top-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-black text-black transition hover:bg-amber-300"
      >
        Buscar
      </button>

      <datalist id="global-search-suggestions">
        {suggestions.map((target) => (
          <option key={target.href} value={target.label} />
        ))}
      </datalist>
    </form>
  );
}

function findBestTarget(query: string, targets: SearchTarget[]) {
  if (!query) return null;

  return targets.find((target) =>
    normalizeSearch(target.label).includes(query) ||
    target.keywords.some((keyword) => normalizeSearch(keyword).includes(query)),
  ) ?? null;
}

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
