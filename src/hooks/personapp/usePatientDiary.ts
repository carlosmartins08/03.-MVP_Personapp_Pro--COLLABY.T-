import { useCallback, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuthContext } from "@/contexts/AuthContext"
import { api } from "@/lib/api"

export type DiarioRegistro = {
  id: string
  texto: string
  humor: number | null
  sentimento: string | null
  tags: string[] | null
  dataRegistro: string
}

type SalvarInput = {
  texto: string
  humor: number
  tags?: string[]
}

const normalizeTags = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String)
  return []
}

export const usePatientDiary = () => {
  const { user } = useAuthContext()
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)

  const { data: pacienteId } = useQuery({
    queryKey: ["paciente-id", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return null
      const p = await api.get<{ id: string }>(`/pacientes/user/${user.id}`)
      return p.id
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: registrosRaw = [], isLoading } = useQuery({
    queryKey: ["diario-registros", pacienteId],
    enabled: Boolean(pacienteId),
    queryFn: async () => {
      if (!pacienteId) return []
      return api.get<DiarioRegistro[]>("/diario/registros", {
        query: { pacienteId, limit: 30 },
      })
    },
    staleTime: 60 * 1000,
  })

  const registros: DiarioRegistro[] = registrosRaw.map(r => ({
    ...r,
    tags: normalizeTags(r.tags),
  }))

  const salvar = useCallback(async ({ texto, humor, tags }: SalvarInput) => {
    if (!pacienteId) throw new Error("Paciente não identificado")
    setIsSaving(true)
    try {
      await api.post("/diario/registros", {
        pacienteId,
        texto,
        humor,
        sentimento: ["muito mal", "ansioso", "neutro", "bem", "ótimo"][humor - 1] ?? "neutro",
        tags: tags ?? [],
      })
      await queryClient.invalidateQueries({ queryKey: ["diario-registros", pacienteId] })
      await queryClient.invalidateQueries({ queryKey: ["diario-humor-hoje", pacienteId] })
    } finally {
      setIsSaving(false)
    }
  }, [pacienteId, queryClient])

  return { registros, isLoading, isSaving, salvar, pacienteId }
}
