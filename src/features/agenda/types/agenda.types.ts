export type AgendaEventType = "deadline" | "hearing" | "task" | "meeting" | "other";

export type AgendaEventStatus = "pending" | "completed" | "canceled";

export type AgendaEventPriority = "low" | "medium" | "high" | "critical";

export type LegalAgendaEvent = {
  id: string;
  client_id: string | null;
  case_id: string | null;
  title: string;
  description: string | null;
  event_type: AgendaEventType;
  status: AgendaEventStatus;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  priority: AgendaEventPriority;
  created_at: string;
};

export type CreateAgendaEventInput = {
  client_id: string | null;
  case_id: string | null;
  title: string;
  description: string | null;
  event_type: AgendaEventType;
  status: AgendaEventStatus;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  priority: AgendaEventPriority;
};

export type AgendaIntegrationStatus = {
  configured: boolean;
  message: string;
  expectedSource: string;
};