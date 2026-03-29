import React from "react"
import { useQuery } from "@tanstack/react-query"
import { BookOpen, Calendar, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuthContext } from "@/contexts/AuthContext"
import { DotGrid, LineAbstract, ShapeBlob } from "@/design-system/decorations"
import { AppHeader, Badge, Button, Card, EmptyState } from "@/design-system/components"
import { useVinculoPaciente } from "@/hooks/useVinculo"
import { moodMeta, useMoodCheckIn } from "@/hooks/personapp/useMoodCheckIn"
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

  const { data: pacienteId } = useQuery({
    queryKey: ["paciente-id", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return null
      const paciente = await api.get<{ id: string }>(`/pacientes/user/${user.id}`)
      return paciente.id
    },
    staleTime: 5 * 60 * 1000,
  })

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

  const moodLabel = entry ? moodMeta[entry.value].label : "Sem registro"
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

  const quickActions = [
    {
      label: "Novo registro",
      icon: <BookOpen className="w-5 h-5" />,
      href: "/app/paciente/diario",
      bg: "bg-ds-accent-mint",
      color: "text-ds-success",
    },
    {
      label: "Sessoes",
      icon: <Calendar className="w-5 h-5" />,
      href: "/app/paciente/sessoes",
      bg: "bg-ds-accent-sky",
      color: "text-ds-primary",
    },
    {
      label: "Suporte",
      icon: <Heart className="w-5 h-5" />,
      href: "/app/paciente/suporte",
      bg: "bg-ds-accent-peach",
      color: "text-ds-error",
    },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto px-4 pb-24 font-manrope">
      <AppHeader variant="patient" name="Maria" date={new Date()} />

      {isLoadingNextSession ? (
        <Card className="p-5 border border-neutral-100 shadow-ds-card">
          <div className="text-sm font-manrope text-neutral-300">Carregando proxima sessao...</div>
        </Card>
      ) : nextSession ? (
        <div className="relative overflow-hidden bg-ds-primary rounded-3xl p-5 text-white mt-4 shadow-ds-lg">
          <ShapeBlob
            color="currentColor"
            size={160}
            opacity={0.06}
            className="absolute -top-8 -right-8 pointer-events-none text-white"
          />
          <LineAbstract
            color="currentColor"
            opacity={0.1}
            className="absolute bottom-2 right-4 pointer-events-none text-white"
          />

          <div className="relative z-10">
            <p className="text-xs font-manrope font-medium uppercase tracking-wider text-white/60">
              Proxima sessao
            </p>
            <p className="text-xl font-sora font-bold mt-1 text-white">
              {profissionalVinculado?.nome ?? "Seu profissional"}
            </p>
            <p className="text-sm font-manrope text-white/80 mt-0.5">{sessionDateLabel}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs font-manrope bg-white/20 px-3 py-1 rounded-full">
                {modalityLabel}
              </span>
              <Button
                variant="ghost"
                className="text-white text-sm p-0 font-manrope transition-all duration-200 hover:opacity-90"
                onClick={() => navigate("/app/paciente/sessoes")}
              >
                Ver detalhes ?
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-5 border border-neutral-100 shadow-ds-card">
          <EmptyState
            title="Nenhuma sessao agendada"
            action={
              <Button variant="primary" size="sm" onClick={() => navigate("/app/paciente/sessoes")}>
                Agendar agora
              </Button>
            }
          />
        </Card>
      )}

      {!vinculoAtivo && (
        <button
          type="button"
          onClick={() => navigate("/app/paciente/profissionais")}
          className="w-full border-2 border-dashed border-ds-primary/30 rounded-2xl p-4 text-center mt-3 transition-all duration-200 hover:border-ds-primary/60 hover:bg-ds-accent-sky/50"
        >
          <p className="text-sm font-manrope font-medium text-ds-primary">+ Encontrar meu profissional</p>
          <p className="text-xs font-manrope text-neutral-300 mt-0.5">
            Conecte-se a um psicologo para comecar
          </p>
        </button>
      )}

      {plano && (
        <button
          type="button"
          onClick={() => navigate("/app/paciente/meu-plano")}
          className="w-full bg-white rounded-2xl p-4 border border-neutral-100 text-left shadow-ds-card transition-all duration-200 hover:shadow-ds-md hover:border-ds-primary/30 cursor-pointer"
        >
          <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mb-1">
            Seu plano terapeutico
          </p>
          <p className="text-sm font-manrope text-neutral-400 leading-relaxed">{plano.abordagem}</p>
          <p className="text-xs font-manrope text-neutral-300 mt-0.5">
            {plano.frequencia}
            {plano.duracaoPrevista ? ` · ${plano.duracaoPrevista}` : ""}
          </p>
        </button>
      )}

      <div className="relative overflow-hidden bg-ds-surface-dark rounded-3xl p-5 text-white mt-3 shadow-ds-md">
        <DotGrid
          color="currentColor"
          opacity={0.06}
          cols={8}
          rows={3}
          className="absolute top-2 right-2 pointer-events-none text-white"
        />

        <div className="relative z-10">
          <p className="text-sm font-manrope text-white/75">Como voce esta agora?</p>
          <div className="flex gap-3 mt-3 justify-between">
            {[
              { emoji: "??", label: "Muito mal" },
              { emoji: "??", label: "Ansioso" },
              { emoji: "??", label: "Neutro" },
              { emoji: "??", label: "Bem" },
              { emoji: "??", label: "Otimo" },
            ].map((item) => (
              <button
                key={item.label}
                className="flex flex-col items-center gap-1 flex-1 bg-white/10 rounded-xl py-3 hover:bg-white/20 transition-all duration-200"
                onClick={() => navigate("/app/paciente/humor")}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-manrope opacity-75">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Ultimo registro
            </p>
            <p className="mt-2 text-sm font-manrope text-neutral-400 leading-relaxed line-clamp-2">
              {entry?.texto || "Nenhum registro ainda."}
            </p>
            {dateLabel && (
              <p className="mt-1 text-xs font-manrope text-neutral-300">
                {dateLabel}
              </p>
            )}
          </div>
          {entry && (
            <Badge variant="neutral" size="sm">
              {moodLabel}
            </Badge>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost"
            className="p-0 text-sm font-manrope transition-all duration-200"
            onClick={() => navigate("/app/paciente/diario")}
          >
            Ver diario ?
          </Button>
        </div>
      </Card>

      <div>
        <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mt-5 mb-3">
          Acoes rapidas
        </p>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((acao) => (
            <button
              key={acao.label}
              type="button"
              onClick={() => navigate(acao.href)}
              className={`flex flex-col items-center gap-2 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-ds-sm ${acao.bg}`}
            >
              <span className={acao.color}>{acao.icon}</span>
              <span className="text-xs font-manrope font-medium text-neutral-400">{acao.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
