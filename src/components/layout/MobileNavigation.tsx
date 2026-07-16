"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import { useSidebarNavigation } from "@/features/navigation/hooks/useSidebarNavigation";

const priorityRoutes = [
  routes.dashboard,
  routes.marketplace,
  routes.clients,
  routes.triage,
  routes.documents,
  routes.agenda,
  routes.reports,
  routes.finance,
  routes.processes,
  routes.settings,
];

export function MobileNavigation() {
  const pathname = usePathname();
  const menuItems = useSidebarNavigation();
  const visibleItems = menuItems
    .filter((item) => !item.disabled)
    .filter((item) => priorityRoutes.includes(item.href))
    .sort((firstItem, secondItem) => priorityRoutes.indexOf(firstItem.href) - priorityRoutes.indexOf(secondItem.href))
    .slice(0, 4);

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 rounded-[1.75rem] border border-slate-200 bg-white/95 px-3 py-2 text-slate-700 shadow-2xl shadow-slate-300/70 backdrop-blur transition-colors dark:border-teal-500/20 dark:bg-[#0B0F19]/95 dark:text-white dark:shadow-black/40 lg:hidden">
      <div className="grid grid-cols-4 gap-2">
        {visibleItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-bold transition ${
                active
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-300 dark:text-slate-950"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <span className="text-lg" aria-hidden="true">{item.icon}</span>
              <span className="mt-1 max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


