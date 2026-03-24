
import React from 'react';
import { Card } from '@/components/ui/card';
import { Brain, AlertTriangle, TrendingDown, MessageSquare } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export const IndicadoresGerais = () => {
  const dashboard = useDashboardData();
  const isLoading = dashboard.isLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const indicadores = [
    {
      icon: <Brain className="text-lavanda" />,
      label: "Pacientes Ativos",
      value: dashboard.totalSessions || 0,
    },
    {
      icon: <AlertTriangle className="text-destructive" />,
      label: "Alertas na Semana",
      value: dashboard.patientsWithFrequentAbsences || 0,
    },
    {
      icon: <TrendingDown className="text-orange-500" />,
      label: "Pacientes em Risco",
      value: dashboard.patientsWithoutSessionFor30Days || 0,
    },
    {
      icon: <MessageSquare className="text-menta-dark" />,
      label: "Temas Principais",
      value: "Em breve",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {indicadores.map((indicador, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-background">{indicador.icon}</div>
            <div>
              <p className="text-sm text-muted-foreground">{indicador.label}</p>
              <h3 className="text-2xl font-bold">{indicador.value}</h3>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
