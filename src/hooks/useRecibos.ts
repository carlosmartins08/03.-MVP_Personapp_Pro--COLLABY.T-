
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

interface Recibo {
  id: string;
  paciente: {
    nome: string;
  };
  data_sessao: string;
  created_at: string;
  enviado: boolean;
}

export const useRecibos = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    paciente: '',
    dataInicio: undefined,
    dataFim: undefined,
    status: 'todos'
  });

  const { data: recibos, isLoading } = useQuery({
    queryKey: ['recibos', filters],
    queryFn: async () => {
      const data = await api.get<Recibo[]>('/recibos');

      return data.filter((recibo) => {
        if (filters.paciente) {
          if (!recibo.paciente.nome.toLowerCase().includes(filters.paciente.toLowerCase())) {
            return false;
          }
        }

        if (filters.dataInicio) {
          if (new Date(recibo.data_sessao) < filters.dataInicio) {
            return false;
          }
        }

        if (filters.dataFim) {
          if (new Date(recibo.data_sessao) > filters.dataFim) {
            return false;
          }
        }

        if (filters.status !== 'todos') {
          const isSent = filters.status === 'enviado';
          if (recibo.enviado !== isSent) {
            return false;
          }
        }

        return true;
      });
    }
  });

  const createRecibo = useMutation({
    mutationFn: async (reciboData: any) => {
      return api.post('/recibos', reciboData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recibos'] });
      toast({
        title: "Recibo criado com sucesso!",
        description: "O recibo foi gerado e está pronto para envio."
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao criar recibo",
        description: "Tente novamente."
      });
    }
  });

  const deleteRecibo = useMutation({
    mutationFn: async (reciboId: string) => {
      await api.delete(`/recibos/${reciboId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recibos'] });
      toast({
        title: "Recibo excluído",
        description: "O recibo foi removido com sucesso."
      });
    }
  });

  const sendRecibo = useMutation({
    mutationFn: async (reciboId: string) => {
      await api.post(`/recibos/${reciboId}/send`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recibos'] });
      toast({
        title: "Recibo enviado",
        description: "O recibo foi marcado como enviado."
      });
    }
  });

  return {
    recibos,
    isLoading,
    filters,
    setFilters,
    handleCreateRecibo: createRecibo.mutate,
    handleSendRecibo: sendRecibo.mutate,
    handleDeleteRecibo: deleteRecibo.mutate
  };
};
