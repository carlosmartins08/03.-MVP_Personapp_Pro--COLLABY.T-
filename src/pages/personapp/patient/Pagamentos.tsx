import { CheckCircle, CreditCard } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { ExportReciboButton } from "@/components/personapp/ExportReciboButton"
import { AppHeader, Badge, Button, EmptyState, Skeleton } from "@/design-system/components"
import { DotGrid } from "@/design-system/decorations"
import { type Pagamento, useCriarPagamento, usePagamentos } from "@/hooks/usePagamentos"

interface PagamentoCardProps {
  pagamento: Pagamento
  onPagar?: () => void
  destaque?: boolean
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace(".", ",")}`

function PagamentoCard({ pagamento, onPagar, destaque = false }: PagamentoCardProps) {
  const nomeProfissional = pagamento.sessao?.profissional?.usuario?.nome ?? "Profissional"

  const dataFormatada = pagamento.sessao?.dataHora
    ? new Date(pagamento.sessao.dataHora).toLocaleDateString("pt-BR")
    : "-"

  const badgeVariant =
    pagamento.status === "pago"
      ? "success"
      : pagamento.status === "pendente"
        ? "warning"
        : "error"

  const statusLabel =
    pagamento.status === "pago"
      ? "Pago"
      : pagamento.status === "pendente"
        ? "Pendente"
        : pagamento.status === "cancelado"
          ? "Cancelado"
          : "Erro"

  return (
    <div
      className={`rounded-3xl p-4 mb-3 border shadow-ds-card transition-all duration-200 hover:shadow-ds-md ${
        destaque ? "bg-ds-accent-lemon border-ds-warning/30" : "bg-white border-neutral-100"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-manrope font-semibold text-neutral-400 text-sm">{nomeProfissional}</p>
          <p className="text-xs font-manrope text-neutral-300">{dataFormatada}</p>
        </div>
        <Badge variant={badgeVariant} size="sm">
          {statusLabel}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-3 gap-3">
        <p className="text-xl font-sora font-bold text-neutral-400">{formatCurrency(pagamento.valor)}</p>

        {onPagar && pagamento.status === "pendente" && (
          <Button
            variant="primary"
            size="sm"
            className="h-12 rounded-2xl font-manrope font-semibold shadow-ds-sm transition-all duration-200"
            onClick={onPagar}
          >
            Pagar via boleto
          </Button>
        )}
      </div>

      {pagamento.status === "pago" && (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 text-ds-success">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Confirmado</span>
          </div>
          <ExportReciboButton pagamento={pagamento} />
        </div>
      )}

      {pagamento.boletoUrl && pagamento.status === "pendente" && (
        <a
          href={pagamento.boletoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs font-manrope text-ds-primary underline mt-2"
        >
          Ver boleto
        </a>
      )}
    </div>
  )
}

const PagamentosPage = () => {
  const navigate = useNavigate()

  const { data: pagamentos = [], isLoading } = usePagamentos()
  const criarPagamento = useCriarPagamento()

  const totalPago = pagamentos
    .filter((pagamento) => pagamento.status === "pago")
    .reduce((acc, pagamento) => acc + pagamento.valor, 0)

  const totalPendente = pagamentos
    .filter((pagamento) => pagamento.status === "pendente")
    .reduce((acc, pagamento) => acc + pagamento.valor, 0)

  const pendentes = pagamentos.filter((pagamento) => pagamento.status === "pendente")
  const historico = pagamentos.filter((pagamento) => pagamento.status !== "pendente")

  const handlePagar = async (pagamento: Pagamento) => {
    try {
      await criarPagamento.mutateAsync({
        sessaoId: pagamento.sessaoId,
        valor: pagamento.valor,
      })
    } catch (error) {
      console.error("Erro ao processar pagamento", error)
    }
  }

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="lg:max-w-3xl lg:mx-auto">
        <AppHeader
          variant="patient"
          title="Pagamentos"
          onBack={() => navigate("/app/paciente/dashboard")}
          className="lg:px-8"
        />

        <div className="px-4 pb-28 lg:px-8">
          <div className="relative overflow-hidden bg-ds-surface-dark rounded-3xl p-5 text-white mt-4 shadow-ds-lg">
            <DotGrid
              color="currentColor"
              opacity={0.06}
              cols={6}
              rows={3}
              className="absolute top-2 right-2 pointer-events-none text-white"
            />
            <p className="relative z-10 text-xs font-manrope font-medium uppercase tracking-widest opacity-60">
              Histórico financeiro
            </p>
            <div className="relative z-10 flex items-end justify-between mt-2">
              <div>
                <p className="text-3xl font-sora font-bold">{formatCurrency(totalPago)}</p>
                <p className="text-sm font-manrope opacity-75">total pago</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-sora font-semibold text-ds-warning">
                  {formatCurrency(totalPendente)}
                </p>
                <p className="text-xs font-manrope opacity-60">pendente</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {isLoading &&
              [1, 2, 3].map((item) => <Skeleton key={item} className="h-24 rounded-3xl mb-3" />)}

            {!isLoading && pendentes.length > 0 && (
              <>
                <p className="text-xs font-manrope font-semibold uppercase tracking-widest text-neutral-300 mt-2 mb-3">
                  Aguardando pagamento
                </p>
                {pendentes.map((pagamento) => (
                  <PagamentoCard
                    key={pagamento.id}
                    pagamento={pagamento}
                    onPagar={() => handlePagar(pagamento)}
                    destaque
                  />
                ))}
              </>
            )}

            {!isLoading && (
              <>
                <p className="text-xs font-manrope font-semibold uppercase tracking-widest text-neutral-300 mt-6 mb-3">
                  Histórico
                </p>

                {historico.length === 0 && (
                  <div className="bg-ds-accent-sky/30 rounded-3xl p-6">
                    <EmptyState
                      icon={<CreditCard className="w-8 h-8" />}
                      title="Nenhum pagamento ainda"
                      description="Seus pagamentos de sessões aparecerão aqui."
                    />
                  </div>
                )}

                {historico.map((pagamento) => (
                  <PagamentoCard key={pagamento.id} pagamento={pagamento} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagamentosPage
