import React from 'react';
import { Card } from '@/design-system/components';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { colors } from '@/design-system';

export const GraficosFrequencia = () => {
  const { data: frequenciaData } = useQuery({
    queryKey: ['frequencia-faltas'],
    queryFn: async () => {
      return api.get('/analytics/frequencia-faltas');
    }
  });

  const { data: riscosData } = useQuery({
    queryKey: ['distribuicao-riscos'],
    queryFn: async () => {
      return api.get('/analytics/distribuicao-riscos');
    }
  });

  const primary = colors.primary[400];
  const danger = colors.semantic.error;
  const warning = colors.semantic.warning;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card variant="default" className="p-6">
        <h3 className="text-lg font-semibold mb-4">Faltas e Reagendamentos</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              faltas: {
                theme: {
                  light: danger,
                  dark: danger,
                },
              },
              reagendamentos: {
                theme: {
                  light: warning,
                  dark: warning,
                },
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequenciaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="faltas" fill={danger} />
                <Bar dataKey="reagendamentos" fill={warning} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>

      <Card variant="default" className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distribuição de Riscos</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              quantidade: {
                theme: {
                  light: primary,
                  dark: primary,
                },
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riscosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="quantidade" fill={primary} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
};
