"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConectaJusLogo } from "./ConectaJusLogo";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/clientes", label: "Clientes", icon: "👥" },
  { href: "/triagem", label: "Triagem IA", icon: "🤖" },
  { href: "/processos", label: "Processos", icon: "⚖️", disabled: true },
  { href: "/documentos", label: "Documentos", icon: "📄", disabled: true },
  { href: "/agenda", label: "Agenda", icon: "📅", disabled: true },
  { href: "/financeiro", label: "Financeiro", icon: "💰", disabled: true },
  { href: "/relatorios", label: "Relatórios", icon: "📊", disabled: true },
  { href: "/configuracoes", label: "Configurações", icon: "⚙️", disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-amber-500/20 bg-[#0B0F19] px-5 py-6 text-white lg:block">
      <div className="mb-8">
        <ConectaJusLogo imageClassName="w-[185px]" />
        <p className="mt-3 text-xs uppercase tracking-[0.25em] text-amber-400">
          Inteligência. Conexão.
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex cursor-not-allowed items-center justify-between rounded-2xl px-4 py-3 text-sm text-slate-500"
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-500">
                  breve
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-5 right-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-slate-400">ConectaJus Premium</p>
        <p className="mt-1 text-sm font-semibold text-white">
          Plataforma jurídica inteligente
        </p>
      </div>
    </aside>
  );
}