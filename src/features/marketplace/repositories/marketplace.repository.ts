import { supabase } from "@/lib/supabase";
import type {
  LawyerCreditAccount,
  MarketplaceCitizenDocument,
  MarketplaceOpportunity,
  MarketplaceOpportunityCrmLink,
  MarketplaceOpportunityPrivateDetails,
  UnlockOpportunityResult,
} from "@/features/marketplace/types/marketplace.types";

const opportunityFields =
  "id, parent_opportunity_id, practice_area, city, state, urgency, summary, complexity, credit_cost, status, created_at";

const privateDetailFields =
  "id, opportunity_id, full_name, phone, whatsapp, email, document_notes, citizen_document_ids, case_history, created_at";

const citizenDocumentFields =
  "id, user_id, file_name, file_path, file_size, mime_type, notes, status, created_at";

const crmLinkFields = "id, opportunity_id, client_id, case_id, created_by, created_at";

export type CreateMarketplaceOpportunityInput = {
  
  parent_opportunity_id: string | null;
practice_area: string | null;
  city: string | null;
  state: string | null;
  urgency: string | null;
  summary: string;
  complexity: string | null;
  credit_cost: number;
  status: "open";
  created_by: string;
};

export type CreateMarketplaceOpportunityPrivateDetailsInput = {
  opportunity_id: string;
  created_by: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  document_notes: string | null;
  citizen_document_ids: string[];
  case_history: string | null;
};

export type CreateMarketplaceOpportunityCrmLinkInput = {
  opportunity_id: string;
  client_id: string;
  case_id: string | null;
  created_by: string;
};

export async function isCurrentUserMarketplaceActor() {
  return supabase
    .rpc("is_current_user_marketplace_actor")
    .single<boolean>();
}

export async function listMarketplaceOpportunities() {
  return supabase
    .from("marketplace_opportunities")
    .select(opportunityFields)
    .order("created_at", { ascending: false })
    .returns<MarketplaceOpportunity[]>();
}

export async function listAccessibleOpportunityPrivateDetails() {
  return supabase
    .from("marketplace_opportunity_private_details")
    .select(privateDetailFields)
    .order("created_at", { ascending: false })
    .returns<MarketplaceOpportunityPrivateDetails[]>();
}

export async function listAccessibleMarketplaceCitizenDocuments() {
  return supabase
    .from("citizen_documents")
    .select(citizenDocumentFields)
    .order("created_at", { ascending: false })
    .returns<MarketplaceCitizenDocument[]>();
}

export async function listMarketplaceOpportunityCrmLinks() {
  return supabase
    .from("marketplace_opportunity_crm_links")
    .select(crmLinkFields)
    .order("created_at", { ascending: false })
    .returns<MarketplaceOpportunityCrmLink[]>();
}

export async function getMarketplaceOpportunityCrmLink(opportunityId: string) {
  return supabase
    .from("marketplace_opportunity_crm_links")
    .select(crmLinkFields)
    .eq("opportunity_id", opportunityId)
    .maybeSingle<MarketplaceOpportunityCrmLink>();
}

export async function createMarketplaceOpportunityCrmLink(input: CreateMarketplaceOpportunityCrmLinkInput) {
  return supabase
    .from("marketplace_opportunity_crm_links")
    .insert(input)
    .select(crmLinkFields)
    .single<MarketplaceOpportunityCrmLink>();
}

export async function createCitizenDocumentSignedUrl(filePath: string) {
  return supabase.storage
    .from("citizen-documents")
    .createSignedUrl(filePath, 60 * 5);
}

export async function createMarketplaceOpportunity(input: CreateMarketplaceOpportunityInput) {
  return supabase
    .from("marketplace_opportunities")
    .insert(input)
    .select(opportunityFields)
    .single<MarketplaceOpportunity>();
}

export async function createMarketplaceOpportunityPrivateDetails(
  input: CreateMarketplaceOpportunityPrivateDetailsInput,
) {
  return supabase
    .from("marketplace_opportunity_private_details")
    .insert(input)
    .select(privateDetailFields)
    .single<MarketplaceOpportunityPrivateDetails>();
}

export async function ensureLawyerCreditAccount() {
  return supabase
    .rpc("ensure_lawyer_credit_account")
    .single<LawyerCreditAccount>();
}

export async function getLawyerCreditAccount(userId: string) {
  return supabase
    .from("lawyer_credit_accounts")
    .select("user_id, balance, updated_at")
    .eq("user_id", userId)
    .maybeSingle<LawyerCreditAccount>();
}

export async function unlockMarketplaceOpportunity(opportunityId: string) {
  return supabase
    .rpc("unlock_marketplace_opportunity", { target_opportunity_id: opportunityId })
    .single<UnlockOpportunityResult>();
}