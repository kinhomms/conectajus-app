"use client";

import type { Client } from "@/features/clients/types/client.types";

type ClientListPanelProps = {
  clients: Client[];
  marketplaceClientIds?: string[];
  selectedClientId?: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectClient: (client: Client) => void;
  onCreateClient?: () => void;
};

function getInitials(name?: string | null) {
  if (!name) return "CJ";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function ClientListPanel({
  clients,
  marketplaceClientIds = [],
  selectedClientId,
  search,
  onSearchChange,
  onSelectClient,
  onCreateClient,
}: ClientListPanelProps) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-5 text-slate-950 dark:text-white shadow-xl shadow-slate-200/70 dark:shadow-black/20">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
            Clientes
          </p>
          <h2 className="mt-2 text-xl font-semibold">Carteira jurídica</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {clients.length} cliente(s) cadastrados
          </p>
        </div>

        {onCreateClient && (
          <button
            type="button"
            onClick={onCreateClient}
            className="rounded-2xl bg-teal-600 dark:bg-teal-300 px-4 py-2 text-sm font-semibold text-white dark:text-slate-950 transition hover:bg-teal-500 dark:hover:bg-teal-200"
          >
            + Novo
          </button>
        )}
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar cliente, CPF, telefone ou marketplace..."
        className="mb-5 w-full rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 text-sm text-slate-950 dark:text-white outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-teal-500 dark:focus:border-teal-300"
      />

      <div className="space-y-3">
        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-6 text-center">
            <p className="text-sm font-medium text-slate-950 dark:text-white">
              Nenhum cliente encontrado
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Ajuste a busca ou cadastre um novo cliente.
            </p>
          </div>
        ) : (
          clients.map((client) => {
            const active = selectedClientId === client.id;
            const fromMarketplace = marketplaceClientIds.includes(client.id);

            return (
              <button
                key={client.id}
                type="button"
                onClick={() => onSelectClient(client)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-teal-600 bg-teal-600 dark:border-teal-300 dark:bg-teal-300/10"
                    : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-600 dark:bg-teal-300 text-sm font-bold text-white dark:text-slate-950">
                    {getInitials(client.full_name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                        {client.full_name || "Cliente sem nome"}
                      </p>
                      {fromMarketplace ? (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-wide text-emerald-200">
                          Marketplace
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-xs text-slate-600 dark:text-slate-400">
                      CPF: {client.cpf || "não informado"}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      WhatsApp: {client.phone || "não informado"}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
