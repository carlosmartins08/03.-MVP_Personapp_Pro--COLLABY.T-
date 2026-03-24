import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import MensagemItem from './MensagemItem';
import { api } from '@/lib/api';

interface ListaMensagensProps {
  pacienteId: string;
}

interface Mensagem {
  id: string;
  dataEnvio: string;
  tipoMensagem: string;
  meio: 'whatsapp' | 'email';
  conteudo: string;
  mensagemEntregue: boolean;
}

const ListaMensagens = ({ pacienteId }: ListaMensagensProps) => {
  const { data: mensagens, isLoading } = useQuery({
    queryKey: ['paciente-mensagens', pacienteId],
    enabled: !!pacienteId,
    queryFn: async () => {
      const data = await api.get<Mensagem[]>(`/pacientes/${pacienteId}/mensagens`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-4 text-center">
        <p className="text-muted-foreground">Carregando mensagens...</p>
      </Card>
    );
  }

  if (!mensagens || mensagens.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p className="text-muted-foreground">Nenhuma mensagem enviada ainda.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {mensagens.map((mensagem) => (
        <MensagemItem
          key={mensagem.id}
          data_envio={mensagem.dataEnvio}
          tipo_mensagem={mensagem.tipoMensagem}
          meio={mensagem.meio}
          conteudo={mensagem.conteudo}
          mensagem_entregue={mensagem.mensagemEntregue}
        />
      ))}
    </div>
  );
};

export default ListaMensagens;
