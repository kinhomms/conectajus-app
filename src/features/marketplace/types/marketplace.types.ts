import type { CitizenDocument } from "@/features/documents/types/document.types";

export type MarketplaceOpportunity = {
  id: string;
  parent_opportunity_id: string | null;
  practice_area: string | null;
  city: string | null;
  state: string | null;
  urgency: string | null;
  summary: string;
  complexity: string | null;
  credit_cost: number | null;
  status: string | null;
  created_at: string;
};

export type MarketplaceOpportunityPrivateDetails = {
  id: string;
  opportunity_id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  document_notes: string | null;
  citizen_document_ids: string[];
  case_history: string | null;
  created_at: string;
};

export type MarketplaceOpportunityCrmLink = {
  id: string;
  opportunity_id: string;
  client_id: string;
  case_id: string | null;
  created_by: string;
  created_at: string;
};

export type MarketplaceCitizenDocument = CitizenDocument;

export type LawyerCreditAccount = {
  user_id: string;
  balance: number;
  updated_at: string;
};

export type UnlockOpportunityResult = {
  ok: boolean;
  message: string;
  opportunity_id: string | null;
  remaining_credits: number | null;
};

export type MarketplaceVisibilityField = {
  label: string;
  description: string;
};

export type MarketplaceIntegrationStatus = {
  ready: boolean;
  message: string;
  expectedSources: string[];
};

export type MarketplaceWorkflowStep = {
  title: string;
  description: string;
};