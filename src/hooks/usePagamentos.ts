import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

export interface Pagamento {
  id: string;
  sessaoId: string;
  valor: number;
  status: 'pendente' | 'pago' | 'cancelado' | 'erro';
  metodo: string;
  transactionId?: string | null;
  boletoUrl?: string | null;
  provider: string;
  criadoEm: string;
  sessao?: {
    dataHora?: string | null;
    profissional?: {
      usuario?: { nome: string };
    };
  };
}

export function usePagamentos() {
  return useQuery<Pagamento[]>({
    queryKey: ['pagamentos'],
    queryFn: async () => {
      return api.get<Pagamento[]>('/pagamentos');
    },
  });
}

export function useCriarPagamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: { sessaoId: string; valor: number }) => {
      return api.post<Pagamento>('/pagamentos', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] });
    },
  });
}
