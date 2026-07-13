export type Client = {
  id: string;
  full_name: string;
  cpf: string | null;
  rg: string | null;
  birth_date: string | null;
  profession: string | null;
  marital_status: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
  created_at: string;
};

export type ClientNote = {
  id: string;
  client_id: string;
  title: string;
  content: string | null;
  note_type: string | null;
  created_at: string;
};

export type ClientCase = {
  id: string;
  client_id: string;
  case_title: string;
  practice_area: string | null;
  case_number: string | null;
  court: string | null;
  status: string | null;
  description: string | null;
  created_at: string;
};

export type ClientDocument = {
  id: string;
  client_id: string;
  document_name: string;
  document_type: string | null;
  notes: string | null;
  created_at: string;
};

export type ClientMarketplaceLink = {
  id: string;
  opportunity_id: string;
  client_id: string;
  case_id: string | null;
  created_by: string;
  created_at: string;
};