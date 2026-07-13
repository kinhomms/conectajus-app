"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/features/auth/services/auth.service";
import { changeAgendaEventStatus, listAgendaEvents } from "@/features/agenda/services/agenda.service";
import type { AgendaEventStatus, AgendaEventType, LegalAgendaEvent } from "@/features/agenda/types/agenda.types";

type AgendaTypeFilter = "all" | AgendaEventType;
type AgendaStatusFilter = "all" | AgendaEventStatus | "overdue" | "upcoming";

function isSameDay(date: Date, compareDate: Date) {
  return (
    date.getFullYear() === compareDate.getFullYear() &&
    date.getMonth() === compareDate.getMonth() &&
    date.getDate() === compareDate.getDate()
  );
}

function getStatusMessage(status: AgendaEventStatus) {
  if (status === "completed") {
    return "Compromisso concluído.";
  }

  if (status === "canceled") {
    return "Compromisso cancelado.";
  }

  return "Compromisso reaberto.";
}

export function useAgendaWorkspace() {
  const router = useRouter();
  const [events, setEvents] = useState<LegalAgendaEvent[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgendaStatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<AgendaTypeFilter>("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSourceConfigured, setIsSourceConfigured] = useState(true);
  const [updatingEventId, setUpdatingEventId] = useState("");

  useEffect(() => {
    async function init() {
      const { data } = await getCurrentUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      await refreshEvents();
      setLoading(false);
    }

    init();
  }, [router]);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    const now = new Date();
    const upcomingLimit = new Date(now);
    upcomingLimit.setDate(upcomingLimit.getDate() + 7);

    return events.filter((event) => {
      const eventDate = new Date(event.starts_at);
      const isPending = event.status === "pending";
      const isOverdue = isPending && eventDate < now && !isSameDay(eventDate, now);
      const isUpcoming = isPending && eventDate >= now && eventDate <= upcomingLimit;
      const matchesTypeFilter = typeFilter === "all" || event.event_type === typeFilter;
      const matchesStatusFilter =
        statusFilter === "all" ||
        event.status === statusFilter ||
        (statusFilter === "overdue" && isOverdue) ||
        (statusFilter === "upcoming" && isUpcoming);

      if (!matchesTypeFilter || !matchesStatusFilter) {
        return false;
      }

      return (
        event.title.toLowerCase().includes(normalizedSearch) ||
        (event.description ?? "").toLowerCase().includes(normalizedSearch) ||
        (event.location ?? "").toLowerCase().includes(normalizedSearch) ||
        event.event_type.toLowerCase().includes(normalizedSearch) ||
        event.priority.toLowerCase().includes(normalizedSearch) ||
        event.status.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [events, search, statusFilter, typeFilter]);

  const metrics = useMemo(() => {
    const now = new Date();
    const upcomingLimit = new Date(now);
    upcomingLimit.setDate(upcomingLimit.getDate() + 7);
    const pendingEvents = events.filter((event) => event.status === "pending");

    return {
      total: events.length,
      today: events.filter((event) => isSameDay(new Date(event.starts_at), now)).length,
      pending: pendingEvents.length,
      critical: pendingEvents.filter((event) => event.priority === "critical" || event.priority === "high").length,
      overdue: pendingEvents.filter((event) => {
        const eventDate = new Date(event.starts_at);
        return eventDate < now && !isSameDay(eventDate, now);
      }).length,
      upcoming: pendingEvents.filter((event) => {
        const eventDate = new Date(event.starts_at);
        return eventDate >= now && eventDate <= upcomingLimit;
      }).length,
      displayed: filteredEvents.length,
    };
  }, [events, filteredEvents.length]);

  async function refreshEvents() {
    setMessage("");
    const { data, error } = await listAgendaEvents();

    if (error) {
      setEvents([]);
      setIsSourceConfigured(false);
      setMessage("Não foi possível carregar a agenda. Verifique se a tabela agenda_events já foi criada no Supabase.");
      return;
    }

    setIsSourceConfigured(true);
    setEvents(data ?? []);
  }

  async function handleChangeEventStatus(eventId: string, status: AgendaEventStatus) {
    setMessage("");
    setUpdatingEventId(eventId);

    const { data, error } = await changeAgendaEventStatus(eventId, status);

    setUpdatingEventId("");

    if (error || !data) {
      setMessage("Não foi possível atualizar o compromisso. Tente novamente.");
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.map((event) => (event.id === eventId ? data : event)),
    );
    setMessage(getStatusMessage(status));
  }

  return {
    events,
    filteredEvents,
    handleChangeEventStatus,
    isSourceConfigured,
    loading,
    message,
    metrics,
    refreshEvents,
    search,
    setSearch,
    setStatusFilter,
    setTypeFilter,
    statusFilter,
    typeFilter,
    updatingEventId,
  };
}
