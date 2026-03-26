import { useCallback, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { useAuthContext } from "@/contexts/AuthContext"
import type { MoodLevel } from "@/design-system/types"
import { api } from "@/lib/api"

type MoodEntry = {
  value: MoodLevel
  sentimento: string
  texto: string
  tags: string[]
  createdAt: string
}

type SaveMoodInput = {
  value: MoodLevel
  texto?: string
  tags?: string[]
}

type DiarioApi = {
  id: string
  texto: string
  sentimento?: string | null
  tags?: unknown
  dataRegistro?: string | null
  humor?: number | null
}

const MOOD_ENDPOINT = "/diario_sentimentos"

export const moodMeta: Record<MoodLevel, { sentimento: string; label: string }> = {
  1: { sentimento: "muito mal", label: "Muito mal" },
  2: { sentimento: "ansioso", label: "Ansioso" },
  3: { sentimento: "neutro", label: "Neutro" },
  4: { sentimento: "bem", label: "Bem" },
  5: { sentimento: "otimo", label: "Otimo!" },
}

const resolveMoodLevel = (entry?: DiarioApi | null): MoodLevel => {
  if (!entry) return 3
  if (entry.humor && entry.humor >= 1 && entry.humor <= 5) {
    return entry.humor as MoodLevel
  }

  const sentimento = entry.sentimento?.toLowerCase() ?? ""
  if (sentimento.includes("muito")) return 1
  if (sentimento.includes("ansios")) return 2
  if (sentimento.includes("neutr")) return 3
  if (sentimento.includes("bem")) return 4
  if (sentimento.includes("otim")) return 5
  return 3
}

const normalizeTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item))
  }
  return []
}

const mapApiToEntry = (entry: DiarioApi | null): MoodEntry | null => {
  if (!entry) return null
  const value = resolveMoodLevel(entry)

  return {
    value,
    sentimento: entry.sentimento ?? moodMeta[value].sentimento,
    texto: entry.texto ?? "",
    tags: normalizeTags(entry.tags),
    createdAt: entry.dataRegistro ?? new Date().toISOString(),
  }
}

export const useMoodCheckIn = () => {
  const { user } = useAuthContext()
  const [entry, setEntry] = useState<MoodEntry | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { data: pacienteId } = useQuery({
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

  const { data: moodData } = useQuery({
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

  useEffect(() => {
    setEntry(mapApiToEntry(moodData ?? null))
  }, [moodData])

  const saveMood = useCallback(
    async ({ value, texto, tags }: SaveMoodInput) => {
      if (!pacienteId) {
        throw new Error("Paciente nao identificado")
      }

      const payload = {
        pacienteId,
        sentimento: moodMeta[value].sentimento,
        texto: texto?.trim() ?? "",
        tags: tags ?? [],
        humor: value,
      }

      const nextEntry: MoodEntry = {
        value,
        sentimento: payload.sentimento,
        texto: payload.texto,
        tags: payload.tags,
        createdAt: new Date().toISOString(),
      }

      setIsSaving(true)
      try {
        await api.post(MOOD_ENDPOINT, payload)
        setEntry(nextEntry)
        return nextEntry
      } finally {
        setIsSaving(false)
      }
    },
    [pacienteId]
  )

  return { entry, isSaving, saveMood }
}
