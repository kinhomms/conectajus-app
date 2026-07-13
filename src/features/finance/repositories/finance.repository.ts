import { supabase } from "@/lib/supabase";
import type {
  AdminCreditPurchaseRequest,
  AccountDeletionRequest,
  AccountDeletionRequestStatus,
  CreditPurchaseRequest,
  CreditRequestDecisionResult,
  EnsureCreditAccountResult,
  LawyerCreditAccount,
  LawyerProfile,
  LawyerVerificationStatus,
  LawyerCreditTransaction,
} from "@/features/finance/types/finance.types";

const accountFields = "user_id, balance, updated_at";
const transactionFields = "id, user_id, amount, transaction_type, metadata, created_at";
const purchaseRequestFields =
  "id, user_id, requested_credits, amount_cents, currency, status, notes, created_at, updated_at";
const lawyerProfileFields =
  "user_id, full_name, email, oab_number, oab_state, verification_status, created_at, updated_at";
const accountDeletionRequestFields =
  "id, user_id, user_email, profile, reason, status, requested_at, decided_at, decided_by, decision_notes";

export type CreateCreditPurchaseRequestInput = {
  user_id: string;
  requested_credits: number;
  amount_cents: number | null;
  currency: string;
  status: "pending";
  notes: string | null;
};

export async function ensureCreditAccount() {
  return supabase
    .rpc("ensure_lawyer_credit_account")
    .single<EnsureCreditAccountResult>();
}


export async function isCurrentUserAdmin() {
  return supabase
    .rpc("is_current_user_admin")
    .single<boolean>();
}
export async function getCreditAccount(userId: string) {
  return supabase
    .from("lawyer_credit_accounts")
    .select(accountFields)
    .eq("user_id", userId)
    .maybeSingle<LawyerCreditAccount>();
}

export async function listCreditTransactions(userId: string) {
  return supabase
    .from("lawyer_credit_transactions")
    .select(transactionFields)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(25)
    .returns<LawyerCreditTransaction[]>();
}

export async function listCreditPurchaseRequests(userId: string) {
  return supabase
    .from("lawyer_credit_purchase_requests")
    .select(purchaseRequestFields)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)
    .returns<CreditPurchaseRequest[]>();
}

export async function createCreditPurchaseRequest(input: CreateCreditPurchaseRequestInput) {
  return supabase
    .from("lawyer_credit_purchase_requests")
    .insert(input)
    .select(purchaseRequestFields)
    .single<CreditPurchaseRequest>();
}

export async function listAdminPendingCreditPurchaseRequests() {
  return supabase
    .rpc("list_pending_credit_purchase_requests")
    .returns<AdminCreditPurchaseRequest[]>();
}

export async function approveCreditPurchaseRequest(requestId: string) {
  return supabase
    .rpc("approve_credit_purchase_request", { target_request_id: requestId })
    .single<CreditRequestDecisionResult>();
}

export async function rejectCreditPurchaseRequest(requestId: string) {
  return supabase
    .rpc("reject_credit_purchase_request", { target_request_id: requestId })
    .single<CreditRequestDecisionResult>();
}
export async function cancelCreditPurchaseRequest(requestId: string) {
  return supabase
    .rpc("cancel_credit_purchase_request", { target_request_id: requestId })
    .single<CreditRequestDecisionResult>();
}

export async function listPendingLawyerProfiles() {
  return supabase
    .from("lawyer_profiles")
    .select(lawyerProfileFields)
    .eq("verification_status", "pending")
    .order("created_at", { ascending: true })
    .returns<LawyerProfile[]>();
}

export async function updateLawyerVerificationStatus(userId: string, status: LawyerVerificationStatus) {
  return supabase
    .from("lawyer_profiles")
    .update({ verification_status: status })
    .eq("user_id", userId)
    .select(lawyerProfileFields)
    .single<LawyerProfile>();
}

export async function listPendingAccountDeletionRequests() {
  return supabase
    .from("account_deletion_requests")
    .select(accountDeletionRequestFields)
    .eq("status", "pending")
    .order("requested_at", { ascending: true })
    .returns<AccountDeletionRequest[]>();
}

export async function updateAccountDeletionRequestStatus(requestId: string, status: AccountDeletionRequestStatus) {
  return supabase
    .from("account_deletion_requests")
    .update({
      decided_at: new Date().toISOString(),
      status,
    })
    .eq("id", requestId)
    .select(accountDeletionRequestFields)
    .single<AccountDeletionRequest>();
}
