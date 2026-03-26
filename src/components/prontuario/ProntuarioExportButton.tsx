
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Paciente, Sessao } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProntuarioExportButtonProps {
  paciente: Paciente;
  sessoes: Sessao[];
}

const ProntuarioExportButton = ({ paciente, sessoes }: ProntuarioExportButtonProps) => {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      const nomeArquivo = `Prontuario_${paciente.nome.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMM')}.pdf`;
      
      // Gerar o PDF
      const [{ pdf }, { default: ProntuarioPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./ProntuarioPDF'),
      ]);

      const blob = await pdf(
        <ProntuarioPDF paciente={paciente} sessoes={sessoes} />
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
        title: "Prontuário exportado",
        description: "O arquivo PDF foi gerado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao exportar prontuário:', error);
      toast({
        variant: "destructive",
        title: "Erro ao exportar",
        description: "Não foi possível gerar o arquivo PDF."
      });
    }
  };

  return (
    <Button
      variant="outline"
      className="bg-azul-light text-azul-dark hover:bg-azul-light/80"
      onClick={handleExport}
    >
      <FileText className="mr-2" />
      Exportar Prontuário
    </Button>
  );
};

export default ProntuarioExportButton;
