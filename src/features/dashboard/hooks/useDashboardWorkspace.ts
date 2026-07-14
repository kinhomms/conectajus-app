"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  getCurrentUser,
  getUserProfile,
  isLegalOperatorProfile,
  logout,
  type UserProfile,
} from "@/features/auth/services/auth.service";
import { canCurrentUserAccessMarketplace, getMarketplaceOpportunities } from "@/features/marketplace/services/marketplace.service";
import type { MarketplaceOpportunity } from "@/features/marketplace/types/marketplace.types";
import {
  listCitizenCasePrivateDetailsForDashboard,
  listCitizenCasesForDashboard,
} from "@/features/dashboard/services/dashboard.service";
import type {
  CitizenDashboardCase,
  CitizenDashboardCasePrivateDetails,
} from "@/features/dashboard/types/dashboard.types";

export function useDashboardWorkspace() {
  const router = useRouter();
  const [canUseMarketplace, setCanUseMarketplace] = useState(false);
  const [citizenCases, setCitizenCases] = useState<CitizenDashboardCase[]>([]);
  const [citizenCasePrivateDetails, setCitizenCasePrivateDetails] = useState<CitizenDashboardCasePrivateDetails[]>([]);
  const [citizenCasesError, setCitizenCasesError] = useState<string | null>(null);
  const [qualifiedOpportunities, setQualifiedOpportunities] = useState<MarketplaceOpportunity[]>([]);
  const [qualifiedOpportunitiesError, setQualifiedOpportunitiesError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>("cliente");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data } = await getCurrentUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      const currentProfile = getUserProfile(data.user);
      setProfile(currentProfile);

      if (isLegalOperatorProfile(currentProfile)) {
        const accessResponse = await canCurrentUserAccessMarketplace();
        const canAccessMarketplace = !accessResponse.error && Boolean(accessResponse.data);
        setCanUseMarketplace(canAccessMarketplace);

        if (canAccessMarketplace) {
          const opportunitiesResponse = await getMarketplaceOpportunities();

          if (opportunitiesResponse.error) {
            setQualifiedOpportunitiesError("Não foi possível carregar oportunidades qualificadas agora.");
          } else {
            setQualifiedOpportunities((opportunitiesResponse.data ?? []).filter((opportunity) => opportunity.status === "open").slice(0, 4));
          }
        }
      } else {
        setCanUseMarketplace(false);

        const [casesResponse, privateDetailsResponse] = await Promise.all([
          listCitizenCasesForDashboard(data.user.id),
          listCitizenCasePrivateDetailsForDashboard(),
        ]);

        if (casesResponse.error) {
          setCitizenCasesError("Não foi possível carregar seus casos publicados agora.");
        } else {
          setCitizenCases(casesResponse.data ?? []);
        }

        if (!privateDetailsResponse.error) {
          setCitizenCasePrivateDetails(privateDetailsResponse.data ?? []);
        }
      }

      setUser(data.user);
      setLoading(false);
    }

    loadUser();
  }, [router]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const citizenCaseStats = useMemo(() => {
    const total = citizenCases.length;
    const complements = citizenCases.filter((caseItem) => Boolean(caseItem.parent_opportunity_id)).length;
    const waiting = citizenCases.filter((caseItem) => caseItem.status === "open" || caseItem.status === "reserved").length;
    const unlocked = citizenCases.filter((caseItem) => caseItem.status === "unlocked" || Boolean(caseItem.unlocked_by)).length;

    return { complements, total, waiting, unlocked };
  }, [citizenCases]);

  const citizenCaseDocumentCounts = useMemo(() => {
    return citizenCasePrivateDetails.reduce<Record<string, number>>((accumulator, detail) => {
      accumulator[detail.opportunity_id] = detail.citizen_document_ids?.length ?? 0;
      return accumulator;
    }, {});
  }, [citizenCasePrivateDetails]);

  return {
    canUseMarketplace,
    citizenCaseDocumentCounts,
    citizenCases,
    citizenCasesError,
    citizenCaseStats,
    fullName: user?.user_metadata?.full_name ?? "Usuário",
    handleLogout,
    isCitizen: profile === "cliente",
    isLegalOperator: isLegalOperatorProfile(profile),
    loading,
    profile,
    qualifiedOpportunities,
    qualifiedOpportunitiesError,
    user,
  };
}
