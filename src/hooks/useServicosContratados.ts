
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import type { ServicoContratado } from '@/types/servicos';
import { api } from '@/lib/api';

export const useServicosContratados = (pacienteId?: string) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: '',
    servico: ''
  });

  const { data: servicosContratados, isLoading } = useQuery({
    queryKey: ['servicos-contratados', pacienteId, filters],
    queryFn: async () => {
      const data = await api.get<ServicoContratado[]>('/servicos-contratados', {
        query: {
          pacienteId: pacienteId || undefined,
          status: filters.status || undefined,
        },
      });

      return data.filter((contrato) =>
        filters.servico ? contrato.servico_id === filters.servico : true
      );
    },
    enabled: !!pacienteId || true
  });

  const criarServicoContratado = useMutation({
    mutationFn: async (dados: {
      paciente_id: string;
      servico_id: string;
      data_inicio: string;
      qtd_total_sessoes: number;
    }) => {
      return api.post('/servicos-contratados', dados);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos-contratados'] });
      toast({
        title: "Serviço contratado com sucesso!",
        description: "O serviço foi vinculado ao paciente."
      });
    },
    onError: (error) => {
      console.error('Error contracting service:', error);
      toast({
        variant: "destructive",
        title: "Erro ao contratar serviço",
        description: "Verifique os dados e tente novamente."
      });
    }
  });

  const incrementarSessoesRealizadas = useMutation({
    mutationFn: async (id: string) => {
      return api.post(`/servicos-contratados/${id}/incrementar`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos-contratados'] });
      toast({
        title: "Sessão registrada",
        description: "Contagem de sessões atualizada com sucesso."
      });
    }
  });

  const atualizarStatusServico = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'ativo' | 'encerrado' | 'suspenso' }) => {
      return api.patch(`/servicos-contratados/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos-contratados'] });
      toast({
        title: "Status atualizado",
        description: "O status do serviço foi atualizado com sucesso."
      });
    }
  });

  return {
    servicosContratados,
    isLoading,
    filters,
    setFilters,
    criarServicoContratado,
    incrementarSessoesRealizadas,
    atualizarStatusServico
  };
};
