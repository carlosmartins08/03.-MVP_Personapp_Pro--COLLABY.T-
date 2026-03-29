import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Video } from "lucide-react"

import { AppHeader, Avatar, Badge, Button, EmptyState } from "@/design-system/components"
import { DotGrid, ShapeBlob } from "@/design-system/decorations"
import { useProfessionalDashboard } from "@/hooks/personapp/useProfessionalDashboard"
import { useProfessionalSchedule } from "@/hooks/personapp/useProfessionalSchedule"

const DIAS_ABREV = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
const MESES = [
  "janeiro",
  "fevereiro",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
]

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function segundaFeira(ref: Date): Date {
  const d = new Date(ref)
  const dia = d.getDay()
  d.setDate(d.getDate() + (dia === 0 ? -6 : 1 - dia))
  d.setHours(0, 0, 0, 0)
  return d
}

function semanaIniciandoEm(segunda: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(segunda)
    d.setDate(d.getDate() + i)
    return d
  })
}

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

const ScheduleProfessionalPage = () => {
  const navigate = useNavigate()
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const [semanaBase, setSemanaBase] = useState<Date>(() => segundaFeira(hoje))
  const [diaSelecionado, setDiaSelecionado] = useState<string>(isoDate(hoje))

  const { nextSession, isLoadingNextSession } = useProfessionalDashboard()
  const { sessoes, isLoading: isLoadingSessoes } = useProfessionalSchedule()

  const diasDaSemana = useMemo(() => semanaIniciandoEm(semanaBase), [semanaBase])

  const isosSessoes = useMemo(
    () => new Set(sessoes.map((sessao) => sessao.data?.slice(0, 10)).filter(Boolean)),
    [sessoes]
  )

  const sessoesDoDia = useMemo(
    () => sessoes.filter((sessao) => sessao.data && sessao.data.slice(0, 10) === diaSelecionado),
    [diaSelecionado, sessoes]
  )

  const diaAtual = diasDaSemana.find((dia) => isoDate(dia) === diaSelecionado) ?? hoje
  const nomeDia = DIAS_ABREV[diaAtual.getDay()]
  const numeroDia = diaAtual.getDate()
  const mes = MESES[diaAtual.getMonth()]

  return (
    <div className="max-w-lg mx-auto font-manrope px-4 pb-24">
      <div className="-mx-4">
        <AppHeader variant="professional" title="Agenda" name="Rafael" />
      </div>

      {!isLoadingNextSession && nextSession && (
        <div className="relative overflow-hidden bg-ds-primary rounded-3xl p-4 text-white mt-4 shadow-ds-lg">
          <ShapeBlob
            color="currentColor"
            size={140}
            opacity={0.06}
            className="absolute -top-8 -right-8 pointer-events-none text-white"
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs font-manrope opacity-70 uppercase tracking-wider">Proxima sessao</p>
              <p className="font-sora font-semibold mt-0.5">{nextSession.patientName}</p>
              <p className="text-xs font-manrope opacity-80 mt-0.5">{nextSession.timeLabel}</p>
            </div>
            <Button
              variant="ghost"
              className="text-white border border-white/30 rounded-2xl px-3 py-1.5 text-xs font-manrope font-semibold transition-all duration-200"
              onClick={() => navigate(`/app/profissional/sala/${nextSession.title}`)}
            >
              <Video className="w-3.5 h-3.5 mr-1" />
              Iniciar
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 mb-1">
        <button
          type="button"
          onClick={() => {
            const prev = new Date(semanaBase)
            prev.setDate(prev.getDate() - 7)
            setSemanaBase(prev)
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-200 hover:bg-neutral-200"
          aria-label="Semana anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-manrope font-medium text-neutral-400 capitalize">
          {MESES[semanaBase.getMonth()]} {semanaBase.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => {
            const next = new Date(semanaBase)
            next.setDate(next.getDate() + 7)
            setSemanaBase(next)
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-200 hover:bg-neutral-200"
          aria-label="Proxima semana"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mt-4 scrollbar-hide -mx-4 px-4">
        {diasDaSemana.map((dia) => {
          const iso = isoDate(dia)
          const selecionado = diaSelecionado === iso
          const ehHoje = iso === isoDate(hoje)
          return (
            <button
              type="button"
              key={iso}
              onClick={() => setDiaSelecionado(iso)}
              className={[
                "flex flex-col items-center min-w-[52px] rounded-2xl py-3 px-2 transition-all duration-200",
                selecionado
                  ? "bg-ds-primary text-white shadow-ds-md scale-105"
                  : ehHoje
                    ? "bg-white border border-ds-primary/30 shadow-ds-sm text-ds-primary hover:border-ds-primary/40"
                    : "bg-white border border-neutral-100 shadow-ds-sm text-neutral-300 hover:border-ds-primary/30",
              ].join(" ")}
            >
              <span className="text-xs font-manrope font-semibold uppercase">{DIAS_ABREV[dia.getDay()]}</span>
              <span className="text-xl font-sora font-bold mt-0.5">{dia.getDate()}</span>
              {isosSessoes.has(iso) && (
                <div className={`w-1.5 h-1.5 rounded-full mt-1 ${selecionado ? "bg-white" : "bg-ds-primary"}`} />
              )}
            </button>
          )
        })}
      </div>

      <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mt-6 mb-3">
        {nomeDia}, {numeroDia} de {mes}
      </p>

      {isLoadingSessoes ? (
        <p className="text-sm font-manrope text-neutral-300 text-center py-6">Carregando agenda...</p>
      ) : sessoesDoDia.length > 0 ? (
        <div className="flex flex-col gap-3">
          {sessoesDoDia.map((sessao) => {
            const horario = sessao.data
              ? new Date(sessao.data).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"
            return (
              <div
                key={sessao.id}
                className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-ds-primary font-sora font-bold text-xl">{horario}</span>
                  <Badge
                    variant={
                      sessao.status === "agendada" || sessao.status === "confirmada"
                        ? "info"
                        : sessao.status === "realizada"
                          ? "success"
                          : "error"
                    }
                  >
                    {{
                      agendada: "Agendada",
                      confirmada: "Confirmada",
                      realizada: "Realizada",
                      cancelada: "Cancelada",
                      faltou: "Faltou",
                    }[sessao.status ?? "agendada"] ?? "Agendada"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar fallback={iniciais(sessao.paciente?.nome ?? "?")} size="sm" />
                    <div>
                      <p className="text-sm font-manrope font-semibold text-neutral-500">
                        {sessao.paciente?.nome ?? "Paciente"}
                      </p>
                      <p className="text-xs font-manrope text-neutral-300">
                        {sessao.modalidade === "online" ? "Online" : "Presencial"}
                        {sessao.duracao ? ` · ${sessao.duracao}min` : ""}
                      </p>
                    </div>
                  </div>
                  {(sessao.status === "agendada" || sessao.status === "confirmada") && (
                    <Button
                      variant="primary"
                      className="rounded-2xl h-11 font-manrope font-semibold transition-all duration-200 shadow-ds-sm hover:shadow-ds-md"
                      onClick={() => navigate(`/app/profissional/sala/${sessao.id}`)}
                    >
                      Iniciar
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-ds-accent-sky/30 rounded-3xl p-6">
          <EmptyState
            title="Nenhuma sessao neste dia"
            description="Voce nao tem sessoes agendadas para esta data."
          />
        </div>
      )}
    </div>
  )
}

export default ScheduleProfessionalPage
