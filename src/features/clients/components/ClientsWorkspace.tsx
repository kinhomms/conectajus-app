"use client";

import { ClientCreateDrawer } from "@/features/clients/components/ClientCreateDrawer";
import { ClientsPremiumPage } from "@/features/clients/components/ClientsPremiumPage";
import { useClientsWorkspace } from "@/features/clients/hooks/useClientsWorkspace";

export function ClientsWorkspace() {
  const clientsWorkspace = useClientsWorkspace();

  if (clientsWorkspace.loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB] text-slate-950 dark:bg-[#0B0F19] dark:text-white">
        <p className="font-black">Carregando clientes...</p>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#F5F7FB] text-slate-950 dark:bg-[#0B0F19] dark:text-white">
        <ClientsPremiumPage
          agendaPriority={clientsWorkspace.agendaPriority}
          agendaStartsAt={clientsWorkspace.agendaStartsAt}
          agendaTitle={clientsWorkspace.agendaTitle}
          clients={clientsWorkspace.filteredClients}
          selectedClient={clientsWorkspace.selectedClient}
          marketplaceClientIds={clientsWorkspace.marketplaceClientIds}
          selectedClientMarketplaceLink={clientsWorkspace.selectedClientMarketplaceLink}
          notes={clientsWorkspace.notes}
          cases={clientsWorkspace.cases}
          documents={clientsWorkspace.documents}
          savingAgendaEvent={clientsWorkspace.savingAgendaEvent}
          search={clientsWorkspace.clientSearch}
          onAgendaPriorityChange={clientsWorkspace.setAgendaPriority}
          onAgendaStartsAtChange={clientsWorkspace.setAgendaStartsAt}
          onAgendaTitleChange={clientsWorkspace.setAgendaTitle}
          onCreateAgendaEvent={clientsWorkspace.handleCreateAgendaEvent}
          onSearchChange={clientsWorkspace.setClientSearch}
          onSelectClient={clientsWorkspace.selectClient}
          onRefresh={clientsWorkspace.refreshClients}
          onCreateClient={() => clientsWorkspace.setCreateDrawerOpen(true)}
        />
      </main>

      <ClientCreateDrawer
        open={clientsWorkspace.createDrawerOpen}
        form={clientsWorkspace.clientForm}
        saving={clientsWorkspace.savingClient}
        message={clientsWorkspace.message}
        onClose={() => clientsWorkspace.setCreateDrawerOpen(false)}
        onSubmit={clientsWorkspace.handleCreateClient}
        onChange={clientsWorkspace.updateClientField}
      />
    </>
  );
}
