import React, { useState } from 'react';
import { Button } from '@/design-system/components';
import { File, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface ExportAlertasButtonProps {
  pacienteId?: string;
  pacienteNome?: string;
  profissionalNome: string;
  isFromCentral?: boolean;
}

export const ExportAlertasButton: React.FC<ExportAlertasButtonProps> = ({
  pacienteId,
  pacienteNome,
  profissionalNome,
  isFromCentral = false
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [observacoes, setObservacoes] = useState('');

  const handleExport = async () => {
    try {
      const nomeArquivo = `Relatorio_Alertas_${
        pacienteNome ? pacienteNome.replace(/\s+/g, '_') : 'Todos'
      }_de_${format(dateRange.from, 'dd-MM-yyyy')}_a_${format(
        dateRange.to,
        'dd-MM-yyyy'
      )}.pdf`;

      const [{ pdf }, { default: AlertasPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./AlertasPDF'),
      ]);

      const blob = await pdf(
        <AlertasPDF
          pacienteId={pacienteId}
          pacienteNome={pacienteNome}
          profissionalNome={profissionalNome}
          dateRange={dateRange}
          observacoes={observacoes}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Relatório exportado",
        description: "O arquivo PDF foi gerado com sucesso."
      });

      setOpen(false);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro ao exportar",
        description: "Não foi possível gerar o arquivo PDF."
      });
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined, type: 'from' | 'to') => {
    if (selectedDate) {
      setDateRange(prev => ({
        ...prev,
        [type]: selectedDate
      }));
    }
  };

  return (
    <>
      <Button
        onClick={() => isFromCentral ? setOpen(true) : handleExport()}
        variant="secondary"
        className="bg-azul-light text-azul-dark hover:bg-azul-light/80"
      >
        <File className="mr-2 h-4 w-4" />
        Exportar Relatório de Alertas
      </Button>

      {isFromCentral && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Exportar Relatório de Alertas</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Período</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="secondary"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "PPP") : <span>Data inicial</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => handleDateSelect(date, 'from')}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="secondary"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "PPP") : <span>Data final</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => handleDateSelect(date, 'to')}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Observações Clínicas</label>
                <Textarea
                  placeholder="Digite suas observações clínicas..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="primary" onClick={handleExport}>Gerar PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ExportAlertasButton;
