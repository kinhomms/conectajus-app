"use client";

import Link from "next/link";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { routes } from "@/lib/routes";
import { useSettingsWorkspace, type SettingsChecklistItem } from "@/features/settings/hooks/useSettingsWorkspace";

export function SettingsWorkspace() {
  const settings = useSettingsWorkspace();

  if (settings.loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-slate-950 dark:text-white">
        <p className="font-black">Carregando configuraÃ§Ãµes...</p>
      </main>
    );
  }

  return (
    <section className="text-slate-950 dark:text-white">
      <PageNavigation dashboardLabel="Dashboard" />

      <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white dark:border-teal-400/20 dark:bg-gradient-to-br dark:from-[#111827] dark:via-[#0B0F19] dark:to-[#07182F] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/30 md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-teal-600 dark:text-teal-300">ConfiguraÃ§Ãµes</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-5xl">Conta, privacidade e operaÃ§Ã£o</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300">
              Central para revisar perfil, preferÃªncias, sessÃ£o, regras de privacidade e solicitaÃ§Ã£o de exclusÃ£o da conta.
            </p>
          </div>

          <button
            type="button"
            onClick={settings.handleLogout}
            disabled={settings.loggingOut}
            className="w-fit rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {settings.loggingOut ? "Saindo..." : "Sair da conta"}
          </button>
        </div>
      </div>

      {settings.message ? (
        <div className="mb-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm font-bold leading-6 text-teal-800 dark:text-teal-100">
          {settings.message}
        </div>
      ) : null}

      <section className="mb-6 grid gap-5 lg:grid-cols-3">
        <ProfileCard label="Nome" value={settings.fullName} description="Nome pÃºblico associado ao cadastro Supabase." />
        <ProfileCard label="E-mail" value={settings.user?.email ?? "NÃ£o informado"} description="Usado para login e recuperaÃ§Ã£o de acesso." />
        <ProfileCard label="Perfil" value={settings.profileLabel} description={settings.isCitizen ? "Fluxo protegido de cidadÃ£o." : "OperaÃ§Ã£o jurÃ­dica e gestÃ£o da plataforma."} />
      </section>

      {settings.isLegalOperator ? (
        <form onSubmit={settings.handleSaveLawyerPublicProfile} className="mb-6 rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">Perfil pÃºblico do advogado</p>
              <h2 className="mt-2 text-2xl font-black">Foto e apresentaÃ§Ã£o para clientes</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Este perfil serÃ¡ usado como apresentaÃ§Ã£o pÃºblica do advogado para aumentar confianÃ§a comercial quando clientes visualizarem informaÃ§Ãµes profissionais.
              </p>
            </div>
            {settings.lawyerPublicProfile ? (
              <Link href={`/advogados/${settings.lawyerPublicProfile.user_id}`} className="w-fit rounded-2xl border border-teal-400/30 px-5 py-3 text-sm font-black text-teal-800 dark:text-teal-100 hover:bg-teal-400/10">
                Ver perfil pÃºblico
              </Link>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-5 text-center">
              {settings.lawyerProfilePhotoUrl ? (
                <img
                  src={settings.lawyerProfilePhotoUrl}
                  alt="Foto do perfil pÃºblico do advogado"
                  className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-teal-400/30"
                />
              ) : (
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-teal-600 text-3xl font-black text-white dark:text-slate-950">
                  {settings.fullName.slice(0, 1).toUpperCase()}
                </div>
              )}

              <label className="mt-5 block cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                Enviar foto
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={settings.handleLawyerPhotoChange}
                  className="sr-only"
                />
              </label>
              <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">PNG, JPG ou WebP atÃ© 5MB.</p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-300">Chamada profissional</span>
                <input
                  value={settings.lawyerHeadline}
                  onChange={(event) => settings.setLawyerHeadline(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-4 text-slate-950 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-300"
                  placeholder="Ex.: Advocacia previdenciÃ¡ria e bancÃ¡ria em Salvador"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-300">ApresentaÃ§Ã£o</span>
                <textarea
                  value={settings.lawyerBio}
                  onChange={(event) => settings.setLawyerBio(event.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-4 text-slate-950 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-300"
                  placeholder="Conte brevemente sua atuaÃ§Ã£o, Ã¡reas de foco e diferenciais de atendimento."
                />
              </label>

              <PreferenceToggle
                checked={settings.lawyerProfilePublic}
                description="Quando ativo, clientes podem visualizar sua foto e apresentaÃ§Ã£o profissional no perfil pÃºblico."
                label="Perfil pÃºblico visÃ­vel"
                onChange={settings.setLawyerProfilePublic}
              />

              <button
                type="submit"
                disabled={settings.savingPublicProfile}
                className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {settings.savingPublicProfile ? "Salvando..." : "Salvar perfil pÃºblico"}
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <section className="mb-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <form onSubmit={settings.handleSaveProfile} className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">Perfil</p>
          <h2 className="mt-2 text-2xl font-black">Dados e preferÃªncias</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Atualize dados bÃ¡sicos e preferÃªncias da sua conta. O e-mail de login permanece vinculado ao Supabase.
          </p>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-300">Nome completo</span>
            <input
              required
              value={settings.workingFullName}
              onChange={(event) => settings.setWorkingFullName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-4 text-slate-950 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-300"
            />
          </label>

          <div className="mt-5 space-y-3">
            <PreferenceToggle
              checked={settings.preferences.emailNotifications}
              description="Receber avisos operacionais sobre conta, documentos, crÃ©ditos e movimentaÃ§Ãµes relevantes."
              label="NotificaÃ§Ãµes por e-mail"
              onChange={(checked) => settings.updatePreference("emailNotifications", checked)}
            />
            <PreferenceToggle
              checked={settings.preferences.marketingOptIn}
              description="Receber comunicaÃ§Ãµes institucionais e novidades da plataforma."
              label="ComunicaÃ§Ãµes e novidades"
              onChange={(checked) => settings.updatePreference("marketingOptIn", checked)}
            />
          </div>

          <button
            type="submit"
            disabled={settings.savingProfile}
            className="mt-5 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white dark:text-slate-950 hover:bg-teal-500 dark:hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {settings.savingProfile ? "Salvando..." : "Salvar configuraÃ§Ãµes"}
          </button>
        </form>

        <section className="rounded-[2rem] border border-red-400/20 bg-red-500/10 p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 dark:text-red-200">Zona de risco</p>
          <h2 className="mt-2 text-2xl font-black">ExclusÃ£o da conta</h2>
          <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-100/80">
            Por seguranÃ§a jurÃ­dica, a exclusÃ£o nÃ£o Ã© instantÃ¢nea. A solicitaÃ§Ã£o entra em anÃ¡lise para tratar retenÃ§Ãµes legais, auditoria de crÃ©ditos, documentos, marketplace e histÃ³rico de atendimento.
          </p>

          {settings.pendingDeletionRequest ? (
            <div className="mt-5 rounded-2xl border border-red-200/20 bg-black/20 p-4">
              <p className="text-sm font-black text-red-700 dark:text-red-100">SolicitaÃ§Ã£o pendente</p>
              <p className="mt-2 text-xs leading-5 text-red-600 dark:text-red-100/70">
                Criada em {new Date(settings.pendingDeletionRequest.requested_at).toLocaleString("pt-BR")}.
              </p>
              <button
                type="button"
                onClick={settings.handleCancelAccountDeletion}
                disabled={settings.submittingDeletion}
                className="mt-4 rounded-2xl border border-red-200/30 px-4 py-3 text-sm font-black text-red-50 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {settings.submittingDeletion ? "Cancelando..." : "Cancelar solicitaÃ§Ã£o"}
              </button>
            </div>
          ) : (
            <div className="mt-5">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-red-700 dark:text-red-100">Motivo opcional</span>
                <textarea
                  value={settings.deletionReason}
                  onChange={(event) => settings.setDeletionReason(event.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-red-200/20 bg-slate-50 dark:bg-[#0B0F19] p-4 text-slate-950 dark:text-white outline-none focus:border-red-300"
                  placeholder="Conte brevemente por que deseja excluir a conta."
                />
              </label>
              <button
                type="button"
                onClick={settings.handleRequestAccountDeletion}
                disabled={settings.submittingDeletion}
                className="mt-4 rounded-2xl bg-red-300 px-5 py-3 text-sm font-black text-white dark:text-slate-950 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {settings.submittingDeletion ? "Enviando..." : "Solicitar exclusÃ£o da conta"}
              </button>
            </div>
          )}
        </section>
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChecklistPanel
          title={settings.isCitizen ? "Privacidade do cidadÃ£o" : "Privacidade operacional"}
          eyebrow="ProteÃ§Ã£o de dados"
          description={
            settings.isCitizen
              ? "Regras que evitam exposiÃ§Ã£o indevida da demanda apÃ³s a triagem."
              : "Controles que preservam o modelo de leads mascarados, desbloqueio por crÃ©ditos e validaÃ§Ã£o OAB."
          }
          items={settings.privacyChecklist}
        />

        <ChecklistPanel
          title="SeguranÃ§a da sessÃ£o"
          eyebrow="Conta"
          description="Sinais bÃ¡sicos de autenticaÃ§Ã£o, ambiente e proteÃ§Ã£o de rotas."
          items={settings.securityChecklist}
        />
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">Ajustes disponÃ­veis</p>
          <h2 className="mt-2 text-2xl font-black">Atalhos de configuraÃ§Ã£o</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Estes atalhos conectam o usuÃ¡rio aos mÃ³dulos que controlam sua operaÃ§Ã£o e seus dados.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SettingsShortcut href={routes.documents} label="Documentos" title="Revisar arquivos" description="Veja documentos enviados, status e complementos vinculados Ã s demandas." />
          <SettingsShortcut href={routes.dashboard} label="Portal" title="Voltar ao painel" description="Acesse a visÃ£o inicial conforme o perfil autenticado." />
          {settings.isLegalOperator ? (
            <SettingsShortcut href={routes.finance} label="CrÃ©ditos/OAB" title="Configurar operaÃ§Ã£o" description="Acompanhe saldo, solicitaÃ§Ãµes, consumo de crÃ©ditos e validaÃ§Ãµes administrativas." />
          ) : (
            <SettingsShortcut href={routes.triage} label="Triagem" title="Nova demanda" description="Organize um novo caso ou complemente uma demanda existente." />
          )}
        </div>
      </section>
    </section>
  );
}

function ProfileCard({ description, label, value }: { description: string; label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">{label}</p>
      <h2 className="mt-4 break-words text-2xl font-black">{value}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

function PreferenceToggle({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-4">
      <span>
        <span className="block text-sm font-black text-slate-950 dark:text-white">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-600 dark:text-slate-400">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 accent-teal-500"
      />
    </label>
  );
}

function ChecklistPanel({
  description,
  eyebrow,
  items,
  title,
}: {
  description: string;
  eyebrow: string;
  items: SettingsChecklistItem[];
  title: string;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/20">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-4">
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                item.done ? "bg-emerald-400 text-white dark:text-slate-950" : "bg-amber-400 text-white dark:text-slate-950"
              }`}>
                {item.done ? "âœ“" : "!"}
              </span>
              <div>
                <h3 className="font-black text-slate-950 dark:text-white">{item.label}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsShortcut({ description, href, label, title }: { description: string; href: string; label: string; title: string }) {
  return (
    <Link href={href} className="rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0B0F19] p-5 transition hover:-translate-y-0.5 hover:border-teal-400/50 hover:bg-white dark:hover:bg-white/5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">{label}</p>
      <h3 className="mt-4 text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
    </Link>
  );
}
