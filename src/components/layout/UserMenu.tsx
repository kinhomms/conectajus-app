"use client";

export function UserMenu() {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 md:block"
      >
        Notificações
      </button>

      <button
        type="button"
        className="rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
      >
        IA Jurídica
      </button>

      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 bg-white/10 text-sm font-bold text-amber-300">
        CJ
      </div>
    </div>
  );
}