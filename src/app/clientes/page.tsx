"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type {
  Client,
  ClientNote,
  ClientCase,
  ClientDocument,
} from "@/features/clients/types/client.types";
import { ClientCard } from "@/features/clients/components/ClientCard";
import { ClientsPremiumPage } from "@/features/clients/components/ClientsPremiumPage";
import { ClientCreateDrawer } from "@/features/clients/components/ClientCreateDrawer";

const initialClientForm = {
  full_name: "",
  cpf: "",
  rg: "",
  birth_date: "",
  profession: "",
  marital_status: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  notes: "",
};

const initialNoteForm = {
  title: "",
  content: "",
  note_type: "atendimento",
};

const initialCaseForm = {
  case_title: "",
  practice_area: "",
  case_number: "",
  court: "",
  status: "em análise",
  description: "",
};

const initialDocumentForm = {
  document_name: "",
  document_type: "",
  notes: "",
};

export default function ClientesPage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [clientForm, setClientForm] = useState(initialClientForm);
  const [noteForm, setNoteForm] = useState(initialNoteForm);
  const [caseForm, setCaseForm] = useState(initialCaseForm);
  const [documentForm, setDocumentForm] = useState(initialDocumentForm);

  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [cases, setCases] = useState<ClientCase[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingClient, setSavingClient] = useState(false);
  const [savingDossier, setSavingDossier] = useState(false);
  const [message, setMessage] = useState("");
  const [dossierMessage, setDossierMessage] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      await loadClients();
      setLoading(false);
    }

    init();
  }, [router]);

  async function loadClients() {
    const { data, error } = await supabase
      .from("clients")
      .select("id, full_name, cpf, rg, birth_date, profession, marital_status, email, phone, address, city, state, notes, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("não foi possÃ­vel carregar os clientes.");
      return;
    }

    setClients(data ?? []);
  }

  async function selectClient(client: Client) {
    setSelectedClient(client);
    setDossierMessage("");
    await Promise.all([
      loadNotes(client.id),
      loadCases(client.id),
      loadDocuments(client.id),
    ]);
  }

  async function loadNotes(clientId: string) {
    const { data } = await supabase
      .from("client_notes")
      .select("id, client_id, title, content, note_type, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    setNotes(data ?? []);
  }

  async function loadCases(clientId: string) {
    const { data } = await supabase
      .from("client_cases")
      .select("id, client_id, case_title, practice_area, case_number, court, status, description, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    setCases(data ?? []);
  }

  async function loadDocuments(clientId: string) {
    const { data } = await supabase
      .from("client_documents")
      .select("id, client_id, document_name, document_type, notes, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    setDocuments(data ?? []);
  }

  function updateClientField(field: keyof typeof initialClientForm, value: string) {
    setClientForm((current) => ({ ...current, [field]: value }));
  }

  async function handleCreateClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingClient(true);
    setMessage("");

    const { error } = await supabase.from("clients").insert({
      full_name: clientForm.full_name,
      cpf: clientForm.cpf || null,
      rg: clientForm.rg || null,
      birth_date: clientForm.birth_date || null,
      profession: clientForm.profession || null,
      marital_status: clientForm.marital_status || null,
      email: clientForm.email || null,
      phone: clientForm.phone || null,
      address: clientForm.address || null,
      city: clientForm.city || null,
      state: clientForm.state || null,
      notes: clientForm.notes || null,
    });

    setSavingClient(false);

    if (error) {
      setMessage("Erro ao cadastrar cliente. Verifique os dados e as permissÃµes do Supabase.");
      return;
    }

    setClientForm(initialClientForm);
    setMessage("Cliente cadastrado com sucesso.");
    await loadClients();
  }

  async function handleCreateNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClient) return;

    setSavingDossier(true);
    setDossierMessage("");

    const { error } = await supabase.from("client_notes").insert({
      client_id: selectedClient.id,
      title: noteForm.title,
      content: noteForm.content || null,
      note_type: noteForm.note_type || "atendimento",
    });

    setSavingDossier(false);

    if (error) {
      setDossierMessage("Erro ao salvar anotação.");
      return;
    }

    setNoteForm(initialNoteForm);
    setDossierMessage("Anotação salva no Dossiê.");
    await loadNotes(selectedClient.id);
  }

  async function handleCreateCase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClient) return;

    setSavingDossier(true);
    setDossierMessage("");

    const { error } = await supabase.from("client_cases").insert({
      client_id: selectedClient.id,
      case_title: caseForm.case_title,
      practice_area: caseForm.practice_area || null,
      case_number: caseForm.case_number || null,
      court: caseForm.court || null,
      status: caseForm.status || "em anÃ¡lise",
      description: caseForm.description || null,
    });

    setSavingDossier(false);

    if (error) {
      setDossierMessage("Erro ao salvar processo.");
      return;
    }

    setCaseForm(initialCaseForm);
    setDossierMessage("Processo vinculado ao cliente.");
    await loadCases(selectedClient.id);
  }

  async function handleCreateDocument(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClient) return;

    setSavingDossier(true);
    setDossierMessage("");

    const { error } = await supabase.from("client_documents").insert({
      client_id: selectedClient.id,
      document_name: documentForm.document_name,
      document_type: documentForm.document_type || null,
      notes: documentForm.notes || null,
    });

    setSavingDossier(false);

    if (error) {
      setDossierMessage("Erro ao salvar documento.");
      return;
    }

    setDocumentForm(initialDocumentForm);
    setDossierMessage("Documento registrado no Dossiê.");
    await loadDocuments(selectedClient.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

    const filteredClients = clients.filter((client) => {
    const search = clientSearch.toLowerCase();

    return (
      client.full_name.toLowerCase().includes(search) ||
      (client.cpf ?? "").toLowerCase().includes(search) ||
      (client.email ?? "").toLowerCase().includes(search) ||
      (client.phone ?? "").toLowerCase().includes(search) ||
      (client.city ?? "").toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
        <p className="font-black">Carregando clientes...</p>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#0B0F19] text-white">
        <ClientsPremiumPage
          clients={filteredClients}
          selectedClient={selectedClient}
          search={clientSearch}
          onSearchChange={setClientSearch}
          onSelectClient={selectClient}
          onRefresh={loadClients}
          onCreateClient={() => setCreateDrawerOpen(true)}
        />
      </main>

      <ClientCreateDrawer
        open={createDrawerOpen}
        form={clientForm}
        saving={savingClient}
        message={message}
        onClose={() => setCreateDrawerOpen(false)}
        onSubmit={handleCreateClient}
        onChange={updateClientField}
      />
    </>
  );
}