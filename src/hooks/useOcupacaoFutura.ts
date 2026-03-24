
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useOcupacaoFutura = (period: number) => {
  return useQuery({
    queryKey: ['ocupacao-futura', period],
    queryFn: async () => {
      try {
        const data = await api.get('/analytics/ocupacao', {
          query: { periodo: period },
        });
        return data;
      } catch (error) {
        console.error('Erro ao obter ocupação futura:', error);
        throw error;
      }
    }
  });
};
