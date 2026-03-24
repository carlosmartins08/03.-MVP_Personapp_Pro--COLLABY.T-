
import React from 'react';
import { Calendar, MessageSquare, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useServicosContratados } from '@/hooks/useServicosContratados';
import { AgendarNovoPacoteForm } from './AgendarNovoPacoteForm';
import { EnviarSugestaoForm } from './EnviarSugestaoForm';
import { DuplicarContratoForm } from './DuplicarContratoForm';
import { ConfirmarEncerramentoDialog } from './ConfirmarEncerramentoDialog';
import type { ServicoContratado } from '@/types/servicos';

interface ServicoAcoesFinalizacaoProps {
  servico: ServicoContratado;
  alerta: {
    alerta_fim_sessoes: boolean;
    alerta_fim_periodo: boolean;
    alerta_inatividade: boolean;
  };
}

export function ServicoAcoesFinalizacao({ servico, alerta }: ServicoAcoesFinalizacaoProps) {
  const [dialogType, setDialogType] = React.useState<string | null>(null);
  const { atualizarStatusServico } = useServicosContratados();

  // Only show actions if any alert is active
  if (!alerta.alerta_fim_sessoes && !alerta.alerta_fim_periodo && !alerta.alerta_inatividade) {
    return null;
  }

  const handleClose = () => setDialogType(null);

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setDialogType('agendar')}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Pré-agendar novo pacote
      </Button>

      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setDialogType('sugerir')}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Enviar sugestão de renovação
      </Button>

      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setDialogType('duplicar')}
      >
        <Copy className="mr-2 h-4 w-4" />
        Duplicar contrato anterior
      </Button>

      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setDialogType('encerrar')}
      >
        <Check className="mr-2 h-4 w-4" />
        Encerrar serviço
      </Button>

      <Dialog open={dialogType === 'agendar'} onOpenChange={() => handleClose()}>
        <AgendarNovoPacoteForm 
          servico={servico}
          onClose={handleClose}
        />
      </Dialog>

      <Dialog open={dialogType === 'sugerir'} onOpenChange={() => handleClose()}>
        <EnviarSugestaoForm 
          servico={servico}
          onClose={handleClose}
        />
      </Dialog>

      <Dialog open={dialogType === 'duplicar'} onOpenChange={() => handleClose()}>
        <DuplicarContratoForm 
          servico={servico}
          onClose={handleClose}
        />
      </Dialog>

      <Dialog open={dialogType === 'encerrar'} onOpenChange={() => handleClose()}>
        <ConfirmarEncerramentoDialog
          servico={servico}
          onConfirm={() => {
            atualizarStatusServico.mutate({ 
              id: servico.id, 
              status: 'encerrado' 
            });
            handleClose();
          }}
          onClose={handleClose}
        />
      </Dialog>
    </div>
  );
}
