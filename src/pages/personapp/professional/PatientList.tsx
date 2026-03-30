import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"

import { ExportProntuarioButton } from "@/components/personapp/ExportProntuarioButton"
import { useAuthContext } from "@/contexts/AuthContext"
import { AppHeader, Avatar, Badge, Button, Card } from "@/design-system/components"
import { useVinculosProfissional } from "@/hooks/useVinculo"
import { api } from "@/lib/api"

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()
}

const dataRelativa = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const dias = Math.floor(diff / 86400000)

  if (dias <= 0) return "Vinculado hoje"
  if (dias === 1) return "Vinculado ontem"
  return `Vinculado ha ${dias} dias`
}

type ProfissionalResumo = {
  id: string
  nome: string
}

type PacienteApi = {
  id: string
  nome: string
}

const PatientListPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const [busca, setBusca] = useState("")

  const { data: profissional, isLoading: isLoadingProfissionalId } = useQuery({
    queryKey: ["profissional-perfil", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return null
      return api.get<ProfissionalResumo>(`/profissionais/user/${user.id}`)
    },
    staleTime: 5 * 60 * 1000,
  })

  const profissionalId = profissional?.id

  const { data: vinculos = [], isLoading: isLoadingVinculos } = useVinculosProfissional(
    profissionalId ?? undefined
  )

  const uniquePacienteIds = useMemo(
    () => Array.from(new Set(vinculos.map((vinculo) => vinculo.pacienteId))),
    [vinculos]
  )

  const { data: pacientesPorId = {}, isLoading: isLoadingPacientes } = useQuery({
    queryKey: ["pacientes-vinculados", uniquePacienteIds],
    enabled: uniquePacienteIds.length > 0,
    queryFn: async () => {
      const pacientes = await Promise.all(
        uniquePacienteIds.map((pacienteId) => api.get<PacienteApi>(`/pacientes/${pacienteId}`))
      )

      return pacientes.reduce<Record<string, PacienteApi>>((acc, paciente) => {
        acc[paciente.id] = paciente
        return acc
      }, {})
    },
    staleTime: 60 * 1000,
  })

  const pacientesFiltrados = useMemo(() => {
    const normalizedBusca = busca.trim().toLowerCase()

    return vinculos
      .map((vinculo) => {
        const paciente = pacientesPorId[vinculo.pacienteId]
        const nome = paciente?.nome ?? "Paciente"

        return {
          id: vinculo.id,
          pacienteId: vinculo.pacienteId,
          nome,
          sessionLabel: dataRelativa(vinculo.criadoEm),
          status: vinculo.status === "ATIVO"
            ? { label: "Ativo", variant: "success" as const }
            : { label: vinculo.status, variant: "neutral" as const },
        }
      })
      .filter((paciente) => paciente.nome.toLowerCase().includes(normalizedBusca))
  }, [busca, vinculos, pacientesPorId])

  const isLoading =
    isLoadingProfissionalId
    || isLoadingVinculos
    || (uniquePacienteIds.length > 0 && isLoadingPacientes)

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="px-4 pb-28 lg:max-w-3xl lg:mx-auto lg:px-8">
        <AppHeader variant="professional" title="Pacientes" name={profissional?.nome ?? ""} />

      <div className="mt-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-200" />
          <input
            type="search"
            placeholder="Buscar paciente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-2xl border border-neutral-100 bg-white text-sm font-manrope text-neutral-500 placeholder:text-neutral-200 focus:outline-none focus:border-ds-primary transition-all duration-200"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-neutral-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-manrope text-neutral-300">
              {busca ? "Nenhum paciente encontrado." : "Nenhum paciente vinculado ainda."}
            </p>
          </div>
        ) : (
          <Card className="rounded-3xl divide-y divide-neutral-100 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md">
            {pacientesFiltrados.map((paciente) => (
              <div key={paciente.id} className="flex items-center gap-3 p-4">
                <Avatar fallbackColor={undefined} initials={iniciais(paciente.nome)} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-manrope font-semibold text-neutral-500 truncate">{paciente.nome}</p>
                  <p className="text-xs font-manrope text-neutral-300 truncate">{paciente.sessionLabel}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={paciente.status.variant} size="sm">
                    {paciente.status.label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-12 px-4 rounded-2xl font-manrope font-semibold shadow-ds-sm transition-all duration-200"
                    onClick={() => navigate(`/app/profissional/plano/${paciente.pacienteId}`)}
                  >
                    Ver plano
                  </Button>
                  <ExportProntuarioButton
                    pacienteId={paciente.pacienteId}
                    nomePaciente={paciente.nome}
                  />
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
      </div>
    </div>
  )
}

export default PatientListPage
