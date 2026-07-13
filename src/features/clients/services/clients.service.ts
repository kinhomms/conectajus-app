import type {
  CreateClientCaseInput,
  CreateClientDocumentInput,
  CreateClientInput,
  CreateClientNoteInput,
} from "@/features/clients/repositories/clients.repository";
import * as clientsRepository from "@/features/clients/repositories/clients.repository";

export type ClientFormState = {
  full_name: string;
  cpf: string;
  rg: string;
  birth_date: string;
  profession: string;
  marital_status: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes: string;
};

export type ClientNoteFormState = {
  title: string;
  content: string;
  note_type: string;
};

export type ClientCaseFormState = {
  case_title: string;
  practice_area: string;
  case_number: string;
  court: string;
  status: string;
  description: string;
};

export type ClientDocumentFormState = {
  document_name: string;
  document_type: string;
  notes: string;
};

export const initialClientForm: ClientFormState = {
  full_name: "",
  cpf: "",
  rg: "",
  birth_date: "",
  profession: "",
  marital_status: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  notes: "",
};

export const initialNoteForm: ClientNoteFormState = {
  title: "",
  content: "",
  note_type: "atendimento",
};

export const initialCaseForm: ClientCaseFormState = {
  case_title: "",
  practice_area: "",
  case_number: "",
  court: "",
  status: "em análise",
  description: "",
};

export const initialDocumentForm: ClientDocumentFormState = {
  document_name: "",
  document_type: "",
  notes: "",
};

export async function getCurrentUser() {
  return clientsRepository.getCurrentUser();
}

export async function signOut() {
  return clientsRepository.signOut();
}

export async function listClients() {
  return clientsRepository.listClients();
}

export async function listClientMarketplaceLinks() {
  return clientsRepository.listClientMarketplaceLinks();
}

export async function listClientDossier(clientId: string) {
  const [notes, cases, documents] = await Promise.all([
    clientsRepository.listClientNotes(clientId),
    clientsRepository.listClientCases(clientId),
    clientsRepository.listClientDocuments(clientId),
  ]);

  return { notes, cases, documents };
}

export async function createClientFromForm(form: ClientFormState) {
  const input: CreateClientInput = {
    full_name: form.full_name,
    cpf: emptyToNull(form.cpf),
    rg: emptyToNull(form.rg),
    birth_date: emptyToNull(form.birth_date),
    profession: emptyToNull(form.profession),
    marital_status: emptyToNull(form.marital_status),
    email: emptyToNull(form.email),
    phone: emptyToNull(form.phone),
    address: emptyToNull(form.address),
    city: emptyToNull(form.city),
    state: emptyToNull(form.state),
    notes: emptyToNull(form.notes),
  };

  return clientsRepository.createClient(input);
}

export async function createClientNoteFromForm(
  clientId: string,
  form: ClientNoteFormState,
) {
  const input: CreateClientNoteInput = {
    client_id: clientId,
    title: form.title,
    content: emptyToNull(form.content),
    note_type: form.note_type || "atendimento",
  };

  return clientsRepository.createClientNote(input);
}

export async function createClientCaseFromForm(
  clientId: string,
  form: ClientCaseFormState,
) {
  const input: CreateClientCaseInput = {
    client_id: clientId,
    case_title: form.case_title,
    practice_area: emptyToNull(form.practice_area),
    case_number: emptyToNull(form.case_number),
    court: emptyToNull(form.court),
    status: form.status || "em análise",
    description: emptyToNull(form.description),
  };

  return clientsRepository.createClientCase(input);
}

export async function createClientDocumentFromForm(
  clientId: string,
  form: ClientDocumentFormState,
) {
  const input: CreateClientDocumentInput = {
    client_id: clientId,
    document_name: form.document_name,
    document_type: emptyToNull(form.document_type),
    notes: emptyToNull(form.notes),
  };

  return clientsRepository.createClientDocument(input);
}

function emptyToNull(value: string) {
  return value || null;
}