export type LegalProcess = {
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
