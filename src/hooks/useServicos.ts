
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import type { Servico } from '@/types/servicos';
import { api } from '@/lib/api';

export const useServicos = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    nome: '',
    modalidade: '',
    tipoCobranca: '',
  });

  const { data: servicos, isLoading } = useQuery({
    queryKey: ['servicos', filters],
    queryFn: async () => {
      const data = await api.get<Servico[]>('/servicos', {
        query: {
          search: filters.nome || undefined,
          modalidade: filters.modalidade || undefined,
          tipoCobranca: filters.tipoCobranca || undefined,
        },
      });

      return data;
    },
  });

  const createServico = useMutation({
    mutationFn: async (servicoData: Omit<Servico, 'id' | 'createdAt'>) => {
      return api.post<Servico>('/servicos', servicoData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
      toast({
        title: "Serviço criado com sucesso!",
        description: "O serviço foi adicionado à sua lista."
      });
    },
    onError: (error) => {
      console.error('Error creating service:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar serviço",
        description: "Verifique os dados e tente novamente."
      });
    }
  });

  const updateServico = useMutation({
    mutationFn: async ({ id, ...servicoData }: Partial<Servico> & { id: string }) => {
      return api.patch<Servico>(`/servicos/${id}`, servicoData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
      toast({
        title: "Serviço atualizado",
        description: "As alterações foram salvas com sucesso."
      });
    },
    onError: (error) => {
      console.error('Error updating service:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar serviço",
        description: "Verifique os dados e tente novamente."
      });
    }
  });

  const deleteServico = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/servicos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
      toast({
        title: "Serviço excluído",
        description: "O serviço foi removido com sucesso."
      });
    },
    onError: (error) => {
      console.error('Error deleting service:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir serviço",
        description: "Não foi possível excluir o serviço. Ele pode estar em uso."
      });
    }
  });

  return {
    servicos,
    isLoading,
    filters,
    setFilters,
    createServico,
    updateServico,
    deleteServico
  };
};
