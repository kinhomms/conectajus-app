"use client";

import Link from "next/link";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { useRegisterWorkspace } from "@/features/auth/hooks/useRegisterWorkspace";

export function RegisterWorkspace() {
  const register = useRegisterWorkspace();

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-6 py-10 text-[#07182F]">
      <div className="mx-auto max-w-xl">
        <PageNavigation tone="light" showDashboard={false} />

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">Cadastro</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">Criar conta no ConectaJus</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Escolha o perfil correto para acessar o ambiente adequado. Cidadãos acompanham a própria demanda; advogados operam CRM, Marketplace e créditos.
          </p>

          <form onSubmit={register.handleRegister} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Nome completo</span>
              <input
                required
                value={register.form.name}
                onChange={(event) => register.updateField("name", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Perfil</span>
              <select
                value={register.form.profile}
                onChange={(event) => register.updateField("profile", event.target.value as typeof register.form.profile)}
                className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]"
              >
                <option value="cliente">Cliente</option>
                <option value="advogado">Advogado</option>
              </select>
            </label>

            <ProfileNotice profile={register.form.profile} />

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">E-mail</span>
              <input
                type="email"
                required
                value={register.form.email}
                onChange={(event) => register.updateField("email", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Senha</span>
              <input
                type="password"
                required
                minLength={6}
                value={register.form.password}
                onChange={(event) => register.updateField("password", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]"
              />
            </label>

            {register.message && (
              <div className={register.success ? "rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700" : "rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700"}>
                {register.message}
              </div>
            )}

            <button
              type="submit"
              disabled={register.loading}
              className="w-full rounded-2xl bg-[#07182F] px-5 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {register.loading ? "Criando conta..." : "Criar conta"}
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

function ProfileNotice({ profile }: { profile: "cliente" | "advogado" }) {
  if (profile === "advogado") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <p className="font-black">Perfil advogado</p>
        <p className="mt-1">
          Você terá acesso ao ambiente operacional: Marketplace com dados mascarados, CRM jurídico, créditos, agenda, processos e documentos liberados após desbloqueio.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-900">
      <p className="font-black">Perfil cidadão</p>
      <p className="mt-1">
        Você poderá fazer triagem, acompanhar seus casos publicados e enviar documentos com dados pessoais protegidos.
      </p>
    </div>
  );
}
