"use client";

import { ClientDetailsPanel } from "./ClientDetailsPanel";
import { ClientListPanel } from "./ClientListPanel";
import { ClientQuickActions } from "./ClientQuickActions";
import type { Client } from "@/features/clients/types/client.types";

type ClientsPremiumPageProps = {
  clients: Client[];
  selectedClient: Client | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectClient: (client: Client) => void;
  onRefresh?: () => void;
  onCreateClient?: () => void;
};

export function ClientsPremiumPage({
  clients,
  selectedClient,
  search,
  onSearchChange,
  onSelectClient,
  onRefresh,
  onCreateClient,
}: ClientsPremiumPageProps) {
  return (
    <div>
      <ClientQuickActions
        onRefresh={onRefresh}
        onCreateClient={onCreateClient}
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <ClientListPanel
          clients={clients}
          selectedClientId={selectedClient?.id}
          search={search}
          onSearchChange={onSearchChange}
          onSelectClient={onSelectClient}
        />

        <ClientDetailsPanel client={selectedClient} />
      </div>
    </div>
  );
}