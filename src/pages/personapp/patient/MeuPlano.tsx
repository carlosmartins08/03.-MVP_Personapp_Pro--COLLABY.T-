import { ClipboardList } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { AppHeader, Button, EmptyState, Skeleton } from "@/design-system/components"
import { DotGrid, ShapeBlob } from "@/design-system/decorations"
import { useMeuPlano } from "@/hooks/usePlanoTratamento"

const MeuPlanoPage = () => {
  const navigate = useNavigate()
  const { data: plano, isLoading } = useMeuPlano()

  return (
    <div className="min-h-screen bg-white font-manrope lg:max-w-2xl lg:mx-auto">
      <AppHeader
        variant="patient"
        title="Meu plano"
        action={
          <Button
            variant="ghost"
            size="sm"
            className="h-12 px-3 rounded-2xl font-manrope font-semibold shadow-ds-sm transition-all duration-200"
            onClick={() => navigate("/app/paciente/dashboard")}
          >
            Voltar
          </Button>
        }
      />

      <div className="px-4 pb-28">

      {isLoading && <Skeleton className="h-48 rounded-3xl mt-4" />}

      {!isLoading && !plano && (
        <div className="mt-6 bg-ds-accent-sky/30 rounded-3xl p-6">
          <EmptyState
            icon={<ClipboardList className="w-8 h-8" />}
            title="Plano ainda não criado"
            description="Seu profissional criará um plano personalizado após a primeira sessão."
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
              Seu plano terapêutico
            </p>
            <p className="relative z-10 text-xl font-sora font-bold mt-1">{plano.abordagem}</p>
            <div className="relative z-10 flex items-center gap-4 mt-3">
              <div>
                <p className="text-xs font-manrope opacity-60">Frequência</p>
                <p className="text-sm font-manrope font-medium">{plano.frequencia}</p>
              </div>
              {plano.duracaoPrevista && (
                <div>
                  <p className="text-xs font-manrope opacity-60">Duração prevista</p>
                  <p className="text-sm font-manrope font-medium">{plano.duracaoPrevista}</p>
                </div>
              )}
            </div>
            <p className="relative z-10 text-xs font-manrope opacity-60 mt-3">
              Por {plano.profissional?.nome ?? "Seu profissional"}
            </p>
          </div>

          {[
            { label: "Objetivos terapêuticos", value: plano.objetivos },
            { label: "Técnicas planejadas", value: plano.tecnicas },
            { label: "Como medir seu progresso", value: plano.indicadores },
          ]
            .filter((secao) => Boolean(secao.value))
            .map((secao) => (
              <div
                key={secao.label}
                className="bg-white rounded-3xl p-4 border border-neutral-100 mt-3 shadow-ds-card transition-all duration-200 hover:shadow-ds-md"
              >
                <p className="text-xs font-manrope font-semibold uppercase tracking-widest text-neutral-300 mb-2">
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
    </div>
  )
}

export default MeuPlanoPage
