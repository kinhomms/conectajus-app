"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { routes } from "@/lib/routes";
import { getLawyerPublicProfile } from "@/features/settings/services/settings.service";
import type { LawyerPublicProfile } from "@/features/settings/repositories/settings.repository";

export function PublicLawyerProfileWorkspace({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<LawyerPublicProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await getLawyerPublicProfile(userId);

      if (!error) {
        setProfile(data ?? null);
      }

      setLoading(false);
    }

    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB] text-[#07182F]">
        <p className="font-black">Carregando perfil...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#F5F7FB] px-6 py-10 text-[#07182F]">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227]">Perfil público</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">Perfil indisponível</h1>
          <p className="mt-4 leading-7 text-slate-600">
            Este advogado ainda não publicou um perfil público ou o perfil foi desativado.
          </p>
          <Link href={routes.home} className="mt-6 inline-flex rounded-2xl bg-[#07182F] px-5 py-3 text-sm font-black text-white">
            Voltar ao início
          </Link>
        </div>
      </main>
    );
  }

  const oab = [profile.oab_state, profile.oab_number].filter(Boolean).join(" ");

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-6 py-10 text-[#07182F]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link href={routes.home} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50">
            Início
          </Link>
          <Link href={routes.triage} className="rounded-2xl bg-[#C9A227] px-4 py-2 text-sm font-black text-[#07182F]">
            Iniciar triagem
          </Link>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          <div className="bg-[#07182F] p-8 text-white md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#C9A227]">Advogado ConectaJus</p>
            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
              {profile.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt={`Foto de ${profile.full_name}`}
                  className="h-36 w-36 rounded-full object-cover ring-4 ring-[#C9A227]/40"
                />
              ) : (
                <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#C9A227] text-5xl font-black text-[#07182F]">
                  {profile.full_name.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div>
                <h1 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">{profile.full_name}</h1>
                <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-300">
                  {profile.headline ?? "Advogado parceiro ConectaJus."}
                </p>
                {oab ? (
                  <span className="mt-4 inline-flex rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-2 text-sm font-black text-[#F7D46A]">
                    OAB {oab}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-8 md:p-10 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227]">Apresentação</p>
              <h2 className="mt-2 text-2xl font-black">Sobre o atendimento</h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                {profile.bio ?? "Perfil profissional em construção."}
              </p>
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-black">Precisa de orientação?</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A ConectaJus organiza sua demanda por triagem inteligente antes de liberar dados pessoais no Marketplace.
              </p>
              <Link href={routes.triage} className="mt-5 inline-flex w-full justify-center rounded-2xl bg-[#07182F] px-5 py-3 text-sm font-black text-white">
                Fazer triagem
              </Link>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
