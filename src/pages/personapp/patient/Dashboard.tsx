import React from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import { useAuthContext } from "@/contexts/AuthContext"
import { DotGrid, LineAbstract, ShapeBlob } from "@/design-system/decorations"
import { AppHeader } from "@/design-system/components"
import { useVinculoPaciente } from "@/hooks/useVinculo"
import { useMoodCheckIn, moodMeta } from "@/hooks/personapp/useMoodCheckIn"
import { usePatientDashboard } from "@/hooks/personapp/usePatientDashboard"
import { useMeuPlano } from "@/hooks/usePlanoTratamento"
import { api } from "@/lib/api"

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value))
  } catch {
    return ""
  }
}

type ProfissionalResumo = {
  id: string
  nome: string
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { entry } = useMoodCheckIn()
  const { nextSession, isLoadingNextSession } = usePatientDashboard()
  const { data: plano } = useMeuPlano()

  const { data: pacienteData } = useQuery({
    queryKey: ["paciente-dados", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return null
      return api.get<{ id: string; nome: string }>(`/pacientes/user/${user.id}`)
    },
    staleTime: 5 * 60 * 1000,
  })
  const pacienteId = pacienteData?.id ?? null

  const { data: vinculos = [] } = useVinculoPaciente(pacienteId ?? undefined)
  const vinculoAtivo = vinculos.find((vinculo) => vinculo.status === "ATIVO")

  const { data: profissionalVinculado } = useQuery({
    queryKey: ["dashboard-profissional-vinculado", vinculoAtivo?.profissionalId],
    enabled: Boolean(vinculoAtivo?.profissionalId),
    queryFn: async () => {
      if (!vinculoAtivo?.profissionalId) return null
      return api.get<ProfissionalResumo>(`/profissionais/${vinculoAtivo.profissionalId}`)
    },
    staleTime: 5 * 60 * 1000,
  })

  const dateLabel = entry?.createdAt ? formatDate(entry.createdAt) : ""
  const sessionDate = nextSession?.data ? new Date(nextSession.data) : null
  const sessionDateLabel = sessionDate
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(sessionDate)
    : ""
  const modalityLabel = nextSession?.modalidade
    ? nextSession.modalidade.charAt(0).toUpperCase() + nextSession.modalidade.slice(1)
    : "Online"

  // keep moodMeta in scope
  void moodMeta

  return (
    <div className="min-h-screen bg-white font-manrope lg:max-w-2xl lg:mx-auto">
      <AppHeader variant="patient" name={pacienteData?.nome ?? ""} date={new Date()} />

      <div className="px-4 pb-28 space-y-4 mt-4">
        {isLoadingNextSession ? (
          <div className="h-36 bg-neutral-100 rounded-3xl animate-pulse" />
        ) : nextSession ? (
          <div className="relative overflow-hidden bg-ds-primary rounded-3xl p-6 text-white shadow-ds-lg">
            <ShapeBlob
              color="currentColor"
              size={180}
              opacity={0.06}
              className="absolute -top-10 -right-10 pointer-events-none text-white"
            />
            <LineAbstract
              color="currentColor"
              opacity={0.1}
              className="absolute bottom-3 right-4 pointer-events-none text-white"
            />
            <div className="relative z-10">
              <p className="text-xs font-manrope font-semibold uppercase tracking-widest text-white/50">
                Próxima sessão
              </p>
              <p className="text-2xl font-sora font-bold mt-2 text-white leading-tight">
                {profissionalVinculado?.nome ?? "Seu profissional"}
              </p>
              <p className="text-sm font-manrope text-white/70 mt-1">{sessionDateLabel}</p>
              <div className="flex items-center justify-between mt-5">
                <span className="text-xs font-manrope bg-white/20 px-3 py-1.5 rounded-full font-medium">
                  {modalityLabel}
                </span>
                <button
                  onClick={() => navigate("/app/paciente/agenda")}
                  className="text-xs font-manrope text-white/80 underline underline-offset-2"
                >
                  Ver detalhes →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-ds-primary/10 border-2 border-dashed border-ds-primary/30 rounded-3xl p-6">
            <p className="text-sm font-manrope font-medium text-ds-primary">
              Nenhuma sessão agendada
            </p>
            <button
              onClick={() => navigate("/app/paciente/profissionais")}
              className="mt-3 text-xs font-manrope font-semibold text-white bg-ds-primary px-4 py-2 rounded-full transition-all duration-200"
            >
              Encontrar profissional →
            </button>
          </div>
        )}

        <div className="relative overflow-hidden bg-ds-surface-dark rounded-3xl p-5 shadow-ds-md">
          <DotGrid
            color="currentColor"
            opacity={0.05}
            cols={8}
            rows={3}
            className="absolute top-2 right-2 pointer-events-none text-white"
          />
          <div className="relative z-10">
            <p className="text-sm font-manrope font-medium text-white/70">Como você está agora?</p>
            <div className="flex gap-2 mt-3">
              {[
                { emoji: "😔", label: "Muito mal" },
                { emoji: "😟", label: "Ansioso" },
                { emoji: "😐", label: "Neutro" },
                { emoji: "🙂", label: "Bem" },
                { emoji: "😊", label: "Ótimo" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate("/app/paciente/humor")}
                  className="flex-1 flex flex-col items-center gap-1.5 bg-white/10 rounded-2xl py-3 hover:bg-white/20 active:scale-95 transition-all duration-200"
                >
                  <span className="text-2xl leading-none">{item.emoji}</span>
                  <span className="text-[10px] font-manrope text-white/60 leading-none">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Registrar",
              emoji: "📓",
              href: "/app/paciente/diario",
              bg: "bg-ds-accent-mint",
              border: "border-emerald-100",
            },
            {
              label: "Agenda",
              emoji: "📅",
              href: "/app/paciente/agenda",
              bg: "bg-ds-accent-sky",
              border: "border-blue-100",
            },
            {
              label: "Profissional",
              emoji: "🩺",
              href: "/app/paciente/profissionais",
              bg: "bg-ds-accent-peach",
              border: "border-orange-100",
            },
          ].map((acao) => (
            <button
              key={acao.label}
              onClick={() => navigate(acao.href)}
              className={`flex flex-col items-center gap-2 py-5 rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-ds-sm ${acao.bg} ${acao.border}`}
            >
              <span className="text-2xl leading-none">{acao.emoji}</span>
              <span className="text-xs font-manrope font-semibold text-neutral-500">
                {acao.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/app/paciente/diario")}
          className="w-full bg-white rounded-3xl p-5 border border-neutral-100 shadow-ds-card text-left transition-all duration-200 hover:shadow-ds-md active:scale-[0.99]"
        >
          <p className="text-xs font-manrope font-semibold uppercase tracking-widest text-neutral-300">
            Último registro
          </p>
          <p className="text-sm font-manrope text-neutral-400 leading-relaxed mt-2 line-clamp-2">
            {entry?.texto ?? "Nenhum registro ainda."}
          </p>
          {entry && (
            <p className="text-xs font-manrope text-neutral-300 mt-2">{dateLabel}</p>
          )}
          <p className="text-xs font-manrope text-ds-primary mt-3 font-medium">Ver diário →</p>
        </button>

        {plano && (
          <button
            onClick={() => navigate("/app/paciente/meu-plano")}
            className="w-full bg-ds-accent-lavender rounded-3xl p-5 border border-purple-100 text-left shadow-ds-sm transition-all duration-200 hover:shadow-ds-md active:scale-[0.99]"
          >
            <p className="text-xs font-manrope font-semibold uppercase tracking-widest text-purple-400">
              Plano terapêutico
            </p>
            <p className="text-base font-sora font-semibold text-neutral-400 mt-1">
              {plano.abordagem}
            </p>
            <p className="text-xs font-manrope text-neutral-300 mt-0.5">
              {plano.frequencia}
              {plano.duracaoPrevista ? ` · ${plano.duracaoPrevista}` : ""}
            </p>
          </button>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
