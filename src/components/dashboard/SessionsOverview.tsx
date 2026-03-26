import React from 'react';
import { Card } from '@/design-system/components';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis 
} from 'recharts';
import { CalendarDays, Users, AlertTriangle } from 'lucide-react';
import { colors } from '@/design-system';

interface SessionsOverviewProps {
  totalSessions: number;
  totalAbsences: number;
  todaySessions: number;
  weeklyData: Array<{
    name: string;
    total: number;
  }>;
  isLoading: boolean;
}

const SessionsOverview: React.FC<SessionsOverviewProps> = ({
  totalSessions,
  totalAbsences,
  todaySessions,
  weeklyData,
  isLoading
}) => {
  const primary = colors.primary[400];

  return (
    <Card variant="default" className="shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-semibold flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-lavanda" />
          Visão Geral de Sessões
        </h3>
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#F1F0FB] p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Realizadas</p>
            <p className="text-2xl font-bold text-gray-800">{totalSessions}</p>
          </div>
          <div className="bg-[#FEF7CD] p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Faltas</p>
            <p className="text-2xl font-bold text-gray-800">{totalAbsences}</p>
          </div>
          <div className="bg-[#F2FCE2] p-3 rounded-lg">
            <p className="text-sm text-gray-600">Hoje</p>
            <p className="text-2xl font-bold text-gray-800">{todaySessions}</p>
          </div>
        </div>
        
        <div className="h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : (
            <ChartContainer
              config={{
                series: {
                  label: "Sessões por semana",
                  color: primary,
                },
                background: {
                  color: "#f8f9fa",
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Bar 
                    dataKey="total" 
                    fill={primary}
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SessionsOverview;
