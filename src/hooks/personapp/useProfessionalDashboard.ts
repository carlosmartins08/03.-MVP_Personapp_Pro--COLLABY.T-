import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { useAuthContext } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import type { ApproachKey } from "@/design-system"

type DashboardAnalytics = {
  totalSessions: number
  totalAbsences: number
  todaySessions: number
  weeklySessionsData: Array<{ name: string; total: number }>
}

type PacienteApi = {
  id: string
  nome: string
  statusRanqueado?: string | null
  especialidade?: string | null
  criadoEm?: string | null
}

type SessaoApi = {
  id: string
  data?: string | null
  status?: string | null
  pacienteId?: string | null
}

const approachLabelToKey: Record<string, ApproachKey> = {
  psicanalise: "psicanalise",
  behaviorismo: "behaviorismo",
  humanismo: "humanismo",
  cognitivismo: "cognitivismo",
  "psicologia positiva": "psicPositiva",
  psicpositiva: "psicPositiva",
  neuropsicologia: "neuropsicologia",
  sistemica: "sistemica",
  transpessoal: "transpessoal",
}

const approachKeyToLabel: Record<ApproachKey, string> = {
  psicanalise: "Psicanalise",
  behaviorismo: "Behaviorismo",
  humanismo: "Humanismo",
  cognitivismo: "Cognitivismo",
  psicPositiva: "Psicologia Positiva",
  neuropsicologia: "Neuropsicologia",
  sistemica: "Sistemica",
  transpessoal: "Transpessoal",
}

const fallbackApproaches: Array<{ approach: ApproachKey; patientsCount: number }> = [
  { approach: "psicanalise", patientsCount: 12 },
  { approach: "cognitivismo", patientsCount: 8 },
  { approach: "humanismo", patientsCount: 5 },
]

const parseApproaches = (value?: string | null) => {
  if (!value) return [] as ApproachKey[]
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .map((item) => approachLabelToKey[item])
    .filter(Boolean) as ApproachKey[]
}

const statusLabelMap: Record<string, { label: string; variant: "success" | "warning" | "error" | "neutral" }> = {
  normal: { label: "Normal", variant: "success" },
  faltas_frequentes: { label: "Faltas", variant: "warning" },
  inadimplente: { label: "Inadimplente", variant: "error" },
  intensivo: { label: "Intensivo", variant: "warning" },
}

const mapSessionStatus = (status?: string | null) => {
  switch (status) {
    case "confirmada":
      return "confirmed" as const
    case "realizada":
    case "cancelada":
    case "faltou":
      return "ended" as const
    case "agendada":
    default:
      return "pending" as const
  }
}

const formatSessionDate = (value?: string | null) => {
  if (!value) return ""
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

const formatSessionTime = (value?: string | null) => {
  if (!value) return ""
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value))
  } catch {
    return value
  }
}

export const useProfessionalDashboard = () => {
  const { user } = useAuthContext()
  const profissionalId = user?.id

  const dashboardQuery = useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: () => api.get<DashboardAnalytics>("/analytics/dashboard"),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  const pacientesQuery = useQuery({
    queryKey: ["pacientes"],
    queryFn: () => api.get<PacienteApi[]>("/pacientes"),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  const sessoesQuery = useQuery({
    queryKey: ["sessoes", "profissional", profissionalId, "agendada"],
    enabled: Boolean(profissionalId),
    queryFn: () =>
      api.get<SessaoApi[]>("/sessoes", {
        query: { profissionalId, status: "agendada", order: "asc" },
      }),
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  })

  const metrics = useMemo(() => {
    const totalPatients = pacientesQuery.data?.length ?? 0
    const sessionsToday = dashboardQuery.data?.todaySessions ?? 0
    const weeklyData = dashboardQuery.data?.weeklySessionsData ?? []
    const sessionsThisWeek = weeklyData.length
      ? weeklyData[weeklyData.length - 1].total
      : 0

    return { totalPatients, sessionsThisWeek, sessionsToday }
  }, [dashboardQuery.data, pacientesQuery.data])

  const approachCards = useMemo(() => {
    const patients = pacientesQuery.data ?? []
    const counts = new Map<ApproachKey, number>()

    patients.forEach((patient) => {
      parseApproaches(patient.especialidade).forEach((approach) => {
        counts.set(approach, (counts.get(approach) ?? 0) + 1)
      })
    })

    if (counts.size === 0) return fallbackApproaches

    return Array.from(counts.entries()).map(([approach, patientsCount]) => ({
      approach,
      patientsCount,
    }))
  }, [pacientesQuery.data])

  const recentPatients = useMemo(() => {
    const patients = [...(pacientesQuery.data ?? [])]
    patients.sort((a, b) => {
      const aTime = a.criadoEm ? new Date(a.criadoEm).getTime() : 0
      const bTime = b.criadoEm ? new Date(b.criadoEm).getTime() : 0
      return bTime - aTime
    })

    return patients.slice(0, 5).map((patient, index) => {
      const approaches = parseApproaches(patient.especialidade)
      const approachLabel = approaches[0] ? approachKeyToLabel[approaches[0]] : null

      return {
        ...patient,
        sessionLabel: `Sessao ${index + 1} · ${approachLabel ?? "Geral"}`,
        status: statusLabelMap[patient.statusRanqueado ?? ""] ?? {
          label: "Normal",
          variant: "neutral" as const,
        },
      }
    })
  }, [pacientesQuery.data])

  const nextSession = useMemo(() => {
    const sessions = sessoesQuery.data ?? []
    if (!sessions.length) return null

    const session = sessions[0]
    const patientsById = new Map(
      (pacientesQuery.data ?? []).map((patient) => [patient.id, patient])
    )
    const patient = session.pacienteId ? patientsById.get(session.pacienteId) : null

    return {
      status: mapSessionStatus(session.status),
      title: "Proxima sessao",
      patientName: patient?.nome ?? "Paciente",
      dateLabel: formatSessionDate(session.data),
      timeLabel: formatSessionTime(session.data) || "--:--",
    }
  }, [sessoesQuery.data, pacientesQuery.data])

  return {
    metrics,
    approachCards,
    recentPatients,
    nextSession,
    isLoadingMetrics: dashboardQuery.isLoading || pacientesQuery.isLoading,
    isLoadingApproaches: pacientesQuery.isLoading,
    isLoadingNextSession: sessoesQuery.isLoading,
    isLoadingPatients: pacientesQuery.isLoading,
  }
}
