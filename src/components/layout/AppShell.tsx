"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

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

        <main className="px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}