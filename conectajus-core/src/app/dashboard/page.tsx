"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      setLoading(false);
    }
    loadUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB] text-[#07182F]"><p className="font-black">Carregando...</p></main>;
  }

  const fullName = user?.user_metadata?.full_name ?? "Usuário";
  const profile = user?.user_metadata?.profile ?? "cliente";

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-6 py-10 text-[#07182F]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">Dashboard</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">Bem-vindo, {fullName}</h1>
            <p className="mt-2 text-slate-600">{user?.email}</p>
          </div>

          <button onClick={handleLogout} className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#07182F]">
            Sair
          </button>
        </div>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase text-blue-700">Perfil</p>
            <h2 className="mt-4 text-2xl font-black capitalize">{profile}</h2>
            <p className="mt-3 text-slate-600">Usuário autenticado pelo Supabase.</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase text-emerald-700">Status</p>
            <h2 className="mt-4 text-2xl font-black">Conta ativa</h2>
            <p className="mt-3 text-slate-600">Sessão validada com sucesso.</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase text-yellow-700">Próximo módulo</p>
            <h2 className="mt-4 text-2xl font-black">Escritório</h2>
            <p className="mt-3 text-slate-600">Depois criaremos escritório, advogados e clientes.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
