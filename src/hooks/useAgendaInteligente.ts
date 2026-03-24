
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useAgendaInteligente = (period: number) => {
  return useQuery({
    queryKey: ['agenda-inteligente', period],
    queryFn: async () => {
      try {
        const data = await api.get('/analytics/agenda', {
          query: { periodo: period },
        });
        return data;
      } catch (error) {
        console.error('Erro ao obter agenda inteligente:', error);
        throw error;
      }
    }
  });
};
