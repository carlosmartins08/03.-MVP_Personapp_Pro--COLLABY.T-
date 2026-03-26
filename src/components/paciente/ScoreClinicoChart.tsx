import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Card } from '@/design-system/components';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { ChartContainer } from '@/components/ui/chart';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { ChartThemeConfig } from '@/types/paciente';
import type { TooltipProps } from 'recharts';
import { colors } from '@/design-system';

interface ScoreChartData {
  data: string;
  score: number;
  dataCompleta: string;
}

interface ScoreClinicoChartProps {
  scoreChartData: ScoreChartData[];
  isLoading: boolean;
}

const ScoreClinicoChart: React.FC<ScoreClinicoChartProps> = ({ 
  scoreChartData, 
  isLoading 
}) => {
  const { getTexto, idioma } = useLocalizacao();
  const primary = colors.primary[400];
  
  const customTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as ScoreChartData;
      return (
        <div className="bg-white p-2 border rounded-md shadow-sm">
          <p className="text-sm font-medium">{dataPoint.data}</p>
          <p className="text-xs">
            Score: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="default" className="overflow-hidden border-none shadow-lg rounded-3xl bg-gradient-to-br from-white to-lavanda-light p-0">
      <div className="pb-2 px-4 pt-4">
        <h3 className="text-base font-medium flex items-center">
          <BarChart2 className="h-4 w-4 mr-2 text-muted-foreground" />
          {getTexto('evolucao_score_clinico') || 'Evolução do score clínico'}
        </h3>
      </div>
      <div className="px-4 pb-4">
        {isLoading ? (
          <Skeleton className="h-[200px] w-full rounded-2xl" />
        ) : scoreChartData.length > 1 ? (
          <div className="h-[200px]">
            <ChartContainer
              config={
                {
                  score: {
                    theme: {
                      light: primary,
                      dark: primary
                    },
                  },
                } as ChartThemeConfig
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="data" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.toString()}
                  />
                  <Tooltip content={customTooltip} />
                  <ReferenceLine y={50} stroke="#888" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={primary}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <BarChart2 className="h-12 w-12 text-muted-foreground opacity-30 mb-2" />
            <p className="text-muted-foreground">
              {getTexto('sem_sessoes_suficientes') || 'Não há sessões suficientes'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getTexto('necessario_mais_sessoes') || 'É necessário ter pelo menos 2 sessões com avaliação'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ScoreClinicoChart;
