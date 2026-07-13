"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, getUserProfile, isCitizenProfile, isLegalOperatorProfile, logout, type UserProfile } from "@/features/auth/services/auth.service";
import { canCurrentUserAccessMarketplace } from "@/features/marketplace/services/marketplace.service";
import type { AccountDeletionRequest } from "@/features/settings/repositories/settings.repository";
import {
  cancelAccountDeletionRequest,
  getAccountPreferences,
  getPendingAccountDeletionRequest,
  requestAccountDeletion,
  updateAccountProfile,
  type AccountPreferences,
} from "@/features/settings/services/settings.service";

export type SettingsChecklistItem = {
  description: string;
  done: boolean;
  label: string;
};

export function useSettingsWorkspace() {
  const router = useRouter();
  const [canAccessMarketplace, setCanAccessMarketplace] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingDeletionRequest, setPendingDeletionRequest] = useState<AccountDeletionRequest | null>(null);
  const [preferences, setPreferences] = useState<AccountPreferences>({ emailNotifications: true, marketingOptIn: false });
  const [profile, setProfile] = useState<UserProfile>("cliente");
  const [savingProfile, setSavingProfile] = useState(false);
  const [submittingDeletion, setSubmittingDeletion] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [workingFullName, setWorkingFullName] = useState("");

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
      setWorkingFullName(getFullNameFromUser(data.user));
      setPreferences(getAccountPreferences(data.user.user_metadata));

      const deletionResponse = await getPendingAccountDeletionRequest(data.user.id);
      if (!deletionResponse.error) {
        setPendingDeletionRequest(deletionResponse.data ?? null);
      }

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
    return user ? getFullNameFromUser(user) : "Usuário ConectaJus";
  }, [user]);

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

  const updatePreference = useCallback((field: keyof AccountPreferences, value: boolean) => {
    setPreferences((current) => ({ ...current, [field]: value }));
  }, []);

  const handleSaveProfile = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!workingFullName.trim()) {
      setMessage("Informe seu nome completo.");
      return;
    }

    setSavingProfile(true);
    const { data, error } = await updateAccountProfile({
      fullName: workingFullName,
      preferences,
    });
    setSavingProfile(false);

    if (error) {
      setMessage("Não foi possível salvar as configurações da conta.");
      return;
    }

    setUser(data.user);
    setMessage("Configurações da conta salvas com sucesso.");
  }, [preferences, workingFullName]);

  const handleRequestAccountDeletion = useCallback(async () => {
    if (!user || pendingDeletionRequest) return;

    setMessage("");
    setSubmittingDeletion(true);

    const { data, error } = await requestAccountDeletion({
      profile,
      reason: deletionReason,
      userEmail,
      userId: user.id,
    });

    setSubmittingDeletion(false);

    if (error) {
      setMessage("Não foi possível registrar a solicitação de exclusão. Verifique se já existe uma solicitação pendente.");
      return;
    }

    setPendingDeletionRequest(data);
    setDeletionReason("");
    setMessage("Solicitação de exclusão registrada. A equipe analisará retenções legais, auditoria e dados vinculados antes da conclusão.");
  }, [deletionReason, pendingDeletionRequest, profile, user, userEmail]);

  const handleCancelAccountDeletion = useCallback(async () => {
    if (!pendingDeletionRequest) return;

    setMessage("");
    setSubmittingDeletion(true);

    const { error } = await cancelAccountDeletionRequest(pendingDeletionRequest.id);

    setSubmittingDeletion(false);

    if (error) {
      setMessage("Não foi possível cancelar a solicitação de exclusão.");
      return;
    }

    setPendingDeletionRequest(null);
    setMessage("Solicitação de exclusão cancelada.");
  }, [pendingDeletionRequest]);

  return {
    canAccessMarketplace,
    deletionReason,
    fullName,
    handleCancelAccountDeletion,
    handleLogout,
    handleRequestAccountDeletion,
    handleSaveProfile,
    isCitizen: isCitizenProfile(profile),
    isLegalOperator: isLegalOperatorProfile(profile),
    loading,
    loggingOut,
    message,
    pendingDeletionRequest,
    preferences,
    privacyChecklist,
    profile,
    profileLabel,
    savingProfile,
    securityChecklist,
    setDeletionReason,
    setWorkingFullName,
    submittingDeletion,
    updatePreference,
    user,
    workingFullName,
  };
}

function getFullNameFromUser(user: User) {
  const metadataName = user.user_metadata?.full_name;
  return typeof metadataName === "string" && metadataName.trim() ? metadataName : "Usuário ConectaJus";
}
