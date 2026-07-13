"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/features/auth/services/auth.service";
import { canCurrentUserAccessMarketplace } from "@/features/marketplace/services/marketplace.service";
import {
  approveCreditPurchaseRequest,
  cancelCreditPurchaseRequest,
  ensureCreditAccount,
  getCreditAccount,
  isCurrentUserAdmin,
  listAdminPendingCreditPurchaseRequests,
  listCreditPurchaseRequests,
  listCreditTransactions,
  rejectCreditPurchaseRequest,
  requestCreditPurchase,
} from "@/features/finance/services/finance.service";
import type {
  AdminCreditPurchaseRequest,
  CreditPackage,
  CreditPurchaseRequest,
  LawyerCreditAccount,
  LawyerCreditTransaction,
} from "@/features/finance/types/finance.types";

export function useFinanceWorkspace() {
  const router = useRouter();
  const [account, setAccount] = useState<LawyerCreditAccount | null>(null);
  const [adminPendingRequests, setAdminPendingRequests] = useState<AdminCreditPurchaseRequest[]>([]);
  const [canAccessFinance, setCanAccessFinance] = useState(false);
  const [cancelingRequestId, setCancelingRequestId] = useState("");
  const [decidingRequestId, setDecidingRequestId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [purchaseRequests, setPurchaseRequests] = useState<CreditPurchaseRequest[]>([]);
  const [requestingPackageId, setRequestingPackageId] = useState("");
  const [transactions, setTransactions] = useState<LawyerCreditTransaction[]>([]);
  const [userId, setUserId] = useState("");

  const refreshFinance = useCallback(async (targetUserId: string, adminMode = isAdmin) => {
    setMessage("");

    const [accountResponse, transactionsResponse, purchaseRequestsResponse, adminRequestsResponse] = await Promise.all([
      getCreditAccount(targetUserId),
      listCreditTransactions(targetUserId),
      listCreditPurchaseRequests(targetUserId),
      adminMode ? listAdminPendingCreditPurchaseRequests() : Promise.resolve({ data: [], error: null }),
    ]);

    if (accountResponse.error) {
      setAccount(null);
      setMessage("Não foi possível carregar a conta de créditos.");
    } else {
      setAccount(accountResponse.data ?? null);
    }

    if (transactionsResponse.error) {
      setTransactions([]);
      setMessage("Não foi possível carregar o histórico de créditos.");
    } else {
      setTransactions(transactionsResponse.data ?? []);
    }

    if (purchaseRequestsResponse.error) {
      setPurchaseRequests([]);
      setMessage("Não foi possível carregar as solicitações de compra.");
    } else {
      setPurchaseRequests(purchaseRequestsResponse.data ?? []);
    }

    if (adminRequestsResponse.error) {
      setAdminPendingRequests([]);
    } else {
      setAdminPendingRequests((adminRequestsResponse.data as AdminCreditPurchaseRequest[] | null) ?? []);
    }
  }, [isAdmin]);

  useEffect(() => {
    async function init() {
      const { data } = await getCurrentUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      const accessResponse = await canCurrentUserAccessMarketplace();
      const allowed = !accessResponse.error && Boolean(accessResponse.data);
      setCanAccessFinance(allowed);
      setUserId(data.user.id);

      if (!allowed) {
        setLoading(false);
        return;
      }

      const adminResponse = await isCurrentUserAdmin();
      const adminProfile = Boolean(adminResponse.data);

      setIsAdmin(adminProfile);

      const { error } = await ensureCreditAccount();

      if (error) {
        setMessage("Não foi possível inicializar a conta de créditos.");
      }

      await refreshFinance(data.user.id, adminProfile);
      setLoading(false);
    }

    init();
  }, [refreshFinance, router]);

  const consumedCredits = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.transaction_type === "consume")
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  }, [transactions]);

  const pendingCredits = useMemo(() => {
    return purchaseRequests
      .filter((request) => request.status === "pending")
      .reduce((total, request) => total + request.requested_credits, 0);
  }, [purchaseRequests]);

  const purchasedCredits = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.transaction_type === "purchase")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  const financeInsights = useMemo(() => {
    const balance = account?.balance ?? 0;
    const pendingRequests = purchaseRequests.filter((request) => request.status === "pending").length;
    const lastTransaction = transactions[0] ?? null;

    return {
      balance,
      estimatedUnlocks: Math.floor(balance),
      lastTransaction,
      pendingRequests,
      shouldRecharge: balance <= 2,
    };
  }, [account?.balance, purchaseRequests, transactions]);

  async function refresh() {
    if (!userId || !canAccessFinance) return;
    await refreshFinance(userId);
  }

  async function handleRequestCreditPurchase(creditPackage: CreditPackage) {
    if (!userId || !canAccessFinance) return;

    setMessage("");
    setRequestingPackageId(creditPackage.id);

    const { error } = await requestCreditPurchase(userId, creditPackage);

    setRequestingPackageId("");

    if (error) {
      setMessage("Não foi possível registrar a solicitação de compra.");
      return;
    }

    setMessage("Solicitação de compra registrada. O saldo será atualizado após aprovação/pagamento.");
    await refreshFinance(userId);
  }

  async function handleCancelRequest(requestId: string) {
    setMessage("");
    setCancelingRequestId(requestId);

    const { data, error } = await cancelCreditPurchaseRequest(requestId);

    setCancelingRequestId("");

    if (error || !data) {
      setMessage("Não foi possível cancelar a solicitação.");
      return;
    }

    setMessage(data.message);
    await refreshFinance(userId);
  }

  async function handleApproveRequest(requestId: string) {
    setMessage("");
    setDecidingRequestId(requestId);

    const { data, error } = await approveCreditPurchaseRequest(requestId);

    setDecidingRequestId("");

    if (error || !data) {
      setMessage("Não foi possível aprovar a solicitação.");
      return;
    }

    setMessage(data.message);
    await refreshFinance(userId, true);
  }

  async function handleRejectRequest(requestId: string) {
    setMessage("");
    setDecidingRequestId(requestId);

    const { data, error } = await rejectCreditPurchaseRequest(requestId);

    setDecidingRequestId("");

    if (error || !data) {
      setMessage("Não foi possível rejeitar a solicitação.");
      return;
    }

    setMessage(data.message);
    await refreshFinance(userId, true);
  }

  return {
    account,
    adminPendingRequests,
    canAccessFinance,
    cancelingRequestId,
    consumedCredits,
    decidingRequestId,
    financeInsights,
    handleApproveRequest,
    handleCancelRequest,
    handleRejectRequest,
    handleRequestCreditPurchase,
    isAdmin,
    loading,
    message,
    pendingCredits,
    purchaseRequests,
    purchasedCredits,
    refresh,
    requestingPackageId,
    transactions,
  };
}
