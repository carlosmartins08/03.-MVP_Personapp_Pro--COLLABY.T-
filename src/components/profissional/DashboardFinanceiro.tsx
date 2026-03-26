import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/design-system/components';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { api } from '@/lib/api';

type FinanceiroResumo = {
  faturamentoMensal: number;
  totalConsultas: number;
  impostosEstimados: number;
};

export default function DashboardFinanceiro() {
  const { idioma, getTexto } = useLocalizacao();
  const locale = idioma === 'en' ? enUS : ptBR;

  const { data, isLoading } = useQuery({
    queryKey: ['financeiro-resumo'],
    queryFn: async () => {
      const resumo = await api.get<{
        total_received: number;
        total_pending: number;
        transactions: Array<{ id: string }>;
      }>('/financeiro/resumo');
      return resumo;
    },
  });

  const resumo: FinanceiroResumo | null = useMemo(() => {
    if (!data) return null;
    const faturamentoMensal = data.total_received ?? 0;
    const totalConsultas = data.transactions?.length ?? 0;
    const impostosEstimados = faturamentoMensal * 0.15;
    return {
      faturamentoMensal,
      totalConsultas,
      impostosEstimados,
    };
  }, [data]);

  const hoje = format(new Date(), 'MMMM yyyy', { locale });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">
        {getTexto('painel_financeiro') || 'Painel Financeiro'} - {hoje}
      </h1>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card variant="default" className="bg-purple-100 p-6">
            <h3 className="text-sm font-semibold">
              {getTexto('faturamento_mensal') || 'Faturamento Mensal'}
            </h3>
            <div className="mt-2 text-2xl font-semibold">
              R$ {resumo?.faturamentoMensal.toFixed(2)}
            </div>
          </Card>

          <Card variant="default" className="bg-green-100 p-6">
            <h3 className="text-sm font-semibold">
              {getTexto('total_consultas') || 'Total de Consultas'}
            </h3>
            <div className="mt-2 text-2xl font-semibold">
              {resumo?.totalConsultas}
            </div>
          </Card>

          <Card variant="default" className="bg-red-100 p-6">
            <h3 className="text-sm font-semibold">
              {getTexto('impostos_estimados') || 'Impostos Estimados'}
            </h3>
            <div className="mt-2 text-2xl font-semibold text-red-600">
              R$ {resumo?.impostosEstimados.toFixed(2)}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
