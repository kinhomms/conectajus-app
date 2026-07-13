import * as financeRepository from "@/features/finance/repositories/finance.repository";
import type {
  CreditPackage,
  FinanceIntegrationStatus,
} from "@/features/finance/types/finance.types";

export const creditPackages: CreditPackage[] = [
  {
    id: "starter",
    label: "Pacote inicial",
    credits: 10,
    description: "Para testar o fluxo de oportunidades qualificadas.",
  },
  {
    id: "growth",
    label: "Pacote crescimento",
    credits: 30,
    description: "Para advogados com uso recorrente do Marketplace.",
  },
  {
    id: "premium",
    label: "Pacote premium",
    credits: 75,
    description: "Para operação comercial mais intensa.",
  },
];

export async function ensureCreditAccount() {
  return financeRepository.ensureCreditAccount();
}

export async function isCurrentUserAdmin() {
  return financeRepository.isCurrentUserAdmin();
}

export async function getCreditAccount(userId: string) {
  return financeRepository.getCreditAccount(userId);
}

export async function listCreditTransactions(userId: string) {
  return financeRepository.listCreditTransactions(userId);
}

export async function listCreditPurchaseRequests(userId: string) {
  return financeRepository.listCreditPurchaseRequests(userId);
}

export async function requestCreditPurchase(userId: string, creditPackage: CreditPackage) {
  return financeRepository.createCreditPurchaseRequest({
    amount_cents: null,
    currency: "BRL",
    notes: `Solicitação criada pelo painel financeiro para ${creditPackage.label}. Valor comercial a confirmar.`,
    requested_credits: creditPackage.credits,
    status: "pending",
    user_id: userId,
  });
}

export async function listAdminPendingCreditPurchaseRequests() {
  return financeRepository.listAdminPendingCreditPurchaseRequests();
}

export async function cancelCreditPurchaseRequest(requestId: string) {
  return financeRepository.cancelCreditPurchaseRequest(requestId);
}

export async function approveCreditPurchaseRequest(requestId: string) {
  return financeRepository.approveCreditPurchaseRequest(requestId);
}

export async function rejectCreditPurchaseRequest(requestId: string) {
  return financeRepository.rejectCreditPurchaseRequest(requestId);
}

export function getFinanceIntegrationStatus(): FinanceIntegrationStatus {
  return {
    configured: true,
    expectedSources: [
      "Tabela lawyer_credit_accounts com saldo por usuário.",
      "Tabela lawyer_credit_transactions com histórico de créditos.",
      "Tabela lawyer_credit_purchase_requests com solicitações pendentes de compra.",
      "RPCs administrativas para aprovação/rejeição segura de créditos.",
      "Tabela marketplace_opportunity_unlocks com auditoria de desbloqueios.",
      "Integração futura com provedor de pagamento para compra automática.",
    ],
    message:
      "O financeiro já lê saldo, histórico e solicitações reais de créditos. A aprovação manual administrativa já pode creditar saldo; cobrança automática ainda será integrada em etapa futura.",
  };
}