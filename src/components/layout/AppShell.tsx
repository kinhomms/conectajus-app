"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordSafeRoute } from "@/lib/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNavigation } from "./MobileNavigation";

const publicRoutes = ["/", "/login", "/redefinir-senha", "/cadastro", "/privacidade", "/termos", "/regras-marketplace"];
const publicRoutePrefixes = ["/advogados/"];

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const isPublicRoute = publicRoutes.includes(pathname) || publicRoutePrefixes.some((routePrefix) => pathname.startsWith(routePrefix));

  useEffect(() => {
    if (!isPublicRoute) {
      recordSafeRoute(pathname);
    }
  }, [isPublicRoute, pathname]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-950 transition-colors dark:bg-[#0B0F19] dark:text-white">
      <Sidebar />

      <div className="min-h-screen lg:pl-72">
        <Topbar />

        <main className="px-4 pb-28 pt-6 sm:px-6 lg:pb-6">
          {children}
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
}


