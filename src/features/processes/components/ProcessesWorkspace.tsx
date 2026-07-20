"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { useProcessesWorkspace } from "@/features/processes/hooks/useProcessesWorkspace";
import type { LegalProcess } from "@/features/processes/types/process.types";

export function ProcessesWorkspace() {
  const processes = useProcessesWorkspace();

  if (processes.loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-slate-950 dark:text-white">
        <p className="font-black">Carregando processos...</p>
      </main>
    );
  }

  return (
    <section className="text-slate-950 dark:text-white">
      <PageNavigation />
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
            Processos
          </p>
          <h1 className="mt-2 text-3xl font-bold">Gestão processual</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Acompanhe os processos vinculados aos clientes cadastrados no CRM jurídico.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={processes.refreshProcesses}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Atualizar
          </button>
          <Link
            href={routes.clients}
            className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-bold text-white dark:bg-teal-300 dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200"
          >
            Vincular pelo cliente
          </Link>
          <Link
            href={routes.agenda}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Ver agenda
          </Link>
        </div>
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-[1fr_140px_140px_140px_140px_140px]">
        <div className="space-y-3">
        <input
          type="search"
          value={processes.search}
          onChange={(event) => processes.setSearch(event.target.value)}
          placeholder="Buscar por título, número, área, vara ou status..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-600 dark:text-slate-400 focus:border-teal-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-300"
        />

          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={processes.statusFilter === "all"}
              label="Todos"
              onClick={() => processes.setStatusFilter("all")}
            />
            <FilterButton
              active={processes.statusFilter === "active"}
              label="Ativos"
              onClick={() => processes.setStatusFilter("active")}
            />
            <FilterButton
              active={processes.statusFilter === "missing_data"}
              label="Pendências"
              onClick={() => processes.setStatusFilter("missing_data")}
            />
            <FilterButton
              active={processes.statusFilter === "closed"}
              label="Encerrados"
              onClick={() => processes.setStatusFilter("closed")}
            />
          </div>
        </div>

        <Metric label="Total" value={processes.processStats.total} />
        <Metric label="Ativos" value={processes.processStats.active} />
        <Metric label="Pendências" value={processes.processStats.missingData} />
        <Metric label="Encerrados" value={processes.processStats.closed} />
        <Metric label="Exibidos" value={processes.processStats.displayed} />
      </div>

      {processes.processStats.missingData > 0 ? (
        <div className="mb-6 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-teal-700 dark:text-teal-200">
            Pendência cadastral
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">
            Existem processos sem número ou vara/tribunal
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-900 dark:text-amber-100">
            Complete esses dados no CRM para melhorar controle processual, agenda de prazos e auditoria do atendimento.
          </p>
        </div>
      ) : null}

      {processes.message && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
          {processes.message}
        </div>
      )}

      {processes.filteredProcesses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white dark:border-white/10 dark:bg-[#111827] p-10 text-center">
          <h2 className="text-xl font-semibold">Nenhum processo encontrado</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Quando um processo for vinculado no painel de um cliente, ele aparecerá aqui para acompanhamento consolidado.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {processes.filteredProcesses.map((process) => (
            <ProcessCard key={process.id} process={process} />
          ))}
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-wide transition ${
        active
          ? "border-teal-600 bg-teal-600 text-white dark:border-teal-300 dark:bg-teal-300 dark:text-slate-950"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function ProcessCard({ process }: { process: LegalProcess }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">
            {process.practice_area || "Área a confirmar"}
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{process.case_title}</h2>
        </div>

        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
          {process.status || "Sem status"}
        </span>
      </div>

      <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-300 md:grid-cols-2">
        <Info label="Número" value={process.case_number || "Não informado"} />
        <Info label="Vara/Tribunal" value={process.court || "Não informado"} />
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {process.description || "Nenhuma descrição cadastrada."}
      </p>

      <p className="mt-5 text-xs text-slate-500">
        Criado em {new Date(process.created_at).toLocaleDateString("pt-BR")}
      </p>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-[#0B0F19] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
