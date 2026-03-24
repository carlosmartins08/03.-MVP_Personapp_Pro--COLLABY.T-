
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useServicosContratados } from '@/hooks/useServicosContratados';
import type { ServicoContratado } from '@/types/servicos';

interface AgendarNovoPacoteFormProps {
  servico: ServicoContratado;
  onClose: () => void;
}

export function AgendarNovoPacoteForm({ servico, onClose }: AgendarNovoPacoteFormProps) {
  const { criarServicoContratado } = useServicosContratados();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      await criarServicoContratado.mutateAsync({
        paciente_id: servico.paciente_id,
        servico_id: servico.servico_id,
        data_inicio: selectedDate.toISOString().split('T')[0],
        qtd_total_sessoes: servico.qtd_total_sessoes
      });
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Pré-agendar Novo Pacote</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Data de início sugerida</label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Agendar</Button>
        </div>
      </form>
    </DialogContent>
  );
}
