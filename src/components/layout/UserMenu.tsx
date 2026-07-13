"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";

type UserMenuProps = {
  isCitizen?: boolean;
};

export function UserMenu({ isCitizen = false }: UserMenuProps) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={routes.agenda}
        className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 md:block"
      >
        Notificações
      </Link>

      {!isCitizen && (
        <Link
          href={routes.triage}
          className="rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
        >
          IA Jurídica
        </Link>
      )}

      <Link
        href={routes.settings}
        aria-label="Abrir configurações da conta"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 bg-white/10 text-sm font-bold text-amber-300 transition hover:bg-white/15"
      >
        CJ
      </Link>
    </div>
  );
}
