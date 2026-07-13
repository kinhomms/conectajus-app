"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, getUserProfile, type UserProfile } from "@/features/auth/services/auth.service";

export function useCurrentUserProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>("cliente");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      const { data } = await getCurrentUser();

      if (!mounted) return;

      setUser(data.user ?? null);
      setProfile(getUserProfile(data.user));
      setLoading(false);
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    isCitizen: profile === "cliente",
    isLegalOperator: profile === "advogado" || profile === "admin",
    loading,
    profile,
    user,
  };
}