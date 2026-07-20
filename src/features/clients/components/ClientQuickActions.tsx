"use client";

type ClientQuickActionsProps = {
  onRefresh?: () => void;
  onCreateClient?: () => void;
};

export function ClientQuickActions({
  onRefresh,
  onCreateClient,
}: ClientQuickActionsProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-5 text-slate-950 dark:text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
          Clientes V2 Premium
        </p>
        <h1 className="mt-2 text-2xl font-bold">CRM jurídico inteligente</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Visualize, filtre e acompanhe seus clientes em uma experiência premium.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 text-sm font-semibold text-slate-950 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10"
        >
          Atualizar
        </button>

        <button
          type="button"
          onClick={onCreateClient}
          className="rounded-2xl bg-teal-600 dark:bg-teal-300 px-4 py-3 text-sm font-bold text-white dark:text-slate-950 transition hover:bg-teal-500 dark:hover:bg-teal-200"
        >
          + Novo cliente
        </button>
      </div>
    </div>
  );
}
