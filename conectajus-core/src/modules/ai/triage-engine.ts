import { legalAreas } from "@/config/legal-areas";
import type { TriageDossier } from "@/types/triage";

function detectArea(description: string) {
  const text = description.toLowerCase();
  const rules: Record<string, string[]> = {
    banking: ["banco", "empréstimo", "juros", "cartão", "desconto", "negativação", "serasa", "consignado"],
    consumer: ["produto", "serviço", "loja", "empresa", "garantia", "defeito", "cancelamento"],
    administrative: ["servidor", "estado", "município", "administração", "portaria", "processo administrativo"],
    "public-tenders": ["concurso", "edital", "banca", "nomeação", "classificação", "redação", "psicotécnico"],
    family: ["divórcio", "pensão", "guarda", "alimentos", "filho", "visitas"],
    labor: ["demissão", "fgts", "rescisão", "salário", "emprego", "carteira assinada"],
    "social-security": ["inss", "aposentadoria", "benefício", "auxílio", "perícia", "bpc"],
    military: ["militar", "pmba", "policial militar", "promoção", "periculosidade", "quartel"],
  };
  let best = { id: "", score: 0 };
  for (const [areaId, keywords] of Object.entries(rules)) {
    const score = keywords.filter((keyword) => text.includes(keyword)).length;
    if (score > best.score) best = { id: areaId, score };
  }
  return legalAreas.find((area) => area.id === best.id) ?? null;
}

function calculateUrgency(description: string): TriageDossier["urgencyLevel"] {
  const text = description.toLowerCase();
  if (text.includes("prisão") || text.includes("risco de vida") || text.includes("cirurgia urgente") || text.includes("audiência amanhã")) return "crítica";
  if (text.includes("prazo") || text.includes("intimação") || text.includes("audiência") || text.includes("recurso") || text.includes("negativação") || text.includes("liminar")) return "alta";
  if (text.includes("urgente") || text.includes("prejuízo") || text.includes("dano")) return "média";
  return "baixa";
}

function calculateMaturity(description: string) {
  let score = 0;
  const text = description.toLowerCase();
  if (description.length >= 80) score += 20;
  if (description.length >= 180) score += 20;
  if (/\d{1,2}\/\d{1,2}|\d{4}|hoje|ontem|semana|mês|prazo/.test(text)) score += 15;
  if (/contrato|documento|comprovante|print|edital|notificação|extrato|laudo|prova/.test(text)) score += 20;
  if (/banco|empresa|estado|município|órgão|pessoa|servidor|banca|empregador/.test(text)) score += 15;
  if (/quero|preciso|desejo|resolver|indenização|cancelar|receber|defesa/.test(text)) score += 10;
  return Math.min(score, 100);
}

function detectRisks(description: string) {
  const text = description.toLowerCase();
  const risks: string[] = [];
  if (/prazo|intimação|audiência|recurso|notificação/.test(text)) risks.push("Há possível prazo em andamento. Recomenda-se análise rápida.");
  if (/prisão|delegacia|ameaça|violência/.test(text)) risks.push("Pode haver urgência penal ou risco à integridade.");
  if (/medicamento|cirurgia|tratamento|hospital|risco de vida/.test(text)) risks.push("Pode haver urgência relacionada à saúde.");
  if (/despejo|corte de água|corte de energia|negativação|perda de vaga/.test(text)) risks.push("Pode haver risco de dano imediato.");
  if (!risks.length) risks.push("Nenhum alerta crítico automático identificado nesta triagem inicial.");
  return risks;
}

export function generateTriageDossier(description: string): TriageDossier {
  const area = detectArea(description);
  const urgencyLevel = calculateUrgency(description);
  const maturityScore = calculateMaturity(description);
  const complexityLevel = urgencyLevel === "crítica" || maturityScore < 40 ? "alta" : urgencyLevel === "alta" || maturityScore < 70 ? "média" : "baixa";
  return {
    legalArea: area?.name ?? "Área jurídica a confirmar",
    urgencyLevel,
    maturityScore,
    complexityLevel,
    executiveSummary: area
      ? `A narrativa indica possível demanda relacionada a ${area.name}. A análise ainda é preliminar e depende da conferência dos documentos e de informações complementares.`
      : "A narrativa ainda não permite definir com segurança a área jurídica principal. É necessário coletar mais informações.",
    suggestedDocuments: area?.documents ?? ["Documentos pessoais", "Comprovantes", "Conversas", "Notificações", "Provas disponíveis"],
    followUpQuestions: area?.questions ?? ["Quem está envolvido no problema?", "Quando os fatos ocorreram?", "Quais documentos você possui?", "Qual solução você deseja?"],
    riskAlerts: detectRisks(description),
    nextSteps: ["Confirmar dados pessoais e local dos fatos.", "Solicitar documentos essenciais.", "Verificar existência de prazo em andamento.", "Submeter o caso à análise individual por advogado."],
    clientWarning: "As informações apresentadas possuem caráter preliminar e informativo, não substituindo a análise individual por advogado habilitado."
  };
}
