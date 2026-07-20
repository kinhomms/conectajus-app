"use client";

import Link from "next/link";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { useResetPasswordWorkspace } from "@/features/auth/hooks/useResetPasswordWorkspace";

export function ResetPasswordWorkspace() {
  const reset = useResetPasswordWorkspace();

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-6 py-10 text-[#07182F]">
      <div className="mx-auto max-w-md">
        <PageNavigation tone="light" showDashboard={false} />

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">Recuperação de acesso</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">Definir nova senha</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Abra esta página pelo link enviado ao seu e-mail e informe uma nova senha com pelo menos 6 caracteres.
          </p>

          <form onSubmit={reset.handleSubmit} className="mt-8 space-y-4">
            <label htmlFor="reset-password" className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Nova senha</span>
              <input
                id="reset-password"
                type="password"
                required
                minLength={6}
                value={reset.password}
                onChange={(event) => reset.setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]"
              />
            </label>

            <label htmlFor="reset-password-confirmation" className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Confirmar nova senha</span>
              <input
                id="reset-password-confirmation"
                type="password"
                required
                minLength={6}
                value={reset.confirmation}
                onChange={(event) => reset.setConfirmation(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227]"
              />
            </label>

            {reset.message && (
              <div className={reset.messageTone === "success" ? "rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700" : "rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700"}>
                {reset.message}
              </div>
            )}

            <button
              type="submit"
              disabled={reset.loading}
              className="w-full rounded-2xl bg-[#07182F] px-5 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reset.loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Lembrou a senha? <Link href={reset.loginHref} className="font-black text-[#07182F]">Entrar</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
