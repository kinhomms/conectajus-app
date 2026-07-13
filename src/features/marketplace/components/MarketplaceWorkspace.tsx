"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { useMarketplaceWorkspace } from "@/features/marketplace/hooks/useMarketplaceWorkspace";
import {
  getLockedLeadFields,
  getMarketplaceIntegrationStatus,
  getMarketplaceWorkflow,
  getPublicLeadFields,
} from "@/features/marketplace/services/marketplace.service";
import type {
  MarketplaceCitizenDocument,
  MarketplaceOpportunity,
  MarketplaceOpportunityPrivateDetails,
} from "@/features/marketplace/types/marketplace.types";

export function MarketplaceWorkspace() {
  const marketplace = useMarketplaceWorkspace();
  const integration = getMarketplaceIntegrationStatus();
  const publicFields = getPublicLeadFields();
  const lockedFields = getLockedLeadFields();
  const workflow = getMarketplaceWorkflow();

  if (marketplace.loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-white">
        <p className="font-black">Carregando marketplace...</p>
      </main>
    );
  }

  if (!marketplace.canAccessMarketplace) {
    return <RestrictedMarketplace />;
  }

  return (
    <section className="text-white">
      <PageNavigation />
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
            Marketplace Jurídico
          </p>
          <h1 className="mt-2 text-3xl font-bold">Oportunidades qualificadas</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Camada estratégica entre a triagem por IA e advogados parceiros, com dados pessoais e documentos protegidos até o desbloqueio por créditos.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => marketplace.refreshOpportunities()}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Atualizar
          </button>
          <Link
            href={routes.finance}
            className="rounded-2xl bg-amber-400 px-5 py-3 text-center text-sm font-bold text-black hover:bg-amber-300"
          >
            Ver créditos
          </Link>
        </div>
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-[1fr_150px_150px_150px_150px_190px]">
        <div className="space-y-3">
          <input
            type="search"
            value={marketplace.search}
            onChange={(event) => marketplace.setSearch(event.target.value)}
            placeholder="Buscar por área, cidade, urgência, resumo ou complexidade..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
          />

          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={marketplace.opportunityKindFilter === "all"}
              label="Todos"
              onClick={() => marketplace.setOpportunityKindFilter("all")}
            />
            <FilterButton
              active={marketplace.opportunityKindFilter === "original"}
              label="Casos originais"
              onClick={() => marketplace.setOpportunityKindFilter("original")}
            />
            <FilterButton
              active={marketplace.opportunityKindFilter === "complement"}
              label="Complementos"
              onClick={() => marketplace.setOpportunityKindFilter("complement")}
            />
          </div>
        </div>

        <Metric label="Total" value={marketplace.opportunityStats.total} />
        <Metric label="Originais" value={marketplace.opportunityStats.originals} />
        <Metric label="Complementos" value={marketplace.opportunityStats.complements} />
        <Metric label="Exibidas" value={marketplace.opportunityStats.displayed} />
        <Metric label="Créditos" value={marketplace.creditAccount?.balance ?? "Sem conta"} />
      </div>

      {typeof marketplace.creditAccount?.balance === "number" && marketplace.creditAccount.balance <= 2 ? (
        <div className="mb-6 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
                Saldo baixo
              </p>
              <h2 className="mt-2 text-xl font-black text-white">Poucos créditos para novas oportunidades</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-100">
                Solicite um novo pacote antes de desbloquear leads urgentes, para não interromper o fluxo comercial.
              </p>
            </div>
            <Link
              href={routes.finance}
              className="rounded-2xl bg-amber-400 px-5 py-3 text-center text-sm font-black text-black hover:bg-amber-300"
            >
              Solicitar créditos
            </Link>
          </div>
        </div>
      ) : null}

      {marketplace.message && (
        <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm font-semibold text-amber-100">
          {marketplace.message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {marketplace.filteredOpportunities.length === 0 ? (
            <EmptyMarketplace integrationMessage={integration.message} />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {marketplace.filteredOpportunities.map((opportunity) => {
                const details = marketplace.privateDetails.find((detail) => detail.opportunity_id === opportunity.id) ?? null;
                const linkedDocuments = details
                  ? marketplace.documents.filter((document) => details.citizen_document_ids.includes(document.id))
                  : [];

                return (
                  <OpportunityCard
                    key={opportunity.id}
                    convertedClientId={marketplace.convertedClientIds[opportunity.id] ?? ""}
                    convertingCrm={marketplace.convertingOpportunityId === opportunity.id}
                    details={details}
                    documents={linkedDocuments}
                    onCreateCrmClient={marketplace.handleCreateCrmClient}
                    onOpenDocument={marketplace.openCitizenDocument}
                    onUnlock={marketplace.handleUnlockOpportunity}
                    openingDocumentId={marketplace.openingDocumentId}
                    opportunity={opportunity}
                    unlocking={marketplace.unlockingId === opportunity.id}
                  />
                );
              })}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <FieldGroup
              eyebrow="Visível antes dos créditos"
              title="Informações abertas ao advogado"
              fields={publicFields}
            />
            <FieldGroup
              eyebrow="Bloqueado até desbloqueio"
              title="Dados protegidos do cidadão"
              fields={lockedFields}
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
              Fluxo premium
            </p>
            <h3 className="mt-2 text-xl font-bold">Como o marketplace opera</h3>

            <div className="mt-5 space-y-3">
              {workflow.map((step) => (
                <div key={step.title} className="rounded-2xl bg-[#0B0F19] p-4">
                  <p className="text-sm font-bold text-white">{step.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
              Fontes integradas
            </p>
            <h3 className="mt-2 text-xl font-bold">Base de dados</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {integration.expectedSources.map((source) => (
                <li key={source} className="rounded-2xl bg-[#0B0F19] p-4">
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function RestrictedMarketplace() {
  return (
    <section className="text-white">
      <PageNavigation dashboardLabel="Portal do cidadão" />
      <div className="rounded-3xl border border-amber-400/20 bg-[#111827] p-8 shadow-xl shadow-black/20">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
          Acesso restrito
        </p>
        <h1 className="mt-3 text-3xl font-black">Marketplace exclusivo para advogados parceiros</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
          O Marketplace exibe oportunidades jurídicas mascaradas para advogados com OAB verificada. Se você é advogado recém-cadastrado, aguarde a validação administrativa da OAB. Se você é cidadão, continue pela triagem para organizar seu caso com segurança.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={routes.triage}
            className="rounded-2xl bg-amber-400 px-5 py-3 text-center text-sm font-black text-black hover:bg-amber-300"
          >
            Ir para Triagem
          </Link>
          <Link
            href={routes.dashboard}
            className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/5"
          >
            Voltar ao painel
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmptyMarketplace({ integrationMessage }: { integrationMessage: string }) {
  const publicFields = getPublicLeadFields();

  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-[#111827] p-8">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
        Sem oportunidades reais
      </p>
      <h2 className="mt-3 text-2xl font-bold">Nenhuma oportunidade disponível</h2>
      <p className="mt-4 max-w-3xl leading-7 text-slate-400">{integrationMessage}</p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#0B0F19] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-white">Preview estrutural do lead</p>
            <p className="mt-1 text-sm text-slate-500">Modelo de visibilidade sem dados pessoais.</p>
          </div>
          <span className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-300">
            dados mascarados
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {publicFields.map((field) => (
            <InfoCard key={field.label} title={field.label} description={field.description} />
          ))}
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({
  convertedClientId,
  convertingCrm,
  details,
  documents,
  onCreateCrmClient,
  onOpenDocument,
  onUnlock,
  openingDocumentId,
  opportunity,
  unlocking,
}: {
  convertedClientId: string;
  convertingCrm: boolean;
  details: MarketplaceOpportunityPrivateDetails | null;
  documents: MarketplaceCitizenDocument[];
  onCreateCrmClient: (opportunity: MarketplaceOpportunity) => void;
  onOpenDocument: (document: MarketplaceCitizenDocument) => void;
  onUnlock: (opportunityId: string) => void;
  openingDocumentId: string;
  opportunity: MarketplaceOpportunity;
  unlocking: boolean;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400">
            {opportunity.practice_area || "Área a confirmar"}
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            {formatLocation(opportunity)}
          </h2>
        </div>

        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
          {opportunity.urgency || "Sem urgência"}
        </span>
      </div>

      {opportunity.parent_opportunity_id ? (
        <div className="mb-4 w-fit rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-violet-200">
          Complemento de triagem
        </div>
      ) : null}

      <p className="line-clamp-4 text-sm leading-6 text-slate-400">{opportunity.summary}</p>

      <div className="mt-5 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
        <Info label="Complexidade" value={opportunity.complexity || "A confirmar"} />
        <Info label="Créditos" value={String(opportunity.credit_cost ?? "A definir")} />
        {opportunity.parent_opportunity_id ? <Info label="Origem" value="Complemento de caso publicado" /> : null}
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
        Dados pessoais, documentos e histórico completo permanecem bloqueados até o uso de créditos.
      </div>

      {details ? (
        <PrivateDetails
          convertedClientId={convertedClientId}
          convertingCrm={convertingCrm}
          details={details}
          documents={documents}
          onCreateCrmClient={onCreateCrmClient}
          onOpenDocument={onOpenDocument}
          openingDocumentId={openingDocumentId}
          opportunity={opportunity}
        />
      ) : (
        <button
          type="button"
          onClick={() => onUnlock(opportunity.id)}
          disabled={unlocking}
          className="mt-5 w-full rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {unlocking ? "Desbloqueando..." : "Desbloquear com créditos"}
        </button>
      )}
    </article>
  );
}

function PrivateDetails({
  convertedClientId,
  convertingCrm,
  details,
  documents,
  onCreateCrmClient,
  onOpenDocument,
  openingDocumentId,
  opportunity,
}: {
  convertedClientId: string;
  convertingCrm: boolean;
  details: MarketplaceOpportunityPrivateDetails;
  documents: MarketplaceCitizenDocument[];
  onCreateCrmClient: (opportunity: MarketplaceOpportunity) => void;
  onOpenDocument: (document: MarketplaceCitizenDocument) => void;
  openingDocumentId: string;
  opportunity: MarketplaceOpportunity;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-50">
      <p className="mb-3 font-black text-emerald-200">Dados liberados</p>
      <div className="space-y-2 text-slate-100">
        <p><span className="text-slate-400">Nome:</span> {details.full_name || "Não informado"}</p>
        <p><span className="text-slate-400">Telefone:</span> {details.phone || "Não informado"}</p>
        <p><span className="text-slate-400">WhatsApp:</span> {details.whatsapp || "Não informado"}</p>
        <p><span className="text-slate-400">E-mail:</span> {details.email || "Não informado"}</p>
        <p><span className="text-slate-400">Documentos mencionados:</span> {details.document_notes || "Não informado"}</p>
        <p><span className="text-slate-400">Histórico:</span> {details.case_history || "Não informado"}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-[#0B0F19]/60 p-4">
        <p className="font-black text-emerald-200">Arquivos privados</p>
        {documents.length === 0 ? (
          <p className="mt-2 text-sm text-slate-300">Nenhum arquivo vinculado a esta oportunidade.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {documents.map((document) => (
              <div key={document.id} className="rounded-2xl bg-black/20 p-3">
                <p className="break-words font-bold text-white">{document.file_name}</p>
                <p className="text-xs text-slate-400">{document.mime_type || "Arquivo privado"}</p>
                <button
                  type="button"
                  onClick={() => onOpenDocument(document)}
                  disabled={openingDocumentId === document.id}
                  className="mt-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {openingDocumentId === document.id ? "Abrindo..." : "Abrir link seguro"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-[#0B0F19]/70 p-4">
        <p className="font-black text-white">Próxima etapa operacional</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Envie este lead desbloqueado para o CRM para abrir cliente, caso, nota inicial e referências dos documentos.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onCreateCrmClient(opportunity)}
            disabled={convertingCrm}
            className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-black hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {convertingCrm ? "Enviando..." : "Enviar para CRM"}
          </button>
          <Link
            href={routes.clients}
            className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-white hover:bg-white/10"
          >
            {convertedClientId ? "Abrir CRM" : "Ver CRM"}
          </Link>
        </div>
        {convertedClientId ? (
          <p className="mt-3 text-xs font-bold text-emerald-200">Cliente vinculado no CRM: {convertedClientId}</p>
        ) : null}
      </div>
    </div>
  );
}

function formatLocation(opportunity: MarketplaceOpportunity) {
  if (opportunity.city && opportunity.state) {
    return `${opportunity.city}/${opportunity.state}`;
  }

  return opportunity.city || opportunity.state || "Cidade não informada";
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-wide transition ${
        active
          ? "border-amber-400 bg-amber-400 text-black"
          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function FieldGroup({
  eyebrow,
  title,
  fields,
}: {
  eyebrow: string;
  title: string;
  fields: Array<{ label: string; description: string }>;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-bold text-white">{title}</h3>
      <div className="mt-5 space-y-3">
        {fields.map((field) => (
          <InfoCard key={field.label} title={field.label} description={field.description} />
        ))}
      </div>
    </div>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-4">
      <p className="text-sm font-bold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#0B0F19] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-white">{value}</p>
    </div>
  );
}
