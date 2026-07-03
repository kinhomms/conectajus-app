"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CadastroPage() {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("cliente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, profile } },
    });

    setLoading(false);

    if (error) {
      setMessage("Não foi possível criar a conta. Verifique os dados informados.");
      return;
    }

    setSuccess(true);
    setMessage("Cadastro criado. Verifique seu e-mail para confirmar a conta.");
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-6 py-10 text-[#07182F]">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="mb-6 inline-block text-sm font-bold text-slate-500 hover:text-[#07182F]">
          ← Voltar
        </Link>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">Cadastro</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">Criar conta no ConectaJus</h1>

          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Nome completo</span>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Perfil</span>
              <select value={profile} onChange={(e) => setProfile(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]">
                <option value="cliente">Cliente</option>
                <option value="advogado">Advogado</option>
                <option value="admin">Administrador</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">E-mail</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Senha</span>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
            </label>

            {message && (
              <div className={success ? "rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700" : "rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700"}>
                {message}
              </div>
            )}

            <button className="w-full rounded-2xl bg-[#07182F] px-5 py-4 text-sm font-black text-white">
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Já tem conta? <Link href="/login" className="font-black text-[#07182F]">Entrar</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
