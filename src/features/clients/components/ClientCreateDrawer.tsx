"use client";

import type { FormEvent } from "react";

type ClientForm = {
  full_name: string;
  cpf: string;
  rg: string;
  birth_date: string;
  profession: string;
  marital_status: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes: string;
};

type ClientCreateDrawerProps = {
  open: boolean;
  form: ClientForm;
  saving?: boolean;
  message?: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof ClientForm, value: string) => void;
};

export function ClientCreateDrawer({
  open,
  form,
  saving,
  message,
  onClose,
  onSubmit,
  onChange,
}: ClientCreateDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar cadastro"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#0B0F19] p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
              Novo cliente
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Cadastro jurídico
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Preencha os dados principais para iniciar o dossiê.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <Field
            label="Nome completo"
            required
            value={form.full_name}
            onChange={(value) => onChange("full_name", value)}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="CPF"
              value={form.cpf}
              onChange={(value) => onChange("cpf", value)}
            />

            <Field
              label="RG"
              value={form.rg}
              onChange={(value) => onChange("rg", value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(value) => onChange("email", value)}
            />

            <Field
              label="WhatsApp"
              value={form.phone}
              onChange={(value) => onChange("phone", value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Cidade"
              value={form.city}
              onChange={(value) => onChange("city", value)}
            />

            <Field
              label="Estado"
              value={form.state}
              onChange={(value) => onChange("state", value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Profissão"
              value={form.profession}
              onChange={(value) => onChange("profession", value)}
            />

            <Field
              label="Estado civil"
              value={form.marital_status}
              onChange={(value) => onChange("marital_status", value)}
            />
          </div>

          <Field
            label="Endereço"
            value={form.address}
            onChange={(value) => onChange("address", value)}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-300">
              Observações iniciais
            </span>
            <textarea
              value={form.notes}
              onChange={(event) => onChange("notes", event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
            />
          </label>

          {message && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              {message}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-bold text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar cliente"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </span>

      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
      />
    </label>
  );
}