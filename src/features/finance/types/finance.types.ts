export type FinanceIntegrationStatus = {
  configured: boolean;
  message: string;
  expectedSources: string[];
};

export type LawyerCreditAccount = {
  user_id: string;
  balance: number;
  updated_at: string;
};

export type LawyerCreditTransaction = {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: "purchase" | "consume" | "refund" | "adjustment";
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type CreditPurchaseRequestStatus = "pending" | "approved" | "rejected" | "canceled";

export type CreditPurchaseRequest = {
  id: string;
  user_id: string;
  requested_credits: number;
  amount_cents: number | null;
  currency: string;
  status: CreditPurchaseRequestStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  decided_at: string | null;
  decided_by: string | null;
  decision_notes: string | null;
};

export type AdminCreditPurchaseRequest = CreditPurchaseRequest & {
  requester_email: string | null;
};

export type CreditPackage = {
  id: string;
  label: string;
  credits: number;
  description: string;
};

export type LawyerVerificationStatus = "pending" | "verified" | "rejected";

export type LawyerProfile = {
  user_id: string;
  full_name: string;
  email: string;
  oab_number: string;
  oab_state: string;
  verification_status: LawyerVerificationStatus;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
  verified_by: string | null;
  verification_notes: string | null;
};

export type AccountDeletionRequestStatus = "pending" | "approved" | "rejected" | "canceled";

export type AccountDeletionRequest = {
  id: string;
  user_id: string;
  user_email: string | null;
  profile: string;
  reason: string | null;
  status: AccountDeletionRequestStatus;
  requested_at: string;
  decided_at: string | null;
  decided_by: string | null;
  decision_notes: string | null;
};

export type EnsureCreditAccountResult = {
  user_id: string;
  balance: number;
  updated_at: string;
};

export type CreditRequestDecisionResult = {
  ok: boolean;
  message: string;
  request_id: string | null;
  credited_balance: number | null;
};
