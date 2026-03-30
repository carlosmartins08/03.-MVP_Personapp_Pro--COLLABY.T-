import React from 'react'
import { Button } from '@/design-system/components'
import { FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ExportProntuarioButtonProps {
  pacienteId: string
  nomePaciente: string
}

export function ExportProntuarioButton({
  pacienteId,
  nomePaciente
}: ExportProntuarioButtonProps) {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const [paciente, sessoes] = await Promise.all([
        api.get(`/pacientes/${pacienteId}`),
        api.get('/sessoes', { query: { pacienteId } })
      ])

      const nomeArquivo = `Prontuario_${nomePaciente.replace(/\s+/g, '_')}_${format(
        new Date(),
        'yyyyMM',
        { locale: ptBR }
      )}.pdf`

      const [{ pdf }, { default: ProntuarioPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/prontuario/ProntuarioPDF'),
      ])

      const blob = await pdf(
        React.createElement(ProntuarioPDF, { paciente, sessoes })
      ).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = nomeArquivo
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: 'Prontuário exportado',
        description: 'Arquivo PDF gerado com sucesso.'
      })
    } catch (err) {
      console.error('Erro ao exportar prontuário:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao exportar',
        description: 'Não foi possível gerar o arquivo.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      className="rounded-2xl font-manrope font-medium transition-all duration-200"
    >
      <FileText className="w-4 h-4 mr-2" />
      {loading ? 'Gerando...' : 'Exportar prontuário'}
    </Button>
  )
}
