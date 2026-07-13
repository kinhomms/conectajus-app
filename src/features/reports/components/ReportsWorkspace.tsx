"use client";

import Link from "next/link";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { routes } from "@/lib/routes";
import { useReportsWorkspace, type ReportAction, type ReportMetric, type ReportSignal } from "@/features/reports/hooks/useReportsWorkspace";

export function ReportsWorkspace() {
  const reports = useReportsWorkspace();

  if (reports.loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-white">
        <p className="font-black">Carregando relatórios...</p>
      </main>
    );
  }

  if (!reports.canAccessReports) {
    return <RestrictedReports />;
  }

  return (
    <section className="text-white">
      <PageNavigation dashboardLabel="Dashboard" />

      <div className="mb-8 overflow-hidden rounded-[2rem] border border-amber-400/20 bg-gradient-to-br from-[#111827] via-[#0B0F19] to-[#07182F] p-6 shadow-xl shadow-black/30 md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">Relatórios executivos</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-5xl">Pulso do ecossistema ConectaJus</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Uma visão de gestão para acompanhar captação, créditos, conversão em CRM, documentos, processos e agenda sem expor dados sensíveis do cidadão.
            </p>
          </div>

          <span className={`w-fit rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wide ${
            reports.canAccessMarketplace
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-amber-400/30 bg-amber-400/10 text-amber-200"
          }`}>
            {reports.canAccessMarketplace ? "Marketplace conectado" : "Marketplace restrito"}
          </span>
        </div>
      </div>

      {reports.message ? (
        <div className="mb-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm font-bold leading-6 text-amber-100">
          {reports.message}
        </div>
      ) : null}

      <section className="mb-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {reports.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Funil operacional</p>
              <h2 className="mt-2 text-2xl font-black">Da triagem ao relacionamento</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Indicadores agregados para entender se a operação está captando, convertendo e acompanhando bem.
              </p>
            </div>
            <Link href={routes.marketplace} className="w-fit rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-black hover:bg-amber-300">
              Abrir Marketplace
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FunnelPill label="Oportunidades totais" value={reports.state.marketplaceOpportunities} />
            <FunnelPill label="Complementos publicados" value={reports.state.marketplaceComplements} />
            <FunnelPill label="Contatos desbloqueados" value={reports.state.marketplaceUnlocked} />
            <FunnelPill label="Conversões para CRM" value={reports.state.crmConversions} />
            <FunnelPill label="Clientes no CRM" value={reports.state.clients} />
            <FunnelPill label="Documentos jurídicos" value={reports.state.documents} />
            <FunnelPill label="Processos monitorados" value={reports.state.processes} />
            <FunnelPill label="Eventos de agenda" value={reports.state.agendaEvents} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Áreas em destaque</p>
          <h2 className="mt-2 text-2xl font-black">Demanda por área jurídica</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Ranking baseado nas oportunidades carregadas do Marketplace.
          </p>

          <div className="mt-5 space-y-3">
            {reports.state.topAreas.length > 0 ? (
              reports.state.topAreas.map((item) => (
                <AreaBar key={item.area} area={item.area} total={item.total} max={reports.state.topAreas[0]?.total ?? 1} />
              ))
            ) : (
              <div className="rounded-3xl border border-white/10 bg-[#0B0F19] p-5 text-sm leading-6 text-slate-400">
                Ainda não há oportunidades suficientes para formar um ranking de áreas.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Prioridades sugeridas</p>
          <h2 className="mt-2 text-2xl font-black">Onde agir agora</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {reports.actions.map((action) => (
            <ActionCard key={action.title} action={action} />
          ))}
        </div>
      </section>
    </section>
  );
}

function RestrictedReports() {
  return (
    <section className="text-white">
      <PageNavigation dashboardLabel="Portal do cidadão" />

      <div className="rounded-3xl border border-amber-400/20 bg-[#111827] p-8 shadow-xl shadow-black/20">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">Acesso restrito</p>
        <h1 className="mt-3 text-3xl font-black">Relatórios executivos são exclusivos da operação jurídica</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
          Esta área consolida indicadores de Marketplace, CRM, créditos, processos e agenda para advogados parceiros e administradores. Para o cidadão, o fluxo correto é acompanhar casos, complementar relatos e organizar documentos pelo portal seguro.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={routes.dashboard} className="rounded-2xl bg-amber-400 px-5 py-3 text-center text-sm font-black text-black hover:bg-amber-300">
            Ir para meu portal
          </Link>
          <Link href={routes.triage} className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/5">
            Fazer triagem
          </Link>
          <Link href={routes.documents} className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/5">
            Enviar documentos
          </Link>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ metric }: { metric: ReportMetric }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-black uppercase text-amber-400">{metric.label}</p>
        <SignalBadge signal={metric.signal} />
      </div>
      <h2 className="mt-4 text-4xl font-black tracking-[-0.05em]">{metric.value}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">{metric.description}</p>
    </div>
  );
}

function FunnelPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0B0F19] p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function AreaBar({ area, max, total }: { area: string; max: number; total: number }) {
  const width = Math.max(12, Math.round((total / Math.max(max, 1)) * 100));

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0B0F19] p-4">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <span className="font-black text-white">{area}</span>
        <span className="font-bold text-slate-400">{total}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-amber-400" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function ActionCard({ action }: { action: ReportAction }) {
  return (
    <Link href={action.href} className="rounded-3xl border border-white/10 bg-[#0B0F19] p-5 transition hover:-translate-y-0.5 hover:border-amber-400/50 hover:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">{action.label}</p>
        <SignalBadge signal={action.signal} />
      </div>
      <h3 className="mt-4 text-lg font-black">{action.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{action.description}</p>
    </Link>
  );
}

function SignalBadge({ signal }: { signal: ReportSignal }) {
  const classes = {
    attention: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    critical: "border-red-400/30 bg-red-400/10 text-red-200",
    healthy: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  }[signal];

  const label = {
    attention: "atenção",
    critical: "crítico",
    healthy: "ok",
  }[signal];

  return (
    <span className={`rounded-full border px-3 py-1 text-[0.65rem] font-black uppercase tracking-wide ${classes}`}>
      {label}
    </span>
  );
}
