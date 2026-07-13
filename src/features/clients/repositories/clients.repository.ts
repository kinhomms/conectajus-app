import { supabase } from "@/lib/supabase";
import type {
  Client,
  ClientCase,
  ClientDocument,
  ClientMarketplaceLink,
  ClientNote,
} from "@/features/clients/types/client.types";

const clientFields =
  "id, full_name, cpf, rg, birth_date, profession, marital_status, email, phone, address, city, state, notes, created_at";

const noteFields = "id, client_id, title, content, note_type, created_at";

const caseFields =
  "id, client_id, case_title, practice_area, case_number, court, status, description, created_at";

const documentFields =
  "id, client_id, document_name, document_type, notes, created_at";

const marketplaceLinkFields = "id, opportunity_id, client_id, case_id, created_by, created_at";

export type CreateClientInput = Omit<Client, "id" | "created_at">;
export type CreateClientNoteInput = Omit<ClientNote, "id" | "created_at">;
export type CreateClientCaseInput = Omit<ClientCase, "id" | "created_at">;
export type CreateClientDocumentInput = Omit<ClientDocument, "id" | "created_at">;

export async function getCurrentUser() {
  return supabase.auth.getUser();
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function listClients() {
  return supabase
    .from("clients")
    .select(clientFields)
    .order("created_at", { ascending: false })
    .returns<Client[]>();
}

export async function listClientNotes(clientId: string) {
  return supabase
    .from("client_notes")
    .select(noteFields)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .returns<ClientNote[]>();
}

export async function listClientCases(clientId: string) {
  return supabase
    .from("client_cases")
    .select(caseFields)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .returns<ClientCase[]>();
}

export async function listClientDocuments(clientId: string) {
  return supabase
    .from("client_documents")
    .select(documentFields)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .returns<ClientDocument[]>();
}

export async function listClientMarketplaceLinks() {
  return supabase
    .from("marketplace_opportunity_crm_links")
    .select(marketplaceLinkFields)
    .order("created_at", { ascending: false })
    .returns<ClientMarketplaceLink[]>();
}

export async function createClient(input: CreateClientInput) {
  return supabase
    .from("clients")
    .insert(input)
    .select(clientFields)
    .single<Client>();
}

export async function createClientNote(input: CreateClientNoteInput) {
  return supabase
    .from("client_notes")
    .insert(input)
    .select(noteFields)
    .single<ClientNote>();
}

export async function createClientCase(input: CreateClientCaseInput) {
  return supabase
    .from("client_cases")
    .insert(input)
    .select(caseFields)
    .single<ClientCase>();
}

export async function createClientDocument(input: CreateClientDocumentInput) {
  return supabase
    .from("client_documents")
    .insert(input)
    .select(documentFields)
    .single<ClientDocument>();
}