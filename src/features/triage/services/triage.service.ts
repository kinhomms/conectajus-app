import { generateTriageDossier } from "@/features/triage/services/triage-engine";

const MIN_DESCRIPTION_LENGTH = 30;

export function validateTriageDescription(description: string) {
  if (description.trim().length < MIN_DESCRIPTION_LENGTH) {
    return "Descreva o caso com um pouco mais de detalhes para que a triagem funcione melhor.";
  }

  return "";
}

export function createTriageDossier(description: string) {
  return generateTriageDossier(description);
}

