"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import type { AgendaEventPriority } from "@/features/agenda/types/agenda.types";
import type {
  Client,
  ClientCase,
  ClientDocument,
  ClientMarketplaceLink,
  ClientNote,
} from "@/features/clients/types/client.types";

type Props = {
  agendaPriority: AgendaEventPriority;
  agendaStartsAt: string;
  agendaTitle: string;
  client: Client | null;
  marketplaceLink?: ClientMarketplaceLink | null;
  notes: ClientNote[];
  cases: ClientCase[];
  documents: ClientDocument[];
  savingAgendaEvent: boolean;
  onAgendaPriorityChange: (value: AgendaEventPriority) => void;
  onAgendaStartsAtChange: (value: string) => void;
  onAgendaTitleChange: (value: string) => void;
  onCreateAgendaEvent: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ClientDetailsPanel({
  agendaPriority,
  agendaStartsAt,
  agendaTitle,
  client,
  marketplaceLink,
  notes,
  cases,
  documents,
  savingAgendaEvent,
  onAgendaPriorityChange,
  onAgendaStartsAtChange,
  onAgendaTitleChange,
  onCreateAgendaEvent,
}: Props) {
  if (!client) {
    return (
      <section className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-10 text-center text-slate-600 dark:text-slate-400">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Nenhum cliente selecionado
          </h2>

          <p className="mt-3 max-w-md">
            Selecione um cliente na lista para visualizar seu dossiê completo.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-8 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-600 dark:bg-teal-300 text-2xl font-bold text-white dark:text-slate-950">
            {client.full_name
              ?.split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-950 dark:text-white">{client.full_name}</h1>
              {marketplaceLink ? (
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-200">
                  Origem Marketplace
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Cliente ativo na plataforma</p>
          </div>
        </div>
      </div>

      {marketplaceLink ? (
        <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Funil Marketplace</p>
          <p className="mt-2 text-sm leading-6 text-emerald-50">
            Este cliente foi criado ou vinculado a partir de uma oportunidade desbloqueada. O vínculo preserva a origem do lead e evita conversões duplicadas.
          </p>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <Info title="Oportunidade" value={marketplaceLink.opportunity_id} />
            <Info title="Vinculado em" value={new Date(marketplaceLink.created_at).toLocaleString("pt-BR")} />
          </div>
        </div>
      ) : null}

      <form onSubmit={onCreateAgendaEvent} className="mt-8 rounded-2xl border border-teal-200 bg-teal-50 dark:border-teal-300/20 dark:bg-teal-300/10 p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700 dark:text-teal-200">Próximo passo</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">Agendar tarefa do atendimento</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              Crie uma tarefa vinculada a este cliente para continuar o atendimento na agenda.
            </p>
          </div>
          <Link href={routes.agenda} className="w-fit rounded-2xl border border-slate-200 dark:border-white/10 px-4 py-2 text-sm font-black text-slate-950 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10">
            Ver agenda
          </Link>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_220px_160px]">
          <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Título
            <input
              value={agendaTitle}
              onChange={(event) => onAgendaTitleChange(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] px-4 py-3 text-sm text-slate-950 dark:text-white outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-teal-500 dark:focus:border-teal-300"
              placeholder="Ex.: Retornar contato com cliente"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Data e hora
            <input
              type="datetime-local"
              value={agendaStartsAt}
              onChange={(event) => onAgendaStartsAtChange(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] px-4 py-3 text-sm text-slate-950 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-300"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Prioridade
            <select
              value={agendaPriority}
              onChange={(event) => onAgendaPriorityChange(event.target.value as AgendaEventPriority)}
              className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] px-4 py-3 text-sm text-slate-950 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-300"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={savingAgendaEvent}
          className="mt-4 rounded-2xl bg-teal-600 dark:bg-teal-300 px-5 py-3 text-sm font-black text-white dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingAgendaEvent ? "Criando..." : "Criar na agenda"}
        </button>
      </form>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Info title="CPF" value={client.cpf || "Não informado"} />
        <Info title="RG" value={client.rg || "Não informado"} />
        <Info title="Telefone" value={client.phone || "Não informado"} />
        <Info title="Email" value={client.email || "Não informado"} />
        <Info title="Cidade" value={client.city || "Não informado"} />
        <Info title="Estado" value={client.state || "Não informado"} />
        <Info title="Profissão" value={client.profession || "Não informado"} />
        <Info title="Estado Civil" value={client.marital_status || "Não informado"} />
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-6">
        <h3 className="mb-3 text-lg font-semibold text-slate-950 dark:text-white">Observações</h3>
        <p className="text-slate-700 dark:text-slate-300">
          {client.notes || "Nenhuma observação cadastrada."}
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <DossierList
          title="Atendimentos"
          empty="Nenhuma anotação registrada."
          items={notes.map((note) => ({
            id: note.id,
            title: note.title,
            description: note.content || note.note_type || "Sem descrição",
          }))}
        />

        <DossierList
          title="Processos"
          empty="Nenhum processo vinculado."
          items={cases.map((clientCase) => ({
            id: clientCase.id,
            title: clientCase.case_title,
            description:
              clientCase.case_number || clientCase.status || "Sem número informado",
          }))}
        />

        <DossierList
          title="Documentos"
          empty="Nenhum documento registrado."
          items={documents.map((document) => ({
            id: document.id,
            title: document.document_name,
            description: document.document_type || document.notes || "Sem tipo informado",
          }))}
        />
      </div>
    </section>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-[#0B0F19] p-5">
      <p className="text-xs uppercase tracking-widest text-teal-600 dark:text-teal-300">{title}</p>
      <p className="mt-2 break-words text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function DossierList({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: Array<{ id: string; title: string; description: string }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950 dark:text-white">{title}</h3>
        <span className="rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">{empty}</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 4).map((item) => (
            <article key={item.id} className="rounded-2xl bg-white dark:bg-white/5 p-4">
              <h4 className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</h4>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
