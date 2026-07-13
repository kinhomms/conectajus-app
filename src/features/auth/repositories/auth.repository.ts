import { supabase } from "@/lib/supabase";

export type SignInInput = {
  email: string;
  password: string;
};

export type PublicUserProfile = "cliente" | "advogado";

export type SignUpInput = SignInInput & {
  name: string;
  profile: PublicUserProfile;
};

export async function getCurrentUser() {
  return supabase.auth.getUser();
}

export async function signInWithPassword(input: SignInInput) {
  return supabase.auth.signInWithPassword(input);
}

export async function signUp(input: SignUpInput) {
  return supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { full_name: input.name, profile: input.profile } },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}