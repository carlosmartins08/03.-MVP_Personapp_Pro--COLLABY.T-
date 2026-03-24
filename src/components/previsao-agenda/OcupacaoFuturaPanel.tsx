
import React from 'react';
import { Card } from '@/components/ui/card';
import { useOcupacaoFutura } from '@/hooks/useOcupacaoFutura';
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
  ResponsiveContainer,
} from 'recharts';

interface OcupacaoFuturaPanelProps {
  period: number;
}

export const OcupacaoFuturaPanel = ({ period }: OcupacaoFuturaPanelProps) => {
  const { data: ocupacaoData, isLoading } = useOcupacaoFutura(period);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Ocupação por Semana</h3>
        <p className="text-sm text-muted-foreground">
          Visão geral da ocupação da agenda nas próximas semanas
        </p>
      </div>

      <div className="h-[300px]">
        <ChartContainer
          config={{
            ocupacao: {
              theme: {
                light: "#9b87f5",
                dark: "#9b87f5",
              },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ocupacaoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="ocupacao" fill="#9b87f5" name="% Ocupação" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};
