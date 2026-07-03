import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07182F]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A227] font-black text-[#07182F]">CJ</div>
          <div>
            <strong className="block text-xl text-white">ConectaJus</strong>
            <span className="text-xs text-slate-300">Inteligência Jurídica que Conecta Soluções.</span>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-200 md:flex">
          <a href="#como-funciona" className="hover:text-white">Como funciona</a>
          <a href="#areas" className="hover:text-white">Áreas</a>
          <a href="#advogados" className="hover:text-white">Advogados</a>
        </nav>
        <div className="flex gap-3">
          <Button href={routes.login} variant="secondary" className="border-white/20 bg-transparent text-white">Entrar</Button>
          <Button href={routes.triage} variant="gold">Iniciar triagem</Button>
        </div>
      </div>
    </header>
  );
}
