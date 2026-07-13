"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/features/auth/services/auth.service";
import {
  canCurrentUserAccessMarketplace,
  createCrmClientFromUnlockedOpportunity,
  createMarketplaceCitizenDocumentSignedUrl,
  ensureCreditAccount,
  getAccessibleMarketplaceCitizenDocuments,
  getAccessibleOpportunityPrivateDetails,
  getCreditAccount,
  getMarketplaceOpportunities,
  getMarketplaceOpportunityCrmLinks,
  unlockOpportunity,
} from "@/features/marketplace/services/marketplace.service";
import type {
  LawyerCreditAccount,
  MarketplaceCitizenDocument,
  MarketplaceOpportunity,
  MarketplaceOpportunityCrmLink,
  MarketplaceOpportunityPrivateDetails,
} from "@/features/marketplace/types/marketplace.types";

type OpportunityKindFilter = "all" | "original" | "complement";

export function useMarketplaceWorkspace() {
  const router = useRouter();
  const [canAccessMarketplace, setCanAccessMarketplace] = useState(false);
  const [convertedClientIds, setConvertedClientIds] = useState<Record<string, string>>({});
  const [convertingOpportunityId, setConvertingOpportunityId] = useState("");
  const [creditAccount, setCreditAccount] = useState<LawyerCreditAccount | null>(null);
  const [crmLinks, setCrmLinks] = useState<MarketplaceOpportunityCrmLink[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [documents, setDocuments] = useState<MarketplaceCitizenDocument[]>([]);
  const [openingDocumentId, setOpeningDocumentId] = useState("");
  const [opportunities, setOpportunities] = useState<MarketplaceOpportunity[]>([]);
  const [opportunityKindFilter, setOpportunityKindFilter] = useState<OpportunityKindFilter>("all");
  const [privateDetails, setPrivateDetails] = useState<MarketplaceOpportunityPrivateDetails[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [unlockingId, setUnlockingId] = useState("");

  const refreshOpportunities = useCallback(async (allowed = canAccessMarketplace) => {
    setMessage("");

    if (!allowed) {
      setOpportunities([]);
      setPrivateDetails([]);
      setDocuments([]);
      setCrmLinks([]);
      setConvertedClientIds({});
      return;
    }

    const [opportunityResponse, detailsResponse, documentsResponse, crmLinksResponse] = await Promise.all([
      getMarketplaceOpportunities(),
      getAccessibleOpportunityPrivateDetails(),
      getAccessibleMarketplaceCitizenDocuments(),
      getMarketplaceOpportunityCrmLinks(),
    ]);

    if (opportunityResponse.error) {
      setOpportunities([]);
      setMessage("Não foi possível carregar as oportunidades do Marketplace.");
      return;
    }

    setOpportunities(opportunityResponse.data ?? []);
    setPrivateDetails(detailsResponse.data ?? []);
    setDocuments(documentsResponse.data ?? []);

    if (!crmLinksResponse.error) {
      const links = crmLinksResponse.data ?? [];
      setCrmLinks(links);
      setConvertedClientIds((current) => ({
        ...links.reduce<Record<string, string>>((accumulator, link) => {
          accumulator[link.opportunity_id] = link.client_id;
          return accumulator;
        }, {}),
        ...current,
      }));
    }
  }, [canAccessMarketplace]);

  const refreshCreditAccount = useCallback(async (userId: string) => {
    if (!userId) return;

    const { data, error } = await getCreditAccount(userId);

    if (error) {
      setCreditAccount(null);
      return;
    }

    setCreditAccount(data ?? null);
  }, []);

  useEffect(() => {
    async function init() {
      const { data } = await getCurrentUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setCurrentUserId(data.user.id);

      const accessResponse = await canCurrentUserAccessMarketplace();
      const allowed = Boolean(accessResponse.data);
      setCanAccessMarketplace(allowed);

      if (allowed) {
        await ensureCreditAccount();
        await Promise.all([
          refreshOpportunities(allowed),
          refreshCreditAccount(data.user.id),
        ]);
      }

      setLoading(false);
    }

    init();
  }, [refreshCreditAccount, refreshOpportunities, router]);

  const filteredOpportunities = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return opportunities.filter((opportunity) => {
      const isComplement = Boolean(opportunity.parent_opportunity_id);
      const matchesKindFilter =
        opportunityKindFilter === "all" ||
        (opportunityKindFilter === "original" && !isComplement) ||
        (opportunityKindFilter === "complement" && isComplement);

      if (!matchesKindFilter) {
        return false;
      }

      return (
        (opportunity.practice_area ?? "").toLowerCase().includes(normalizedSearch) ||
        (opportunity.city ?? "").toLowerCase().includes(normalizedSearch) ||
        (opportunity.state ?? "").toLowerCase().includes(normalizedSearch) ||
        (opportunity.urgency ?? "").toLowerCase().includes(normalizedSearch) ||
        (opportunity.complexity ?? "").toLowerCase().includes(normalizedSearch) ||
        opportunity.summary.toLowerCase().includes(normalizedSearch) ||
        (opportunity.parent_opportunity_id ? "complemento complementar triagem" : "caso original").includes(normalizedSearch)
      );
    });
  }, [opportunities, opportunityKindFilter, search]);

  const opportunityStats = useMemo(() => {
    const complements = opportunities.filter((opportunity) => Boolean(opportunity.parent_opportunity_id)).length;

    return {
      complements,
      displayed: filteredOpportunities.length,
      originals: opportunities.length - complements,
      total: opportunities.length,
    };
  }, [filteredOpportunities.length, opportunities]);

  async function handleUnlockOpportunity(opportunityId: string) {
    if (!canAccessMarketplace) {
      setMessage("Apenas advogados parceiros podem desbloquear oportunidades.");
      return;
    }

    setMessage("");
    setUnlockingId(opportunityId);

    const { data, error } = await unlockOpportunity(opportunityId);

    setUnlockingId("");

    if (error || !data) {
      setMessage("Não foi possível desbloquear a oportunidade.");
      return;
    }

    if (!data.ok) {
      setMessage(data.message);
      return;
    }

    setMessage(data.message);
    await Promise.all([
      refreshOpportunities(true),
      refreshCreditAccount(currentUserId),
    ]);
  }

  async function handleCreateCrmClient(opportunity: MarketplaceOpportunity) {
    const details = privateDetails.find((detail) => detail.opportunity_id === opportunity.id);

    if (!details) {
      setMessage("Desbloqueie a oportunidade antes de enviar para o CRM.");
      return;
    }

    const linkedDocuments = documents.filter((document) => details.citizen_document_ids.includes(document.id));

    setMessage("");
    setConvertingOpportunityId(opportunity.id);

    const result = await createCrmClientFromUnlockedOpportunity({
      currentUserId,
      details,
      documents: linkedDocuments,
      opportunity,
    });

    setConvertingOpportunityId("");
    setMessage(result.message);

    if (result.ok && result.clientId) {
      setConvertedClientIds((current) => ({
        ...current,
        [opportunity.id]: result.clientId ?? "",
      }));

      if (result.crmLink) {
        const crmLink = result.crmLink;
        setCrmLinks((current) => {
          const withoutCurrentOpportunity = current.filter((link) => link.opportunity_id !== crmLink.opportunity_id);
          return [crmLink, ...withoutCurrentOpportunity];
        });
      }
    }
  }

  async function openCitizenDocument(document: MarketplaceCitizenDocument) {
    setOpeningDocumentId(document.id);
    setMessage("");

    const { data, error } = await createMarketplaceCitizenDocumentSignedUrl(document.file_path);
    setOpeningDocumentId("");

    if (error || !data?.signedUrl) {
      setMessage("Não foi possível abrir o documento privado agora.");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return {
    canAccessMarketplace,
    convertedClientIds,
    convertingOpportunityId,
    creditAccount,
    crmLinks,
    documents,
    filteredOpportunities,
    handleCreateCrmClient,
    handleUnlockOpportunity,
    loading,
    message,
    openCitizenDocument,
    openingDocumentId,
    opportunities,
    opportunityKindFilter,
    opportunityStats,
    privateDetails,
    refreshOpportunities,
    search,
    setOpportunityKindFilter,
    setSearch,
    unlockingId,
  };
}
