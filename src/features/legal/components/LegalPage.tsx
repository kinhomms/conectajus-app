import Link from "next/link";
import { routes } from "@/lib/routes";

export type LegalSection = {
  title: string;
  items: string[];
};

export type LegalPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  reviewNote: string;
  sections: LegalSection[];
};

export function LegalPage({ content }: { content: LegalPageContent }) {
  return (
    <main className="min-h-screen bg-[#F5F7FB] text-[#07182F]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href={routes.home} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A227] font-black text-[#07182F]">
              CJ
            </span>
            <span>
              <strong className="block text-xl">ConectaJus</strong>
              <span className="text-xs font-semibold text-slate-500">Documentos públicos</span>
            </span>
          </Link>

          <div className="flex flex-wrap gap-2 text-sm font-bold">
            <Link href={routes.privacy} className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
              Privacidade
            </Link>
            <Link href={routes.terms} className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
              Termos
            </Link>
            <Link href={routes.marketplaceRules} className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
              Marketplace
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#C9A227]">
            {content.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] md:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            {content.description}
          </p>
          <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              Última atualização: {content.lastUpdated}
            </div>
            <div className="rounded-2xl bg-amber-50 p-4 text-amber-900">
              {content.reviewNote}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {content.sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black tracking-[-0.02em]">{section.title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {section.items.map((item) => (
                  <li key={item} className="rounded-2xl bg-slate-50 p-4">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-[#07182F] p-6 text-white">
          <h2 className="text-xl font-black">Contato e solicitações</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Para dúvidas, solicitações de privacidade, suporte ou revisão de dados, use o canal oficial informado pela operação ConectaJus.
            Antes do go-live público, substituir este texto pelo e-mail/canal definitivo de atendimento.
          </p>
        </div>
      </section>
    </main>
  );
}
