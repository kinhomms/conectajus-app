import Link from "next/link";

const legalAreas = [
  "Direito Bancário",
  "Direito do Consumidor",
  "Direito Administrativo",
  "Concursos Públicos",
  "Direito de Família",
  "Inventário e Sucessões",
  "Direito Trabalhista",
  "Direito Previdenciário",
  "Direito de Trânsito",
  "Direito à Saúde",
  "Direito Imobiliário",
  "Direito Militar",
];

const steps = [
  ["1", "Cliente relata o caso", "A pessoa explica o problema em linguagem simples."],
  ["2", "IA faz perguntas", "A conversa se adapta à área jurídica identificada."],
  ["3", "Lead mascarado é criado", "Área, cidade, urgência e resumo ficam disponíveis sem expor dados pessoais."],
  ["4", "Advogado desbloqueia", "Dados privados e documentos só aparecem após uso controlado de créditos."],
];

const marketplaceFlow = [
  {
    title: "Antes dos créditos",
    text: "O advogado vê apenas área, cidade, urgência, complexidade e resumo mascarado.",
  },
  {
    title: "Depois do desbloqueio",
    text: "Nome, contato, histórico e documentos privados são liberados dentro do fluxo auditável.",
  },
  {
    title: "Após a conversão",
    text: "A oportunidade pode seguir para CRM, agenda, processos, documentos e gestão financeira.",
  },
];

export function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F7FB] text-[#07182F]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07182F]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A227] font-black text-[#07182F]">
              CJ
            </div>
            <div>
              <strong className="block text-xl text-white">ConectaJus</strong>
              <span className="text-xs text-slate-300">
                Inteligência Jurídica que Conecta Soluções.
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-200 md:flex">
            <a href="#como-funciona" className="hover:text-white">Como funciona</a>
            <a href="#areas" className="hover:text-white">Áreas</a>
            <a href="#advogados" className="hover:text-white">Advogados</a>
            <a href="#seguranca" className="hover:text-white">Segurança</a>
          </nav>

          <div className="flex gap-3">
            <Link href="/login" className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white">
              Entrar
            </Link>
            <Link href="/triagem" className="rounded-xl bg-[#C9A227] px-4 py-2 text-sm font-black text-[#07182F]">
              Iniciar triagem
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-[#C9A227]/30 bg-white px-4 py-2 text-sm font-bold text-[#102542] shadow-sm">
              Plataforma jurídica inteligente para múltiplas áreas do Direito
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-[-0.04em] text-[#07182F] md:text-7xl">
              O primeiro atendimento jurídico começa com inteligência.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A ConectaJus ajuda o cliente a organizar seu problema jurídico,
              responde perguntas iniciais, identifica a área do Direito, sugere
              documentos e prepara uma oportunidade mascarada para análise por advogado.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/triagem" className="rounded-2xl bg-[#07182F] px-6 py-4 text-center font-black text-white shadow-xl shadow-slate-900/10">
                Preciso de orientação jurídica
              </Link>
              <a href="#advogados" className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center font-black text-[#07182F]">
                Sou advogado
              </a>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              A IA organiza informações preliminares. Dados pessoais e documentos privados permanecem protegidos até liberação controlada no Marketplace.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
            <div className="rounded-[1.5rem] bg-[#07182F] p-5 text-white">
              <div className="mb-4 flex items-center justify-between">
                <strong>Dossiê Inteligente</strong>
                <span className="rounded-full bg-[#C9A227] px-3 py-1 text-xs font-black text-[#07182F]">IA</span>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Área provável</p>
                  <strong>Direito Bancário</strong>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Urgência</p>
                  <strong>Alta, possível prazo ou risco financeiro</strong>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Documentos sugeridos</p>
                  <strong>Contrato, extratos, prints e comprovantes</strong>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Resumo para o advogado</p>
                  <strong>Caso organizado antes da primeira análise humana.</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-4xl font-black tracking-[-0.03em]">Como funciona</h2>
          <p className="mt-3 text-slate-600">
            A plataforma foi desenhada para transformar relatos confusos em casos organizados.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {steps.map(([num, title, text]) => (
            <div key={num} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227] font-black">
                {num}
              </div>
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[2rem] border border-slate-200 bg-[#07182F] p-8 text-white shadow-xl shadow-slate-900/10">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">Marketplace jurídico</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.03em]">Oportunidades com privacidade desde a origem</h2>
            <p className="mt-4 leading-8 text-slate-300">
              O cidadão conta o caso, a IA organiza a demanda e o advogado analisa oportunidades qualificadas sem receber dados pessoais antes do desbloqueio.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {marketplaceFlow.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="areas" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-4xl font-black tracking-[-0.03em]">
              Preparada para múltiplas áreas do Direito
            </h2>
            <p className="mt-3 text-slate-600">
              A ConectaJus recebe demandas de diversas áreas e organiza oportunidades para análise
              por advogados parceiros conforme contexto, urgência e complexidade.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {legalAreas.map((area) => (
              <div key={area} className="rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-4 font-bold text-[#102542]">
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="advogados" className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-2">
        <div className="rounded-[2rem] bg-[#07182F] p-8 text-white">
          <h2 className="text-4xl font-black tracking-[-0.03em]">Para advogados parceiros</h2>
          <p className="mt-4 leading-8 text-slate-300">
            Advogados podem acessar oportunidades qualificadas, usar créditos para desbloqueio,
            converter leads em CRM e acompanhar a rotina jurídica em uma operação integrada.
          </p>
          <Link href="/cadastro" className="mt-6 inline-flex rounded-2xl bg-[#C9A227] px-6 py-4 font-black text-[#07182F]">
            Criar conta de advogado
          </Link>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-black">Operação conectada</h3>
          <ul className="mt-5 space-y-4 text-slate-700">
            <li>Marketplace com oportunidades mascaradas por área, cidade e urgência.</li>
            <li>Sistema de créditos para desbloqueio auditável de dados privados.</li>
            <li>CRM jurídico para relacionamento, casos, documentos e notas.</li>
            <li>Agenda para prazos, audiências, reuniões e tarefas.</li>
            <li>Processos, documentos e financeiro em um hub operacional.</li>
          </ul>
        </div>
      </section>

      <section id="seguranca" className="bg-[#07182F] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl font-black tracking-[-0.03em]">Segurança, ética e responsabilidade</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-300">
            A plataforma trabalha com dados mascarados no Marketplace, armazenamento privado de documentos,
            controle de acesso e desbloqueio auditável por créditos, respeitando LGPD, sigilo profissional
            e os limites éticos da advocacia, sem promessa de resultado e sem substituir a análise de advogado habilitado.
          </p>
        </div>
      </section>

      <footer className="bg-[#050F1D] px-6 py-8 text-sm text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row">
          <p>© ConectaJus. Todos os direitos reservados.</p>
          <p>Ecossistema jurídico inteligente para triagem, CRM e Marketplace.</p>
        </div>
      </footer>
    </main>
  );
}
