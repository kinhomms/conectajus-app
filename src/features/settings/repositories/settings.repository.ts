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

export type LawyerPublicProfile = {
  user_id: string;
  full_name: string;
  headline: string | null;
  bio: string | null;
  profile_photo_url: string | null;
  oab_number: string | null;
  oab_state: string | null;
  is_public: boolean;
  updated_at: string;
};

export type UpsertLawyerPublicProfileInput = {
  bio: string | null;
  full_name: string;
  headline: string | null;
  is_public: boolean;
  oab_number: string | null;
  oab_state: string | null;
  profile_photo_url: string | null;
  user_id: string;
};

const accountDeletionFields =
  "id, user_id, user_email, profile, reason, status, requested_at, decided_at, decided_by, decision_notes";
const lawyerPublicProfileFields =
  "user_id, full_name, headline, bio, profile_photo_url, oab_number, oab_state, is_public, updated_at";
const lawyerProfilePhotoBucket = "lawyer-profile-photos";

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

export async function getOwnLawyerPublicProfile(userId: string) {
  return supabase
    .from("lawyer_public_profiles")
    .select(lawyerPublicProfileFields)
    .eq("user_id", userId)
    .maybeSingle<LawyerPublicProfile>();
}

export async function getLawyerPublicProfile(userId: string) {
  return supabase
    .from("lawyer_public_profiles")
    .select(lawyerPublicProfileFields)
    .eq("user_id", userId)
    .eq("is_public", true)
    .maybeSingle<LawyerPublicProfile>();
}

export async function upsertLawyerPublicProfile(input: UpsertLawyerPublicProfileInput) {
  return supabase
    .from("lawyer_public_profiles")
    .upsert(input, { onConflict: "user_id" })
    .select(lawyerPublicProfileFields)
    .single<LawyerPublicProfile>();
}

export async function uploadLawyerProfilePhoto(userId: string, file: File) {
  const extension = getFileExtension(file.name, file.type);
  const filePath = `${userId}/profile.${extension}`;

  const uploadResponse = await supabase.storage
    .from(lawyerProfilePhotoBucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: true,
    });

  if (uploadResponse.error) {
    return { data: null, error: uploadResponse.error };
  }

  const publicUrlResponse = supabase.storage
    .from(lawyerProfilePhotoBucket)
    .getPublicUrl(filePath);

  return {
    data: publicUrlResponse.data.publicUrl,
    error: null,
  };
}

function getFileExtension(fileName: string, mimeType: string) {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  if (fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png" || fileExtension === "webp") {
    return fileExtension === "jpg" ? "jpeg" : fileExtension;
  }

  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";

  return "jpeg";
}
