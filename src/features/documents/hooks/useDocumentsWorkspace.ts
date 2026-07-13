"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getUserProfile,
  isLegalOperatorProfile,
} from "@/features/auth/services/auth.service";
import {
  createCitizenDocumentSignedUrl,
  listCitizenDocuments,
  listDocuments,
  uploadCitizenDocument,
} from "@/features/documents/services/documents.service";
import type { CitizenDocument, LegalDocument } from "@/features/documents/types/document.types";

type CitizenDocumentStatusFilter = "all" | CitizenDocument["status"];

function subscribeToLocationSnapshot() {
  return () => undefined;
}

function getComplementOpportunityIdSnapshot() {
  return new URLSearchParams(window.location.search).get("opportunity") ?? "";
}

function getServerComplementOpportunityIdSnapshot() {
  return "";
}

export function useDocumentsWorkspace() {
  const router = useRouter();
  const [citizenDocuments, setCitizenDocuments] = useState<CitizenDocument[]>([]);
  const [citizenDocumentStatusFilter, setCitizenDocumentStatusFilter] = useState<CitizenDocumentStatusFilter>("all");
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isCitizen, setIsCitizen] = useState(true);
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [openingDocumentId, setOpeningDocumentId] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  const refreshDocuments = useCallback(async (forceLegalOperator = !isCitizen) => {
    setMessage("");

    if (!forceLegalOperator) {
      setDocuments([]);
      return;
    }

    const { data, error } = await listDocuments();

    if (error) {
      setMessage("Não foi possível carregar os documentos.");
      return;
    }

    setDocuments(data ?? []);
  }, [isCitizen]);

  const refreshCitizenDocuments = useCallback(async (targetUserId = userId) => {
    if (!targetUserId) return;

    setMessage("");
    const { data, error } = await listCitizenDocuments(targetUserId);

    if (error) {
      setCitizenDocuments([]);
      setMessage("Não foi possível carregar seus documentos.");
      return;
    }

    setCitizenDocuments(data ?? []);
  }, [userId]);

  useEffect(() => {
    async function init() {
      const { data } = await getCurrentUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      const profile = getUserProfile(data.user);
      const legalOperator = isLegalOperatorProfile(profile);
      setIsCitizen(!legalOperator);
      setUserId(data.user.id);

      if (legalOperator) {
        await refreshDocuments(true);
      } else {
        await refreshCitizenDocuments(data.user.id);
      }

      setLoading(false);
    }

    init();
  }, [refreshCitizenDocuments, refreshDocuments, router]);

  const complementOpportunityId = useSyncExternalStore(
    subscribeToLocationSnapshot,
    getComplementOpportunityIdSnapshot,
    getServerComplementOpportunityIdSnapshot,
  );

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return documents.filter((document) => {
      return (
        document.document_name.toLowerCase().includes(normalizedSearch) ||
        (document.document_type ?? "").toLowerCase().includes(normalizedSearch) ||
        (document.notes ?? "").toLowerCase().includes(normalizedSearch)
      );
    });
  }, [documents, search]);

  const filteredCitizenDocuments = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return citizenDocuments.filter((document) => {
      const matchesStatusFilter =
        citizenDocumentStatusFilter === "all" || document.status === citizenDocumentStatusFilter;

      if (!matchesStatusFilter) {
        return false;
      }

      return (
        document.file_name.toLowerCase().includes(normalizedSearch) ||
        (document.mime_type ?? "").toLowerCase().includes(normalizedSearch) ||
        document.status.toLowerCase().includes(normalizedSearch) ||
        (document.notes ?? "").toLowerCase().includes(normalizedSearch)
      );
    });
  }, [citizenDocumentStatusFilter, citizenDocuments, search]);

  const citizenDocumentStats = useMemo(() => {
    const totalSize = citizenDocuments.reduce((total, document) => total + (document.file_size ?? 0), 0);

    return {
      archived: citizenDocuments.filter((document) => document.status === "archived").length,
      displayed: filteredCitizenDocuments.length,
      reviewed: citizenDocuments.filter((document) => document.status === "reviewed").length,
      total: citizenDocuments.length,
      totalSize,
      uploaded: citizenDocuments.filter((document) => document.status === "uploaded").length,
    };
  }, [citizenDocuments, filteredCitizenDocuments.length]);

  const legalDocumentStats = useMemo(() => {
    const typed = documents.filter((document) => Boolean(document.document_type)).length;

    return {
      displayed: filteredDocuments.length,
      missingType: documents.length - typed,
      total: documents.length,
      typed,
    };
  }, [documents, filteredDocuments.length]);

  async function handleCitizenUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile || !userId) {
      setMessage("Selecione um arquivo antes de enviar.");
      return;
    }

    setUploading(true);
    setMessage("");

    const { error, linkError } = await uploadCitizenDocument(userId, selectedFile, notes, complementOpportunityId || undefined);

    setUploading(false);

    if (error) {
      setMessage("Não foi possível enviar o documento. Verifique o arquivo e tente novamente.");
      return;
    }

    setNotes("");
    setSelectedFile(null);
    setMessage(
      linkError
        ? "Documento enviado com segurança, mas não foi possível vincular automaticamente à demanda. Você ainda pode informar esse envio na próxima triagem complementar."
        : complementOpportunityId
          ? "Documento complementar enviado com segurança e vinculado à demanda."
          : "Documento enviado com segurança.",
    );
    await refreshCitizenDocuments(userId);
  }

  async function openCitizenDocument(document: CitizenDocument) {
    setOpeningDocumentId(document.id);
    setMessage("");

    const { data, error } = await createCitizenDocumentSignedUrl(document.file_path);
    setOpeningDocumentId("");

    if (error || !data?.signedUrl) {
      setMessage("Não foi possível abrir o documento agora.");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return {
    citizenDocuments,
    citizenDocumentStats,
    citizenDocumentStatusFilter,
    complementOpportunityId,
    documents,
    filteredCitizenDocuments,
    filteredDocuments,
    handleCitizenUpload,
    isCitizen,
    legalDocumentStats,
    loading,
    message,
    notes,
    openCitizenDocument,
    openingDocumentId,
    refreshCitizenDocuments,
    refreshDocuments,
    search,
    selectedFile,
    setCitizenDocumentStatusFilter,
    setNotes,
    setSearch,
    setSelectedFile,
    uploading,
  };
}
