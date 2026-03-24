
import { useCallback, useMemo, useState } from 'react';
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

export const useMonthlyFinancialSummary = () => {
  const [data, setData] = useState<FinancialSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const transactions = data?.transactions ?? [];
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
      try {
        setIsLoading(true);

        const parsedPeriod =
          typeof period === 'string'
            ? period
            : typeof period === 'object'
              ? period.label ?? period.value.toString()
              : undefined;

        const response = await api.get<FinancialSummaryResponse>('/financeiro/resumo', {
          query: parsedPeriod ? { period: parsedPeriod } : undefined,
        });

        setData(response);
        return response;
      } catch (error) {
        console.error('Error fetching monthly summary:', error);
        setData(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    data,
    summary,
    periodLabel: data?.period,
    transactions,
    receivedTransactions,
    pendingTransactions,
    fetchSummary,
    isLoading,
  };
};
