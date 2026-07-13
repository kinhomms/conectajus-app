import { supabase } from "@/lib/supabase";
import type { LegalProcess } from "@/features/processes/types/process.types";

const processFields =
  "id, client_id, case_title, practice_area, case_number, court, status, description, created_at";

export async function listProcesses() {
  return supabase
    .from("client_cases")
    .select(processFields)
    .order("created_at", { ascending: false })
    .returns<LegalProcess[]>();
}
