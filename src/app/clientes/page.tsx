"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Client = {
  id: string;
  full_name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

export default function ClientesPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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

  async function loadClients() {
    const { data, error } = await supabase
      .from("clients")
      .select("id, full_name, cpf, email, phone, created_at")
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
      full_name: fullName,
      cpf: cpf || null,
      email: email || null,
      phone: phone || null,
    });

    setSaving(false);

    if (error) {
      setMessage("Erro ao cadastrar cliente. Verifique as permissões do Supabase.");
      return;
    }

    setFullName("");
    setCpf("");
    setEmail("");
    setPhone("");
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
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">
              ConectaJus CRM
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">
              Clientes
            </h1>
            <p className="mt-2 text-slate-600">
              Cadastre e acompanhe os primeiros clientes da plataforma.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/dashboard" className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#07182F]">
              Dashboard
            </a>
            <button onClick={handleLogout} className="rounded-2xl bg-[#07182F] px-5 py-3 text-sm font-black text-white">
              Sair
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Novo cliente</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Preencha os dados principais. Depois evoluiremos para documentos, histórico, processos e IA.
            </p>

            <form onSubmit={handleCreateClient} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">Nome completo</span>
                <input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">CPF</span>
                <input value={cpf} onChange={(event) => setCpf(event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" placeholder="Opcional" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">E-mail</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" placeholder="Opcional" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">WhatsApp</span>
                <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" placeholder="Opcional" />
              </label>

              {message && <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{message}</div>}

              <button className="w-full rounded-2xl bg-[#07182F] px-5 py-4 text-sm font-black text-white">
                {saving ? "Salvando..." : "Cadastrar cliente"}
              </button>
            </form>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">Clientes cadastrados</h2>
                <p className="mt-2 text-sm text-slate-600">{clients.length} cliente(s) encontrado(s).</p>
              </div>
              <button onClick={loadClients} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black">
                Atualizar
              </button>
            </div>

            {clients.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-slate-600">
                Nenhum cliente cadastrado ainda.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-4">Nome</th>
                      <th className="p-4">Contato</th>
                      <th className="p-4">CPF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-t border-slate-100">
                        <td className="p-4 font-bold">{client.full_name}</td>
                        <td className="p-4 text-slate-600">
                          <div>{client.email || "Sem e-mail"}</div>
                          <div>{client.phone || "Sem telefone"}</div>
                        </td>
                        <td className="p-4 text-slate-600">{client.cpf || "Não informado"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
