import { useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { AppHeader, Avatar, Badge, Button, EmptyState } from "@/design-system/components"
import { usePatientSchedule, type SessaoComRelacoes } from "@/hooks/personapp/usePatientSchedule"
import { api } from "@/lib/api"

type Sessao = SessaoComRelacoes

const DIAS_ABREV = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
const MESES = [
  "janeiro",
  "fevereiro",
  "março",
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

function iniciais(nome?: string) {
  if (!nome) return "?"
  return nome
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase()
}

function isoDate(data: Date) {
  return data.toISOString().slice(0, 10)
}

function isHoje(iso: string) {
  return iso === isoDate(new Date())
}

function semanaIniciandoEm(segunda: Date): Date[] {
  return Array.from({ length: 7 }, (_, index) => {
    const dia = new Date(segunda)
    dia.setDate(dia.getDate() + index)
    return dia
  })
}

function segundaFeira(dataRef: Date): Date {
  const data = new Date(dataRef)
  const diaDaSemana = data.getDay()
  const diff = diaDaSemana === 0 ? -6 : 1 - diaDaSemana
  data.setDate(data.getDate() + diff)
  data.setHours(0, 0, 0, 0)
  return data
}

const SchedulePage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { sessoes, isLoading, pacienteId } = usePatientSchedule()
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const [semanaBase, setSemanaBase] = useState<Date>(() => segundaFeira(hoje))
  const [diaSelecionado, setDiaSelecionado] = useState<string>(isoDate(hoje))

  const diasDaSemana = useMemo(() => semanaIniciandoEm(semanaBase), [semanaBase])

  const sessoesDoDia = useMemo(
    () => sessoes.filter((sessao) => sessao.data && sessao.data.slice(0, 10) === diaSelecionado),
    [diaSelecionado, sessoes]
  )

  const isosSessoes = useMemo(
    () => new Set(sessoes.map((sessao) => sessao.data?.slice(0, 10)).filter(Boolean)),
    [sessoes]
  )

  const diaAtual = diasDaSemana.find((dia) => isoDate(dia) === diaSelecionado) ?? hoje
  const nomeDia = DIAS_ABREV[diaAtual.getDay()]
  const numeroDia = diaAtual.getDate()
  const mes = MESES[diaAtual.getMonth()]

  const confirmarSessao = useMutation({
    mutationFn: async (sessaoId: string) => {
      await api.patch(`/sessoes/${sessaoId}/confirmar`)
      return sessaoId
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sessoes", "paciente", pacienteId],
      })
    },
  })

  function badgeVariant(status: Sessao["status"]) {
    if (status === "agendada" || status === "confirmada") return "info" as const
    if (status === "realizada") return "success" as const
    return "error" as const
  }

  const statusLabel: Record<string, string> = {
    agendada: "Agendada",
    confirmada: "Confirmada",
    realizada: "Realizada",
    cancelada: "Cancelada",
    faltou: "Faltou",
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-manrope">
        <div className="lg:max-w-3xl lg:mx-auto">
          <AppHeader variant="patient" title="Agenda" className="lg:px-8" />
          <div className="px-4 pb-28 lg:px-8">
            <div className="mt-8 text-center text-neutral-300 text-sm font-manrope">
              Carregando agenda...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="lg:max-w-3xl lg:mx-auto">
        <AppHeader variant="patient" title="Agenda" className="lg:px-8" />

        <div className="px-4 pb-28 lg:px-8">
          <div className="flex items-center justify-between mt-4 mb-1">
        <button
          type="button"
          onClick={() => {
            const anterior = new Date(semanaBase)
            anterior.setDate(anterior.getDate() - 7)
            setSemanaBase(anterior)
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
            const proxima = new Date(semanaBase)
            proxima.setDate(proxima.getDate() + 7)
            setSemanaBase(proxima)
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-200 hover:bg-neutral-200"
          aria-label="Próxima semana"
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
                <div
                  className={[
                    "w-1.5 h-1.5 rounded-full mt-1",
                    selecionado ? "bg-white" : "bg-ds-primary",
                  ].join(" ")}
                />
              )}
            </button>
          )
        })}
      </div>

      <p className="text-xs font-manrope font-semibold uppercase tracking-widest text-neutral-300 mt-6 mb-3">
        {nomeDia}, {numeroDia} de {mes}
      </p>

      {sessoesDoDia.length > 0 ? (
        <div className="flex flex-col gap-3">
          {sessoesDoDia.map((sessao) => {
            const horario = sessao.data
              ? new Date(sessao.data).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"

            const confirmandoSessaoAtual =
              confirmarSessao.isPending && confirmarSessao.variables === sessao.id

            return (
              <div
                key={sessao.id}
                className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-ds-primary font-sora font-bold text-xl">{horario}</span>
                  <Badge variant={badgeVariant(sessao.status)}>
                    {statusLabel[sessao.status ?? "agendada"] ?? "Agendada"}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar fallback={iniciais(sessao.profissional?.nome)} size="sm" />
                  <div>
                    <p className="text-sm font-manrope font-semibold text-neutral-400">
                      {sessao.profissional?.nome ?? "Profissional"}
                    </p>
                    <p className="text-xs font-manrope text-neutral-300">
                      {sessao.modalidade === "online" ? "Online" : "Presencial"}
                      {sessao.duracao ? ` \u00B7 ${sessao.duracao}min` : ""}
                    </p>
                  </div>
                </div>

                {sessao.status === "agendada" && (
                  <Button
                    variant="secondary"
                    className="w-full mt-3 h-12 rounded-2xl font-manrope font-semibold shadow-ds-sm transition-all duration-200"
                    onClick={() => confirmarSessao.mutate(sessao.id)}
                    disabled={confirmarSessao.isPending}
                  >
                    {confirmandoSessaoAtual ? "Confirmando..." : "Confirmar presença"}
                  </Button>
                )}

                {sessao.status === "confirmada" && isHoje(diaSelecionado) && (
                  <Button
                    variant="primary"
                    className="w-full mt-3 h-12 rounded-2xl font-manrope font-semibold transition-all duration-200 shadow-ds-sm hover:shadow-ds-md"
                    onClick={() => navigate(`/app/paciente/consulta/${sessao.id}`)}
                  >
                    Entrar na sessão
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-ds-accent-sky/50 rounded-3xl p-6 mt-2">
          <EmptyState
            icon={<Calendar className="w-8 h-8" />}
            title="Nenhuma sessão neste dia"
            description="Você não tem sessões agendadas para esta data."
            action={
              <Button
                variant="secondary"
                className="h-12 rounded-2xl font-manrope font-semibold shadow-ds-sm transition-all duration-200"
                onClick={() => navigate("/app/paciente/profissionais")}
              >
                Agendar sessão
              </Button>
            }
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate("/app/paciente/profissionais")}
        className="fixed bottom-20 right-4 z-10 bg-ds-primary text-white w-14 h-14 rounded-full shadow-ds-lg flex items-center justify-center transition-all duration-200 hover:shadow-ds-lg hover:scale-105 active:scale-95"
        aria-label="Agendar nova sessão"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
    </div>
  </div>
  )
}

export default SchedulePage
