import React from 'react';
import { Card } from '@/design-system/components';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  PieChart, 
  Pie, 
  LineChart, 
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer 
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { colors } from '@/design-system';

type SentimentoData = {
  name: string;
  value: number;
};

type EvolucaoScoreData = {
  semana: string;
  score: number;
};

export const GraficosSentimentosEvolucao = () => {
  const { data: sentimentosData = [] } = useQuery<SentimentoData[]>({
    queryKey: ['sentimentos-distribuicao'],
    queryFn: async () => {
      return api.get<SentimentoData[]>('/analytics/sentimentos');
    },
  });

  const { data: evolucaoData = [] } = useQuery<EvolucaoScoreData[]>({
    queryKey: ['evolucao-scores'],
    queryFn: async () => {
      return api.get<EvolucaoScoreData[]>('/analytics/evolucao-score');
    },
  });

  const primary = colors.primary[400];
  const COLORS = [
    colors.primary[400],
    colors.primary[300],
    colors.primary[200],
    colors.primary[100],
    colors.primary[50],
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card variant="default" className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distribuição de Sentimentos</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              value: {
                theme: {
                  light: primary,
                  dark: primary,
                },
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentosData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill={primary}
                  label
                >
                  {sentimentosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>

      <Card variant="default" className="p-6">
        <h3 className="text-lg font-semibold mb-4">Evolução do Score Clínico</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              score: {
                theme: {
                  light: primary,
                  dark: primary,
                },
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucaoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={primary}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
};
