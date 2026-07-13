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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-amber-500/20 bg-[#0B0F19]/95 px-3 py-2 text-white shadow-2xl shadow-black/40 backdrop-blur lg:hidden">
      <div className="grid grid-cols-4 gap-2">
        {visibleItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-bold transition ${
                active
                  ? "bg-amber-400 text-black"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
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
