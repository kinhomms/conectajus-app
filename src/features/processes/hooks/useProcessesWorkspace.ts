"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getUserProfile, isLegalOperatorProfile } from "@/features/auth/services/auth.service";
import { listProcesses } from "@/features/processes/services/processes.service";
import type { LegalProcess } from "@/features/processes/types/process.types";

type ProcessStatusFilter = "all" | "active" | "missing_data" | "closed";

export function useProcessesWorkspace() {
  const router = useRouter();
  const [processes, setProcesses] = useState<LegalProcess[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProcessStatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function init() {
      const { data } = await getCurrentUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      if (!isLegalOperatorProfile(getUserProfile(data.user))) {
        router.replace("/dashboard");
        return;
      }

      await refreshProcesses();
      setLoading(false);
    }

    init();
  }, [router]);

  const filteredProcesses = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return processes.filter((process) => {
      const normalizedStatus = (process.status ?? "").toLowerCase();
      const isClosed = ["closed", "archived", "finalizado", "arquivado", "encerrado"].some((status) =>
        normalizedStatus.includes(status)
      );
      const missingData = !process.case_number || !process.court;
      const matchesStatusFilter =
        statusFilter === "all" ||
        (statusFilter === "active" && !isClosed) ||
        (statusFilter === "closed" && isClosed) ||
        (statusFilter === "missing_data" && missingData);

      if (!matchesStatusFilter) {
        return false;
      }

      return (
        process.case_title.toLowerCase().includes(normalizedSearch) ||
        (process.practice_area ?? "").toLowerCase().includes(normalizedSearch) ||
        (process.case_number ?? "").toLowerCase().includes(normalizedSearch) ||
        (process.court ?? "").toLowerCase().includes(normalizedSearch) ||
        (process.status ?? "").toLowerCase().includes(normalizedSearch)
      );
    });
  }, [processes, search, statusFilter]);

  const processStats = useMemo(() => {
    const closed = processes.filter((process) => {
      const normalizedStatus = (process.status ?? "").toLowerCase();
      return ["closed", "archived", "finalizado", "arquivado", "encerrado"].some((status) =>
        normalizedStatus.includes(status)
      );
    }).length;
    const missingData = processes.filter((process) => !process.case_number || !process.court).length;

    return {
      active: processes.length - closed,
      closed,
      displayed: filteredProcesses.length,
      missingData,
      total: processes.length,
    };
  }, [filteredProcesses.length, processes]);

  async function refreshProcesses() {
    setMessage("");
    const { data, error } = await listProcesses();

    if (error) {
      setMessage("Não foi possível carregar os processos.");
      return;
    }

    setProcesses(data ?? []);
  }

  return {
    filteredProcesses,
    loading,
    message,
    processStats,
    processes,
    refreshProcesses,
    search,
    setSearch,
    setStatusFilter,
    statusFilter,
  };
}
