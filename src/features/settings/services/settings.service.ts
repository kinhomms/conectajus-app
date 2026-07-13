import type { UserProfile } from "@/features/auth/services/auth.service";
import * as settingsRepository from "@/features/settings/repositories/settings.repository";

export type AccountPreferences = {
  emailNotifications: boolean;
  marketingOptIn: boolean;
};

export const defaultAccountPreferences: AccountPreferences = {
  emailNotifications: true,
  marketingOptIn: false,
};

export function getAccountPreferences(metadata: Record<string, unknown> | undefined): AccountPreferences {
  const preferences = metadata?.account_preferences;

  if (!preferences || typeof preferences !== "object") {
    return defaultAccountPreferences;
  }

  const typedPreferences = preferences as Partial<AccountPreferences>;

  return {
    emailNotifications: typeof typedPreferences.emailNotifications === "boolean" ? typedPreferences.emailNotifications : true,
    marketingOptIn: typeof typedPreferences.marketingOptIn === "boolean" ? typedPreferences.marketingOptIn : false,
  };
}

export async function updateAccountProfile(input: {
  fullName: string;
  preferences: AccountPreferences;
}) {
  return settingsRepository.updateUserMetadata({
    account_preferences: input.preferences,
    full_name: input.fullName.trim(),
  });
}

export async function getPendingAccountDeletionRequest(userId: string) {
  return settingsRepository.getPendingAccountDeletionRequest(userId);
}

export async function requestAccountDeletion(input: {
  profile: UserProfile;
  reason: string;
  userEmail: string | null;
  userId: string;
}) {
  return settingsRepository.createAccountDeletionRequest({
    profile: input.profile,
    reason: input.reason.trim() || null,
    status: "pending",
    user_email: input.userEmail,
    user_id: input.userId,
  });
}

export async function cancelAccountDeletionRequest(requestId: string) {
  return settingsRepository.cancelAccountDeletionRequest(requestId);
}
