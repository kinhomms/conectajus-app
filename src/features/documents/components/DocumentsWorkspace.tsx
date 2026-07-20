"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { useDocumentsWorkspace } from "@/features/documents/hooks/useDocumentsWorkspace";
import type { CitizenDocument, LegalDocument } from "@/features/documents/types/document.types";

export function DocumentsWorkspace() {
  const documents = useDocumentsWorkspace();

  if (documents.loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-slate-950 dark:text-white">
        <p className="font-black">Carregando documentos...</p>
      </main>
    );
  }

  if (documents.isCitizen) {
    return <CitizenDocumentsWorkspace documents={documents} />;
  }

  return (
    <section className="text-slate-950 dark:text-white">
      <PageNavigation />
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">
            Documentos
          </p>
          <h1 className="mt-2 text-3xl font-bold">Central de documentos</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Consulte os documentos registrados nos dossiês dos clientes.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => documents.refreshDocuments(true)}
            className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
          >
            Atualizar
          </button>
          <Link
            href={routes.clients}
            className="rounded-2xl bg-teal-600 dark:bg-teal-300 px-5 py-3 text-sm font-bold text-white dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200"
          >
            Registrar pelo cliente
          </Link>
        </div>
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-[1fr_150px_150px_150px_150px]">
        <input
          type="search"
          value={documents.search}
          onChange={(event) => documents.setSearch(event.target.value)}
          placeholder="Buscar por nome, tipo ou observação..."
          className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 text-sm text-slate-950 dark:text-white outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-teal-500 dark:focus:border-teal-300"
        />

        <Metric label="Total" value={documents.legalDocumentStats.total} />
        <Metric label="Classificados" value={documents.legalDocumentStats.typed} />
        <Metric label="Sem tipo" value={documents.legalDocumentStats.missingType} />
        <Metric label="Exibidos" value={documents.legalDocumentStats.displayed} />
      </div>

      {documents.message && <Message tone="error" text={documents.message} />}

      {documents.filteredDocuments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-10 text-center">
          <h2 className="text-xl font-semibold">Nenhum documento encontrado</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Quando documentos forem registrados no painel de um cliente, eles aparecerão aqui para consulta centralizada.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          {documents.filteredDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </section>
  );
}

type CitizenDocumentsWorkspaceProps = {
  documents: ReturnType<typeof useDocumentsWorkspace>;
};

function CitizenDocumentsWorkspace({ documents }: CitizenDocumentsWorkspaceProps) {
  return (
    <section className="text-slate-950 dark:text-white">
      <PageNavigation dashboardLabel="Portal do cidadão" />
      <div className="mb-8 rounded-[2rem] border border-teal-500 dark:border-teal-300/20 bg-white dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20 md:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">Meus documentos</p>
        <h1 className="mt-2 text-3xl font-bold">Documentos do seu caso</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Envie comprovantes, contratos, prints, notificações e arquivos relacionados ao seu caso. Os arquivos ficam em armazenamento privado e só você consegue listar seus próprios documentos neste portal.
        </p>
      </div>

      {documents.complementOpportunityId && (
        <div className="mb-6 rounded-3xl border border-teal-200 bg-teal-50 dark:border-teal-300/30 dark:bg-teal-300/10 p-5 text-sm leading-6 text-amber-900 dark:text-amber-100">
          <p className="font-black">Complemento de demanda publicada</p>
          <p className="mt-1 text-amber-900 dark:text-amber-50/90">Este documento será anexado à oportunidade selecionada sem alterar o relato original já publicado no Marketplace.</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <form
            onSubmit={documents.handleCitizenUpload}
            className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">Upload seguro</p>
            <h2 className="mt-2 text-2xl font-bold">Adicionar documento</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Use arquivos em PDF, imagens ou documentos de texto. Evite enviar dados que não tenham relação com o caso.
            </p>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Arquivo
                <input
                  type="file"
                  onChange={(event) => documents.setSelectedFile(event.target.files?.[0] ?? null)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] px-4 py-3 text-sm text-slate-700 dark:text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white dark:file:bg-teal-300 dark:file:text-slate-950"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Observação opcional
                <textarea
                  value={documents.notes}
                  onChange={(event) => documents.setNotes(event.target.value)}
                  placeholder="Ex.: contrato assinado, comprovante de pagamento, print da conversa..."
                  rows={3}
                  className="resize-none rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] px-4 py-3 text-sm text-slate-950 dark:text-white outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-teal-500 dark:focus:border-teal-300"
                />
              </label>
            </div>

            {documents.message && <Message tone={documents.message.includes("segurança") ? "success" : "error"} text={documents.message} />}

            <button
              type="submit"
              disabled={documents.uploading}
              className="mt-5 rounded-2xl bg-teal-600 dark:bg-teal-300 px-5 py-3 text-sm font-bold text-white dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {documents.uploading ? "Enviando..." : "Enviar documento"}
            </button>
          </form>

          <div className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
            <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_150px]">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">Arquivos enviados</p>
                <h2 className="mt-2 text-2xl font-bold">Sua lista segura</h2>
              </div>
              <Metric label="Total" value={documents.citizenDocumentStats.total} />
            </div>

            <div className="mb-5 grid gap-4 md:grid-cols-4">
              <Metric label="Enviados" value={documents.citizenDocumentStats.uploaded} />
              <Metric label="Revisados" value={documents.citizenDocumentStats.reviewed} />
              <Metric label="Arquivados" value={documents.citizenDocumentStats.archived} />
              <Metric label="Exibidos" value={documents.citizenDocumentStats.displayed} />
            </div>

            <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-4">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Volume aproximado enviado: {formatFileSize(documents.citizenDocumentStats.totalSize)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={documents.citizenDocumentStatusFilter === "all"}
                    label="Todos"
                    onClick={() => documents.setCitizenDocumentStatusFilter("all")}
                  />
                  <FilterButton
                    active={documents.citizenDocumentStatusFilter === "uploaded"}
                    label="Enviados"
                    onClick={() => documents.setCitizenDocumentStatusFilter("uploaded")}
                  />
                  <FilterButton
                    active={documents.citizenDocumentStatusFilter === "reviewed"}
                    label="Revisados"
                    onClick={() => documents.setCitizenDocumentStatusFilter("reviewed")}
                  />
                  <FilterButton
                    active={documents.citizenDocumentStatusFilter === "archived"}
                    label="Arquivados"
                    onClick={() => documents.setCitizenDocumentStatusFilter("archived")}
                  />
                </div>
              </div>
            </div>

            <input
              type="search"
              value={documents.search}
              onChange={(event) => documents.setSearch(event.target.value)}
              placeholder="Buscar meus documentos..."
              className="mb-5 w-full rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 text-sm text-slate-950 dark:text-white outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-teal-500 dark:focus:border-teal-300"
            />

            {documents.filteredCitizenDocuments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-8 text-center">
                <h3 className="text-lg font-semibold">Nenhum documento enviado ainda</h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Assim que você enviar arquivos, eles aparecerão aqui com acesso privado por link temporário.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {documents.filteredCitizenDocuments.map((document) => (
                  <CitizenDocumentCard
                    key={document.id}
                    document={document}
                    opening={documents.openingDocumentId === document.id}
                    onOpen={() => documents.openCitizenDocument(document)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
          <p className="text-xs uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">Privacidade</p>
          <h3 className="mt-2 text-xl font-bold">O que preparar</h3>
          <div className="mt-5 space-y-3">
            <ChecklistItem text="Documentos pessoais apenas quando solicitados no fluxo seguro." />
            <ChecklistItem text="Contratos, prints, notificações e comprovantes relacionados ao caso." />
            <ChecklistItem text="Links de abertura são temporários e gerados apenas quando você solicita." />
          </div>
        </aside>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-wide transition ${
        active
          ? "border-teal-600 bg-teal-600 dark:border-teal-300 dark:bg-teal-300 text-white dark:text-slate-950"
          : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function getCitizenDocumentStatusLabel(status: CitizenDocument["status"]) {
  const labels = {
    archived: "Arquivado",
    reviewed: "Revisado",
    uploaded: "Enviado",
  };

  return labels[status];
}

function formatFileSize(bytes: number) {
  if (!bytes) {
    return "0 KB";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function DocumentCard({ document }: { document: LegalDocument }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 dark:bg-teal-300 text-xl font-black text-white dark:text-slate-950">
        DOC
      </div>

      <p className="text-xs uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">
        {document.document_type || "Tipo não informado"}
      </p>
      <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{document.document_name}</h2>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {document.notes || "Nenhuma observação cadastrada."}
      </p>

      <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
        Registrado em {new Date(document.created_at).toLocaleDateString("pt-BR")}
      </p>
    </article>
  );
}

function CitizenDocumentCard({ document, onOpen, opening }: { document: CitizenDocument; onOpen: () => void; opening: boolean }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 dark:bg-teal-300 text-sm font-black text-white dark:text-slate-950">
        DOC
      </div>
      <span className="mb-3 inline-flex rounded-full border border-teal-200 bg-teal-50 dark:border-teal-300/30 dark:bg-teal-300/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-teal-800 dark:text-teal-200">
        {getCitizenDocumentStatusLabel(document.status)}
      </span>
      <p className="text-xs uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">{document.mime_type || "Arquivo"}</p>
      <h3 className="mt-2 break-words text-lg font-bold text-slate-950 dark:text-white">{document.file_name}</h3>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {document.notes || "Sem observação."}
      </p>
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Enviado em {new Date(document.created_at).toLocaleDateString("pt-BR")}
      </p>
      <button
        type="button"
        onClick={onOpen}
        disabled={opening}
        className="mt-4 rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-2 text-sm font-bold text-slate-950 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {opening ? "Abrindo..." : "Abrir com link seguro"}
      </button>
    </article>
  );
}

function ChecklistItem({ text }: { text: string }) {
  return <div className="rounded-2xl bg-slate-50 dark:bg-[#0B0F19] p-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{text}</div>;
}

function Message({ text, tone }: { text: string; tone: "error" | "success" }) {
  return (
    <div className={`mt-5 rounded-2xl border p-4 text-sm font-semibold ${tone === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-red-500/30 bg-red-500/10 text-red-200"}`}>
      {text}
    </div>
  );
}
