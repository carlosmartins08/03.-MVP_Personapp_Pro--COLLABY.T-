import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart2 } from 'lucide-react';
import type { Sessao } from '@/types/queries';
import type { TooltipProps } from 'recharts';

interface ScoreEmocionalProps {
  sessoes: Sessao[];
  isLoading: boolean;
}

interface ChartDataPoint {
  date: string;
  formattedDate: string;
  score: number;
}

const customTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as ChartDataPoint;
    return (
      <div className="bg-white p-2 border rounded-md shadow-sm text-xs">
        <p className="font-medium">{dataPoint.formattedDate}</p>
        <p>
          Score: <span className="font-medium">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ScoreEmocional = ({ sessoes, isLoading }: ScoreEmocionalProps) => {
  const chartData: ChartDataPoint[] = (sessoes || [])
    .filter((sessao) => sessao.scoreClinico !== null && sessao.data)
    .map((sessao) => ({
      date: sessao.data as string,
      formattedDate: format(parseISO(sessao.data as string), 'dd/MM/yyyy', { locale: ptBR }),
      score: sessao.scoreClinico as number,
    }));

  const mediaScore =
    chartData.length > 0
      ? chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length
      : 0;

  const ultimoScore = chartData.length > 0 ? chartData[chartData.length - 1].score : 0;
  const penultimoScore = chartData.length > 1 ? chartData[chartData.length - 2].score : 0;
  const variacao = ultimoScore - penultimoScore;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <BarChart2 className="h-4 w-4 mr-2 text-muted-foreground" />
          Score Emocional
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-muted-foreground">Media</div>
                <div className="text-2xl font-bold">{mediaScore.toFixed(1)}</div>
              </div>

              {chartData.length >= 2 && (
                <div>
                  <div className="text-sm text-muted-foreground">Ultima variacao</div>
                  <div
                    className={`text-lg font-medium ${
                      variacao > 0 ? 'text-green-600' : variacao < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    {variacao > 0 ? '+' : ''}
                    {variacao.toFixed(1)}
                  </div>
                </div>
              )}

              {chartData.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground">Ultimo score</div>
                  <div className="text-2xl font-bold">{ultimoScore}</div>
                </div>
              )}
            </div>

            {chartData.length > 0 ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis
                      dataKey="formattedDate"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => value.split('/').slice(0, 2).join('/')}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip content={customTooltip} />
                    <ReferenceLine y={mediaScore} stroke="#888" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Nao ha dados suficientes para exibir o grafico
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoreEmocional;
