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
  AccountDeletionRequest,
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
      <main className="flex min-h-[60vh] items-center justify-center text-slate-950 dark:text-white">
        <p className="font-black">Carregando financeiro...</p>
      </main>
    );
  }

  if (!finance.canAccessFinance) {
    return <RestrictedFinance />;
  }

  return (
    <section className="text-slate-950 dark:text-white">
      <PageNavigation />
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
            Financeiro
          </p>
          <h1 className="mt-2 text-3xl font-bold">CrÃ©ditos e faturamento</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Saldo, histÃ³rico e solicitaÃ§Ãµes reais de crÃ©ditos para desbloqueio de oportunidades.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={finance.refresh}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Atualizar
          </button>
          <Link
            href={routes.marketplace}
            className="rounded-2xl bg-teal-600 dark:bg-teal-300 px-5 py-3 text-center text-sm font-bold text-white dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200"
          >
            Ver Marketplace
          </Link>
        </div>
      </div>

      {finance.message && (
        <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-50 dark:bg-amber-400/10 p-4 text-sm font-semibold text-amber-900 dark:text-amber-100">
          {finance.message}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Metric label="Saldo atual" value={finance.account?.balance ?? 0} helper="crÃ©ditos disponÃ­veis" />
        <Metric label="Desbloqueios" value={finance.financeInsights.estimatedUnlocks} helper="estimativa com saldo atual" />
        <Metric label="Comprados" value={finance.purchasedCredits} helper="crÃ©ditos adicionados" />
        <Metric label="Consumidos" value={finance.consumedCredits} helper="desbloqueios realizados" />
        <Metric label="Pendentes" value={finance.pendingCredits} helper="crÃ©ditos solicitados" />
        <Metric label="Pedidos" value={finance.financeInsights.pendingRequests} helper="solicitaÃ§Ãµes em aberto" />
      </div>

      <CreditHealthPanel
        lastTransaction={finance.financeInsights.lastTransaction}
        shouldRecharge={finance.financeInsights.shouldRecharge}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {finance.isAdmin && (
            <section className="rounded-3xl border border-slate-200 bg-white dark:border-amber-400/20 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
                  AdministraÃ§Ã£o
                </p>
                <h2 className="mt-2 text-2xl font-bold">AprovaÃ§Ã£o de crÃ©ditos</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Aprovar uma solicitaÃ§Ã£o adiciona crÃ©ditos ao usuÃ¡rio e registra uma transaÃ§Ã£o de compra.
                </p>
              </div>

              {finance.adminPendingRequests.length === 0 ? (
                <EmptyState
                  title="Nenhuma solicitaÃ§Ã£o pendente"
                  description="Pedidos aguardando aprovaÃ§Ã£o aparecerÃ£o aqui para administradores."
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
            <section className="rounded-3xl border border-sky-400/20 bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.25em] text-sky-300">
                  ValidaÃ§Ã£o OAB
                </p>
                <h2 className="mt-2 text-2xl font-bold">Advogados aguardando conferÃªncia</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  O Marketplace e o Financeiro ficam bloqueados atÃ© a OAB ser marcada como verificada. Confira nome, UF e nÃºmero em fonte externa confiÃ¡vel antes de aprovar.
                </p>
              </div>

              {finance.lawyerProfilesPendingVerification.length === 0 ? (
                <EmptyState
                  title="Nenhuma OAB pendente"
                  description="Cadastros de advogados aguardando validaÃ§Ã£o aparecerÃ£o aqui."
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

          {finance.isAdmin && (
            <section className="rounded-3xl border border-red-400/20 bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.25em] text-red-200">
                  Privacidade e LGPD
                </p>
                <h2 className="mt-2 text-2xl font-bold">SolicitaÃ§Ãµes de exclusÃ£o de conta</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Aprovar aqui nÃ£o apaga automaticamente o usuÃ¡rio do Auth. A aprovaÃ§Ã£o registra a decisÃ£o para tratamento administrativo de retenÃ§Ãµes legais, documentos, crÃ©ditos, auditoria e dados vinculados.
                </p>
              </div>

              {finance.accountDeletionRequests.length === 0 ? (
                <EmptyState
                  title="Nenhuma exclusÃ£o pendente"
                  description="SolicitaÃ§Ãµes feitas pelos usuÃ¡rios aparecerÃ£o aqui para anÃ¡lise administrativa."
                />
              ) : (
                <div className="space-y-3">
                  {finance.accountDeletionRequests.map((request) => (
                    <AccountDeletionRequestCard
                      key={request.id}
                      deciding={finance.decidingDeletionRequestId === request.id}
                      onApprove={(requestId) => finance.handleDecideAccountDeletion(requestId, "approved")}
                      onReject={(requestId) => finance.handleDecideAccountDeletion(requestId, "rejected")}
                      request={request}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
                Solicitar crÃ©ditos
              </p>
              <h2 className="mt-2 text-2xl font-bold">Pacotes disponÃ­veis</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                A solicitaÃ§Ã£o fica pendente. Nenhum crÃ©dito Ã© adicionado e nenhuma cobranÃ§a Ã© feita automaticamente nesta etapa.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {creditPackages.map((creditPackage) => (
                <div key={creditPackage.id} className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-5">
                  <p className="text-sm font-bold text-slate-950 dark:text-white">{creditPackage.label}</p>
                  <p className="mt-2 text-3xl font-black text-teal-700 dark:text-teal-200">{creditPackage.credits}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">crÃ©ditos</p>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-400">{creditPackage.description}</p>
                  <p className="mt-3 rounded-xl bg-white dark:bg-white/5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Valor a confirmar
                  </p>
                  <button
                    type="button"
                    onClick={() => finance.handleRequestCreditPurchase(creditPackage)}
                    disabled={finance.requestingPackageId === creditPackage.id}
                    className="mt-4 w-full rounded-2xl bg-teal-600 dark:bg-teal-300 px-4 py-3 text-sm font-black text-white dark:text-slate-950 transition hover:bg-teal-500 dark:hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {finance.requestingPackageId === creditPackage.id ? "Solicitando..." : "Solicitar pacote"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
                HistÃ³rico
              </p>
              <h2 className="mt-2 text-2xl font-bold">MovimentaÃ§Ãµes de crÃ©ditos</h2>
            </div>

            {finance.transactions.length === 0 ? (
              <EmptyState
                title="Nenhuma movimentaÃ§Ã£o registrada"
                description="Quando houver compra aprovada, consumo, estorno ou ajuste de crÃ©ditos, o histÃ³rico aparecerÃ¡ aqui."
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
          <section className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
            <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
              SolicitaÃ§Ãµes
            </p>
            <h3 className="mt-2 text-xl font-bold">Pedidos de compra</h3>

            {finance.purchaseRequests.length === 0 ? (
              <div className="mt-5">
                <EmptyState
                  title="Nenhum pedido"
                  description="SolicitaÃ§Ãµes de compra de crÃ©ditos aparecerÃ£o aqui antes da aprovaÃ§Ã£o."
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

          <section className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
            <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
              Pagamentos
            </p>
            <h3 className="mt-2 text-xl font-bold">IntegraÃ§Ã£o futura</h3>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {integration.message}
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
            <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
              Fontes ativas
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
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
    <section className="text-slate-950 dark:text-white">
      <PageNavigation dashboardLabel="Portal do cidadÃ£o" />
      <div className="rounded-3xl border border-slate-200 bg-white dark:border-amber-400/20 dark:bg-[#111827] p-8 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
        <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
          Acesso restrito
        </p>
        <h1 className="mt-3 text-3xl font-black">Financeiro exclusivo para advogados parceiros</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          CrÃ©ditos sÃ£o usados para desbloquear oportunidades jurÃ­dicas no Marketplace. Advogados recÃ©m-cadastrados precisam aguardar a validaÃ§Ã£o administrativa da OAB antes de acessar crÃ©ditos. Se vocÃª Ã© cidadÃ£o, continue pela triagem para organizar seu caso.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={routes.triage}
            className="rounded-2xl bg-teal-600 dark:bg-teal-300 px-5 py-3 text-center text-sm font-black text-white dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200"
          >
            Ir para Triagem
          </Link>
          <Link
            href={routes.dashboard}
            className="rounded-2xl border border-slate-200 dark:border-white/10 px-5 py-3 text-center text-sm font-bold text-slate-950 dark:text-white hover:bg-white dark:bg-white/5"
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
    <div className={`rounded-3xl border border-dashed border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] text-center ${compact ? "p-5" : "p-10"}`}>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
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
        ? "border-amber-400/30 bg-amber-50 dark:bg-amber-400/10"
        : "border-emerald-400/20 bg-emerald-400/10"
    }`}>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className={`text-xs font-black uppercase tracking-[0.25em] ${
            shouldRecharge ? "text-teal-700 dark:text-teal-200" : "text-emerald-300"
          }`}>
            SaÃºde dos crÃ©ditos
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">
            {shouldRecharge ? "Saldo baixo para novas oportunidades" : "Saldo operacional saudÃ¡vel"}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
            {shouldRecharge
              ? "Considere solicitar um novo pacote antes de analisar leads mais urgentes no Marketplace."
              : "O advogado pode continuar desbloqueando oportunidades sem interromper o fluxo comercial."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19]/80 p-4 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Ãšltima movimentaÃ§Ã£o</p>
          {lastTransaction ? (
            <div className="mt-2">
              <p className="font-black text-slate-950 dark:text-white">
                {transactionLabels[lastTransaction.transaction_type]} Â· {lastTransaction.amount > 0 ? "+" : ""}{lastTransaction.amount} crÃ©ditos
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {new Date(lastTransaction.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
          ) : (
            <p className="mt-2 font-semibold text-slate-700 dark:text-slate-300">Nenhuma movimentaÃ§Ã£o registrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, helper }: { label: string; value: number; helper: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{helper}</p>
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
    <article className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-950 dark:text-white">{request.requested_credits} crÃ©ditos</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {new Date(request.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
        <span className="rounded-full bg-amber-50 dark:bg-amber-400/10 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-200">
          {requestStatusLabels[request.status]}
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {request.amount_cents === null ? "Valor comercial a confirmar." : formatCurrency(request.amount_cents, request.currency)}
      </p>
      {request.status === "pending" && (
        <button
          type="button"
          onClick={() => onCancel(request.id)}
          disabled={canceling}
          className="mt-3 w-full rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-black text-slate-700 dark:text-slate-300 transition hover:bg-white dark:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
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
    <article className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="font-bold text-slate-950 dark:text-white">{request.requested_credits} crÃ©ditos solicitados</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            UsuÃ¡rio: {request.requester_email || request.user_id}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
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
            className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-white dark:text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
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
    <article className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="font-bold text-slate-950 dark:text-white">{profile.full_name}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{profile.email}</p>
          <p className="mt-3 inline-flex rounded-full bg-sky-400/10 px-3 py-1 text-xs font-black text-sky-200">
            OAB {profile.oab_state} {profile.oab_number}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
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
            className="rounded-xl bg-sky-300 px-3 py-2 text-xs font-black text-white dark:text-slate-950 hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deciding ? "Processando..." : "Verificar OAB"}
          </button>
        </div>
      </div>
    </article>
  );
}

function AccountDeletionRequestCard({
  deciding,
  onApprove,
  onReject,
  request,
}: {
  deciding: boolean;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  request: AccountDeletionRequest;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="font-bold text-slate-950 dark:text-white">{request.user_email || request.user_id}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Perfil: {request.profile}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Solicitada em {new Date(request.requested_at).toLocaleString("pt-BR")}
          </p>
          {request.reason ? (
            <p className="mt-3 rounded-2xl bg-white dark:bg-white/5 p-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {request.reason}
            </p>
          ) : (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Sem motivo informado.</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onReject(request.id)}
            disabled={deciding}
            className="rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-black text-slate-200 hover:bg-white dark:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Rejeitar
          </button>
          <button
            type="button"
            onClick={() => onApprove(request.id)}
            disabled={deciding}
            className="rounded-xl bg-red-300 px-3 py-2 text-xs font-black text-white dark:text-slate-950 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deciding ? "Processando..." : "Aprovar anÃ¡lise"}
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
    <article className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-4 md:flex-row md:items-center">
      <div>
        <p className="text-sm font-bold text-slate-950 dark:text-white">
          {transactionLabels[transaction.transaction_type]}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {new Date(transaction.created_at).toLocaleString("pt-BR")}
        </p>
        {metadataText ? (
          <p className="mt-2 break-all text-xs font-semibold text-slate-600 dark:text-slate-400">
            {metadataText}
          </p>
        ) : null}
      </div>
      <span className={positive ? "font-black text-emerald-300" : "font-black text-teal-700 dark:text-teal-200"}>
        {positive ? "+" : ""}{transaction.amount} crÃ©ditos
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
    return `SolicitaÃ§Ã£o vinculada: ${requestId}`;
  }

  return "";
}

function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    currency,
    style: "currency",
  }).format(amountCents / 100);
}
