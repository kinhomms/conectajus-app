import type { Client } from "../types/client.types";

type ClientCardProps = {
  client: Client;
  onOpen: (client: Client) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ClientCard({ client, onOpen }: ClientCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#C9A227] hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#07182F] text-sm font-black text-white">
          {getInitials(client.full_name) || "CJ"}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black text-[#07182F]">
            {client.full_name}
          </h3>

          <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
            CPF: {client.cpf || "não informado"}
          </p>

          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <p>📱 {client.phone || "Sem telefone"}</p>
            <p>✉️ {client.email || "Sem e-mail"}</p>
            <p>📍 {client.city || "Cidade não informada"}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              Cadastro: {new Date(client.created_at).toLocaleDateString("pt-BR")}
            </span>

            <button
              type="button"
              onClick={() => onOpen(client)}
              className="rounded-2xl bg-[#07182F] px-4 py-2 text-xs font-black text-white transition hover:bg-[#102A4C]"
            >
              Abrir dossiê
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
