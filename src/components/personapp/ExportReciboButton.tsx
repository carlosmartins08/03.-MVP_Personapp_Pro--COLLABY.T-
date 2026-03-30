import React from 'react'
import { Button } from '@/design-system/components'
import { Receipt } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Pagamento } from '@/hooks/usePagamentos'

interface ExportReciboButtonProps {
  pagamento: Pagamento
}

export function ExportReciboButton({ pagamento }: ExportReciboButtonProps) {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const dataFormatada = format(
        new Date(pagamento.criadoEm),
        "dd 'de' MMMM 'de' yyyy",
        { locale: ptBR }
      )
      const nomeProfissional =
        pagamento.sessao?.profissional?.usuario?.nome ?? 'Profissional'
      const valor = pagamento.valor.toFixed(2).replace('.', ',')

      const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Recibo - PersonApp</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px;
                   max-width: 600px; margin: 0 auto; color: #333; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold;
                    color: #3055A4; }
            .title { font-size: 20px; margin: 20px 0;
                     border-bottom: 2px solid #3055A4; padding-bottom: 10px; }
            .row { display: flex; justify-content: space-between;
                   margin: 12px 0; padding: 8px 0;
                   border-bottom: 1px solid #eee; }
            .label { color: #737373; font-size: 14px; }
            .value { font-weight: bold; font-size: 14px; }
            .total { font-size: 20px; color: #3055A4;
                     font-weight: bold; margin-top: 20px; }
            .footer { text-align: center; margin-top: 40px;
                      color: #737373; font-size: 12px; }
            .status { background: #EBF8F0; color: #2D7B2D;
                      padding: 4px 12px; border-radius: 20px;
                      font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">PersonApp</div>
            <p style="color:#737373;font-size:14px">
              Saúde mental com acompanhamento humano
            </p>
          </div>
          <div class="title">Recibo de Pagamento</div>
          <div class="row">
            <span class="label">Data</span>
            <span class="value">${dataFormatada}</span>
          </div>
          <div class="row">
            <span class="label">Profissional</span>
            <span class="value">${nomeProfissional}</span>
          </div>
          <div class="row">
            <span class="label">Método</span>
            <span class="value">Boleto bancário</span>
          </div>
          <div class="row">
            <span class="label">Status</span>
            <span class="value">
              <span class="status">Pago</span>
            </span>
          </div>
          <div class="row">
            <span class="label">ID da transação</span>
            <span class="value" style="font-size:12px;color:#737373">
              ${pagamento.transactionId ?? pagamento.id}
            </span>
          </div>
          <div class="row total">
            <span>Total</span>
            <span>R$ ${valor}</span>
          </div>
          <div class="footer">
            <p>PersonApp — Plataforma de telepsicologia</p>
            <p>Este documento é um comprovante digital de pagamento.</p>
          </div>
        </body>
        </html>
      `

      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Recibo_PersonApp_${pagamento.id.slice(0, 8)}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: 'Recibo exportado',
        description: 'Abra o arquivo no navegador para imprimir como PDF.'
      })
    } catch (err) {
      console.error('Erro ao exportar recibo:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao exportar',
        description: 'Não foi possível gerar o recibo.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleExport}
      disabled={loading || pagamento.status !== 'pago'}
      className="rounded-2xl font-manrope text-xs transition-all duration-200"
    >
      <Receipt className="w-3.5 h-3.5 mr-1.5" />
      {loading ? 'Gerando...' : 'Baixar recibo'}
    </Button>
  )
}
