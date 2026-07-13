import type { User } from "@supabase/supabase-js";
import * as authRepository from "@/features/auth/repositories/auth.repository";
import type { SignInInput, SignUpInput } from "@/features/auth/repositories/auth.repository";

export type LoginFormState = SignInInput;

export type RegisterFormState = SignUpInput;

export type UserProfile = "cliente" | "advogado" | "admin";

export const initialLoginForm: LoginFormState = {
  email: "",
  password: "",
};

export const initialRegisterForm: RegisterFormState = {
  name: "",
  profile: "cliente",
  email: "",
  password: "",
};

export async function getCurrentUser() {
  return authRepository.getCurrentUser();
}

export function getUserProfile(user: User | null | undefined): UserProfile {
  const profile = user?.user_metadata?.profile;

  if (profile === "advogado" || profile === "admin") {
    return profile;
  }

  return "cliente";
}

export function isCitizenProfile(profile: UserProfile) {
  return profile === "cliente";
}

export function isLegalOperatorProfile(profile: UserProfile) {
  return profile === "advogado" || profile === "admin";
}

export async function login(input: LoginFormState) {
  return authRepository.signInWithPassword(input);
}

export async function register(input: RegisterFormState) {
  return authRepository.signUp(input);
}

export async function logout() {
  return authRepository.signOut();
}