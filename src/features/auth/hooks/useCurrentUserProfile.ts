"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, getUserProfile, subscribeToAuthChanges, type UserProfile } from "@/features/auth/services/auth.service";

export function useCurrentUserProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>("cliente");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    function applyUser(nextUser: User | null) {
      if (!mounted) return;

      setUser(nextUser);
      setProfile(getUserProfile(nextUser));
      setLoading(false);
    }

    async function loadProfile() {
      const { data } = await getCurrentUser();
      applyUser(data.user ?? null);
    }

    loadProfile();

    const { data: authListener } = subscribeToAuthChanges((nextUser) => {
      applyUser(nextUser);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
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
