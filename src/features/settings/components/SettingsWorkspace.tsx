"use client";

import Link from "next/link";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { routes } from "@/lib/routes";
import { useSettingsWorkspace, type SettingsChecklistItem } from "@/features/settings/hooks/useSettingsWorkspace";

export function SettingsWorkspace() {
  const settings = useSettingsWorkspace();

  if (settings.loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-white">
        <p className="font-black">Carregando configurações...</p>
      </main>
    );
  }

  return (
    <section className="text-white">
      <PageNavigation dashboardLabel="Dashboard" />

      <div className="mb-8 overflow-hidden rounded-[2rem] border border-amber-400/20 bg-gradient-to-br from-[#111827] via-[#0B0F19] to-[#07182F] p-6 shadow-xl shadow-black/30 md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">Configurações</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-5xl">Conta, privacidade e operação</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Central para revisar perfil, sessão, regras de privacidade e próximos ajustes operacionais do ecossistema ConectaJus.
            </p>
          </div>

          <button
            type="button"
            onClick={settings.handleLogout}
            disabled={settings.loggingOut}
            className="w-fit rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {settings.loggingOut ? "Saindo..." : "Sair da conta"}
          </button>
        </div>
      </div>

      {settings.message ? (
        <div className="mb-6 rounded-3xl border border-red-400/20 bg-red-500/10 p-5 text-sm font-bold leading-6 text-red-100">
          {settings.message}
        </div>
      ) : null}

      <section className="mb-6 grid gap-5 lg:grid-cols-3">
        <ProfileCard label="Nome" value={settings.fullName} description="Nome público associado ao cadastro Supabase." />
        <ProfileCard label="E-mail" value={settings.user?.email ?? "Não informado"} description="Usado para login e recuperação de acesso." />
        <ProfileCard label="Perfil" value={settings.profileLabel} description={settings.isCitizen ? "Fluxo protegido de cidadão." : "Operação jurídica e gestão da plataforma."} />
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChecklistPanel
          title={settings.isCitizen ? "Privacidade do cidadão" : "Privacidade operacional"}
          eyebrow="Proteção de dados"
          description={
            settings.isCitizen
              ? "Regras que evitam exposição indevida da demanda após a triagem."
              : "Controles que preservam o modelo de leads mascarados e desbloqueio por créditos."
          }
          items={settings.privacyChecklist}
        />

        <ChecklistPanel
          title="Segurança da sessão"
          eyebrow="Conta"
          description="Sinais básicos de autenticação, ambiente e proteção de rotas."
          items={settings.securityChecklist}
        />
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Ajustes disponíveis</p>
          <h2 className="mt-2 text-2xl font-black">Atalhos de configuração</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Enquanto preferências persistentes não exigem uma tabela própria, estes atalhos conectam o usuário aos módulos que controlam sua operação.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SettingsShortcut href={routes.documents} label="Documentos" title="Revisar arquivos" description="Veja documentos enviados, status e complementos vinculados às demandas." />
          <SettingsShortcut href={routes.dashboard} label="Portal" title="Voltar ao painel" description="Acesse a visão inicial conforme o perfil autenticado." />
          {settings.isLegalOperator ? (
            <SettingsShortcut href={routes.finance} label="Créditos" title="Configurar operação" description="Acompanhe saldo, solicitações e consumo de créditos do Marketplace." />
          ) : (
            <SettingsShortcut href={routes.triage} label="Triagem" title="Nova demanda" description="Organize um novo caso ou complemente uma demanda existente." />
          )}
        </div>
      </section>
    </section>
  );
}

function ProfileCard({ description, label, value }: { description: string; label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">{label}</p>
      <h2 className="mt-4 break-words text-2xl font-black">{value}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function ChecklistPanel({
  description,
  eyebrow,
  items,
  title,
}: {
  description: string;
  eyebrow: string;
  items: SettingsChecklistItem[];
  title: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-3xl border border-white/10 bg-[#0B0F19] p-4">
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                item.done ? "bg-emerald-400 text-black" : "bg-amber-400 text-black"
              }`}>
                {item.done ? "✓" : "!"}
              </span>
              <div>
                <h3 className="font-black text-white">{item.label}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsShortcut({ description, href, label, title }: { description: string; href: string; label: string; title: string }) {
  return (
    <Link href={href} className="rounded-3xl border border-white/10 bg-[#0B0F19] p-5 transition hover:-translate-y-0.5 hover:border-amber-400/50 hover:bg-white/5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">{label}</p>
      <h3 className="mt-4 text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </Link>
  );
}
