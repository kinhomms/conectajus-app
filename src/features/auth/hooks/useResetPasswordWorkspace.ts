"use client";

import { useState } from "react";
import { routes } from "@/lib/routes";
import { updatePassword } from "@/features/auth/services/auth.service";

export function useResetPasswordWorkspace() {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "success">("error");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageTone("error");

    const { error } = await updatePassword(password, confirmation);

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessageTone("success");
    setMessage("Senha redefinida com sucesso. Você já pode entrar novamente.");
    setPassword("");
    setConfirmation("");
  }

  return {
    confirmation,
    handleSubmit,
    loading,
    loginHref: routes.login,
    message,
    messageTone,
    password,
    setConfirmation,
    setPassword,
  };
}
