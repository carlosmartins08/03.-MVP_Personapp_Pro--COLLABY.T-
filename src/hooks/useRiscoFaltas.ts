
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useRiscoFaltas = (period: number) => {
  return useQuery({
    queryKey: ['risco-faltas', period],
    queryFn: async () => {
      try {
        const data = await api.get('/analytics/risco-faltas', {
          query: { periodo: period },
        });
        return data;
      } catch (error) {
        console.error('Erro ao obter risco de faltas:', error);
        throw error;
      }
    }
  });
};
