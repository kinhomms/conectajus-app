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
  oabNumber: "",
  oabState: "",
};

export async function getCurrentUser() {
  return authRepository.getCurrentUser();
}
export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return authRepository.onAuthStateChange(callback);
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
  const normalizedInput = {
    ...input,
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    oabNumber: input.oabNumber.trim().replace(/\D/g, ""),
    oabState: input.oabState.trim().toUpperCase(),
  };

  if (normalizedInput.profile === "advogado") {
    if (!normalizedInput.oabNumber || !normalizedInput.oabState) {
      return { data: null, error: new Error("Informe número da OAB e UF para cadastro como advogado.") };
    }

    if (!/^\d{3,8}$/.test(normalizedInput.oabNumber)) {
      return { data: null, error: new Error("Informe um número de OAB válido, somente com dígitos.") };
    }

    if (!isValidBrazilianState(normalizedInput.oabState)) {
      return { data: null, error: new Error("Informe uma UF válida da OAB.") };
    }
  }

  const result = await authRepository.signUp(normalizedInput);

  if (!result.error && result.data.user && result.data.user.identities?.length === 0) {
    return {
      data: null,
      error: new Error("Este e-mail já possui uma conta no ConectaJus. Entre com a conta existente ou use outro e-mail."),
    };
  }

  return result;
}

export async function logout() {
  return authRepository.signOut();
}

function isValidBrazilianState(value: string) {
  return [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ].includes(value);
}




