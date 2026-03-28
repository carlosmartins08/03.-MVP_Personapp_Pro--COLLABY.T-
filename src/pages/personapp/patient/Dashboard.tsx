import React from "react"
import { useNavigate } from "react-router-dom"

import { AppHeader, Badge, Button, Card, EmptyState } from "@/design-system/components"
import { moodMeta, useMoodCheckIn } from "@/hooks/personapp/useMoodCheckIn"
import { usePatientDashboard } from "@/hooks/personapp/usePatientDashboard"

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

const DashboardPage = () => {
  const navigate = useNavigate()
  const { entry } = useMoodCheckIn()
  const { nextSession, isLoadingNextSession } = usePatientDashboard()

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

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto px-4 pb-24">
      <AppHeader variant="patient" name="Maria" date={new Date()} notificationCount={1} />

      {isLoadingNextSession ? (
        <Card className="p-5">
          <div className="text-sm text-neutral-300">Carregando próxima sessão...</div>
        </Card>
      ) : nextSession ? (
        <div className="bg-ds-primary rounded-2xl p-5 text-white">
          <p className="text-xs font-medium uppercase tracking-wider opacity-75">
            Próxima sessão
          </p>
          <p className="text-xl font-bold mt-1">Seu profissional</p>
          <p className="text-sm opacity-90 mt-0.5">{sessionDateLabel}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
              {modalityLabel}
            </span>
            <Button
              variant="ghost"
              className="text-white text-sm p-0"
              onClick={() => navigate("/app/paciente/sessoes")}
            >
              Ver detalhes →
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-5 border border-neutral-100">
          <EmptyState
            title="Nenhuma sessão agendada"
            action={
              <Button variant="primary" size="sm" onClick={() => navigate("/app/paciente/sessoes")}>
                Agendar agora
              </Button>
            }
          />
        </Card>
      )}

      <div className="bg-ds-surface-dark rounded-2xl p-5 text-white">
        <p className="text-sm opacity-75">Como você está agora?</p>
        <div className="flex gap-3 mt-3 justify-between">
          {[
            { emoji: "😔", label: "Muito mal" },
            { emoji: "😟", label: "Ansioso" },
            { emoji: "😐", label: "Neutro" },
            { emoji: "🙂", label: "Bem" },
            { emoji: "😊", label: "Ótimo" },
          ].map((item) => (
            <button
              key={item.label}
              className="flex flex-col items-center gap-1 flex-1 bg-white/10 rounded-xl py-3 hover:bg-white/20 transition-colors"
              onClick={() => navigate("/app/paciente/humor")}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs opacity-75">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Card className="p-5 border border-neutral-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-neutral-300">
              Último registro
            </p>
            <p className="mt-2 text-sm text-neutral-400 line-clamp-2">
              {entry?.texto || "Nenhum registro ainda."}
            </p>
          </div>
          {entry && (
            <Badge variant="neutral" size="sm">
              {moodLabel}
            </Badge>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" className="p-0 text-sm" onClick={() => navigate("/app/paciente/diario")}>
            Ver diário →
          </Button>
        </div>
      </Card>

      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-neutral-300 mb-3">
          Ações rápidas
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Registrar", emoji: "📝", onClick: () => navigate("/app/paciente/diario") },
            { label: "Sessões", emoji: "📅", onClick: () => navigate("/app/paciente/sessoes") },
            { label: "Suporte", emoji: "⚠️", onClick: () => navigate("/app/paciente/suporte") },
          ].map((item) => (
            <button
              key={item.label}
              className="bg-neutral-50 rounded-xl py-4 flex flex-col items-center gap-2 text-xs font-medium text-neutral-300"
              onClick={item.onClick}
            >
              <span className="text-lg">{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
