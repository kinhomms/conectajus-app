import * as agendaRepository from "@/features/agenda/repositories/agenda.repository";
import type {
  AgendaEventPriority,
  AgendaEventStatus,
  AgendaIntegrationStatus,
  CreateAgendaEventInput,
} from "@/features/agenda/types/agenda.types";

export type CreateClientFollowUpInput = {
  clientId: string;
  caseId: string | null;
  clientName: string;
  priority: AgendaEventPriority;
  startsAt: string;
  title: string;
};

export async function listAgendaEvents() {
  return agendaRepository.listAgendaEvents();
}

export async function createClientFollowUpEvent(input: CreateClientFollowUpInput) {
  const eventInput: CreateAgendaEventInput = {
    case_id: input.caseId,
    client_id: input.clientId,
    description: `Próximo passo do atendimento de ${input.clientName}.`,
    ends_at: null,
    event_type: "task",
    location: null,
    priority: input.priority,
    starts_at: input.startsAt,
    status: "pending",
    title: input.title,
  };

  return agendaRepository.createAgendaEvent(eventInput);
}

export async function changeAgendaEventStatus(eventId: string, status: AgendaEventStatus) {
  return agendaRepository.updateAgendaEventStatus(eventId, status);
}

export function getAgendaIntegrationStatus(configured: boolean): AgendaIntegrationStatus {
  return {
    configured,
    expectedSource: "Tabela Supabase agenda_events para compromissos, prazos, audiências e tarefas.",
    message: configured
      ? "A agenda já possui fonte de dados configurada e está pronta para exibir compromissos reais."
      : "A agenda ainda não conseguiu ler a tabela agenda_events. A interface permanece disponível, mas nenhum compromisso real será exibido até a migração ser aplicada no Supabase.",
  };
}