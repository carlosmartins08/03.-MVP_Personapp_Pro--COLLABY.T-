
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useServicosContratados } from '@/hooks/useServicosContratados';
import type { ServicoContratado } from '@/types/servicos';

interface DuplicarContratoFormProps {
  servico: ServicoContratado;
  onClose: () => void;
}

export function DuplicarContratoForm({ servico, onClose }: DuplicarContratoFormProps) {
  const { criarServicoContratado } = useServicosContratados();
  const [sessoes, setSessoes] = React.useState(servico.qtd_total_sessoes);
  const [dataInicio, setDataInicio] = React.useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await criarServicoContratado.mutateAsync({
      paciente_id: servico.paciente_id,
      servico_id: servico.servico_id,
      data_inicio: dataInicio,
      qtd_total_sessoes: sessoes
    });
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Duplicar Contrato Anterior</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Início</label>
          <Input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantidade de Sessões</label>
          <Input
            type="number"
            value={sessoes}
            onChange={(e) => setSessoes(Number(e.target.value))}
            min={1}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Criar Novo Contrato</Button>
        </div>
      </form>
    </DialogContent>
  );
}
