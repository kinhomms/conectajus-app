"use client";

import Link from "next/link";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { useLoginWorkspace } from "@/features/auth/hooks/useLoginWorkspace";

export function LoginWorkspace() {
  const login = useLoginWorkspace();

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-6 py-10 text-[#07182F]">
      <div className="mx-auto max-w-md">
        <PageNavigation tone="light" showDashboard={false} />

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">Acesso</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">Entrar no ConectaJus</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            O sistema identifica seu perfil após o login e direciona você para o ambiente correto: Portal do Cidadão, CRM jurídico ou operação do Marketplace.
          </p>

          <div className="mt-6 grid gap-3">
            <AccessHint
              title="Cidadão"
              description="Triagem, acompanhamento da demanda e envio seguro de documentos."
            />
            <AccessHint
              title="Advogado/Admin"
              description="Marketplace, CRM, créditos, agenda, processos e documentos liberados."
            />
          </div>

          <form onSubmit={login.handleLogin} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">E-mail</span>
              <input
                type="email"
                required
                value={login.form.email}
                onChange={(event) => login.updateField("email", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Senha</span>
              <input
                type="password"
                required
                value={login.form.password}
                onChange={(event) => login.updateField("password", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]"
              />
            </label>

            {login.message && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                {login.message}
              </div>
            )}

            <button
              type="submit"
              disabled={login.loading}
              className="w-full rounded-2xl bg-[#07182F] px-5 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {login.loading ? "Entrando..." : "Entrar"}
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

function AccessHint({ description, title }: { description: string; title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-[#07182F]">{title}</p>
      <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
    </div>
  );
}
