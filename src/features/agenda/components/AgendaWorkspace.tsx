"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { getAgendaIntegrationStatus } from "@/features/agenda/services/agenda.service";
import { useAgendaWorkspace } from "@/features/agenda/hooks/useAgendaWorkspace";
import type { AgendaEventPriority, AgendaEventStatus, AgendaEventType, LegalAgendaEvent } from "@/features/agenda/types/agenda.types";

const eventTypeLabels: Record<AgendaEventType, string> = {
  deadline: "Prazo",
  hearing: "AudiÃªncia",
  task: "Tarefa",
  meeting: "ReuniÃ£o",
  other: "Outro",
};

const statusLabels: Record<AgendaEventStatus, string> = {
  pending: "Pendente",
  completed: "ConcluÃ­do",
  canceled: "Cancelado",
};

const priorityLabels: Record<AgendaEventPriority, string> = {
  low: "Baixa",
  medium: "MÃ©dia",
  high: "Alta",
  critical: "CrÃ­tica",
};

export function AgendaWorkspace() {
  const agenda = useAgendaWorkspace();
  const integration = getAgendaIntegrationStatus(agenda.isSourceConfigured);

  if (agenda.loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-slate-950 dark:text-white">
        <p className="font-black">Carregando agenda...</p>
      </main>
    );
  }

  return (
    <section className="text-slate-950 dark:text-white">
      <PageNavigation dashboardLabel="Portal do cidadÃ£o" />
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
            Agenda
          </p>
          <h1 className="mt-2 text-3xl font-bold">Agenda jurÃ­dica</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Central de prazos, audiÃªncias, reuniÃµes e tarefas vinculadas Ã  operaÃ§Ã£o jurÃ­dica.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={agenda.refreshEvents}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Atualizar
          </button>
          <Link
            href={routes.processes}
            className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-bold text-white dark:bg-teal-300 dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200"
          >
            Ver processos
          </Link>
        </div>
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-[1fr_130px_130px_130px_130px_130px_130px]">
        <div className="space-y-3">
        <input
          type="search"
          value={agenda.search}
          onChange={(event) => agenda.setSearch(event.target.value)}
          placeholder="Buscar por tÃ­tulo, descriÃ§Ã£o, local, tipo, prioridade ou status..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-600 dark:text-slate-400 focus:border-teal-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-300"
        />

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <FilterButton active={agenda.typeFilter === "all"} label="Todos" onClick={() => agenda.setTypeFilter("all")} />
              <FilterButton active={agenda.typeFilter === "deadline"} label="Prazos" onClick={() => agenda.setTypeFilter("deadline")} />
              <FilterButton active={agenda.typeFilter === "hearing"} label="AudiÃªncias" onClick={() => agenda.setTypeFilter("hearing")} />
              <FilterButton active={agenda.typeFilter === "meeting"} label="ReuniÃµes" onClick={() => agenda.setTypeFilter("meeting")} />
              <FilterButton active={agenda.typeFilter === "task"} label="Tarefas" onClick={() => agenda.setTypeFilter("task")} />
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterButton active={agenda.statusFilter === "all"} label="Tudo" onClick={() => agenda.setStatusFilter("all")} />
              <FilterButton active={agenda.statusFilter === "pending"} label="Pendentes" onClick={() => agenda.setStatusFilter("pending")} />
              <FilterButton active={agenda.statusFilter === "upcoming"} label="7 dias" onClick={() => agenda.setStatusFilter("upcoming")} />
              <FilterButton active={agenda.statusFilter === "overdue"} label="Atrasados" onClick={() => agenda.setStatusFilter("overdue")} />
              <FilterButton active={agenda.statusFilter === "completed"} label="ConcluÃ­dos" onClick={() => agenda.setStatusFilter("completed")} />
              <FilterButton active={agenda.statusFilter === "canceled"} label="Cancelados" onClick={() => agenda.setStatusFilter("canceled")} />
            </div>
          </div>
        </div>

        <Metric label="Total" value={agenda.metrics.total} />
        <Metric label="Hoje" value={agenda.metrics.today} />
        <Metric label="7 dias" value={agenda.metrics.upcoming} />
        <Metric label="Atrasados" value={agenda.metrics.overdue} />
        <Metric label="Pendentes" value={agenda.metrics.pending} />
        <Metric label="CrÃ­ticos" value={agenda.metrics.critical} />
      </div>

      {agenda.metrics.overdue > 0 ? (
        <div className="mb-6 rounded-3xl border border-red-400/30 bg-red-500/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-200">
            AtenÃ§Ã£o operacional
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Existem compromissos pendentes em atraso</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-red-100">
            Revise prazos, audiÃªncias e tarefas vencidas antes de avanÃ§ar para novos atendimentos.
          </p>
        </div>
      ) : null}

      {agenda.message && (
        <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm font-semibold text-amber-900 dark:text-amber-100">
          {agenda.message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {agenda.filteredEvents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white dark:border-white/10 dark:bg-[#111827] p-10">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                {integration.configured ? "Sem compromissos" : "Fonte pendente"}
              </p>
              <h2 className="mt-3 text-2xl font-bold">Nenhum evento encontrado</h2>
              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">{integration.message}</p>
              <p className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-slate-700 dark:text-slate-300">
                Fonte esperada: {integration.expectedSource}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {agenda.filteredEvents.map((event) => (
              <AgendaEventCard
                key={event.id}
                event={event}
                onChangeStatus={agenda.handleChangeEventStatus}
                updating={agenda.updatingEventId === event.id}
              />
            ))}
          </div>
        )}

        <aside className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
          <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
            OperaÃ§Ã£o jurÃ­dica
          </p>
          <h3 className="mt-2 text-xl font-bold">Escopo conectado</h3>

          <div className="mt-5 space-y-3">
            <ChecklistItem text="Prazos processuais vinculados ao cliente e ao processo." />
            <ChecklistItem text="AudiÃªncias com data, horÃ¡rio, tribunal/local e responsÃ¡vel." />
            <ChecklistItem text="Tarefas internas com prioridade e status de execuÃ§Ã£o." />
            <ChecklistItem text="Base pronta para alertas futuros e visÃ£o diÃ¡ria do escritÃ³rio." />
          </div>
        </aside>
      </div>
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

function AgendaEventCard({
  event,
  onChangeStatus,
  updating,
}: {
  event: LegalAgendaEvent;
  onChangeStatus: (eventId: string, status: AgendaEventStatus) => void;
  updating: boolean;
}) {
  const startDate = new Date(event.starts_at);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{eventTypeLabels[event.event_type]}</Badge>
            <Badge>{priorityLabels[event.priority]}</Badge>
            <Badge>{statusLabels[event.status]}</Badge>
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">{event.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {event.description || "Nenhuma descriÃ§Ã£o cadastrada."}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 dark:bg-[#0B0F19] p-4 text-left lg:min-w-48">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Data</p>
          <p className="mt-1 font-bold text-slate-950 dark:text-white">
            {startDate.toLocaleDateString("pt-BR")}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {startDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {event.location && (
        <p className="mt-5 rounded-2xl bg-white/5 p-4 text-sm text-slate-700 dark:text-slate-300">
          Local: {event.location}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-5">
        {event.status !== "completed" && (
          <StatusButton
            disabled={updating}
            label={updating ? "Salvando..." : "Concluir"}
            onClick={() => onChangeStatus(event.id, "completed")}
            variant="primary"
          />
        )}
        {event.status !== "pending" && (
          <StatusButton
            disabled={updating}
            label="Reabrir"
            onClick={() => onChangeStatus(event.id, "pending")}
          />
        )}
        {event.status !== "canceled" && (
          <StatusButton
            disabled={updating}
            label="Cancelar"
            onClick={() => onChangeStatus(event.id, "canceled")}
            variant="danger"
          />
        )}
      </div>
    </article>
  );
}

function StatusButton({
  disabled,
  label,
  onClick,
  variant = "secondary",
}: {
  disabled: boolean;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
}) {
  const variantClasses = {
    primary: "border-teal-600 bg-teal-600 text-white dark:border-teal-300 dark:bg-teal-300 dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200",
    secondary: "border-white/10 bg-white/5 text-slate-950 dark:text-white hover:bg-white/10",
    danger: "border-red-400/30 bg-red-500/10 text-red-100 hover:bg-red-500/20",
  }[variant];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses}`}
    >
      {label}
    </button>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
      {children}
    </span>
  );
}

function ChecklistItem({ text }: { text: string }) {
  return <div className="rounded-2xl bg-slate-50 dark:bg-[#0B0F19] p-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{text}</div>;
}
