"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TriageResult } from "@/components/triage/TriageResult";
import { generateTriageDossier } from "@/modules/ai/triage-engine";
import type { TriageDossier } from "@/types/triage";

export default function TriagePage() {
  const [description, setDescription] = useState("");
  const [dossier, setDossier] = useState<TriageDossier | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (description.trim().length < 30) {
      setError("Descreva o caso com um pouco mais de detalhes para que a triagem funcione melhor.");
      return;
    }
    setDossier(generateTriageDossier(description));
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-6 py-10 text-[#07182F]">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.95fr_1.05fr]">
        <section>
          <div className="mb-6">
            <a href="/" className="text-sm font-bold text-slate-500 hover:text-[#07182F]">← Voltar para início</a>
          </div>
          <Card>
            <div className="mb-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">Triagem Jurídica Inteligente</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#07182F]">Conte o que aconteceu.</h1>
              <p className="mt-4 leading-7 text-slate-600">A ConectaJus irá organizar as primeiras informações do caso, identificar a área provável, apontar documentos úteis e gerar um dossiê preliminar.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">Descrição do caso</span>
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={12} className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10" placeholder="Ex.: Meu banco começou a descontar valores do meu benefício, mas eu não reconheço esse contrato..." />
              </label>
              {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
              <Button>Gerar dossiê preliminar</Button>
            </form>
          </Card>
        </section>
        <section>
          {dossier ? (
            <TriageResult dossier={dossier} />
          ) : (
            <Card className="flex min-h-[560px] items-center justify-center bg-[#07182F] text-white">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#C9A227] text-2xl font-black text-[#07182F]">IA</div>
                <h2 className="text-3xl font-black">Dossiê Inteligente</h2>
                <p className="mt-4 leading-7 text-slate-300">O resultado da triagem aparecerá aqui com área provável, urgência, maturidade, perguntas, documentos e alertas.</p>
              </div>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
