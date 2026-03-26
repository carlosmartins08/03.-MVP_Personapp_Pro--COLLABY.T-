import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { PeriodOption } from '@/components/PeriodSelector';

export type FinancialTransaction = {
  id: string;
  sessaoId: string;
  pacienteId: string;
  pacienteNome?: string;
  valor: number;
  status: 'pago' | 'pendente' | 'cancelado';
  dataSessao?: string;
  dataPagamento?: string;
  metodoPagamento?: string;
};

export type FinancialSummaryResponse = {
  total_received: number;
  total_pending: number;
  period: string;
  from: string;
  to: string;
  transactions: FinancialTransaction[];
};

const parsePeriodLabel = (period: PeriodOption | string) => {
  if (typeof period === 'string') return period;
  if (typeof period === 'object' && period !== null) {
    return period.label ?? period.value.toString();
  }
  return undefined;
};

export const useMonthlyFinancialSummary = () => {
  const queryClient = useQueryClient();
  const [periodLabel, setPeriodLabel] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['financeiro-resumo', periodLabel],
    enabled: Boolean(periodLabel),
    queryFn: async () => {
      if (!periodLabel) return null;
      return api.get<FinancialSummaryResponse>('/financeiro/resumo', {
        query: { period: periodLabel },
      });
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const transactions = useMemo(() => data?.transactions ?? [], [data]);
  const summary = useMemo(
    () => ({
      total_received: data?.total_received ?? 0,
      total_pending: data?.total_pending ?? 0,
    }),
    [data],
  );

  const receivedTransactions = useMemo(
    () => transactions.filter((item) => item.status === 'pago'),
    [transactions],
  );

  const pendingTransactions = useMemo(
    () => transactions.filter((item) => item.status === 'pendente'),
    [transactions],
  );

  const fetchSummary = useCallback(
    async (period: PeriodOption | string): Promise<FinancialSummaryResponse> => {
      const parsedPeriod = parsePeriodLabel(period);
      if (!parsedPeriod) {
        throw new Error('Periodo invalido');
      }
      setPeriodLabel(parsedPeriod);

      const response = await queryClient.fetchQuery({
        queryKey: ['financeiro-resumo', parsedPeriod],
        queryFn: () =>
          api.get<FinancialSummaryResponse>('/financeiro/resumo', {
            query: { period: parsedPeriod },
          }),
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
      });

      return response;
    },
    [queryClient],
  );

  return {
    data,
    summary,
    periodLabel: data?.period ?? periodLabel ?? undefined,
    transactions,
    receivedTransactions,
    pendingTransactions,
    fetchSummary,
    isLoading: isLoading || isFetching,
  };
};
