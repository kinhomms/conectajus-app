"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientFollowUpEvent } from "@/features/agenda/services/agenda.service";
import type { AgendaEventPriority } from "@/features/agenda/types/agenda.types";
import type {
  Client,
  ClientCase,
  ClientDocument,
  ClientMarketplaceLink,
  ClientNote,
} from "@/features/clients/types/client.types";
import { getUserProfile, isLegalOperatorProfile } from "@/features/auth/services/auth.service";
import {
  createClientCaseFromForm,
  createClientDocumentFromForm,
  createClientFromForm,
  createClientNoteFromForm,
  getCurrentUser,
  initialCaseForm,
  initialClientForm,
  initialDocumentForm,
  initialNoteForm,
  listClientDossier,
  listClientMarketplaceLinks,
  listClients,
  signOut,
  type ClientCaseFormState,
  type ClientDocumentFormState,
  type ClientFormState,
  type ClientNoteFormState,
} from "@/features/clients/services/clients.service";

export function useClientsWorkspace() {
  const router = useRouter();
  const [agendaPriority, setAgendaPriority] = useState<AgendaEventPriority>("medium");
  const [agendaStartsAt, setAgendaStartsAt] = useState(getDefaultAgendaStartsAt());
  const [agendaTitle, setAgendaTitle] = useState("Retornar contato com cliente");
  const [clients, setClients] = useState<Client[]>([]);
  const [marketplaceLinks, setMarketplaceLinks] = useState<ClientMarketplaceLink[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientForm, setClientForm] = useState<ClientFormState>(initialClientForm);
  const [noteForm, setNoteForm] = useState<ClientNoteFormState>(initialNoteForm);
  const [caseForm, setCaseForm] = useState<ClientCaseFormState>(initialCaseForm);
  const [documentForm, setDocumentForm] = useState<ClientDocumentFormState>(initialDocumentForm);
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [cases, setCases] = useState<ClientCase[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAgendaEvent, setSavingAgendaEvent] = useState(false);
  const [savingClient, setSavingClient] = useState(false);
  const [savingDossier, setSavingDossier] = useState(false);
  const [message, setMessage] = useState("");
  const [dossierMessage, setDossierMessage] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const { data } = await getCurrentUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      if (!isLegalOperatorProfile(getUserProfile(data.user))) {
        router.replace("/dashboard");
        return;
      }

      await refreshClients();
      setLoading(false);
    }

    init();
  }, [router]);

  const marketplaceClientIds = useMemo(() => {
    return marketplaceLinks.map((link) => link.client_id);
  }, [marketplaceLinks]);

  const selectedClientMarketplaceLink = useMemo(() => {
    if (!selectedClient) return null;
    return marketplaceLinks.find((link) => link.client_id === selectedClient.id) ?? null;
  }, [marketplaceLinks, selectedClient]);

  const filteredClients = useMemo(() => {
    const search = clientSearch.toLowerCase();

    return clients.filter((client) => {
      const fromMarketplace = marketplaceClientIds.includes(client.id);
      return (
        client.full_name.toLowerCase().includes(search) ||
        (client.cpf ?? "").toLowerCase().includes(search) ||
        (client.email ?? "").toLowerCase().includes(search) ||
        (client.phone ?? "").toLowerCase().includes(search) ||
        (client.city ?? "").toLowerCase().includes(search) ||
        (fromMarketplace && "marketplace".includes(search))
      );
    });
  }, [clientSearch, clients, marketplaceClientIds]);

  async function refreshClients() {
    const [clientsResponse, linksResponse] = await Promise.all([
      listClients(),
      listClientMarketplaceLinks(),
    ]);

    if (clientsResponse.error) {
      setMessage("Não foi possível carregar os clientes.");
      return;
    }

    setClients(clientsResponse.data ?? []);

    if (!linksResponse.error) {
      setMarketplaceLinks(linksResponse.data ?? []);
    }
  }

  async function selectClient(client: Client) {
    setSelectedClient(client);
    setDossierMessage("");
    setAgendaTitle("Retornar contato com cliente");
    setAgendaStartsAt(getDefaultAgendaStartsAt());
    setAgendaPriority("medium");
    const dossier = await listClientDossier(client.id);
    setNotes(dossier.notes.data ?? []);
    setCases(dossier.cases.data ?? []);
    setDocuments(dossier.documents.data ?? []);
  }

  function updateClientField(field: keyof ClientFormState, value: string) {
    setClientForm((current) => ({ ...current, [field]: value }));
  }

  async function handleCreateClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingClient(true);
    setMessage("");
    const { error } = await createClientFromForm(clientForm);
    setSavingClient(false);

    if (error) {
      setMessage("Erro ao cadastrar cliente. Verifique os dados e as permissões do Supabase.");
      return;
    }

    setClientForm(initialClientForm);
    setMessage("Cliente cadastrado com sucesso.");
    await refreshClients();
  }

  async function handleCreateAgendaEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedClient) return;

    if (!agendaTitle.trim() || !agendaStartsAt) {
      setDossierMessage("Informe título, data e hora para criar o próximo passo na agenda.");
      return;
    }

    setSavingAgendaEvent(true);
    setDossierMessage("");

    const response = await createClientFollowUpEvent({
      caseId: cases[0]?.id ?? null,
      clientId: selectedClient.id,
      clientName: selectedClient.full_name,
      priority: agendaPriority,
      startsAt: new Date(agendaStartsAt).toISOString(),
      title: agendaTitle.trim(),
    });

    setSavingAgendaEvent(false);

    if (response.error) {
      setDossierMessage("Não foi possível criar o evento na agenda.");
      return;
    }

    setDossierMessage("Próximo passo criado na agenda.");
    setAgendaTitle("Retornar contato com cliente");
    setAgendaStartsAt(getDefaultAgendaStartsAt());
    setAgendaPriority("medium");
  }

  async function handleCreateNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClient) return;
    setSavingDossier(true);
    setDossierMessage("");
    const { error } = await createClientNoteFromForm(selectedClient.id, noteForm);
    setSavingDossier(false);

    if (error) {
      setDossierMessage("Erro ao salvar anotação.");
      return;
    }

    setNoteForm(initialNoteForm);
    setDossierMessage("Anotação salva no Dossiê.");
    const dossier = await listClientDossier(selectedClient.id);
    setNotes(dossier.notes.data ?? []);
  }

  async function handleCreateCase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClient) return;
    setSavingDossier(true);
    setDossierMessage("");
    const { error } = await createClientCaseFromForm(selectedClient.id, caseForm);
    setSavingDossier(false);

    if (error) {
      setDossierMessage("Erro ao salvar processo.");
      return;
    }

    setCaseForm(initialCaseForm);
    setDossierMessage("Processo vinculado ao cliente.");
    const dossier = await listClientDossier(selectedClient.id);
    setCases(dossier.cases.data ?? []);
  }

  async function handleCreateDocument(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClient) return;
    setSavingDossier(true);
    setDossierMessage("");
    const { error } = await createClientDocumentFromForm(selectedClient.id, documentForm);
    setSavingDossier(false);

    if (error) {
      setDossierMessage("Erro ao salvar documento.");
      return;
    }

    setDocumentForm(initialDocumentForm);
    setDossierMessage("Documento registrado no Dossiê.");
    const dossier = await listClientDossier(selectedClient.id);
    setDocuments(dossier.documents.data ?? []);
  }

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return {
    agendaPriority,
    agendaStartsAt,
    agendaTitle,
    caseForm,
    cases,
    clientForm,
    clientSearch,
    createDrawerOpen,
    documentForm,
    documents,
    dossierMessage,
    filteredClients,
    handleCreateAgendaEvent,
    handleCreateCase,
    handleCreateClient,
    handleCreateDocument,
    handleCreateNote,
    handleLogout,
    loading,
    marketplaceClientIds,
    marketplaceLinks,
    message,
    noteForm,
    notes,
    refreshClients,
    savingAgendaEvent,
    savingClient,
    savingDossier,
    selectedClient,
    selectedClientMarketplaceLink,
    selectClient,
    setAgendaPriority,
    setAgendaStartsAt,
    setAgendaTitle,
    setCaseForm,
    setClientSearch,
    setCreateDrawerOpen,
    setDocumentForm,
    setNoteForm,
    updateClientField,
  };
}

function getDefaultAgendaStartsAt() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(9, 0, 0, 0);

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
}