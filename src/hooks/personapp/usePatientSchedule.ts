import { useQuery } from "@tanstack/react-query"
import { useAuthContext } from "@/contexts/AuthContext"
import { api } from "@/lib/api"

export type SessaoComRelacoes = {
  id: string
  data: string | null
  status: "agendada" | "confirmada" | "realizada" | "cancelada" | "faltou" | null
  modalidade: string | null
  duracao: number | null
  profissional: { id: string; nome: string; crp: string | null } | null
}

export const usePatientSchedule = () => {
  const { user } = useAuthContext()

  const { data: pacienteId, isLoading: isLoadingId } = useQuery({
    queryKey: ["paciente-id", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return null
      const p = await api.get<{ id: string }>(`/pacientes/user/${user.id}`)
      return p.id
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: sessoes = [], isLoading: isLoadingSessoes, refetch } = useQuery({
    queryKey: ["sessoes", "paciente", pacienteId],
    enabled: Boolean(pacienteId),
    queryFn: async () => {
      if (!pacienteId) return []
      return api.get<SessaoComRelacoes[]>("/sessoes", {
        query: { pacienteId, order: "asc" },
      })
    },
    staleTime: 30 * 1000,
  })

  return {
    pacienteId,
    sessoes,
    isLoading: isLoadingId || isLoadingSessoes,
    refetch,
  }
}
