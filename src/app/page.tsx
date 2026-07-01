export default function Home() {
  const areas = [
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
            <a
              href="#login"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white"
            >
              Entrar
            </a>
            <a
              href="#triagem"
              className="rounded-xl bg-[#C9A227] px-4 py-2 text-sm font-black text-[#07182F]"
            >
              Iniciar triagem
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-96 w-96 rounded-full bg-[#C9A227]/20 blur-3xl" />
        <div className="absolute bottom-[-140px] right-[-140px] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

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
              documentos e prepara um dossiê para análise por advogado.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                id="triagem"
                href="#"
                className="rounded-2xl bg-[#07182F] px-6 py-4 text-center font-black text-white shadow-xl shadow-slate-900/10"
              >
                Preciso de orientação jurídica
              </a>
              <a
                href="#advogados"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center font-black text-[#07182F]"
              >
                Sou advogado
              </a>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              As informações da IA são preliminares e não substituem análise individual por advogado habilitado.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
            <div className="rounded-[1.5rem] bg-[#07182F] p-5 text-white">
              <div className="mb-4 flex items-center justify-between">
                <strong>Dossiê Inteligente</strong>
                <span className="rounded-full bg-[#C9A227] px-3 py-1 text-xs font-black text-[#07182F]">
                  IA
                </span>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Área provável</p>
                  <strong>Direito Bancário</strong>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Urgência</p>
                  <strong>Alta — possível prazo ou risco financeiro</strong>
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
          {[
            ["1", "Cliente relata o caso", "A pessoa explica o problema em linguagem simples."],
            ["2", "IA faz perguntas", "A conversa se adapta à área jurídica identificada."],
            ["3", "Dossiê é criado", "Fatos, documentos e riscos são organizados."],
            ["4", "Advogado analisa", "O profissional recebe o caso com muito mais clareza."],
          ].map(([num, title, text]) => (
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

      <section id="areas" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-4xl font-black tracking-[-0.03em]">
              Preparada para múltiplas áreas do Direito
            </h2>
            <p className="mt-3 text-slate-600">
              A ConectaJus nasce preparada para receber clientes de diversas áreas e, futuramente,
              distribuir oportunidades para advogados parceiros conforme especialidade.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => (
              <div
                key={area}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-4 font-bold text-[#102542]"
              >
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="advogados" className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-2">
        <div className="rounded-[2rem] bg-[#07182F] p-8 text-white">
          <h2 className="text-4xl font-black tracking-[-0.03em]">
            Para advogados parceiros
          </h2>
          <p className="mt-4 leading-8 text-slate-300">
            No futuro, advogados de diversas áreas poderão se cadastrar, comprar créditos,
            receber oportunidades qualificadas e acompanhar casos dentro da plataforma.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-black">Modelo futuro</h3>
          <ul className="mt-5 space-y-4 text-slate-700">
            <li>• Cadastro e aprovação de advogados.</li>
            <li>• Áreas de atuação e regiões atendidas.</li>
            <li>• Compra de créditos.</li>
            <li>• Recebimento de oportunidades qualificadas.</li>
            <li>• Painel próprio do advogado.</li>
          </ul>
        </div>
      </section>

      <section id="seguranca" className="bg-[#07182F] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl font-black tracking-[-0.03em]">
            Segurança, ética e responsabilidade
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-300">
            A plataforma será construída respeitando LGPD, sigilo profissional,
            controle de acesso e os limites éticos da advocacia, sem promessa de resultado
            e sem substituir a análise de advogado habilitado.
          </p>
        </div>
      </section>

      <footer className="bg-[#050F1D] px-6 py-8 text-sm text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row">
          <p>© ConectaJus. Todos os direitos reservados.</p>
          <p>Plataforma jurídica inteligente em desenvolvimento.</p>
        </div>
      </footer>
    </main>
  );
}
