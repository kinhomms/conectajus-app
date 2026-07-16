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
        className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 md:block"
      >
        Notificações
      </Link>

      {!isCitizen && (
        <Link
          href={routes.marketplace}
          className="rounded-2xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200"
        >
          Oportunidades
        </Link>
      )}

      <Link
        href={routes.settings}
        aria-label="Abrir configurações da conta"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-sm font-bold text-teal-700 transition hover:bg-teal-100 dark:border-teal-400/30 dark:bg-white/10 dark:text-teal-200 dark:hover:bg-white/15"
      >
        CJ
      </Link>
    </div>
  );
}



