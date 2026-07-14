"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { getCurrentUser } from "@/features/auth/services/auth.service";
import { listCitizenDocuments } from "@/features/documents/services/documents.service";
import type { CitizenDocument } from "@/features/documents/types/document.types";
import { publishTriageOpportunity } from "@/features/marketplace/services/marketplace.service";
import type { TriageDossier } from "@/types/triage";
import {
  createTriageDossier,
  validateTriageDescription,
} from "@/features/triage/services/triage.service";

function subscribeToLocationSnapshot(onStoreChange: () => void) {
  queueMicrotask(onStoreChange);
  window.addEventListener("popstate", onStoreChange);

  return () => window.removeEventListener("popstate", onStoreChange);
}

function getComplementOpportunityIdSnapshot() {
  return new URLSearchParams(window.location.search).get("complementOf") ?? "";
}

function getServerComplementOpportunityIdSnapshot() {
  return "";
}

export function useTriageWorkspace() {
  const [acceptedPublicationRules, setAcceptedPublicationRules] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState<CitizenDocument[]>([]);
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [documentNotes, setDocumentNotes] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [dossier, setDossier] = useState<TriageDossier | null>(null);
  const [error, setError] = useState("");
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [marketplaceMessage, setMarketplaceMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [publishedOpportunityId, setPublishedOpportunityId] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [selectedCitizenDocumentIds, setSelectedCitizenDocumentIds] = useState<string[]>([]);
  const [state, setState] = useState("");
  const [userId, setUserId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const complementOpportunityId = useSyncExternalStore(
    subscribeToLocationSnapshot,
    getComplementOpportunityIdSnapshot,
    getServerComplementOpportunityIdSnapshot,
  );
  const isComplementary = Boolean(complementOpportunityId);
  const isPublished = Boolean(publishedOpportunityId);

  const refreshAvailableDocuments = useCallback(async (targetUserId = userId) => {
    if (!targetUserId) {
      setAvailableDocuments([]);
      setLoadingDocuments(false);
      return;
    }

    setLoadingDocuments(true);
    const { data } = await listCitizenDocuments(targetUserId);
    setAvailableDocuments(data ?? []);
    setLoadingDocuments(false);
  }, [userId]);

  useEffect(() => {
    async function init() {
      const { data } = await getCurrentUser();

      if (!data.user) {
        setLoadingDocuments(false);
        return;
      }

      setUserId(data.user.id);
      setFullName(data.user.user_metadata?.full_name ?? "");
      setEmail(data.user.email ?? "");
      await refreshAvailableDocuments(data.user.id);
    }

    init();
  }, [refreshAvailableDocuments]);

  const selectedDocuments = useMemo(() => {
    return availableDocuments.filter((document) => selectedCitizenDocumentIds.includes(document.id));
  }, [availableDocuments, selectedCitizenDocumentIds]);

  function toggleCitizenDocument(documentId: string) {
    if (isPublished) return;

    setSelectedCitizenDocumentIds((current) => {
      if (current.includes(documentId)) {
        return current.filter((id) => id !== documentId);
      }

      return [...current, documentId];
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMarketplaceMessage("");

    if (isPublished) {
      setError("Esta demanda já foi publicada. Para mudar substancialmente o relato, inicie uma nova triagem ou complemente com documentos.");
      return;
    }

    const validationError = validateTriageDescription(description);

    if (validationError) {
      setError(validationError);
      return;
    }

    setDossier(createTriageDossier(description));
  }

  function handleEditDemand() {
    if (isPublished) {
      setError("Depois de publicada no Marketplace, a demanda não é editada diretamente para preservar a integridade do lead. Você pode iniciar uma nova triagem ou anexar documentos complementares.");
      return;
    }

    setDossier(null);
    setMarketplaceMessage("Você pode ajustar o relato e gerar o dossiê novamente antes de publicar.");
  }

  function handleStartNewDemand() {
    setCity("");
    setDescription("");
    setDocumentNotes("");
    setDossier(null);
    setError("");
    setMarketplaceMessage("");
    setPhone("");
    setPublishedOpportunityId("");
    setAcceptedPublicationRules(false);
    setSelectedCitizenDocumentIds([]);
    setState("");
    setWhatsapp("");
  }

  async function handlePublishOpportunity() {
    setError("");
    setMarketplaceMessage("");

    if (!dossier) {
      setError("Gere o dossiê antes de publicar a oportunidade.");
      return;
    }

    if (!acceptedPublicationRules) {
      setError("Confirme que revisou as informações e compreendeu as regras de IA, privacidade e Marketplace antes de publicar.");
      return;
    }

    if (city.trim().length < 2) {
      setError("Informe a cidade para publicar a oportunidade no Marketplace.");
      return;
    }

    setPublishing(true);

    const { data: userData } = await getCurrentUser();

    if (!userData.user) {
      setPublishing(false);
      setError("Faça login para publicar uma oportunidade no Marketplace.");
      return;
    }

    const selectedDocumentSummary = selectedDocuments
      .map((document) => `Arquivo enviado: ${document.file_name}`)
      .join("\n");
    const complementReference = isComplementary
      ? `Triagem complementar vinculada à oportunidade original: ${complementOpportunityId}`
      : "";
    const combinedDocumentNotes = [complementReference, documentNotes.trim(), selectedDocumentSummary]
      .filter(Boolean)
      .join("\n\n");

    const { data: publishedOpportunity, error: publishError } = await publishTriageOpportunity({
      citizenDocumentIds: selectedCitizenDocumentIds,
      city,
      description,
      documentNotes: combinedDocumentNotes,
      dossier,
      email,
      fullName,
      parentOpportunityId: isComplementary ? complementOpportunityId : null,
      phone,
      state,
      userId: userData.user.id,
      whatsapp,
    });

    setPublishing(false);

    if (publishError) {
      setError("Não foi possível publicar a oportunidade no Marketplace.");
      return;
    }

    setPublishedOpportunityId(publishedOpportunity?.id ?? "");
    setMarketplaceMessage(
      isComplementary
        ? "Triagem complementar publicada no Marketplace como novo dossiê mascarado, mantendo o caso original preservado."
        : "Oportunidade mascarada publicada no Marketplace com dados privados e documentos protegidos.",
    );
  }

  return {
    acceptedPublicationRules,
    availableDocuments,
    city,
    complementOpportunityId,
    description,
    documentNotes,
    dossier,
    email,
    error,
    fullName,
    handleEditDemand,
    handlePublishOpportunity,
    handleStartNewDemand,
    handleSubmit,
    isComplementary,
    isPublished,
    loadingDocuments,
    marketplaceMessage,
    phone,
    publishedOpportunityId,
    publishing,
    refreshAvailableDocuments,
    selectedCitizenDocumentIds,
    selectedDocuments,
    setAcceptedPublicationRules,
    setCity,
    setDescription,
    setDocumentNotes,
    setEmail,
    setFullName,
    setPhone,
    setState,
    setWhatsapp,
    state,
    toggleCitizenDocument,
    whatsapp,
  };
}
