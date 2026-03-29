import React, { useState } from "react"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { useAuthContext } from "@/contexts/AuthContext"
import { AppHeader, Avatar, Badge, Button, Card, Input } from "@/design-system/components"
import { ShapeBlob } from "@/design-system/decorations"
import { colors, type ApproachKey } from "@/design-system"
import { useCriarVinculo, useVinculoPaciente } from "@/hooks/useVinculo"
import { api } from "@/lib/api"

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

const dataFormatada = (iso: string) => {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

type Profissional = { id: string; nome: string; crp: string | null; especialidade: string | null }

const ProfessionalListPage = () => {
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [selectedApproach, setSelectedApproach] = useState<ApproachKey | "todos">("todos")
  const [selectingProfessionalId, setSelectingProfessionalId] = useState<string | null>(null)

  const criarVinculo = useCriarVinculo()

  const { data: pacienteId } = useQuery({
    queryKey: ["paciente-id", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return null
      const paciente = await api.get<{ id: string }>(`/pacientes/user/${user.id}`)
      return paciente.id
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: vinculos = [] } = useVinculoPaciente(pacienteId ?? undefined)
  const vinculoAtivo = vinculos.find((vinculo) => vinculo.status === "ATIVO")

  const { data: profissionalVinculado } = useQuery({
    queryKey: ["profissional-vinculado", vinculoAtivo?.profissionalId],
    enabled: Boolean(vinculoAtivo?.profissionalId),
    queryFn: async () => {
      if (!vinculoAtivo?.profissionalId) return null
      return api.get<Profissional>(`/profissionais/${vinculoAtivo.profissionalId}`)
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: professionals = [], isLoading } = useQuery({
    queryKey: ["profissionais", query, selectedApproach],
    queryFn: () =>
      api.get<Profissional[]>("/profissionais", {
        query: {
          ...(query.trim() ? { busca: query.trim() } : {}),
          ...(selectedApproach !== "todos" ? { abordagem: selectedApproach } : {}),
        },
      }),
    staleTime: 30 * 1000,
  })

  const filteredProfessionals = professionals

  const handleSelecionarProfissional = async (profissionalId: string) => {
    if (!pacienteId) return

    try {
      setSelectingProfessionalId(profissionalId)
      await criarVinculo.mutateAsync({
        pacienteId,
        profissionalId,
      })
      navigate("/app/paciente/dashboard")
    } catch (error) {
      console.error("Erro ao criar vinculo", error)
    } finally {
      setSelectingProfessionalId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto px-4 pb-24 font-manrope">
      <div className="-mx-4">
        <AppHeader
          variant="minimal"
          title="Encontrar Psicologo"
          onBack={() => navigate(-1)}
        />
      </div>

      {vinculoAtivo && (
        <div className="relative overflow-hidden bg-ds-primary rounded-3xl p-4 text-white mt-1 shadow-ds-lg">
          <ShapeBlob
            color="currentColor"
            size={140}
            opacity={0.06}
            className="absolute -top-8 -right-8 pointer-events-none text-white"
          />
          <p className="relative z-10 text-xs font-manrope font-medium uppercase tracking-wider opacity-70">
            Seu profissional atual
          </p>
          <div className="relative z-10 flex items-center gap-3 mt-2">
            <Avatar
              initials={getInitials(profissionalVinculado?.nome ?? "Profissional")}
              size="md"
              className="bg-white/20 text-white"
            />
            <div>
              <p className="font-manrope font-semibold">
                {profissionalVinculado?.nome ?? "Profissional vinculado"}
              </p>
              <p className="text-xs font-manrope opacity-75">
                Vinculo ativo desde {dataFormatada(vinculoAtivo.criadoEm)}
              </p>
            </div>
          </div>
        </div>
      )}

      {vinculoAtivo && (
        <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
          Outros profissionais disponiveis
        </p>
      )}

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-200" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou CRP"
            className="w-full pl-9 font-manrope"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedApproach("todos")}
            className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-manrope font-semibold transition-all duration-200"
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
                className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-manrope font-semibold transition-all duration-200"
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
        {isLoading && (
          <p className="text-sm font-manrope text-neutral-300 text-center py-6">Carregando profissionais...</p>
        )}
        {!isLoading && filteredProfessionals.length === 0 && (
          <p className="text-sm font-manrope text-neutral-300">Nenhum profissional encontrado.</p>
        )}

        {filteredProfessionals.map((professional) => {
          const professionalApproaches = parseApproaches(professional.especialidade)
          const topApproaches = professionalApproaches.slice(0, 3)

          return (
            <Card
              key={professional.id}
              variant="default"
              className="w-full p-4 rounded-3xl border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md"
            >
              <div className="flex gap-3">
                <Avatar size="md" initials={getInitials(professional.nome)} />
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-sora font-semibold text-neutral-500">
                      {professional.nome}
                    </h3>
                    {professional.crp && (
                      <Badge variant="success" size="sm">
                        CRP verificado
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs font-manrope text-neutral-300">
                    CRP {professional.crp ?? "Nao informado"}
                  </p>

                  {topApproaches.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {topApproaches.map((approachKey) => {
                        const palette = colors.approach[approachKey]
                        return (
                          <span
                            key={approachKey}
                            className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-manrope font-medium"
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

                  <div className="mt-3 flex flex-wrap gap-3 text-xs font-manrope text-neutral-400">
                    <span>Modalidade: Online</span>
                    <span>Valor: R$ 180</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full sm:w-auto rounded-2xl font-manrope font-semibold transition-all duration-200"
                    >
                      Ver perfil
                    </Button>
                    <Button
                      size="sm"
                      className="w-full sm:w-auto rounded-2xl font-manrope font-semibold transition-all duration-200 shadow-ds-sm hover:shadow-ds-md"
                      loading={selectingProfessionalId === professional.id}
                      onClick={() => handleSelecionarProfissional(professional.id)}
                    >
                      Vincular
                    </Button>
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

