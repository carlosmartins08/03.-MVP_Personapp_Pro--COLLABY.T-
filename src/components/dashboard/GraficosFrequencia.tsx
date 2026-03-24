
import React from 'react';
import { Card } from '@/components/ui/card';
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Faltas e Reagendamentos</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              faltas: {
                theme: {
                  light: "#ea384c",
                  dark: "#ea384c",
                },
              },
              reagendamentos: {
                theme: {
                  light: "#FEC6A1",
                  dark: "#FEC6A1",
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
                <Bar dataKey="faltas" fill="#ea384c" />
                <Bar dataKey="reagendamentos" fill="#FEC6A1" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distribuição de Riscos</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              quantidade: {
                theme: {
                  light: "#9b87f5",
                  dark: "#9b87f5",
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
                <Bar dataKey="quantidade" fill="#9b87f5" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
};
