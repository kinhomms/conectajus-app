export type CitizenDashboardOpportunityStatus = "open" | "reserved" | "unlocked" | "closed" | "archived" | string;

export type CitizenDashboardCase = {
  id: string;
  parent_opportunity_id: string | null;
  practice_area: string | null;
  city: string | null;
  state: string | null;
  urgency: string | null;
  summary: string;
  complexity: string | null;
  credit_cost: number | null;
  status: CitizenDashboardOpportunityStatus | null;
  unlocked_by: string | null;
  unlocked_at: string | null;
  created_at: string;
};

export type CitizenDashboardCasePrivateDetails = {
  id: string;
  opportunity_id: string;
  citizen_document_ids: string[];
  created_at: string;
};