"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNavigation } from "./MobileNavigation";

const publicRoutes = ["/", "/login", "/cadastro"];

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
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