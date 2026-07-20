"use client";

import Link from "next/link";
import { navigateBackSafely } from "@/lib/navigation";
import { routes } from "@/lib/routes";

type PageNavigationProps = {
  dashboardLabel?: string;
  dashboardHref?: string;
  showDashboard?: boolean;
  tone?: "dark" | "light";
};

export function PageNavigation({
  dashboardHref = routes.dashboard,
  dashboardLabel = "Painel",
  showDashboard = true,
  tone = "light",
}: PageNavigationProps) {
  const buttonClass = tone === "light"
    ? "rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-800 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
    : "rounded-2xl border border-white/20 bg-white/15 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-white/20";

  const homeClass = tone === "light"
    ? "rounded-2xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-teal-800 shadow-sm hover:bg-teal-100 dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-100 dark:hover:bg-teal-400/15"
    : "rounded-2xl border border-white/20 bg-white px-4 py-2 text-sm font-black text-slate-900 shadow-sm hover:bg-slate-100";

  const dashboardClass = tone === "light"
    ? "rounded-2xl bg-teal-600 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-teal-500 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200"
    : "rounded-2xl bg-white px-4 py-2 text-sm font-black text-slate-950 shadow-sm hover:bg-slate-100";

  return (
    <nav className="mb-5 flex flex-wrap items-center gap-3" aria-label="Navegação da página">
      <button type="button" onClick={() => navigateBackSafely(dashboardHref)} className={buttonClass}>
        ← Voltar
      </button>
      <Link href={routes.home} className={homeClass}>
        Início
      </Link>
      {showDashboard ? (
        <Link href={dashboardHref} className={dashboardClass}>
          {dashboardLabel}
        </Link>
      ) : null}
    </nav>
  );
}
