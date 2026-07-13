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
      <main className="flex min-h-[60vh] items-center justify-center text-white">
        <p className="font-black">Carregando processos...</p>
      </main>
    );
  }

  return (
    <section className="text-white">
      <PageNavigation />
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
            Processos
          </p>
          <h1 className="mt-2 text-3xl font-bold">Gestão processual</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Acompanhe os processos vinculados aos clientes cadastrados no CRM jurídico.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={processes.refreshProcesses}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Atualizar
          </button>
          <Link
            href={routes.clients}
            className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-bold text-black hover:bg-amber-300"
          >
            Vincular pelo cliente
          </Link>
          <Link
            href={routes.agenda}
            className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/5"
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
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
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
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            Pendência cadastral
          </p>
          <h2 className="mt-2 text-xl font-black text-white">
            Existem processos sem número ou vara/tribunal
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-100">
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
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#111827] p-10 text-center">
          <h2 className="text-xl font-semibold">Nenhum processo encontrado</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
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
    <div className="rounded-2xl border border-white/10 bg-[#111827] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
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
          ? "border-amber-400 bg-amber-400 text-black"
          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function ProcessCard({ process }: { process: LegalProcess }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400">
            {process.practice_area || "Área a confirmar"}
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">{process.case_title}</h2>
        </div>

        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
          {process.status || "Sem status"}
        </span>
      </div>

      <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
        <Info label="Número" value={process.case_number || "Não informado"} />
        <Info label="Vara/Tribunal" value={process.court || "Não informado"} />
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">
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
    <div className="rounded-2xl bg-[#0B0F19] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-white">{value}</p>
    </div>
  );
}
