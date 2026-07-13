import { supabase } from "@/lib/supabase";
import type {
  AgendaEventStatus,
  CreateAgendaEventInput,
  LegalAgendaEvent,
} from "@/features/agenda/types/agenda.types";

const agendaEventFields =
  "id, client_id, case_id, title, description, event_type, status, starts_at, ends_at, location, priority, created_at";

export async function listAgendaEvents() {
  return supabase
    .from("agenda_events")
    .select(agendaEventFields)
    .order("starts_at", { ascending: true })
    .limit(100)
    .returns<LegalAgendaEvent[]>();
}

export async function createAgendaEvent(input: CreateAgendaEventInput) {
  return supabase
    .from("agenda_events")
    .insert(input)
    .select(agendaEventFields)
    .single<LegalAgendaEvent>();
}

export async function updateAgendaEventStatus(eventId: string, status: AgendaEventStatus) {
  return supabase
    .from("agenda_events")
    .update({ status })
    .eq("id", eventId)
    .select(agendaEventFields)
    .single<LegalAgendaEvent>();
}