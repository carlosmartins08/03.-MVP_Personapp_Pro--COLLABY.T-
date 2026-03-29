import { ClipboardList } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { AppHeader, Button, EmptyState, Skeleton } from "@/design-system/components"
import { DotGrid, ShapeBlob } from "@/design-system/decorations"
import { useMeuPlano } from "@/hooks/usePlanoTratamento"

const MeuPlanoPage = () => {
  const navigate = useNavigate()
  const { data: plano, isLoading } = useMeuPlano()

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 font-manrope">
      <div className="-mx-4">
        <AppHeader
          variant="patient"
          title="Meu Plano"
          action={
            <Button
              variant="ghost"
              size="sm"
              className="text-white border border-white/30 h-8 px-2 rounded-2xl font-manrope font-semibold transition-all duration-200"
              onClick={() => navigate("/app/paciente/dashboard")}
            >
              Voltar
            </Button>
          }
        />
      </div>

      {isLoading && <Skeleton className="h-48 rounded-3xl mt-4" />}

      {!isLoading && !plano && (
        <div className="mt-6 bg-ds-accent-sky/30 rounded-3xl p-6">
          <EmptyState
            icon={<ClipboardList className="w-8 h-8" />}
            title="Plano ainda nao criado"
            description="Seu profissional criara um plano personalizado apos a primeira sessao."
          />
        </div>
      )}

      {!isLoading && plano && (
        <>
          <div className="relative overflow-hidden bg-ds-surface-dark rounded-3xl p-5 text-white mt-4 shadow-ds-lg">
            <DotGrid
              color="currentColor"
              opacity={0.05}
              cols={6}
              rows={3}
              className="absolute top-2 right-2 pointer-events-none text-white"
            />
            <ShapeBlob
              color="currentColor"
              size={120}
              opacity={0.04}
              className="absolute -bottom-6 -right-6 pointer-events-none text-white"
            />
            <p className="relative z-10 text-xs font-manrope uppercase tracking-wider opacity-60">
              Seu plano terapeutico
            </p>
            <p className="relative z-10 text-xl font-sora font-bold mt-1">{plano.abordagem}</p>
            <div className="relative z-10 flex items-center gap-4 mt-3">
              <div>
                <p className="text-xs font-manrope opacity-60">Frequencia</p>
                <p className="text-sm font-manrope font-medium">{plano.frequencia}</p>
              </div>
              {plano.duracaoPrevista && (
                <div>
                  <p className="text-xs font-manrope opacity-60">Duracao prevista</p>
                  <p className="text-sm font-manrope font-medium">{plano.duracaoPrevista}</p>
                </div>
              )}
            </div>
            <p className="relative z-10 text-xs font-manrope opacity-60 mt-3">
              Por {plano.profissional?.nome ?? "Seu profissional"}
            </p>
          </div>

          {[
            { label: "Objetivos terapeuticos", value: plano.objetivos },
            { label: "Tecnicas planejadas", value: plano.tecnicas },
            { label: "Como medir seu progresso", value: plano.indicadores },
          ]
            .filter((secao) => Boolean(secao.value))
            .map((secao) => (
              <div
                key={secao.label}
                className="bg-white rounded-3xl p-4 border border-neutral-100 mt-3 shadow-ds-card transition-all duration-200 hover:shadow-ds-md"
              >
                <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  {secao.label}
                </p>
                <p className="text-sm font-manrope text-neutral-400 leading-relaxed whitespace-pre-wrap">
                  {secao.value}
                </p>
              </div>
            ))}
        </>
      )}
    </div>
  )
}

export default MeuPlanoPage
