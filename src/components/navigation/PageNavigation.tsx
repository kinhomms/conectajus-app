"use client";

import Link from "next/link";
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
  tone = "dark",
}: PageNavigationProps) {
  const buttonClass = tone === "light"
    ? "rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"
    : "rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white hover:bg-white/10";

  const homeClass = tone === "light"
    ? "rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"
    : "rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white hover:bg-white/10";

  const dashboardClass = tone === "light"
    ? "rounded-2xl bg-[#07182F] px-4 py-2 text-sm font-black text-white hover:bg-[#0B2545]"
    : "rounded-2xl bg-amber-400 px-4 py-2 text-sm font-black text-black hover:bg-amber-300";

  return (
    <nav className="mb-5 flex flex-wrap items-center gap-3" aria-label="Navegacao da pagina">
      <button type="button" onClick={() => window.history.back()} className={buttonClass}>
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