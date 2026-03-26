import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { useAuthContext } from "@/contexts/AuthContext"
import { api } from "@/lib/api"

type DiarioApi = {
  id: string
  texto: string
  sentimento?: string | null
  humor?: number | null
  dataRegistro?: string | null
}

type SessaoApi = {
  id: string
  data?: string | null
  status?: string | null
  modalidade?: string | null
  profissionalId?: string | null
}

export const usePatientDashboard = () => {
  const { user } = useAuthContext()

  const { data: pacienteId, isLoading: isLoadingPacienteId } = useQuery({
    queryKey: ["paciente-id", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return null
      const paciente = await api.get<{ id: string }>(`/pacientes/user/${user.id}`)
      return paciente.id
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  const moodQuery = useQuery({
    queryKey: ["diario-humor-hoje", pacienteId],
    enabled: Boolean(pacienteId),
    queryFn: async () => {
      if (!pacienteId) return null
      return api.get<DiarioApi | null>("/diario/humor-hoje", {
        query: { pacienteId },
      })
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  const sessoesQuery = useQuery({
    queryKey: ["sessoes", "paciente", pacienteId, "agendada"],
    enabled: Boolean(pacienteId),
    queryFn: async () => {
      if (!pacienteId) return [] as SessaoApi[]
      return api.get<SessaoApi[]>("/sessoes", {
        query: { pacienteId, status: "agendada", order: "asc" },
      })
    },
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  })

  const nextSession = useMemo(() => {
    const sessions = sessoesQuery.data ?? []
    return sessions[0] ?? null
  }, [sessoesQuery.data])

  return {
    moodToday: moodQuery.data ?? null,
    nextSession,
    isLoadingMoodToday: moodQuery.isLoading || isLoadingPacienteId,
    isLoadingNextSession: sessoesQuery.isLoading || isLoadingPacienteId,
  }
}
