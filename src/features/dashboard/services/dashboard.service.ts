import * as dashboardRepository from "@/features/dashboard/repositories/dashboard.repository";

export async function listCitizenCasesForDashboard(userId: string) {
  return dashboardRepository.listCitizenDashboardCases(userId);
}

export async function listCitizenCasePrivateDetailsForDashboard() {
  return dashboardRepository.listCitizenDashboardCasePrivateDetails();
}