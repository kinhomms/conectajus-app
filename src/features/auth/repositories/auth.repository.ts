import { supabase } from "@/lib/supabase";

export type SignInInput = {
  email: string;
  password: string;
};

export type PublicUserProfile = "cliente" | "advogado";

export type SignUpInput = SignInInput & {
  name: string;
  profile: PublicUserProfile;
  oabNumber: string;
  oabState: string;
};

export async function getCurrentUser() {
  return supabase.auth.getUser();
}

export async function signInWithPassword(input: SignInInput) {
  return supabase.auth.signInWithPassword(input);
}

export async function signUp(input: SignUpInput) {
  const metadata = {
    full_name: input.name,
    profile: input.profile,
    ...(input.profile === "advogado"
      ? {
          lawyer_oab_number: input.oabNumber,
          lawyer_oab_state: input.oabState,
          lawyer_verification_status: "pending",
        }
      : {}),
  };

  return supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: metadata },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
