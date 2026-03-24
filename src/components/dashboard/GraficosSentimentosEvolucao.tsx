
import React from 'react';
import { Card } from '@/components/ui/card';
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

export const GraficosSentimentosEvolucao = () => {
  const { data: sentimentosData } = useQuery({
    queryKey: ['sentimentos-distribuicao'],
    queryFn: async () => {
      return api.get('/analytics/sentimentos');
    },
  });

  const { data: evolucaoData } = useQuery({
    queryKey: ['evolucao-scores'],
    queryFn: async () => {
      return api.get('/analytics/evolucao-score');
    },
  });

  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distribuição de Sentimentos</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              value: {
                theme: {
                  light: "#9b87f5",
                  dark: "#9b87f5",
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
                  fill="#8884d8"
                  label
                >
                  {sentimentosData?.map((entry: any, index: number) => (
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

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Evolução do Score Clínico</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              score: {
                theme: {
                  light: "#9b87f5",
                  dark: "#9b87f5",
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
                  stroke="#9b87f5"
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
