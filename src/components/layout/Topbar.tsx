"use client";

import { useCurrentUserProfile } from "@/features/auth/hooks/useCurrentUserProfile";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";

export function Topbar() {
  const { isCitizen } = useCurrentUserProfile();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0F19]/90 px-6 py-4 text-white backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
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

        <UserMenu isCitizen={isCitizen} />
      </div>
    </header>
  );
}
