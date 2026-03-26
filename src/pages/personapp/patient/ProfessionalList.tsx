import React, { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { AppHeader, Avatar, Badge, Button, Card, Input } from "@/design-system/components"
import { colors, type ApproachKey } from "@/design-system"
import { professionalsMock } from "@/mocks/professionals"

// TODO: integrar GET /profissionais no backend Fastify quando a rota existir.
const approachLabels: Record<ApproachKey, string> = {
  psicanalise: "Psicanalise",
  behaviorismo: "Behaviorismo",
  humanismo: "Humanismo",
  cognitivismo: "Cognitivismo",
  psicPositiva: "Psicologia Positiva",
  neuropsicologia: "Neuropsicologia",
  sistemica: "Sistemica",
  transpessoal: "Transpessoal",
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

const approachOptions: { key: ApproachKey; label: string }[] = [
  { key: "psicanalise", label: approachLabels.psicanalise },
  { key: "cognitivismo", label: approachLabels.cognitivismo },
  { key: "humanismo", label: approachLabels.humanismo },
  { key: "behaviorismo", label: approachLabels.behaviorismo },
  { key: "psicPositiva", label: approachLabels.psicPositiva },
  { key: "neuropsicologia", label: approachLabels.neuropsicologia },
  { key: "sistemica", label: approachLabels.sistemica },
  { key: "transpessoal", label: approachLabels.transpessoal },
]

const parseApproaches = (value?: string | null) => {
  if (!value) return [] as ApproachKey[]
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .map((item) => approachLabelToKey[item])
    .filter(Boolean) as ApproachKey[]
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

const ProfessionalListPage = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [selectedApproach, setSelectedApproach] = useState<ApproachKey | "todos">("todos")

  const filteredProfessionals = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return professionalsMock.filter((professional) => {
      const matchesQuery =
        !normalizedQuery ||
        professional.nome.toLowerCase().includes(normalizedQuery) ||
        (professional.crp ?? "").toLowerCase().includes(normalizedQuery)

      const professionalApproaches = parseApproaches(professional.especialidade)
      const matchesApproach =
        selectedApproach === "todos" || professionalApproaches.includes(selectedApproach)

      return matchesQuery && matchesApproach
    })
  }, [query, selectedApproach])

  return (
    <div className="flex flex-col gap-4">
      <div className="-mx-4">
        <AppHeader
          variant="minimal"
          title="Encontrar Psicologo"
          onBack={() => navigate(-1)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou CRP"
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedApproach("todos")}
            className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
            style={
              selectedApproach === "todos"
                ? { backgroundColor: colors.primary[400], borderColor: colors.primary[400], color: "#fff" }
                : { backgroundColor: colors.neutral[50], borderColor: colors.neutral[100], color: colors.neutral[400] }
            }
          >
            Todos
          </button>
          {approachOptions.map((option) => {
            const palette = colors.approach[option.key]
            const isActive = selectedApproach === option.key
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelectedApproach(option.key)}
                className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
                style={
                  isActive
                    ? { backgroundColor: palette.accent, borderColor: palette.accent, color: "#fff" }
                    : { backgroundColor: palette.bg, borderColor: palette.accent, color: palette.text }
                }
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredProfessionals.length === 0 && (
          <p className="text-sm text-gray-500">Nenhum profissional encontrado.</p>
        )}

        {filteredProfessionals.map((professional) => {
          const professionalApproaches = parseApproaches(professional.especialidade)
          const topApproaches = professionalApproaches.slice(0, 3)

          return (
            <Card key={professional.id} variant="default" className="p-4">
              <div className="flex gap-3">
                <Avatar size="md" initials={getInitials(professional.nome)} />
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      {professional.nome}
                    </h3>
                    {professional.crp && (
                      <Badge variant="success" size="sm">
                        CRP verificado
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    CRP {professional.crp ?? "Nao informado"}
                  </p>

                  {topApproaches.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {topApproaches.map((approachKey) => {
                        const palette = colors.approach[approachKey]
                        return (
                          <span
                            key={approachKey}
                            className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: palette.bg,
                              borderColor: palette.accent,
                              color: palette.text,
                            }}
                          >
                            {approachLabels[approachKey]}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                    <span>Modalidade: Online</span>
                    <span>Valor: R$ 180</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="ghost" size="sm">
                      Ver perfil
                    </Button>
                    <Button size="sm">Agendar</Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ProfessionalListPage
