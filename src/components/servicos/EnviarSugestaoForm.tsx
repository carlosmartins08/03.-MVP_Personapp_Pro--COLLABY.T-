
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ServicoContratado } from '@/types/servicos';
import { toast } from '@/hooks/use-toast';

interface EnviarSugestaoFormProps {
  servico: ServicoContratado;
  onClose: () => void;
}

export function EnviarSugestaoForm({ servico, onClose }: EnviarSugestaoFormProps) {
  const [mensagem, setMensagem] = React.useState(
    `Olá ${servico.paciente_nome},\n\nGostaria de renovar o pacote de ${servico.servico_nome}?`
  );

  const handleEnviarWhatsApp = () => {
    const texto = encodeURIComponent(mensagem);
    window.open(`https://wa.me/?text=${texto}`);
    onClose();
  };

  const handleEnviarEmail = () => {
    const subject = encodeURIComponent(`Renovação de ${servico.servico_nome}`);
    const body = encodeURIComponent(mensagem);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Enviar Sugestão de Renovação</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Mensagem</label>
          <Textarea 
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={6}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleEnviarWhatsApp}>Enviar por WhatsApp</Button>
          <Button onClick={handleEnviarEmail}>Enviar por E-mail</Button>
        </div>
      </div>
    </DialogContent>
  );
}
