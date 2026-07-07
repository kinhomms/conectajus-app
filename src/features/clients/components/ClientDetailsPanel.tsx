"use client";

import type { Client } from "@/features/clients/types/client.types";

type Props = {
  client: Client | null;
};

export function ClientDetailsPanel({ client }: Props) {
  if (!client) {
    return (
      <section className="flex h-full items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111827] p-10 text-center text-slate-400">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Nenhum cliente selecionado
          </h2>

          <p className="mt-3 max-w-md">
            Selecione um cliente na lista para visualizar seu dossiê
            completo.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-xl shadow-black/20">
      <div className="flex items-center gap-5">

        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400 text-2xl font-bold text-black">
          {client.full_name
            ?.split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>

        <div>

          <h1 className="text-3xl font-bold text-white">
            {client.full_name}
          </h1>

          <p className="mt-2 text-slate-400">
            Cliente ativo na plataforma
          </p>

        </div>

      </div>

      <div className="mt-10 grid grid-cols-2 gap-6">

        <Info
          title="CPF"
          value={client.cpf || "Não informado"}
        />

        <Info
          title="RG"
          value={client.rg || "Não informado"}
        />

        <Info
          title="Telefone"
          value={client.phone || "Não informado"}
        />

        <Info
          title="Email"
          value={client.email || "Não informado"}
        />

        <Info
          title="Cidade"
          value={client.city || "Não informado"}
        />

        <Info
          title="Estado"
          value={client.state || "Não informado"}
        />

        <Info
          title="Profissão"
          value={client.profession || "Não informado"}
        />

        <Info
          title="Estado Civil"
          value={client.marital_status || "Não informado"}
        />

      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-[#0B0F19] p-6">

        <h3 className="mb-3 text-lg font-semibold text-white">
          Observações
        </h3>

        <p className="text-slate-300">
          {client.notes || "Nenhuma observação cadastrada."}
        </p>

      </div>

    </section>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#0B0F19] p-5">
      <p className="text-xs uppercase tracking-widest text-amber-400">
        {title}
      </p>

      <p className="mt-2 text-white">
        {value}
      </p>
    </div>
  );
}