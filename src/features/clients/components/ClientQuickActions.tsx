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
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#111827] p-5 text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
          Clientes V2 Premium
        </p>
        <h1 className="mt-2 text-2xl font-bold">CRM jurídico inteligente</h1>
        <p className="mt-1 text-sm text-slate-400">
          Visualize, filtre e acompanhe seus clientes em uma experiência premium.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Atualizar
        </button>

        <button
          type="button"
          onClick={onCreateClient}
          className="rounded-2xl bg-amber-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-amber-300"
        >
          + Novo cliente
        </button>
      </div>
    </div>
  );
}