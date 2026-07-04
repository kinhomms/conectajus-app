"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Client, ClientNote, ClientCase, ClientDocument } from "@/features/clients/types/client.types";
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
      setMessage("Não foi possível carregar os clientes.");
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
      setMessage("Erro ao cadastrar cliente. Verifique os dados e as permissões do Supabase.");
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
    setDossierMessage("Anotação salva no dossiê.");
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
      status: caseForm.status || "em análise",
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
    setDossierMessage("Documento registrado no dossiê.");
    await loadDocuments(selectedClient.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB] text-[#07182F]">
        <p className="font-black">Carregando clientes...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-6 py-10 text-[#07182F]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">ConectaJus CRM</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">Dossiê Jurídico do Cliente</h1>
            <p className="mt-2 text-slate-600">Clientes, atendimentos, documentos e processos em uma única visão.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/dashboard" className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#07182F]">
              Painel
            </a>
            <button onClick={handleLogout} className="rounded-2xl bg-[#07182F] px-5 py-3 text-sm font-black text-white">
              Sair
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Novo cliente</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Cadastre a ficha principal do cliente.</p>

              <form onSubmit={handleCreateClient} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Nome completo</span>
                  <input required value={clientForm.full_name} onChange={(e) => updateClientField("full_name", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">CPF</span>
                    <input value={clientForm.cpf} onChange={(e) => updateClientField("cpf", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">RG</span>
                    <input value={clientForm.rg} onChange={(e) => updateClientField("rg", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">E-mail</span>
                    <input type="email" value={clientForm.email} onChange={(e) => updateClientField("email", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">WhatsApp</span>
                    <input value={clientForm.phone} onChange={(e) => updateClientField("phone", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Observações iniciais</span>
                  <textarea value={clientForm.notes} onChange={(e) => updateClientField("notes", e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>

                {message && <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{message}</div>}

                <button className="w-full rounded-2xl bg-[#07182F] px-5 py-4 text-sm font-black text-white">
                  {savingClient ? "Salvando..." : "Cadastrar cliente"}
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black">Clientes</h2>
                  <p className="mt-2 text-sm text-slate-600">{clients.length} cliente(s).</p>
                </div>
                <button onClick={loadClients} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black">
                  Atualizar
                </button>
              </div>

              {clients.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-slate-600">Nenhum cliente cadastrado ainda.</div>
              ) : (
                <div className="space-y-3">
                  {clients.map((client) => (
                    <button key={client.id} onClick={() => selectClient(client)} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#C9A227] hover:bg-slate-50">
                      <div className="flex flex-col justify-between gap-2 md:flex-row">
                        <strong className="text-[#07182F]">{client.full_name}</strong>
                        <span className="text-xs font-bold text-slate-500">{new Date(client.created_at).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">{client.phone || "Sem telefone"} • {client.email || "Sem e-mail"}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Dossiê do cliente</h2>

              {!selectedClient ? (
                <p className="mt-4 text-slate-600">Selecione um cliente para abrir o dossiê jurídico.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227]">Cliente selecionado</p>
                    <h3 className="mt-2 text-2xl font-black">{selectedClient.full_name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      CPF: {selectedClient.cpf || "não informado"} • WhatsApp: {selectedClient.phone || "não informado"}
                    </p>
                  </div>

                  {dossierMessage && (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
                      {dossierMessage}
                    </div>
                  )}

                  <div className="grid gap-5 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 p-5">
                      <h3 className="text-lg font-black">Atendimento</h3>
                      <form onSubmit={handleCreateNote} className="mt-4 space-y-3">
                        <input required value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} placeholder="Título" className="w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-[#C9A227]" />
                        <select value={noteForm.note_type} onChange={(e) => setNoteForm({ ...noteForm, note_type: e.target.value })} className="w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-[#C9A227]">
                          <option value="atendimento">Atendimento</option>
                          <option value="ligação">Ligação</option>
                          <option value="reunião">Reunião</option>
                          <option value="estratégia">Estratégia</option>
                          <option value="pendência">Pendência</option>
                        </select>
                        <textarea value={noteForm.content} onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })} placeholder="Resumo" rows={4} className="w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-[#C9A227]" />
                        <button className="w-full rounded-2xl bg-[#07182F] p-3 text-sm font-black text-white">{savingDossier ? "Salvando..." : "Salvar"}</button>
                      </form>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-5">
                      <h3 className="text-lg font-black">Processo</h3>
                      <form onSubmit={handleCreateCase} className="mt-4 space-y-3">
                        <input required value={caseForm.case_title} onChange={(e) => setCaseForm({ ...caseForm, case_title: e.target.value })} placeholder="Título do caso" className="w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-[#C9A227]" />
                        <input value={caseForm.practice_area} onChange={(e) => setCaseForm({ ...caseForm, practice_area: e.target.value })} placeholder="Área do direito" className="w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-[#C9A227]" />
                        <input value={caseForm.case_number} onChange={(e) => setCaseForm({ ...caseForm, case_number: e.target.value })} placeholder="Número do processo" className="w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-[#C9A227]" />
                        <input value={caseForm.court} onChange={(e) => setCaseForm({ ...caseForm, court: e.target.value })} placeholder="Vara/Tribunal" className="w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-[#C9A227]" />
                        <textarea value={caseForm.description} onChange={(e) => setCaseForm({ ...caseForm, description: e.target.value })} placeholder="Descrição" rows={3} className="w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-[#C9A227]" />
                        <button className="w-full rounded-2xl bg-[#07182F] p-3 text-sm font-black text-white">{savingDossier ? "Salvando..." : "Vincular"}</button>
                      </form>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-5">
                      <h3 className="text-lg font-black">Documento</h3>
                      <form onSubmit={handleCreateDocument} className="mt-4 space-y-3">
                        <input required value={documentForm.document_name} onChange={(e) => setDocumentForm({ ...documentForm, document_name: e.target.value })} placeholder="Nome do documento" className="w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-[#C9A227]" />
                        <input value={documentForm.document_type} onChange={(e) => setDocumentForm({ ...documentForm, document_type: e.target.value })} placeholder="Tipo" className="w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-[#C9A227]" />
                        <textarea value={documentForm.notes} onChange={(e) => setDocumentForm({ ...documentForm, notes: e.target.value })} placeholder="Observações" rows={4} className="w-full rounded-2xl border border-slate-300 p-3 text-sm outline-none focus:border-[#C9A227]" />
                        <button className="w-full rounded-2xl bg-[#07182F] p-3 text-sm font-black text-white">{savingDossier ? "Salvando..." : "Registrar"}</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedClient && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-black">Histórico</h3>
                  <div className="mt-4 space-y-3">
                    {notes.length === 0 ? <p className="text-sm text-slate-500">Sem registros.</p> : notes.map((note) => (
                      <div key={note.id} className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase text-[#C9A227]">{note.note_type}</p>
                        <p className="font-bold">{note.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{note.content || "Sem resumo."}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-black">Processos</h3>
                  <div className="mt-4 space-y-3">
                    {cases.length === 0 ? <p className="text-sm text-slate-500">Sem processos.</p> : cases.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                        <p className="font-bold">{item.case_title}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.practice_area || "Área não informada"} • {item.status || "sem status"}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.case_number || "Sem número"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-black">Documentos</h3>
                  <div className="mt-4 space-y-3">
                    {documents.length === 0 ? <p className="text-sm text-slate-500">Sem documentos.</p> : documents.map((doc) => (
                      <div key={doc.id} className="rounded-2xl bg-slate-50 p-4">
                        <p className="font-bold">{doc.document_name}</p>
                        <p className="mt-1 text-sm text-slate-600">{doc.document_type || "Tipo não informado"}</p>
                        <p className="mt-1 text-xs text-slate-500">{doc.notes || "Sem observações."}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
