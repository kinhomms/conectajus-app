"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import {
  getUserProfile,
  initialLoginForm,
  isLegalOperatorProfile,
  login,
  requestPasswordReset,
  type LoginFormState,
} from "@/features/auth/services/auth.service";

export function useLoginWorkspace() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormState>(initialLoginForm);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "success">("error");
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof LoginFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageTone("error");

    const { data, error } = await login(form);

    setLoading(false);

    if (error) {
      setMessage("Não foi possível entrar. Verifique seu e-mail e senha.");
      return;
    }

    const profile = getUserProfile(data.user);

    router.push(isLegalOperatorProfile(profile) ? routes.marketplace : routes.dashboard);
  }

  async function handlePasswordReset() {
    setLoading(true);
    setMessage("");
    setMessageTone("error");

    const { error } = await requestPasswordReset(form.email);

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessageTone("success");
    setMessage("Enviamos um link de recuperação para o e-mail informado. Verifique sua caixa de entrada.");
  }

  return {
    form,
    handleLogin,
    handlePasswordReset,
    loading,
    message,
    messageTone,
    updateField,
  };
}

