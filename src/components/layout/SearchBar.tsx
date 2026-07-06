"use client";

export function SearchBar() {
  return (
    <div className="w-full max-w-xl">
      <label htmlFor="global-search" className="sr-only">
        Buscar na plataforma
      </label>

      <input
        id="global-search"
        type="search"
        placeholder="Buscar clientes, processos, documentos..."
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/70 focus:bg-white/10"
      />
    </div>
  );
}