
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Paciente, Sessao } from '@/types';
import { format, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExportEvolucaoButtonProps {
  paciente: Paciente;
  sessoes: Sessao[];
  profissionalNome: string;
}

const ExportEvolucaoButton = ({ 
  paciente, 
  sessoes,
  profissionalNome 
}: ExportEvolucaoButtonProps) => {
  const { toast } = useToast();
  
  const handleExport = async () => {
    try {
      const periodoFim = new Date();
      const periodoInicio = subWeeks(periodoFim, 12);
      
      const nomeArquivo = `Relatorio_Evolucao_${paciente.nome.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMM')}.pdf`;
      
      // Gerar o PDF
      const [{ pdf }, { default: EvolucaoPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./EvolucaoPDF'),
      ]);

      const blob = await pdf(
        <EvolucaoPDF 
          paciente={paciente}
          sessoes={sessoes.filter(s => 
            new Date(s.data) >= periodoInicio && 
            new Date(s.data) <= periodoFim
          )}
          periodo={{
            inicio: periodoInicio,
            fim: periodoFim
          }}
          profissionalNome={profissionalNome}
        />
      ).toBlob();
      
      // Criar URL e link para download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      
      // Simular clique e limpar URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Relatório exportado",
        description: "O arquivo PDF foi gerado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro ao exportar",
        description: "Não foi possível gerar o arquivo PDF."
      });
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="bg-azul-light text-azul-dark hover:bg-azul-light/80"
    >
      <FileText className="mr-2" />
      Exportar Relatório
    </Button>
  );
};

export default ExportEvolucaoButton;
