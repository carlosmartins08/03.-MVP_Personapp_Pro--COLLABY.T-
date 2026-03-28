import { useQuery } from "@tanstack/react-query"
import { useAuthContext } from "@/contexts/AuthContext"
import { api } from "@/lib/api"

export type SessaoProfissional = {
  id: string
  data: string | null
  status: "agendada" | "confirmada" | "realizada" | "cancelada" | "faltou" | null
  modalidade: string | null
  duracao: number | null
  dailyRoomUrl: string | null
  paciente: { id: string; nome: string } | null
}

export const useProfessionalSchedule = () => {
  const { user } = useAuthContext()

  const { data: profissionalId, isLoading: isLoadingId } = useQuery({
    queryKey: ["profissional-id", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return null
      const p = await api.get<{ id: string }>(`/profissionais/user/${user.id}`)
      return p.id
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: sessoes = [], isLoading: isLoadingSessoes, refetch } = useQuery({
    queryKey: ["sessoes", "profissional", profissionalId],
    enabled: Boolean(profissionalId),
    queryFn: async () => {
      if (!profissionalId) return []
      return api.get<SessaoProfissional[]>("/sessoes", {
        query: { profissionalId, order: "asc" },
      })
    },
    staleTime: 30 * 1000,
  })

  return {
    profissionalId,
    sessoes,
    isLoading: isLoadingId || isLoadingSessoes,
    refetch,
  }
}
