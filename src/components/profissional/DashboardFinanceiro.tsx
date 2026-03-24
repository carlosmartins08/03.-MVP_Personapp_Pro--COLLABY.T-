import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
          <Card className="bg-purple-100">
            <CardHeader>
              <CardTitle>{getTexto('faturamento_mensal') || 'Faturamento Mensal'}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              R$ {resumo?.faturamentoMensal.toFixed(2)}
            </CardContent>
          </Card>

          <Card className="bg-green-100">
            <CardHeader>
              <CardTitle>{getTexto('total_consultas') || 'Total de Consultas'}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {resumo?.totalConsultas}
            </CardContent>
          </Card>

          <Card className="bg-red-100">
            <CardHeader>
              <CardTitle>{getTexto('impostos_estimados') || 'Impostos Estimados'}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-red-600">
              R$ {resumo?.impostosEstimados.toFixed(2)}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
