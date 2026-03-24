
import React from 'react';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ServicoContratado } from '@/types/servicos';

interface ConfirmarEncerramentoDialogProps {
  servico: ServicoContratado;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmarEncerramentoDialog({ 
  servico, 
  onConfirm, 
  onClose 
}: ConfirmarEncerramentoDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirmar Encerramento</DialogTitle>
        <DialogDescription>
          Tem certeza que deseja encerrar este serviço? Esta ação bloqueará novos agendamentos 
          para este contrato.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button variant="destructive" onClick={onConfirm}>Confirmar Encerramento</Button>
      </div>
    </DialogContent>
  );
}
