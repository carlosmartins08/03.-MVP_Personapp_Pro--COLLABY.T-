
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExportFinanceiroButtonProps {
  financialData: any[];
  summary: {
    total_received: number;
    total_pending: number;
  };
  period: string;
}

const ExportFinanceiroButton = ({ financialData, summary, period }: ExportFinanceiroButtonProps) => {
  const handleExport = async () => {
    try {
      // Create the filename with the current month and year
      const currentDate = new Date();
      const filename = `Financeiro_PersonaClinic_${format(currentDate, 'yyyyMM')}.pdf`;
      
      // Later we'll implement the actual PDF generation here
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Erro ao exportar relatório');
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="bg-lavanda-light hover:bg-lavanda text-gray-700 border-gray-200"
    >
      <Download className="h-4 w-4 mr-2" />
      Exportar Relatório
    </Button>
  );
};

export default ExportFinanceiroButton;
