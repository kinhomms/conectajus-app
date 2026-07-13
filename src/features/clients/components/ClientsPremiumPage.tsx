"use client";

import { PageNavigation } from "@/components/navigation/PageNavigation";
import { ClientDetailsPanel } from "./ClientDetailsPanel";
import { ClientListPanel } from "./ClientListPanel";
import { ClientQuickActions } from "./ClientQuickActions";
import type { AgendaEventPriority } from "@/features/agenda/types/agenda.types";
import type {
  Client,
  ClientCase,
  ClientDocument,
  ClientMarketplaceLink,
  ClientNote,
} from "@/features/clients/types/client.types";

type ClientsPremiumPageProps = {
  agendaPriority: AgendaEventPriority;
  agendaStartsAt: string;
  agendaTitle: string;
  clients: Client[];
  selectedClient: Client | null;
  selectedClientMarketplaceLink: ClientMarketplaceLink | null;
  marketplaceClientIds: string[];
  notes: ClientNote[];
  cases: ClientCase[];
  documents: ClientDocument[];
  savingAgendaEvent: boolean;
  search: string;
  onAgendaPriorityChange: (value: AgendaEventPriority) => void;
  onAgendaStartsAtChange: (value: string) => void;
  onAgendaTitleChange: (value: string) => void;
  onCreateAgendaEvent: (event: React.FormEvent<HTMLFormElement>) => void;
  onSearchChange: (value: string) => void;
  onSelectClient: (client: Client) => void;
  onRefresh?: () => void;
  onCreateClient?: () => void;
};

export function ClientsPremiumPage({
  agendaPriority,
  agendaStartsAt,
  agendaTitle,
  clients,
  selectedClient,
  selectedClientMarketplaceLink,
  marketplaceClientIds,
  notes,
  cases,
  documents,
  savingAgendaEvent,
  search,
  onAgendaPriorityChange,
  onAgendaStartsAtChange,
  onAgendaTitleChange,
  onCreateAgendaEvent,
  onSearchChange,
  onSelectClient,
  onRefresh,
  onCreateClient,
}: ClientsPremiumPageProps) {
  return (
    <div>
      <PageNavigation />
      <ClientQuickActions onRefresh={onRefresh} onCreateClient={onCreateClient} />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <ClientListPanel
          clients={clients}
          marketplaceClientIds={marketplaceClientIds}
          selectedClientId={selectedClient?.id}
          search={search}
          onSearchChange={onSearchChange}
          onSelectClient={onSelectClient}
        />

        <ClientDetailsPanel
          agendaPriority={agendaPriority}
          agendaStartsAt={agendaStartsAt}
          agendaTitle={agendaTitle}
          client={selectedClient}
          marketplaceLink={selectedClientMarketplaceLink}
          notes={notes}
          cases={cases}
          documents={documents}
          savingAgendaEvent={savingAgendaEvent}
          onAgendaPriorityChange={onAgendaPriorityChange}
          onAgendaStartsAtChange={onAgendaStartsAtChange}
          onAgendaTitleChange={onAgendaTitleChange}
          onCreateAgendaEvent={onCreateAgendaEvent}
        />
      </div>
    </div>
  );
}