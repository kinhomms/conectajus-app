import { supabase } from "@/lib/supabase";

export type AccountDeletionRequest = {
  id: string;
  user_id: string;
  user_email: string | null;
  profile: string;
  reason: string | null;
  status: "pending" | "approved" | "rejected" | "canceled";
  requested_at: string;
  decided_at: string | null;
  decided_by: string | null;
  decision_notes: string | null;
};

export type CreateAccountDeletionRequestInput = {
  profile: string;
  reason: string | null;
  status: "pending";
  user_email: string | null;
  user_id: string;
};

const accountDeletionFields =
  "id, user_id, user_email, profile, reason, status, requested_at, decided_at, decided_by, decision_notes";

export async function updateUserMetadata(metadata: Record<string, unknown>) {
  return supabase.auth.updateUser({ data: metadata });
}

export async function getPendingAccountDeletionRequest(userId: string) {
  return supabase
    .from("account_deletion_requests")
    .select(accountDeletionFields)
    .eq("user_id", userId)
    .eq("status", "pending")
    .maybeSingle<AccountDeletionRequest>();
}

export async function createAccountDeletionRequest(input: CreateAccountDeletionRequestInput) {
  return supabase
    .from("account_deletion_requests")
    .insert(input)
    .select(accountDeletionFields)
    .single<AccountDeletionRequest>();
}

export async function cancelAccountDeletionRequest(requestId: string) {
  return supabase
    .from("account_deletion_requests")
    .update({ status: "canceled" })
    .eq("id", requestId)
    .select(accountDeletionFields)
    .single<AccountDeletionRequest>();
}
