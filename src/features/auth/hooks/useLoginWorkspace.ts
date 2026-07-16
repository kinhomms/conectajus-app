"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  initialLoginForm,
  login,
  type LoginFormState,
} from "@/features/auth/services/auth.service";

export function useLoginWorkspace() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormState>(initialLoginForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof LoginFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await login(form);

    setLoading(false);

    if (error) {
      setMessage("Não foi possível entrar. Verifique seu e-mail e senha.");
      return;
    }

    router.push("/dashboard");
  }

  return {
    form,
    handleLogin,
    loading,
    message,
    updateField,
  };
}

