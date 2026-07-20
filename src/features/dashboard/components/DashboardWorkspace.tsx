"use client";

import Link from "next/link";
import { navigateBackSafely } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import { useDashboardWorkspace } from "@/features/dashboard/hooks/useDashboardWorkspace";
import type { CitizenDashboardCase } from "@/features/dashboard/types/dashboard.types";

type CitizenDashboardProps = {
  caseDocumentCounts: Record<string, number>;
  cases: CitizenDashboardCase[];
  casesError: string | null;
  fullName: string;
  handleLogout: () => void;
  stats: {
    complements: number;
    total: number;
    waiting: number;
    unlocked: number;
  };
};

export function DashboardWorkspace() {
  const dashboard = useDashboardWorkspace();
  const operatorEcosystemCards = getOperatorEcosystemCards(dashboard.canUseMarketplace);

  if (dashboard.loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-slate-950 dark:text-white">
        <p className="font-black">Carregando...</p>
      </main>
    );
  }

  if (dashboard.isCitizen) {
    return (
      <CitizenDashboard
        caseDocumentCounts={dashboard.citizenCaseDocumentCounts}
        cases={dashboard.citizenCases}
        casesError={dashboard.citizenCasesError}
        fullName={dashboard.fullName}
        handleLogout={dashboard.handleLogout}
        stats={dashboard.citizenCaseStats}
      />
    );
  }

  return (
    <section className="text-slate-950 dark:text-white">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">Bem-vindo, {dashboard.fullName}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Operação jurídica, CRM e oportunidades em um só lugar.</p>
        </div>

        <button onClick={dashboard.handleLogout} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
          Sair
        </button>
      </div>

      <section className="mb-6 grid gap-5 md:grid-cols-3">
        <SummaryCard label="Perfil" value={dashboard.profile} description="Conta autenticada pelo Supabase." />
        <SummaryCard label="Status" value="Conta ativa" description="Sessão validada com sucesso." />
        <SummaryCard
          label="Marketplace"
          value={dashboard.canUseMarketplace ? "Habilitado" : "Pendente"}
          description={dashboard.canUseMarketplace ? "Acesso a oportunidades e créditos liberado." : "Acesso restrito ou aguardando configuração."}
        />
      </section>

      {dashboard.canUseMarketplace ? (
        <section className="mb-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 dark:border-amber-400/20 dark:bg-gradient-to-br dark:from-[#111827] dark:via-[#0B0F19] dark:to-[#15110A] dark:shadow-black/20">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">Oportunidades qualificadas</p>
              <h2 className="mt-2 text-2xl font-black">Leads jurídicos prontos para análise</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                As melhores oportunidades aparecem aqui logo após o login, com dados pessoais protegidos até o desbloqueio por créditos.
              </p>
            </div>
            <Link href={routes.marketplace} className="w-fit rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white dark:bg-teal-300 dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200">
              Ver marketplace completo
            </Link>
          </div>

          {dashboard.qualifiedOpportunitiesError ? (
            <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm font-bold text-red-100">
              {dashboard.qualifiedOpportunitiesError}
            </div>
          ) : dashboard.qualifiedOpportunities.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 p-5 dark:bg-[#0B0F19]">
              <h3 className="text-lg font-black">Nenhuma oportunidade aberta agora</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Quando cidadãos publicarem novas triagens, elas aparecerão aqui primeiro para acelerar sua análise comercial.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {dashboard.qualifiedOpportunities.map((opportunity) => (
                <QualifiedOpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          )}
        </section>
      ) : null}

      <section className="mb-6 rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 p-6 dark:bg-[#111827] shadow-xl shadow-slate-200/70 dark:shadow-black/20">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">Visão executiva</p>
            <h2 className="mt-2 text-2xl font-black">Ecossistema ConectaJus</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Acompanhe os módulos estratégicos da operação jurídica em uma visão única: captação, relacionamento, prazos, documentos e créditos.
            </p>
          </div>
          <span className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-800 dark:text-amber-200">
            operação integrada
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {operatorEcosystemCards.map((card) => (
            <EcosystemCard key={card.href} {...card} />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 p-6 dark:bg-[#111827] shadow-xl shadow-slate-200/70 dark:shadow-black/20">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">Próximas ações</p>
            <h2 className="mt-2 text-2xl font-black">Continue a operação do escritório</h2>
          </div>
          <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-700 dark:text-slate-300">
            advogado/admin
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {lawyerCards.map((card) => (
            <ActionCard key={card.href} {...card} />
          ))}
        </div>
      </section>
    </section>
  );
}

function QualifiedOpportunityCard({ opportunity }: { opportunity: import("@/features/marketplace/types/marketplace.types").MarketplaceOpportunity }) {
  const location = [opportunity.city, opportunity.state].filter(Boolean).join("/") || "Local não informado";

  return (
    <Link
      href={routes.marketplace}
      className="rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 p-5 dark:bg-[#0B0F19] transition hover:-translate-y-0.5 hover:border-teal-400/50 hover:bg-white dark:hover:bg-white/5"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">{opportunity.practice_area ?? "Área a confirmar"}</p>
          <h3 className="mt-2 text-lg font-black text-slate-950 dark:text-white">{location}</h3>
        </div>
        <span className="w-fit rounded-full bg-teal-600 px-3 py-1 text-xs font-black text-white dark:text-slate-950">
          {opportunity.credit_cost ?? 1} crédito(s)
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{opportunity.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">{opportunity.urgency ?? "Urgência não informada"}</span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">{opportunity.complexity ?? "Complexidade não informada"}</span>
        {opportunity.parent_opportunity_id ? (
          <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-black text-violet-200">Complemento</span>
        ) : null}
      </div>
    </Link>
  );
}

function CitizenDashboard({ caseDocumentCounts, cases, casesError, fullName, handleLogout, stats }: CitizenDashboardProps) {
  return (
    <section className="text-slate-950 dark:text-white">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => navigateBackSafely(routes.dashboard)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-slate-950 dark:text-white hover:bg-white/10"
        >
          ← Voltar
        </button>
        <Link href={routes.home} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-slate-950 dark:text-white hover:bg-white/10">
          Início
        </Link>
        <Link href={routes.triage} className="rounded-2xl bg-teal-600 px-4 py-2 text-sm font-black text-white dark:bg-teal-300 dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200">
          Nova triagem
        </Link>
      </div>

      <div className="mb-8 overflow-hidden rounded-[2rem] border border-amber-400/20 bg-gradient-to-br from-[#111827] via-[#0B0F19] to-[#07182F] p-6 shadow-xl shadow-black/30 md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">Portal do cidadão</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-5xl">Olá, {fullName}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300">
              Este é seu espaço seguro para contar o que aconteceu, organizar documentos e acompanhar a evolução do seu atendimento. Seus dados pessoais não aparecem para advogados no marketplace sem uma liberação controlada.
            </p>
          </div>

          <button onClick={handleLogout} className="w-fit rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-slate-950 dark:text-white hover:bg-white/10">
            Sair
          </button>
        </div>
      </div>

      <section className="mb-6 grid gap-5 lg:grid-cols-4">
        <CitizenStatusCard label="Casos publicados" value={String(stats.total)} description="Triagens enviadas para análise protegida no marketplace jurídico." />
        <CitizenStatusCard label="Aguardando análise" value={String(stats.waiting)} description="Casos visíveis para advogados apenas com dados mascarados." />
        <CitizenStatusCard label="Complementos" value={String(stats.complements)} description="Novas informações vinculadas ao caso original sem alterar o histórico publicado." />
        <CitizenStatusCard label="Contato liberado" value={String(stats.unlocked)} description="Quando um advogado usa créditos, o atendimento pode avançar em ambiente seguro." />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 p-6 dark:bg-[#111827] shadow-xl shadow-slate-200/70 dark:shadow-black/20">
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">Próximos passos</p>
              <h2 className="mt-2 text-2xl font-black">Continue sua jornada</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {citizenCards.map((card) => (
                <ActionCard key={card.href} {...card} />
              ))}
            </div>
          </div>

          <CitizenCasesPanel caseDocumentCounts={caseDocumentCounts} cases={cases} error={casesError} />
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 p-6 dark:bg-[#111827] shadow-xl shadow-slate-200/70 dark:shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">Como funciona</p>
          <h3 className="mt-2 text-xl font-black">Fluxo protegido</h3>
          <div className="mt-5 space-y-3">
            <FlowStep number="1" text="Você informa o problema pela triagem." />
            <FlowStep number="2" text="A IA organiza o caso e evita exposição desnecessária." />
            <FlowStep number="3" text="Advogados analisam apenas dados mascarados." />
            <FlowStep number="4" text="Dados pessoais só são liberados dentro do fluxo seguro." />
          </div>
        </aside>
      </section>
    </section>
  );
}

function CitizenCasesPanel({ caseDocumentCounts, cases, error }: { caseDocumentCounts: Record<string, number>; cases: CitizenDashboardCase[]; error: string | null }) {
  const primaryCases = cases.filter((caseItem) => !caseItem.parent_opportunity_id);
  const complementaryCases = cases.filter((caseItem) => Boolean(caseItem.parent_opportunity_id));

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 p-6 dark:bg-[#111827] shadow-xl shadow-slate-200/70 dark:shadow-black/20">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">Meus casos</p>
          <h2 className="mt-2 text-2xl font-black">Acompanhamento das triagens publicadas</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Casos principais e complementos ficam separados para preservar o relato original e facilitar o acompanhamento.
          </p>
        </div>
        <Link href={routes.triage} className="w-fit rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white dark:bg-teal-300 dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200">
          Nova triagem
        </Link>
      </div>

      <div className="mb-5 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-900 dark:text-amber-50">
        <p className="font-black text-amber-800 dark:text-amber-200">Sobre edição da demanda</p>
        <p className="mt-2">
          Depois que uma triagem é publicada, o relato original fica preservado para manter o histórico confiável do Marketplace. Se algo novo aconteceu, complemente com documentos ou abra uma nova triagem complementar.
        </p>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm font-bold text-red-700 dark:text-red-100">{error}</div>
      ) : null}

      {!error && cases.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 p-5 dark:bg-[#0B0F19]">
          <h3 className="text-lg font-black">Nenhum caso publicado ainda</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Comece pela triagem. Depois de publicar, você poderá acompanhar o status do caso por aqui.
          </p>
        </div>
      ) : null}

      {!error && primaryCases.length > 0 ? (
        <CaseSection
          caseDocumentCounts={caseDocumentCounts}
          cases={primaryCases}
          description="Demandas originais publicadas no Marketplace."
          title="Casos principais"
        />
      ) : null}

      {!error && complementaryCases.length > 0 ? (
        <CaseSection
          caseDocumentCounts={caseDocumentCounts}
          cases={complementaryCases}
          description="Informações novas conectadas ao caso original, sem alterar o relato publicado."
          title="Complementos enviados"
        />
      ) : null}
    </section>
  );
}

function CaseSection({
  caseDocumentCounts,
  cases,
  description,
  title,
}: {
  caseDocumentCounts: Record<string, number>;
  cases: CitizenDashboardCase[];
  description: string;
  title: string;
}) {
  return (
    <div className="mt-6">
      <div className="mb-3">
        <h3 className="text-lg font-black text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <div className="space-y-3">
        {cases.map((caseItem) => (
          <CitizenCaseCard key={caseItem.id} caseItem={caseItem} documentCount={caseDocumentCounts[caseItem.id] ?? 0} />
        ))}
      </div>
    </div>
  );
}
function CitizenCaseCard({ caseItem, documentCount }: { caseItem: CitizenDashboardCase; documentCount: number }) {
  const complementTargetId = caseItem.parent_opportunity_id ?? caseItem.id;
  const status = getCitizenCaseStatus(caseItem);
  const location = [caseItem.city, caseItem.state].filter(Boolean).join("/") || "Local não informado";

  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 p-5 dark:bg-[#0B0F19]">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${status.className}`}>{status.label}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">{caseItem.urgency ?? "Urgência não informada"}</span>
            {caseItem.parent_opportunity_id ? (
              <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-violet-200">Complemento</span>
            ) : null}
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">{documentCount} documento(s)</span>
          </div>
          <h3 className="mt-4 text-lg font-black">{caseItem.practice_area ?? "Área jurídica a definir"}</h3>
          <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-400">{location}</p>
        </div>
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{formatDate(caseItem.created_at)}</span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{caseItem.summary}</p>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <InfoPill label="Complexidade" value={caseItem.complexity ?? "Não informada"} />
        <InfoPill label="Próxima etapa" value={status.nextStep} />
        {caseItem.parent_opportunity_id ? <InfoPill label="Vínculo" value="Triagem complementar vinculada ao caso anterior." /> : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={`${routes.documents}?opportunity=${caseItem.id}`} className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-black text-slate-950 dark:text-white hover:bg-white/10">
          Complementar documentos
        </Link>
        <Link href={`${routes.triage}?complementOf=${complementTargetId}`} className="rounded-2xl border border-amber-400/30 px-4 py-2 text-xs font-black text-amber-800 dark:text-amber-200 hover:bg-amber-400/10">
          Complementar relato
        </Link>
      </div>
    </article>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">{label}</p>
      <p className="mt-2 text-sm font-bold text-slate-950 dark:text-slate-200">{value}</p>
    </div>
  );
}

function SummaryCard({ description, label, value }: { description: string; label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 p-6 dark:bg-[#111827] shadow-xl shadow-slate-200/70 dark:shadow-black/20">
      <p className="text-xs font-black uppercase text-teal-600 dark:text-teal-300">{label}</p>
      <h2 className="mt-4 text-2xl font-black capitalize">{value}</h2>
      <p className="mt-3 text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

function CitizenStatusCard({ description, label, value }: { description: string; label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 p-6 dark:bg-[#111827] shadow-xl shadow-slate-200/70 dark:shadow-black/20">
      <p className="text-xs font-black uppercase text-teal-600 dark:text-teal-300">{label}</p>
      <h2 className="mt-4 text-2xl font-black">{value}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

function ActionCard({ description, href, icon, title }: { description: string; href: string; icon: string; title: string }) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 p-5 dark:bg-[#0B0F19] transition hover:-translate-y-0.5 hover:border-teal-400/50 hover:bg-white dark:hover:bg-white/5 hover:shadow-lg"
    >
      <p className="text-2xl" aria-hidden="true">{icon}</p>
      <h3 className="mt-3 text-lg font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
    </Link>
  );
}

function EcosystemCard({
  description,
  href,
  label,
  status,
  title,
}: {
  description: string;
  href: string;
  label: string;
  status: "active" | "attention" | "ready";
  title: string;
}) {
  const statusClasses = {
    active: "border-emerald-400/30 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
    attention: "border-amber-400/30 bg-amber-400/10 text-amber-800 dark:text-amber-200",
    ready: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  }[status];

  return (
    <Link
      href={href}
      className="rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 p-5 dark:bg-[#0B0F19] transition hover:-translate-y-0.5 hover:border-teal-400/50 hover:bg-white dark:hover:bg-white/5"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">{label}</p>
        <span className={`rounded-full border px-3 py-1 text-[0.65rem] font-black uppercase tracking-wide ${statusClasses}`}>
          {status === "attention" ? "atenção" : status === "active" ? "ativo" : "pronto"}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
    </Link>
  );
}

function FlowStep({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-[#0B0F19] text-sm leading-6 text-slate-700 dark:text-slate-300">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-white dark:text-slate-950">{number}</span>
      <span>{text}</span>
    </div>
  );
}

function getCitizenCaseStatus(caseItem: CitizenDashboardCase) {
  if (caseItem.status === "unlocked" || caseItem.unlocked_by) {
    return {
      className: "bg-emerald-400/15 text-emerald-700 dark:text-emerald-200",
      label: "Contato liberado",
      nextStep: "Aguardar contato do advogado pelo canal informado.",
    };
  }

  if (caseItem.status === "reserved") {
    return {
      className: "bg-sky-400/15 text-sky-200",
      label: "Em análise",
      nextStep: "Um advogado demonstrou interesse e está avaliando o caso.",
    };
  }

  if (caseItem.status === "closed") {
    return {
      className: "bg-slate-400/15 text-slate-200",
      label: "Encerrado",
      nextStep: "Caso encerrado no fluxo atual.",
    };
  }

  if (caseItem.status === "archived") {
    return {
      className: "bg-slate-400/15 text-slate-700 dark:text-slate-300",
      label: "Arquivado",
      nextStep: "Caso arquivado e fora da vitrine de oportunidades.",
    };
  }

  return {
    className: "bg-amber-400/15 text-amber-800 dark:text-amber-200",
    label: "Aguardando advogado",
    nextStep: "Advogados parceiros podem analisar o resumo mascarado.",
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getOperatorEcosystemCards(canUseMarketplace: boolean) {
  return [
    {
      description: "Entrada estratégica de oportunidades mascaradas, triagem por IA e desbloqueio por créditos.",
      href: routes.marketplace,
      label: "Captação",
      status: canUseMarketplace ? "active" : "attention",
      title: "Marketplace jurídico",
    },
    {
      description: "Relacionamento com clientes, painel do caso, notas e conversão de oportunidades desbloqueadas.",
      href: routes.clients,
      label: "Operação",
      status: "active",
      title: "CRM jurídico",
    },
    {
      description: "Saldo, solicitações, consumo e saúde dos créditos para continuidade comercial.",
      href: routes.finance,
      label: "Receita",
      status: canUseMarketplace ? "active" : "attention",
      title: "Financeiro e créditos",
    },
    {
      description: "Gestão processual consolidada, pendências cadastrais e vínculo com clientes.",
      href: routes.processes,
      label: "Jurídico",
      status: "ready",
      title: "Processos",
    },
    {
      description: "Prazos, audiências, reuniões, tarefas e alertas de atraso operacional.",
      href: routes.agenda,
      label: "Rotina",
      status: "ready",
      title: "Agenda",
    },
    {
      description: "Indicadores executivos de captação, créditos, CRM, processos, documentos e agenda.",
      href: routes.reports,
      label: "Gestão",
      status: "ready",
      title: "Relatórios",
    },
    {
      description: "Documentos enviados pelo cidadão e complementos vinculados às demandas publicadas.",
      href: routes.documents,
      label: "Provas",
      status: "ready",
      title: "Documentos",
    },
    {
      description: "Conta, segurança, privacidade e atalhos de operação por perfil.",
      href: routes.settings,
      label: "Conta",
      status: "ready",
      title: "Configurações",
    },
  ] satisfies Array<{
    description: string;
    href: string;
    label: string;
    status: "active" | "attention" | "ready";
    title: string;
  }>;
}

const citizenCards = [
  {
    href: routes.triage,
    icon: "🤖",
    title: "Iniciar triagem",
    description: "Conte seu caso em linguagem simples para a IA organizar as informações essenciais.",
  },
  {
    href: routes.documents,
    icon: "📄",
    title: "Organizar documentos",
    description: "Separe contratos, prints, notificações, comprovantes e outros arquivos importantes.",
  },
  {
    href: routes.agenda,
    icon: "📅",
    title: "Acompanhar agenda",
    description: "Veja compromissos, lembretes e próximos passos quando houver eventos cadastrados.",
  },
];

const lawyerCards = [
  {
    href: routes.marketplace,
    icon: "🧭",
    title: "Ver oportunidades",
    description: "Analise leads mascarados por área, cidade, urgência e complexidade antes de usar créditos.",
  },
  {
    href: routes.finance,
    icon: "💰",
    title: "Gerir créditos",
    description: "Acompanhe saldo, solicitações de compra e histórico de consumo no marketplace.",
  },
  {
    href: routes.clients,
    icon: "👥",
    title: "Abrir CRM",
    description: "Gerencie clientes, painel premium e relacionamento jurídico em uma área centralizada.",
  },
];








