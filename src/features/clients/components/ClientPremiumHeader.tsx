import { ConectaJusLogo } from "@/components/layout/ConectaJusLogo";

type ClientPremiumHeaderProps = {
  totalClients: number;
  filteredClients: number;
};

export function ClientPremiumHeader({
  totalClients,
  filteredClients,
}: ClientPremiumHeaderProps) {
  return (
    <section className="cj-premium-header">
      <div>
        <ConectaJusLogo imageClassName="w-[160px]" />
        <p className="mt-4 text-sm uppercase tracking-[0.28em] text-amber-400">
          Clientes V2 Premium
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Gestão inteligente de clientes jurídicos
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Organize atendimentos, dados cadastrais, processos, documentos e histórico em uma experiência premium.
        </p>
      </div>

      <div className="cj-premium-header-card">
        <span className="text-sm text-slate-400">Clientes encontrados</span>
        <strong className="mt-2 block text-4xl text-white">{filteredClients}</strong>
        <span className="mt-1 block text-sm text-slate-400">
          de {totalClients} cliente(s) cadastrados
        </span>
      </div>
    </section>
  );
}
