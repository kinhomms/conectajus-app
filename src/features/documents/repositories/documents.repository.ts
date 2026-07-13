import { supabase } from "@/lib/supabase";
import type {
  CitizenDocument,
  CreateCitizenDocumentInput,
  LegalDocument,
} from "@/features/documents/types/document.types";

const documentFields = "id, client_id, document_name, document_type, notes, created_at";
const citizenDocumentFields = "id, user_id, file_name, file_path, file_size, mime_type, notes, status, created_at";
const privateDetailDocumentLinkFields = "id, opportunity_id, citizen_document_ids";
const citizenDocumentsBucket = "citizen-documents";

type PrivateDetailDocumentLink = {
  id: string;
  opportunity_id: string;
  citizen_document_ids: string[];
};

export async function listDocuments() {
  return supabase
    .from("client_documents")
    .select(documentFields)
    .order("created_at", { ascending: false })
    .returns<LegalDocument[]>();
}

export async function listCitizenDocuments(userId: string) {
  return supabase
    .from("citizen_documents")
    .select(citizenDocumentFields)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<CitizenDocument[]>();
}

export async function uploadCitizenDocumentFile(userId: string, file: File) {
  const safeName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  const filePath = `${userId}/${crypto.randomUUID()}-${safeName}`;

  const uploadResponse = await supabase.storage
    .from(citizenDocumentsBucket)
    .upload(filePath, file, { upsert: false });

  return {
    ...uploadResponse,
    filePath,
  };
}

export async function createCitizenDocument(input: CreateCitizenDocumentInput) {
  return supabase
    .from("citizen_documents")
    .insert(input)
    .select(citizenDocumentFields)
    .single<CitizenDocument>();
}

export async function appendCitizenDocumentToMarketplaceOpportunity(
  opportunityId: string,
  userId: string,
  documentId: string,
) {
  const detailsResponse = await supabase
    .from("marketplace_opportunity_private_details")
    .select(privateDetailDocumentLinkFields)
    .eq("opportunity_id", opportunityId)
    .eq("created_by", userId)
    .maybeSingle<PrivateDetailDocumentLink>();

  if (detailsResponse.error || !detailsResponse.data) {
    return {
      data: null,
      error: detailsResponse.error ?? new Error("Detalhes privados da oportunidade não encontrados."),
    };
  }

  const citizenDocumentIds = Array.from(new Set([...detailsResponse.data.citizen_document_ids, documentId]));

  return supabase
    .from("marketplace_opportunity_private_details")
    .update({ citizen_document_ids: citizenDocumentIds })
    .eq("id", detailsResponse.data.id)
    .eq("created_by", userId)
    .select(privateDetailDocumentLinkFields)
    .single<PrivateDetailDocumentLink>();
}

export async function createCitizenDocumentSignedUrl(filePath: string) {
  return supabase.storage
    .from(citizenDocumentsBucket)
    .createSignedUrl(filePath, 60 * 5);
}