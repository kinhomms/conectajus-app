"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, getUserProfile, isCitizenProfile, isLegalOperatorProfile, logout, type UserProfile } from "@/features/auth/services/auth.service";
import { canCurrentUserAccessMarketplace } from "@/features/marketplace/services/marketplace.service";

export type SettingsChecklistItem = {
  description: string;
  done: boolean;
  label: string;
};

export function useSettingsWorkspace() {
  const router = useRouter();
  const [canAccessMarketplace, setCanAccessMarketplace] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<UserProfile>("cliente");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await getCurrentUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      const currentProfile = getUserProfile(data.user);
      setUser(data.user);
      setProfile(currentProfile);

      if (isLegalOperatorProfile(currentProfile)) {
        const accessResponse = await canCurrentUserAccessMarketplace();
        setCanAccessMarketplace(!accessResponse.error && Boolean(accessResponse.data));
      }

      setLoading(false);
    }

    loadSettings();
  }, [router]);

  const userEmail = user?.email ?? "";

  const fullName = useMemo(() => {
    const metadataName = user?.user_metadata?.full_name;
    return typeof metadataName === "string" && metadataName.trim() ? metadataName : "Usuário ConectaJus";
  }, [user?.user_metadata]);

  const profileLabel = {
    admin: "Administrador",
    advogado: "Advogado parceiro",
    cliente: "Cidadão",
  }[profile];

  const privacyChecklist = useMemo<SettingsChecklistItem[]>(() => {
    if (isCitizenProfile(profile)) {
      return [
        {
          description: "O Marketplace exibe área, cidade, urgência, complexidade e resumo sem dados pessoais.",
          done: true,
          label: "Dados mascarados na vitrine",
        },
        {
          description: "Nome, telefone, WhatsApp, e-mail, documentos e histórico só aparecem no fluxo de desbloqueio.",
          done: true,
          label: "Dados privados protegidos",
        },
        {
          description: "Complementos preservam o histórico original da triagem publicada.",
          done: true,
          label: "Histórico da demanda preservado",
        },
      ];
    }

    return [
      {
        description: canAccessMarketplace ? "A conta pode acessar oportunidades mascaradas e fluxo de créditos." : "A conta ainda não possui acesso operacional ao Marketplace.",
        done: canAccessMarketplace,
        label: "Acesso ao Marketplace",
      },
      {
        description: "Os dados privados do cidadão devem ser acessados apenas após uso de créditos/autorização do fluxo.",
        done: true,
        label: "Regra de privacidade ativa",
      },
      {
        description: "O CRM deve receber apenas oportunidades desbloqueadas e vinculadas ao caso correto.",
        done: true,
        label: "Conversão controlada para CRM",
      },
    ];
  }, [canAccessMarketplace, profile]);

  const securityChecklist = useMemo<SettingsChecklistItem[]>(() => [
    {
      description: userEmail ? `Conta autenticada como ${userEmail}.` : "Sessão autenticada pelo Supabase.",
      done: Boolean(userEmail),
      label: "Sessão Supabase",
    },
    {
      description: "As variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias no build.",
      done: true,
      label: "Ambiente configurável",
    },
    {
      description: "Rotas sensíveis redirecionam usuários sem sessão para o login.",
      done: true,
      label: "Proteção por autenticação",
    },
  ], [userEmail]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    setMessage("");

    const { error } = await logout();

    if (error) {
      setMessage("Não foi possível sair agora. Tente novamente.");
      setLoggingOut(false);
      return;
    }

    router.push("/login");
  }, [router]);

  return {
    canAccessMarketplace,
    fullName,
    handleLogout,
    isCitizen: isCitizenProfile(profile),
    isLegalOperator: isLegalOperatorProfile(profile),
    loading,
    loggingOut,
    message,
    privacyChecklist,
    profile,
    profileLabel,
    securityChecklist,
    user,
  };
}
