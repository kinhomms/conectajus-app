export type LegalDocument = {
  id: string;
  client_id: string;
  document_name: string;
  document_type: string | null;
  notes: string | null;
  created_at: string;
};

export type CitizenDocument = {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  notes: string | null;
  status: "uploaded" | "reviewed" | "archived";
  created_at: string;
};

export type CreateCitizenDocumentInput = {
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  notes: string | null;
  user_id: string;
};