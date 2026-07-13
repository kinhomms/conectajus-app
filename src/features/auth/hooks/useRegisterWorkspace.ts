"use client";

import { useState } from "react";
import {
  initialRegisterForm,
  register,
  type RegisterFormState,
} from "@/features/auth/services/auth.service";

export function useRegisterWorkspace() {
  const [form, setForm] = useState<RegisterFormState>(initialRegisterForm);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof RegisterFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    const { error } = await register(form);

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSuccess(true);
    setMessage("Cadastro criado. Verifique seu e-mail para confirmar a conta.");
  }

  return {
    form,
    handleRegister,
    loading,
    message,
    success,
    updateField,
  };
}
