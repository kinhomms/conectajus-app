import {
  createCitizenDocumentSignedUrl,
  createMarketplaceOpportunity,
  createMarketplaceOpportunityCrmLink,
  createMarketplaceOpportunityPrivateDetails,
  ensureLawyerCreditAccount,
  getLawyerCreditAccount,
  getMarketplaceOpportunityCrmLink,
  isCurrentUserMarketplaceActor,
  listAccessibleMarketplaceCitizenDocuments,
  listAccessibleOpportunityPrivateDetails,
  listMarketplaceOpportunities,
  listMarketplaceOpportunityCrmLinks,
  unlockMarketplaceOpportunity,
} from "@/features/marketplace/repositories/marketplace.repository";
import type {
  MarketplaceCitizenDocument,
  MarketplaceIntegrationStatus,
  MarketplaceOpportunity,
  MarketplaceOpportunityCrmLink,
  MarketplaceOpportunityPrivateDetails,
  MarketplaceVisibilityField,
  MarketplaceWorkflowStep,
} from "@/features/marketplace/types/marketplace.types";
import * as clientsRepository from "@/features/clients/repositories/clients.repository";
import type { TriageDossier } from "@/types/triage";

export type PublishTriageOpportunityInput = {
  city: string;
  citizenDocumentIds: string[];
  description: string;
  dossier: TriageDossier;
  documentNotes: string;
  email: string;
  fullName: string;
  parentOpportunityId?: string | null;
  phone: string;
  state: string;
  userId: string;
  whatsapp: string;
};

export type CreateCrmClientFromOpportunityInput = {
  currentUserId: string;
  details: MarketplaceOpportunityPrivateDetails;
  documents: MarketplaceCitizenDocument[];
  opportunity: MarketplaceOpportunity;
};

export type CreateCrmClientFromOpportunityResult = {
  clientId: string | null;
  crmLink: MarketplaceOpportunityCrmLink | null;
  ok: boolean;
  reusedExistingClient: boolean;
  message: string;
};

export async function canCurrentUserAccessMarketplace() {
  return isCurrentUserMarketplaceActor();
}

export async function getMarketplaceOpportunities() {
  return listMarketplaceOpportunities();
}

export async function getAccessibleOpportunityPrivateDetails() {
  return listAccessibleOpportunityPrivateDetails();
}

export async function getAccessibleMarketplaceCitizenDocuments() {
  return listAccessibleMarketplaceCitizenDocuments();
}

export async function getMarketplaceOpportunityCrmLinks() {
  return listMarketplaceOpportunityCrmLinks();
}

export async function createMarketplaceCitizenDocumentSignedUrl(filePath: string) {
  return createCitizenDocumentSignedUrl(filePath);
}

export async function ensureCreditAccount() {
  return ensureLawyerCreditAccount();
}

export async function getCreditAccount(userId: string) {
  return getLawyerCreditAccount(userId);
}

export async function unlockOpportunity(opportunityId: string) {
  return unlockMarketplaceOpportunity(opportunityId);
}

export async function createCrmClientFromUnlockedOpportunity({
  currentUserId,
  details,
  documents,
  opportunity,
}: CreateCrmClientFromOpportunityInput): Promise<CreateCrmClientFromOpportunityResult> {
  const existingLinkResponse = await getMarketplaceOpportunityCrmLink(opportunity.id);

  if (existingLinkResponse.data) {
    return {
      clientId: existingLinkResponse.data.client_id,
      crmLink: existingLinkResponse.data,
      ok: true,
      reusedExistingClient: true,
      message: "Esta oportunidade já está vinculada ao CRM.",
    };
  }

  const contactPhone = details.phone || details.whatsapp || null;
  const existingClientResponse = await clientsRepository.listClients();

  if (existingClientResponse.error) {
    return {
      clientId: null,
      crmLink: null,
      ok: false,
      reusedExistingClient: false,
      message: "Não foi possível consultar o CRM antes de criar o cliente.",
    };
  }

  const existingClient = (existingClientResponse.data ?? []).find((client) => {
    const sameEmail = details.email && client.email?.toLowerCase() === details.email.toLowerCase();
    const samePhone = contactPhone && normalizePhone(client.phone) === normalizePhone(contactPhone);
    return Boolean(sameEmail || samePhone);
  });

  const clientResponse = existingClient
    ? { data: existingClient, error: null }
    : await clientsRepository.createClient({
        address: null,
        birth_date: null,
        city: opportunity.city,
        cpf: null,
        email: details.email,
        full_name: details.full_name || "Cliente Marketplace",
        marital_status: null,
        notes: buildClientNotes(opportunity, details),
        phone: contactPhone,
        profession: null,
        rg: null,
        state: opportunity.state,
      });

  if (clientResponse.error || !clientResponse.data) {
    return {
      clientId: null,
      crmLink: null,
      ok: false,
      reusedExistingClient: false,
      message: "Não foi possível criar o cliente no CRM.",
    };
  }

  const clientId = clientResponse.data.id;
  const [caseResponse, noteResponse, ...documentResponses] = await Promise.all([
    clientsRepository.createClientCase({
      case_number: null,
      case_title: `Marketplace - ${opportunity.practice_area || "Caso jurídico"}`,
      client_id: clientId,
      court: null,
      description: buildCaseDescription(opportunity, details),
      practice_area: opportunity.practice_area,
      status: "novo lead",
    }),
    clientsRepository.createClientNote({
      client_id: clientId,
      content: buildInitialNote(opportunity, details),
      note_type: "marketplace",
      title: "Lead desbloqueado no Marketplace",
    }),
    ...documents.map((document) =>
      clientsRepository.createClientDocument({
        client_id: clientId,
        document_name: document.file_name,
        document_type: document.mime_type || "documento privado",
        notes: `Documento privado do cidadão vinculado ao lead. ID do arquivo: ${document.id}`,
      }),
    ),
  ]);

  if (caseResponse.error || noteResponse.error || documentResponses.some((response) => response.error)) {
    return {
      clientId,
      crmLink: null,
      ok: false,
      reusedExistingClient: Boolean(existingClient),
      message: "Cliente criado, mas houve falha ao completar caso, nota ou documentos do CRM.",
    };
  }

  const linkResponse = await createMarketplaceOpportunityCrmLink({
    case_id: caseResponse.data?.id ?? null,
    client_id: clientId,
    created_by: currentUserId,
    opportunity_id: opportunity.id,
  });

  if (linkResponse.error || !linkResponse.data) {
    return {
      clientId,
      crmLink: null,
      ok: false,
      reusedExistingClient: Boolean(existingClient),
      message: "Atendimento criado no CRM, mas não foi possível registrar o vínculo com o marketplace.",
    };
  }

  return {
    clientId,
    crmLink: linkResponse.data,
    ok: true,
    reusedExistingClient: Boolean(existingClient),
    message: existingClient
      ? "Cliente já existia no CRM. Criamos um novo caso e registramos o vínculo com o marketplace."
      : "Cliente, caso, nota inicial e vínculo com marketplace enviados para o CRM.",
  };
}

export async function publishTriageOpportunity(input: PublishTriageOpportunityInput) {
  const opportunityResponse = await createMarketplaceOpportunity({
    city: normalizeText(input.city),
    complexity: input.dossier.complexityLevel,
    created_by: input.userId,
    credit_cost: calculateCreditCost(input.dossier),
    parent_opportunity_id: input.parentOpportunityId ?? null,
    practice_area: input.dossier.legalArea,
    state: normalizeState(input.state),
    status: "open",
    summary: input.dossier.executiveSummary,
    urgency: input.dossier.urgencyLevel,
  });

  if (opportunityResponse.error || !opportunityResponse.data) {
    return opportunityResponse;
  }

  const detailsResponse = await createMarketplaceOpportunityPrivateDetails({
    case_history: normalizeText(input.description),
    citizen_document_ids: input.citizenDocumentIds,
    created_by: input.userId,
    document_notes: normalizeText(input.documentNotes),
    email: normalizeText(input.email),
    full_name: normalizeText(input.fullName),
    opportunity_id: opportunityResponse.data.id,
    phone: normalizeText(input.phone),
    whatsapp: normalizeText(input.whatsapp),
  });

  if (detailsResponse.error) {
    return {
      ...opportunityResponse,
      error: detailsResponse.error,
    };
  }

  return opportunityResponse;
}

export function getMarketplaceIntegrationStatus(): MarketplaceIntegrationStatus {
  return {
    ready: true,
    message:
      "O Marketplace usa oportunidades reais, créditos, auditoria de desbloqueio, dados pessoais privados e documentos do cidadão liberados somente após desbloqueio.",
    expectedSources: [
      "Tabela marketplace_opportunities com leads mascarados gerados pela triagem por IA e relação estruturada para complementos.",
      "Tabela marketplace_opportunity_private_details com dados pessoais protegidos.",
      "Tabela citizen_documents com documentos privados do cidadão.",
      "Bucket citizen-documents no Supabase Storage com links temporários.",
      "Tabelas lawyer_credit_accounts e marketplace_opportunity_unlocks para crédito e auditoria.",
      "Tabela marketplace_opportunity_crm_links para rastrear envio de leads ao CRM.",
      "CRM jurídico para transformar leads desbloqueados em cliente, caso e nota inicial.",
    ],
  };
}

export function getPublicLeadFields(): MarketplaceVisibilityField[] {
  return [
    {
      label: "Área jurídica",
      description: "Classificação preliminar do caso gerada pela triagem.",
    },
    {
      label: "Cidade",
      description: "Localidade necessária para compatibilidade territorial.",
    },
    {
      label: "Urgência",
      description: "Indicação de prazo, risco ou necessidade de resposta rápida.",
    },
    {
      label: "Resumo",
      description: "Síntese objetiva do problema, sem dados pessoais.",
    },
    {
      label: "Complexidade",
      description: "Sinalização inicial para o advogado avaliar esforço e prioridade.",
    },
  ];
}

export function getLockedLeadFields(): MarketplaceVisibilityField[] {
  return [
    {
      label: "Nome e contato",
      description: "Nome, telefone, WhatsApp e e-mail só são liberados após uso de créditos.",
    },
    {
      label: "Documentos privados",
      description: "Arquivos enviados pelo cidadão permanecem protegidos até a liberação.",
    },
    {
      label: "Histórico completo",
      description: "Relato detalhado, respostas da triagem e linha do tempo ficam bloqueados.",
    },
  ];
}

export function getMarketplaceWorkflow(): MarketplaceWorkflowStep[] {
  return [
    {
      title: "1. Cidadão inicia a triagem",
      description: "A IA coleta informações, organiza o caso e associa documentos privados quando selecionados.",
    },
    {
      title: "2. Marketplace exibe lead mascarado",
      description: "Advogados visualizam apenas dados estratégicos suficientes para decidir se há interesse.",
    },
    {
      title: "3. Créditos desbloqueiam o contato",
      description: "Após consumir créditos, dados pessoais, histórico e documentos vinculados são liberados com auditoria.",
    },
    {
      title: "4. Lead vira atendimento",
      description: "O advogado envia os dados desbloqueados para o CRM, criando cliente, caso, nota inicial e vínculo auditável.",
    },
  ];
}

function buildClientNotes(opportunity: MarketplaceOpportunity, details: MarketplaceOpportunityPrivateDetails) {
  return [
    "Origem: Marketplace ConectaJus.",
    opportunity.parent_opportunity_id ? `Complemento da oportunidade: ${opportunity.parent_opportunity_id}.` : null,
    `Urgência: ${opportunity.urgency || "não informada"}.`,
    `Complexidade: ${opportunity.complexity || "não informada"}.`,
    details.document_notes ? `Documentos mencionados: ${details.document_notes}` : null,
  ].filter(Boolean).join("\n");
}

function buildCaseDescription(opportunity: MarketplaceOpportunity, details: MarketplaceOpportunityPrivateDetails) {
  return [
    "Resumo mascarado:",
    opportunity.summary,
    opportunity.parent_opportunity_id ? `Complemento vinculado à oportunidade original: ${opportunity.parent_opportunity_id}.` : null,
    "",
    "Histórico completo liberado:",
    details.case_history || "Não informado.",
  ].filter((line) => line !== null).join("\n");
}

function buildInitialNote(opportunity: MarketplaceOpportunity, details: MarketplaceOpportunityPrivateDetails) {
  return [
    `Lead desbloqueado em ${formatDateTime(new Date())}.`,
    opportunity.parent_opportunity_id ? `Tipo: complemento de triagem (${opportunity.parent_opportunity_id}).` : "Tipo: oportunidade original.",
    `Área: ${opportunity.practice_area || "não informada"}.`,
    `Local: ${[opportunity.city, opportunity.state].filter(Boolean).join("/") || "não informado"}.`,
    `Telefone: ${details.phone || "não informado"}.`,
    `WhatsApp: ${details.whatsapp || "não informado"}.`,
    `E-mail: ${details.email || "não informado"}.`,
  ].join("\n");
}
function calculateCreditCost(dossier: TriageDossier) {
  if (dossier.urgencyLevel === "crítica" || dossier.complexityLevel === "alta") {
    return 5;
  }

  if (dossier.urgencyLevel === "alta" || dossier.complexityLevel === "média") {
    return 3;
  }

  return 1;
}

function normalizePhone(value: string | null) {
  return (value ?? "").replace(/\D/g, "");
}

function normalizeText(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeState(value: string) {
  const trimmed = value.trim().toUpperCase();
  return trimmed.length > 0 ? trimmed : null;
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}