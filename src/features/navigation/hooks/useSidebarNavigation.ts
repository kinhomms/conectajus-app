"use client";

import { useEffect, useMemo, useState } from "react";
import { routes } from "@/lib/routes";
import { useCurrentUserProfile } from "@/features/auth/hooks/useCurrentUserProfile";
import { canCurrentUserAccessMarketplace } from "@/features/marketplace/services/marketplace.service";

export type SidebarMenuItem = {
  description?: string;
  disabled?: boolean;
  href: string;
  icon: string;
  label: string;
};

const citizenItems: SidebarMenuItem[] = [
  { href: routes.dashboard, label: "Meu portal", icon: "🏠", description: "Acompanhe casos publicados" },
  { href: routes.triage, label: "Triagem do caso", icon: "🤖", description: "Organize uma nova demanda" },
  { href: routes.documents, label: "Meus documentos", icon: "📄", description: "Envios e complementos" },
  { href: routes.agenda, label: "Minha agenda", icon: "📅", description: "Próximos passos" },
  { href: routes.settings, label: "Configurações", icon: "⚙️", description: "Conta e privacidade" },
];

const legalOperatorItems: SidebarMenuItem[] = [
  { href: routes.dashboard, label: "Dashboard", icon: "🏠", description: "Visão executiva" },
  { href: routes.clients, label: "Clientes", icon: "👥", description: "CRM jurídico" },
  { href: routes.triage, label: "Triagem IA", icon: "🤖", description: "Organização inicial" },
  { href: routes.processes, label: "Processos", icon: "⚖️", description: "Gestão processual" },
  { href: routes.documents, label: "Documentos", icon: "📄", description: "Dossiês e provas" },
  { href: routes.agenda, label: "Agenda", icon: "📅", description: "Prazos e tarefas" },
  { href: routes.reports, label: "Relatórios", icon: "📊", description: "Indicadores executivos" },
  { href: routes.settings, label: "Configurações", icon: "⚙️", description: "Conta e operação" },
];

const marketplaceItems: SidebarMenuItem[] = [
  { href: routes.marketplace, label: "Marketplace", icon: "🧭", description: "Leads mascarados" },
  { href: routes.finance, label: "Financeiro", icon: "💰", description: "Créditos e consumo" },
];

const comingSoonItems: SidebarMenuItem[] = [];

export function useSidebarNavigation() {
  const { isCitizen, isLegalOperator } = useCurrentUserProfile();
  const [canUseMarketplace, setCanUseMarketplace] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPermissions() {
      if (!isLegalOperator) {
        setCanUseMarketplace(false);
        return;
      }

      const { data, error } = await canCurrentUserAccessMarketplace();

      if (!mounted) return;
      setCanUseMarketplace(!error && Boolean(data));
    }

    loadPermissions();

    return () => {
      mounted = false;
    };
  }, [isLegalOperator]);

  return useMemo(() => {
    if (isCitizen) {
      return citizenItems;
    }

    return [
      ...legalOperatorItems,
      ...(canUseMarketplace ? marketplaceItems : []),
      ...comingSoonItems,
    ];
  }, [canUseMarketplace, isCitizen]);
}
