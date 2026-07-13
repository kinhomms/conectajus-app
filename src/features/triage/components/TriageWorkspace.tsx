"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { Card } from "@/components/ui/Card";
import { TriageResult } from "@/features/triage/components/TriageResult";
import { useTriageWorkspace } from "@/features/triage/hooks/useTriageWorkspace";

export function TriageWorkspace() {
  const triage = useTriageWorkspace();

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-6 py-10 text-[#07182F]">
      <div className="mx-auto mb-6 flex max-w-7xl flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"
        >
          ← Voltar
        </button>
        <Link href={routes.dashboard} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50">
          Portal do cidadão
        </Link>
        <Link href={routes.home} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50">
          Início
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.95fr_1.05fr]">
        <section>
          <Card>
            <div className="mb-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">
                {triage.isComplementary ? "Triagem Jurídica Complementar" : "Triagem Jurídica Inteligente"}
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#07182F]">
                {triage.isComplementary ? "Conte o que mudou." : "Conte o que aconteceu."}
              </h1>
              <p className="mt-4 leading-7 text-slate-600">
                {triage.isComplementary ? "Registre fatos novos, mudanças importantes ou informações que surgiram depois da publicação original. O caso anterior permanece preservado." : "A ConectaJus organiza as primeiras informações do caso, identifica a área provável, aponta documentos úteis e gera um dossiê preliminar com dados pessoais protegidos."}
              </p>
            </div>

            {triage.isComplementary && !triage.isPublished ? (
              <div className="mb-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                Esta é uma triagem complementar. Ela cria um novo dossiê relacionado ao caso anterior, sem alterar o relato original já publicado.
              </div>
            ) : null}

            {triage.isPublished ? (
              <div className="mb-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                Esta demanda já foi publicada no Marketplace. Para preservar a integridade do lead visto pelos advogados, a edição direta fica bloqueada. Se precisar complementar, envie documentos ou inicie uma nova triagem.
              </div>
            ) : triage.dossier ? (
              <div className="mb-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                Antes de publicar, você ainda pode editar a demanda. Ajuste o relato no formulário e gere o dossiê novamente.
              </div>
            ) : null}

            <form onSubmit={triage.handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">
                    Cidade do caso
                  </span>
                  <input
                    value={triage.city}
                    onChange={(event) => triage.setCity(event.target.value)}
                    disabled={triage.isPublished}
                    className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                    placeholder="Ex.: Salvador"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">
                    UF
                  </span>
                  <input
                    value={triage.state}
                    onChange={(event) => triage.setState(event.target.value.toUpperCase().slice(0, 2))}
                    disabled={triage.isPublished}
                    className="w-full rounded-2xl border border-slate-300 bg-white p-4 uppercase outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                    placeholder="BA"
                  />
                </label>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Dados protegidos para desbloqueio
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Estes dados não aparecem no Marketplace antes do uso de créditos. Eles ficam protegidos em camada privada.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">Nome</span>
                    <input
                      value={triage.fullName}
                      onChange={(event) => triage.setFullName(event.target.value)}
                      disabled={triage.isPublished}
                      className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="Nome do cidadão"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">E-mail</span>
                    <input
                      value={triage.email}
                      onChange={(event) => triage.setEmail(event.target.value)}
                      disabled={triage.isPublished}
                      className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="email@exemplo.com"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">Telefone</span>
                    <input
                      value={triage.phone}
                      onChange={(event) => triage.setPhone(event.target.value)}
                      disabled={triage.isPublished}
                      className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="(00) 00000-0000"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">WhatsApp</span>
                    <input
                      value={triage.whatsapp}
                      onChange={(event) => triage.setWhatsapp(event.target.value)}
                      disabled={triage.isPublished}
                      className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="WhatsApp para contato"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Documentos mencionados</span>
                  <textarea
                    value={triage.documentNotes}
                    onChange={(event) => triage.setDocumentNotes(event.target.value)}
                    disabled={triage.isPublished}
                    rows={3}
                    className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                    placeholder="Ex.: contrato, prints, extratos, notificações..."
                  />
                </label>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227]">
                      Documentos enviados
                    </p>
                    <h2 className="mt-1 text-lg font-black text-[#07182F]">Vincular arquivos ao caso</h2>
                  </div>
                  <Link
                    href={triage.complementOpportunityId ? `${routes.documents}?opportunity=${triage.complementOpportunityId}` : routes.documents}
                    className="rounded-2xl border border-slate-300 px-4 py-2 text-center text-sm font-black text-[#07182F] hover:bg-slate-50"
                  >
                    {triage.isPublished ? "Complementar documentos" : "Enviar novo documento"}
                  </Link>
                </div>

                {triage.loadingDocuments ? (
                  <p className="mt-4 text-sm font-semibold text-slate-500">Carregando documentos...</p>
                ) : triage.availableDocuments.length === 0 ? (
                  <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    Nenhum documento enviado ainda. Você pode continuar a triagem e enviar arquivos depois pela área “Meus documentos”.
                  </p>
                ) : (
                  <div className="mt-4 grid gap-3">
                    {triage.availableDocuments.map((document) => {
                      const checked = triage.selectedCitizenDocumentIds.includes(document.id);

                      return (
                        <label
                          key={document.id}
                          className={`flex gap-3 rounded-2xl border p-4 transition ${triage.isPublished ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-80" : checked ? "cursor-pointer border-[#C9A227] bg-[#C9A227]/10" : "cursor-pointer border-slate-200 bg-slate-50 hover:bg-white"}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={triage.isPublished}
                            onChange={() => triage.toggleCitizenDocument(document.id)}
                            className="mt-1 h-4 w-4 accent-[#C9A227] disabled:cursor-not-allowed"
                          />
                          <span>
                            <span className="block break-words text-sm font-black text-[#07182F]">{document.file_name}</span>
                            <span className="mt-1 block text-xs text-slate-500">
                              Enviado em {new Date(document.created_at).toLocaleDateString("pt-BR")}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">
                  Descrição do caso
                </span>
                <textarea
                  value={triage.description}
                  onChange={(event) => triage.setDescription(event.target.value)}
                  disabled={triage.isPublished}
                  rows={12}
                  className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  placeholder="Ex.: Meu banco começou a descontar valores do meu benefício, mas eu não reconheço esse contrato..."
                />
              </label>

              {triage.error && (
                <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                  {triage.error}
                </div>
              )}

              {triage.marketplaceMessage && (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                  {triage.marketplaceMessage}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={triage.isPublished}
                  className="rounded-2xl bg-[#07182F] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {triage.isComplementary ? (triage.dossier ? "Gerar dossiê complementar novamente" : "Gerar dossiê complementar") : triage.dossier ? "Gerar dossiê novamente" : "Gerar dossiê preliminar"}
                </button>
                {triage.dossier && !triage.isPublished ? (
                  <button
                    type="button"
                    onClick={triage.handleEditDemand}
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#07182F] hover:bg-slate-50"
                  >
                    Editar demanda antes de publicar
                  </button>
                ) : null}
                {triage.isPublished ? (
                  <button
                    type="button"
                    onClick={triage.handleStartNewDemand}
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#07182F] hover:bg-slate-50"
                  >
                    Iniciar nova triagem
                  </button>
                ) : null}
              </div>
            </form>
          </Card>
        </section>

        <section className="space-y-4">
          {triage.dossier ? (
            <>
              <TriageResult dossier={triage.dossier} />
              <Card className="border border-[#C9A227]/20 bg-white">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227]">
                      Marketplace
                    </p>
                    <h3 className="mt-2 text-xl font-black text-[#07182F]">
                      {triage.isComplementary ? "Publicar complemento mascarado" : "Publicar oportunidade mascarada"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {triage.isComplementary ? "O complemento será exibido como novo lead mascarado, mantendo dados pessoais, documentos e histórico protegidos até o desbloqueio." : "Serão exibidos apenas área, cidade, urgência, resumo, complexidade e custo em créditos. Dados pessoais e documentos ficam privados até o desbloqueio."}
                    </p>
                    {!triage.isPublished ? (
                      <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-800">
                        Revise com calma. Até publicar, você pode editar o relato e gerar o dossiê novamente.
                      </p>
                    ) : (
                      <p className="mt-3 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
                        Publicado. Agora acompanhe pelo Portal do cidadão ou complemente com documentos.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={triage.handlePublishOpportunity}
                      disabled={triage.publishing || Boolean(triage.publishedOpportunityId)}
                      className="rounded-2xl bg-[#C9A227] px-5 py-3 text-sm font-black text-[#07182F] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {triage.publishing ? "Publicando..." : triage.publishedOpportunityId ? "Publicado" : "Publicar no Marketplace"}
                    </button>
                    {triage.publishedOpportunityId ? (
                      <Link
                        href={routes.dashboard}
                        className="rounded-2xl border border-[#C9A227]/30 px-5 py-3 text-center text-sm font-black text-[#07182F] transition hover:-translate-y-0.5 hover:bg-[#C9A227]/10"
                      >
                        Acompanhar no portal
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={triage.handleEditDemand}
                        className="rounded-2xl border border-[#C9A227]/30 px-5 py-3 text-center text-sm font-black text-[#07182F] transition hover:-translate-y-0.5 hover:bg-[#C9A227]/10"
                      >
                        Editar antes de publicar
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="flex min-h-[560px] items-center justify-center bg-[#07182F] text-white">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#C9A227] text-2xl font-black text-[#07182F]">
                  IA
                </div>
                <h2 className="text-3xl font-black">Dossiê Inteligente</h2>
                <p className="mt-4 leading-7 text-slate-300">
                  O resultado da triagem aparecerá aqui com área provável, urgência, maturidade, perguntas, documentos e alertas.
                </p>
              </div>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}