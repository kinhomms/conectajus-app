export type TriageDossier = {
  legalArea: string;
  urgencyLevel: "baixa" | "média" | "alta" | "crítica";
  maturityScore: number;
  complexityLevel: "baixa" | "média" | "alta";
  executiveSummary: string;
  suggestedDocuments: string[];
  followUpQuestions: string[];
  riskAlerts: string[];
  nextSteps: string[];
  clientWarning: string;
};
