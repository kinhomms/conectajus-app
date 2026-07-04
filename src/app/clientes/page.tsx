"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Client = {
  id: string;
  full_name: string;
  cpf: string | null;
  rg: string | null;
  birth_date: string | null;
  profession: string | null;
  marital_status: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
  created_at: string;
};

const initialForm = {
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

export default function ClientesPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState(initialForm);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

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

  async function handleCreateClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("clients").insert({
      full_name: form.full_name,
      cpf: form.cpf || null,
      rg: form.rg || null,
      birth_date: form.birth_date || null,
      profession: form.profession || null,
      marital_status: form.marital_status || null,
      email: form.email || null,
      phone: form.phone || null,
      address: form.address || null,
      city: form.city || null,
      state: form.state || null,
      notes: form.notes || null,
    });

    setSaving(false);

    if (error) {
      setMessage("Erro ao cadastrar cliente. Verifique os dados e as permissões do Supabase.");
      return;
    }

    setForm(initialForm);
    setMessage("Cliente cadastrado com sucesso.");
    await loadClients();
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
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">Clientes</h1>
            <p className="mt-2 text-slate-600">Cadastro completo do cliente, com dados pessoais, contato, endereço e observações.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/dashboard" className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#07182F]">Dashboard</a>
            <button onClick={handleLogout} className="rounded-2xl bg-[#07182F] px-5 py-3 text-sm font-black text-white">Sair</button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Novo cliente</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Preencha os dados principais para formar a base do dossiê jurídico.</p>

            <form onSubmit={handleCreateClient} className="mt-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-black text-slate-700">Nome completo</span>
                  <input required value={form.full_name} onChange={(e) => updateField("full_name", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">CPF</span>
                  <input value={form.cpf} onChange={(e) => updateField("cpf", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">RG</span>
                  <input value={form.rg} onChange={(e) => updateField("rg", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Data de nascimento</span>
                  <input type="date" value={form.birth_date} onChange={(e) => updateField("birth_date", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Estado civil</span>
                  <select value={form.marital_status} onChange={(e) => updateField("marital_status", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]">
                    <option value="">Não informado</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                    <option value="União estável">União estável</option>
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-black text-slate-700">Profissão</span>
                  <input value={form.profession} onChange={(e) => updateField("profession", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">E-mail</span>
                  <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">WhatsApp</span>
                  <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-black text-slate-700">Endereço</span>
                  <input value={form.address} onChange={(e) => updateField("address", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Cidade</span>
                  <input value={form.city} onChange={(e) => updateField("city", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Estado</span>
                  <input maxLength={2} value={form.state} onChange={(e) => updateField("state", e.target.value.toUpperCase())} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" placeholder="BA" />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-black text-slate-700">Observações</span>
                  <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} rows={4} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
                </label>
              </div>

              {message && <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{message}</div>}
              <button className="w-full rounded-2xl bg-[#07182F] px-5 py-4 text-sm font-black text-white">{saving ? "Salvando..." : "Cadastrar cliente"}</button>
            </form>
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black">Clientes cadastrados</h2>
                  <p className="mt-2 text-sm text-slate-600">{clients.length} cliente(s) encontrado(s).</p>
                </div>
                <button onClick={loadClients} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black">Atualizar</button>
              </div>
              {clients.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-slate-600">Nenhum cliente cadastrado ainda.</div>
              ) : (
                <div className="space-y-3">
                  {clients.map((client) => (
                    <button key={client.id} onClick={() => setSelectedClient(client)} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#C9A227] hover:bg-slate-50">
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

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Dossiê do cliente</h2>
              {!selectedClient ? (
                <p className="mt-4 text-slate-600">Clique em um cliente cadastrado para visualizar os detalhes.</p>
              ) : (
                <div className="mt-5 space-y-4 text-sm">
                  <div><p className="text-xs font-black uppercase text-slate-400">Nome</p><p className="font-bold">{selectedClient.full_name}</p></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div><p className="text-xs font-black uppercase text-slate-400">CPF</p><p>{selectedClient.cpf || "Não informado"}</p></div>
                    <div><p className="text-xs font-black uppercase text-slate-400">RG</p><p>{selectedClient.rg || "Não informado"}</p></div>
                    <div><p className="text-xs font-black uppercase text-slate-400">Nascimento</p><p>{selectedClient.birth_date ? new Date(selectedClient.birth_date).toLocaleDateString("pt-BR") : "Não informado"}</p></div>
                    <div><p className="text-xs font-black uppercase text-slate-400">Estado civil</p><p>{selectedClient.marital_status || "Não informado"}</p></div>
                    <div><p className="text-xs font-black uppercase text-slate-400">Profissão</p><p>{selectedClient.profession || "Não informado"}</p></div>
                    <div><p className="text-xs font-black uppercase text-slate-400">Contato</p><p>{selectedClient.phone || "Sem telefone"}</p><p>{selectedClient.email || "Sem e-mail"}</p></div>
                  </div>
                  <div><p className="text-xs font-black uppercase text-slate-400">Endereço</p><p>{selectedClient.address || "Não informado"}{selectedClient.city ? ` — ${selectedClient.city}` : ""}{selectedClient.state ? `/${selectedClient.state}` : ""}</p></div>
                  <div><p className="text-xs font-black uppercase text-slate-400">Observações</p><p className="leading-6">{selectedClient.notes || "Sem observações"}</p></div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
