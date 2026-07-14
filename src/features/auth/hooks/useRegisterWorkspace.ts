"use client";

import { useState } from "react";
import {
  initialRegisterForm,
  register,
  type RegisterFormState,
} from "@/features/auth/services/auth.service";

export function useRegisterWorkspace() {
  const [acceptedLegalTerms, setAcceptedLegalTerms] = useState(false);
  const [form, setForm] = useState<RegisterFormState>(initialRegisterForm);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof RegisterFormState, value: string) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "profile" && value === "cliente") {
        return { ...next, oabNumber: "", oabState: "" };
      }

      return next;
    });
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    if (!acceptedLegalTerms) {
      setLoading(false);
      setMessage("Para criar a conta, aceite os Termos de Uso e a Política de Privacidade.");
      return;
    }

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
    acceptedLegalTerms,
    form,
    handleRegister,
    loading,
    message,
    setAcceptedLegalTerms,
    success,
    updateField,
  };
}
