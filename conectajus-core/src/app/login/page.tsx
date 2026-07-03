"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setMessage("Não foi possível entrar. Verifique seu e-mail e senha.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-6 py-10 text-[#07182F]">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-6 inline-block text-sm font-bold text-slate-500 hover:text-[#07182F]">
          ← Voltar
        </Link>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">Acesso</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">Entrar no ConectaJus</h1>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">E-mail</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Senha</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]" />
            </label>

            {message && <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{message}</div>}

            <button className="w-full rounded-2xl bg-[#07182F] px-5 py-4 text-sm font-black text-white">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Ainda não tem conta? <Link href="/cadastro" className="font-black text-[#07182F]">Criar cadastro</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
