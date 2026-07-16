"use client";

import { useCurrentUserProfile } from "@/features/auth/hooks/useCurrentUserProfile";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export function Topbar() {
  const { isCitizen } = useCurrentUserProfile();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-6 py-4 text-slate-950 shadow-sm shadow-slate-200/60 backdrop-blur transition-colors dark:border-white/10 dark:bg-[#0B0F19]/90 dark:text-white dark:shadow-black/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
            ConectaJus
          </p>
          <h1 className="text-lg font-semibold">
            {isCitizen ? "Portal do cidadão" : "Ecossistema jurídico inteligente"}
          </h1>
        </div>

        <div className="hidden flex-1 justify-center px-8 lg:flex">
          <SearchBar
            isCitizen={isCitizen}
            placeholder={isCitizen ? "Buscar meus documentos e próximos passos..." : "Buscar clientes, processos, documentos e oportunidades..."}
          />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu isCitizen={isCitizen} />
        </div>
      </div>
    </header>
  );
}

