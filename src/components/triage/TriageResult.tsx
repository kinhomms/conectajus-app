import type { TriageDossier } from "@/types/triage";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MaturityBar } from "@/components/cases/MaturityBar";

export function TriageResult({ dossier }: { dossier: TriageDossier }) {
  return (
    <Card className="space-y-6">
      <div>
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge>{dossier.legalArea}</Badge>
          <Badge tone={dossier.urgencyLevel === "alta" || dossier.urgencyLevel === "crítica" ? "danger" : "success"}>Urgência: {dossier.urgencyLevel}</Badge>
          <Badge tone="warning">Complexidade: {dossier.complexityLevel}</Badge>
        </div>
        <h2 className="text-2xl font-black text-[#07182F]">Dossiê preliminar</h2>
        <p className="mt-3 leading-7 text-slate-600">{dossier.executiveSummary}</p>
      </div>
      <MaturityBar value={dossier.maturityScore} />
      <div>
        <h3 className="font-black text-[#07182F]">Perguntas complementares</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">{dossier.followUpQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div>
        <h3 className="font-black text-[#07182F]">Documentos sugeridos</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">{dossier.suggestedDocuments.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div>
        <h3 className="font-black text-[#07182F]">Alertas</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">{dossier.riskAlerts.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{dossier.clientWarning}</div>
    </Card>
  );
}
