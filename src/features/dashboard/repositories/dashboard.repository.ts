import { supabase } from "@/lib/supabase";
import type {
  CitizenDashboardCase,
  CitizenDashboardCasePrivateDetails,
} from "@/features/dashboard/types/dashboard.types";

const citizenCaseFields =
  "id, parent_opportunity_id, practice_area, city, state, urgency, summary, complexity, credit_cost, status, unlocked_by, unlocked_at, created_at";

const citizenCasePrivateDetailFields = "id, opportunity_id, citizen_document_ids, created_at";

export async function listCitizenDashboardCases(userId: string) {
  return supabase
    .from("marketplace_opportunities")
    .select(citizenCaseFields)
    .eq("created_by", userId)
    .order("created_at", { ascending: false })
    .returns<CitizenDashboardCase[]>();
}

export async function listCitizenDashboardCasePrivateDetails() {
  return supabase
    .from("marketplace_opportunity_private_details")
    .select(citizenCasePrivateDetailFields)
    .order("created_at", { ascending: false })
    .returns<CitizenDashboardCasePrivateDetails[]>();
}