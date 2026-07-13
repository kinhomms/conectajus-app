import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConectaJus | Inteligência Jurídica",
  description:
    "ConectaJus: inteligência, conexão e gestão jurídica em uma plataforma premium.",
  icons: {
    icon: "/brand/conectajus-logo-premium.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
