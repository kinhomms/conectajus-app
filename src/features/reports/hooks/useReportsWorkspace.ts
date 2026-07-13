"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { listAgendaEvents } from "@/features/agenda/services/agenda.service";
import { getCurrentUser, getUserProfile, isLegalOperatorProfile } from "@/features/auth/services/auth.service";
import { listClients } from "@/features/clients/services/clients.service";
import { listDocuments } from "@/features/documents/services/documents.service";
import { getCreditAccount, listCreditPurchaseRequests, listCreditTransactions } from "@/features/finance/services/finance.service";
import { canCurrentUserAccessMarketplace, getMarketplaceOpportunities, getMarketplaceOpportunityCrmLinks } from "@/features/marketplace/services/marketplace.service";
import { listProcesses } from "@/features/processes/services/processes.service";

export type ReportSignal = "healthy" | "attention" | "critical";

export type ReportMetric = {
  description: string;
  label: string;
  signal: ReportSignal;
  value: string;
};

export type ReportAction = {
  description: string;
  href: string;
  label: string;
  signal: ReportSignal;
  title: string;
};

export function useReportsWorkspace() {
  const router = useRouter();
  const [canAccessMarketplace, setCanAccessMarketplace] = useState(false);
  const [canAccessReports, setCanAccessReports] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [state, setState] = useState({
    agendaEvents: 0,
    agendaOverdue: 0,
    clients: 0,
    creditBalance: 0,
    creditConsumed: 0,
    crmConversions: 0,
    documents: 0,
    marketplaceComplements: 0,
    marketplaceOpportunities: 0,
    marketplaceUnlocked: 0,
    pendingCreditRequests: 0,
    processes: 0,
    processesMissingData: 0,
    topAreas: [] as Array<{ area: string; total: number }>,
  });

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      setMessage("");

      const { data } = await getCurrentUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      const profile = getUserProfile(data.user);

      if (!isLegalOperatorProfile(profile)) {
        setCanAccessReports(false);
        setLoading(false);
        return;
      }

      setCanAccessReports(true);

      const accessResponse = await canCurrentUserAccessMarketplace();
      const allowedMarketplace = !accessResponse.error && Boolean(accessResponse.data);
      setCanAccessMarketplace(allowedMarketplace);

      const [
        clientsResponse,
        processesResponse,
        documentsResponse,
        agendaResponse,
        accountResponse,
        transactionsResponse,
        requestsResponse,
        opportunitiesResponse,
        crmLinksResponse,
      ] = await Promise.all([
        listClients(),
        listProcesses(),
        listDocuments(),
        listAgendaEvents(),
        getCreditAccount(data.user.id),
        listCreditTransactions(data.user.id),
        listCreditPurchaseRequests(data.user.id),
        allowedMarketplace ? getMarketplaceOpportunities() : Promise.resolve({ data: [], error: null }),
        allowedMarketplace ? getMarketplaceOpportunityCrmLinks() : Promise.resolve({ data: [], error: null }),
      ]);

      const clients = clientsResponse.data ?? [];
      const processes = processesResponse.data ?? [];
      const documents = documentsResponse.data ?? [];
      const agendaEvents = agendaResponse.data ?? [];
      const transactions = transactionsResponse.data ?? [];
      const purchaseRequests = requestsResponse.data ?? [];
      const opportunities = opportunitiesResponse.data ?? [];
      const crmLinks = crmLinksResponse.data ?? [];
      const today = new Date();

      const areaTotals = opportunities.reduce<Record<string, number>>((accumulator, opportunity) => {
        const area = opportunity.practice_area || "Área não informada";
        accumulator[area] = (accumulator[area] ?? 0) + 1;
        return accumulator;
      }, {});

      setState({
        agendaEvents: agendaEvents.length,
        agendaOverdue: agendaEvents.filter((event) => event.status === "pending" && new Date(event.starts_at) < today).length,
        clients: clients.length,
        creditBalance: accountResponse.data?.balance ?? 0,
        creditConsumed: transactions
          .filter((transaction) => transaction.transaction_type === "consume")
          .reduce((total, transaction) => total + Math.abs(transaction.amount), 0),
        crmConversions: crmLinks.length,
        documents: documents.length,
        marketplaceComplements: opportunities.filter((opportunity) => Boolean(opportunity.parent_opportunity_id)).length,
        marketplaceOpportunities: opportunities.length,
        marketplaceUnlocked: opportunities.filter((opportunity) => opportunity.status === "unlocked").length,
        pendingCreditRequests: purchaseRequests.filter((request) => request.status === "pending").length,
        processes: processes.length,
        processesMissingData: processes.filter((process) => !process.case_number || !process.court).length,
        topAreas: Object.entries(areaTotals)
          .map(([area, total]) => ({ area, total }))
          .sort((first, second) => second.total - first.total)
          .slice(0, 5),
      });

      const anyError = [
        clientsResponse.error,
        processesResponse.error,
        documentsResponse.error,
        agendaResponse.error,
        accountResponse.error,
        transactionsResponse.error,
        requestsResponse.error,
        opportunitiesResponse.error,
        crmLinksResponse.error,
      ].some(Boolean);

      if (anyError) {
        setMessage("Alguns indicadores não puderam ser carregados. Os cards exibem os dados disponíveis.");
      }

      setLoading(false);
    }

    loadReports();
  }, [router]);

  const conversionRate = useMemo(() => {
    if (state.marketplaceOpportunities === 0) return 0;
    return Math.round((state.crmConversions / state.marketplaceOpportunities) * 100);
  }, [state.crmConversions, state.marketplaceOpportunities]);

  const metrics = useMemo<ReportMetric[]>(() => [
    {
      description: "Demandas mascaradas disponíveis para análise e captação.",
      label: "Oportunidades",
      signal: state.marketplaceOpportunities > 0 ? "healthy" : "attention",
      value: String(state.marketplaceOpportunities),
    },
    {
      description: "Oportunidades desbloqueadas e convertidas para acompanhamento no CRM.",
      label: "Conversão CRM",
      signal: conversionRate >= 30 ? "healthy" : conversionRate > 0 ? "attention" : "critical",
      value: `${conversionRate}%`,
    },
    {
      description: "Saldo atual disponível para desbloquear dados privados no marketplace.",
      label: "Créditos",
      signal: state.creditBalance > 5 ? "healthy" : state.creditBalance > 0 ? "attention" : "critical",
      value: String(state.creditBalance),
    },
    {
      description: "Prazos, tarefas e audiências pendentes com data anterior a hoje.",
      label: "Atrasos",
      signal: state.agendaOverdue === 0 ? "healthy" : state.agendaOverdue <= 3 ? "attention" : "critical",
      value: String(state.agendaOverdue),
    },
  ], [conversionRate, state.agendaOverdue, state.creditBalance, state.marketplaceOpportunities]);

  const actions = useMemo<ReportAction[]>(() => [
    {
      description: state.creditBalance <= 2 ? "Saldo baixo pode travar desbloqueios estratégicos." : "Saldo suficiente para continuar avaliando oportunidades.",
      href: "/financeiro",
      label: "Receita",
      signal: state.creditBalance <= 2 ? "critical" : "healthy",
      title: "Saúde dos créditos",
    },
    {
      description: `${state.processesMissingData} processo(s) sem número ou vara/tribunal cadastrados.`,
      href: "/processos",
      label: "Operação",
      signal: state.processesMissingData > 0 ? "attention" : "healthy",
      title: "Cadastro processual",
    },
    {
      description: `${state.pendingCreditRequests} solicitação(ões) de compra aguardando decisão.`,
      href: "/financeiro",
      label: "Admin",
      signal: state.pendingCreditRequests > 0 ? "attention" : "healthy",
      title: "Pedidos de crédito",
    },
  ], [state.creditBalance, state.pendingCreditRequests, state.processesMissingData]);

  return {
    actions,
    canAccessMarketplace,
    canAccessReports,
    loading,
    message,
    metrics,
    state,
  };
}
