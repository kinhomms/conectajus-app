"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { useFinanceWorkspace } from "@/features/finance/hooks/useFinanceWorkspace";
import {
  creditPackages,
  getFinanceIntegrationStatus,
} from "@/features/finance/services/finance.service";
import type {
  AdminCreditPurchaseRequest,
  CreditPurchaseRequest,
  LawyerProfile,
  LawyerCreditTransaction,
} from "@/features/finance/types/finance.types";

const transactionLabels: Record<LawyerCreditTransaction["transaction_type"], string> = {
  adjustment: "Ajuste",
  consume: "Consumo",
  purchase: "Compra",
  refund: "Estorno",
};

const requestStatusLabels: Record<CreditPurchaseRequest["status"], string> = {
  approved: "Aprovada",
  canceled: "Cancelada",
  pending: "Pendente",
  rejected: "Rejeitada",
};

export function FinanceWorkspace() {
  const finance = useFinanceWorkspace();
  const integration = getFinanceIntegrationStatus();

  if (finance.loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-white">
        <p className="font-black">Carregando financeiro...</p>
      </main>
    );
  }

  if (!finance.canAccessFinance) {
    return <RestrictedFinance />;
  }

  return (
    <section className="text-white">
      <PageNavigation />
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
            Financeiro
          </p>
          <h1 className="mt-2 text-3xl font-bold">Créditos e faturamento</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Saldo, histórico e solicitações reais de créditos para desbloqueio de oportunidades.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={finance.refresh}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Atualizar
          </button>
          <Link
            href={routes.marketplace}
            className="rounded-2xl bg-amber-400 px-5 py-3 text-center text-sm font-bold text-black hover:bg-amber-300"
          >
            Ver Marketplace
          </Link>
        </div>
      </div>

      {finance.message && (
        <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm font-semibold text-amber-100">
          {finance.message}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Metric label="Saldo atual" value={finance.account?.balance ?? 0} helper="créditos disponíveis" />
        <Metric label="Desbloqueios" value={finance.financeInsights.estimatedUnlocks} helper="estimativa com saldo atual" />
        <Metric label="Comprados" value={finance.purchasedCredits} helper="créditos adicionados" />
        <Metric label="Consumidos" value={finance.consumedCredits} helper="desbloqueios realizados" />
        <Metric label="Pendentes" value={finance.pendingCredits} helper="créditos solicitados" />
        <Metric label="Pedidos" value={finance.financeInsights.pendingRequests} helper="solicitações em aberto" />
      </div>

      <CreditHealthPanel
        lastTransaction={finance.financeInsights.lastTransaction}
        shouldRecharge={finance.financeInsights.shouldRecharge}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {finance.isAdmin && (
            <section className="rounded-3xl border border-amber-400/20 bg-[#111827] p-6 shadow-xl shadow-black/20">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                  Administração
                </p>
                <h2 className="mt-2 text-2xl font-bold">Aprovação de créditos</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Aprovar uma solicitação adiciona créditos ao usuário e registra uma transação de compra.
                </p>
              </div>

              {finance.adminPendingRequests.length === 0 ? (
                <EmptyState
                  title="Nenhuma solicitação pendente"
                  description="Pedidos aguardando aprovação aparecerão aqui para administradores."
                />
              ) : (
                <div className="space-y-3">
                  {finance.adminPendingRequests.map((request) => (
                    <AdminPurchaseRequestCard
                      key={request.id}
                      deciding={finance.decidingRequestId === request.id}
                      onApprove={finance.handleApproveRequest}
                      onReject={finance.handleRejectRequest}
                      request={request}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {finance.isAdmin && (
            <section className="rounded-3xl border border-sky-400/20 bg-[#111827] p-6 shadow-xl shadow-black/20">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.25em] text-sky-300">
                  Validação OAB
                </p>
                <h2 className="mt-2 text-2xl font-bold">Advogados aguardando conferência</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  O Marketplace e o Financeiro ficam bloqueados até a OAB ser marcada como verificada. Confira nome, UF e número em fonte externa confiável antes de aprovar.
                </p>
              </div>

              {finance.lawyerProfilesPendingVerification.length === 0 ? (
                <EmptyState
                  title="Nenhuma OAB pendente"
                  description="Cadastros de advogados aguardando validação aparecerão aqui."
                />
              ) : (
                <div className="space-y-3">
                  {finance.lawyerProfilesPendingVerification.map((profile) => (
                    <LawyerVerificationCard
                      key={profile.user_id}
                      deciding={finance.decidingLawyerId === profile.user_id}
                      onReject={(userId) => finance.handleDecideLawyerVerification(userId, "rejected")}
                      onVerify={(userId) => finance.handleDecideLawyerVerification(userId, "verified")}
                      profile={profile}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                Solicitar créditos
              </p>
              <h2 className="mt-2 text-2xl font-bold">Pacotes disponíveis</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                A solicitação fica pendente. Nenhum crédito é adicionado e nenhuma cobrança é feita automaticamente nesta etapa.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {creditPackages.map((creditPackage) => (
                <div key={creditPackage.id} className="rounded-2xl border border-white/10 bg-[#0B0F19] p-5">
                  <p className="text-sm font-bold text-white">{creditPackage.label}</p>
                  <p className="mt-2 text-3xl font-black text-amber-300">{creditPackage.credits}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">créditos</p>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{creditPackage.description}</p>
                  <p className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                    Valor a confirmar
                  </p>
                  <button
                    type="button"
                    onClick={() => finance.handleRequestCreditPurchase(creditPackage)}
                    disabled={finance.requestingPackageId === creditPackage.id}
                    className="mt-4 w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {finance.requestingPackageId === creditPackage.id ? "Solicitando..." : "Solicitar pacote"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                Histórico
              </p>
              <h2 className="mt-2 text-2xl font-bold">Movimentações de créditos</h2>
            </div>

            {finance.transactions.length === 0 ? (
              <EmptyState
                title="Nenhuma movimentação registrada"
                description="Quando houver compra aprovada, consumo, estorno ou ajuste de créditos, o histórico aparecerá aqui."
              />
            ) : (
              <div className="space-y-3">
                {finance.transactions.map((transaction) => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
              Solicitações
            </p>
            <h3 className="mt-2 text-xl font-bold">Pedidos de compra</h3>

            {finance.purchaseRequests.length === 0 ? (
              <div className="mt-5">
                <EmptyState
                  title="Nenhum pedido"
                  description="Solicitações de compra de créditos aparecerão aqui antes da aprovação."
                  compact
                />
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {finance.purchaseRequests.map((request) => (
                  <PurchaseRequestCard
                    key={request.id}
                    canceling={finance.cancelingRequestId === request.id}
                    onCancel={finance.handleCancelRequest}
                    request={request}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
              Pagamentos
            </p>
            <h3 className="mt-2 text-xl font-bold">Integração futura</h3>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              {integration.message}
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
              Fontes ativas
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {integration.expectedSources.map((source) => (
                <li key={source} className="rounded-2xl bg-[#0B0F19] p-4">
                  {source}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </section>
  );
}

function RestrictedFinance() {
  return (
    <section className="text-white">
      <PageNavigation dashboardLabel="Portal do cidadão" />
      <div className="rounded-3xl border border-amber-400/20 bg-[#111827] p-8 shadow-xl shadow-black/20">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
          Acesso restrito
        </p>
        <h1 className="mt-3 text-3xl font-black">Financeiro exclusivo para advogados parceiros</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
          Créditos são usados para desbloquear oportunidades jurídicas no Marketplace. Advogados recém-cadastrados precisam aguardar a validação administrativa da OAB antes de acessar créditos. Se você é cidadão, continue pela triagem para organizar seu caso.
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

function EmptyState({
  compact = false,
  description,
  title,
}: {
  compact?: boolean;
  description: string;
  title: string;
}) {
  return (
    <div className={`rounded-3xl border border-dashed border-white/10 bg-[#0B0F19] text-center ${compact ? "p-5" : "p-10"}`}>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function CreditHealthPanel({
  lastTransaction,
  shouldRecharge,
}: {
  lastTransaction: LawyerCreditTransaction | null;
  shouldRecharge: boolean;
}) {
  return (
    <div className={`mb-6 rounded-3xl border p-5 ${
      shouldRecharge
        ? "border-amber-400/30 bg-amber-400/10"
        : "border-emerald-400/20 bg-emerald-400/10"
    }`}>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className={`text-xs font-black uppercase tracking-[0.25em] ${
            shouldRecharge ? "text-amber-300" : "text-emerald-300"
          }`}>
            Saúde dos créditos
          </p>
          <h2 className="mt-2 text-xl font-black text-white">
            {shouldRecharge ? "Saldo baixo para novas oportunidades" : "Saldo operacional saudável"}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            {shouldRecharge
              ? "Considere solicitar um novo pacote antes de analisar leads mais urgentes no Marketplace."
              : "O advogado pode continuar desbloqueando oportunidades sem interromper o fluxo comercial."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/80 p-4 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Última movimentação</p>
          {lastTransaction ? (
            <div className="mt-2">
              <p className="font-black text-white">
                {transactionLabels[lastTransaction.transaction_type]} · {lastTransaction.amount > 0 ? "+" : ""}{lastTransaction.amount} créditos
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(lastTransaction.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
          ) : (
            <p className="mt-2 font-semibold text-slate-300">Nenhuma movimentação registrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, helper }: { label: string; value: number; helper: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function PurchaseRequestCard({
  canceling,
  onCancel,
  request,
}: {
  canceling: boolean;
  onCancel: (requestId: string) => void;
  request: CreditPurchaseRequest;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0B0F19] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-white">{request.requested_credits} créditos</p>
          <p className="mt-1 text-xs text-slate-500">
            {new Date(request.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
        <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
          {requestStatusLabels[request.status]}
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        {request.amount_cents === null ? "Valor comercial a confirmar." : formatCurrency(request.amount_cents, request.currency)}
      </p>
      {request.status === "pending" && (
        <button
          type="button"
          onClick={() => onCancel(request.id)}
          disabled={canceling}
          className="mt-3 w-full rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {canceling ? "Cancelando..." : "Cancelar pedido"}
        </button>
      )}
    </article>
  );
}

function AdminPurchaseRequestCard({
  deciding,
  onApprove,
  onReject,
  request,
}: {
  deciding: boolean;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  request: AdminCreditPurchaseRequest;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0B0F19] p-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="font-bold text-white">{request.requested_credits} créditos solicitados</p>
          <p className="mt-1 text-xs text-slate-500">
            Usuário: {request.requester_email || request.user_id}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {new Date(request.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onReject(request.id)}
            disabled={deciding}
            className="rounded-xl border border-red-400/30 px-3 py-2 text-xs font-black text-red-200 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Rejeitar
          </button>
          <button
            type="button"
            onClick={() => onApprove(request.id)}
            disabled={deciding}
            className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-black hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deciding ? "Processando..." : "Aprovar"}
          </button>
        </div>
      </div>
    </article>
  );
}

function LawyerVerificationCard({
  deciding,
  onReject,
  onVerify,
  profile,
}: {
  deciding: boolean;
  onReject: (userId: string) => void;
  onVerify: (userId: string) => void;
  profile: LawyerProfile;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0B0F19] p-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="font-bold text-white">{profile.full_name}</p>
          <p className="mt-1 text-xs text-slate-500">{profile.email}</p>
          <p className="mt-3 inline-flex rounded-full bg-sky-400/10 px-3 py-1 text-xs font-black text-sky-200">
            OAB {profile.oab_state} {profile.oab_number}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Cadastro: {new Date(profile.created_at).toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onReject(profile.user_id)}
            disabled={deciding}
            className="rounded-xl border border-red-400/30 px-3 py-2 text-xs font-black text-red-200 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Rejeitar
          </button>
          <button
            type="button"
            onClick={() => onVerify(profile.user_id)}
            disabled={deciding}
            className="rounded-xl bg-sky-300 px-3 py-2 text-xs font-black text-black hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deciding ? "Processando..." : "Verificar OAB"}
          </button>
        </div>
      </div>
    </article>
  );
}

function TransactionCard({ transaction }: { transaction: LawyerCreditTransaction }) {
  const positive = transaction.amount > 0;
  const metadataText = getTransactionMetadataText(transaction);

  return (
    <article className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-[#0B0F19] p-4 md:flex-row md:items-center">
      <div>
        <p className="text-sm font-bold text-white">
          {transactionLabels[transaction.transaction_type]}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {new Date(transaction.created_at).toLocaleString("pt-BR")}
        </p>
        {metadataText ? (
          <p className="mt-2 break-all text-xs font-semibold text-slate-400">
            {metadataText}
          </p>
        ) : null}
      </div>
      <span className={positive ? "font-black text-emerald-300" : "font-black text-amber-300"}>
        {positive ? "+" : ""}{transaction.amount} créditos
      </span>
    </article>
  );
}

function getTransactionMetadataText(transaction: LawyerCreditTransaction) {
  const metadata = transaction.metadata;

  if (!metadata || typeof metadata !== "object") {
    return "";
  }

  const opportunityId = metadata.opportunity_id;
  const requestId = metadata.request_id;

  if (typeof opportunityId === "string" && opportunityId) {
    return `Oportunidade desbloqueada: ${opportunityId}`;
  }

  if (typeof requestId === "string" && requestId) {
    return `Solicitação vinculada: ${requestId}`;
  }

  return "";
}

function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    currency,
    style: "currency",
  }).format(amountCents / 100);
}
