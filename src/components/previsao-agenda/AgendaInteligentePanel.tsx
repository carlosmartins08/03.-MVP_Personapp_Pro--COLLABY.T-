
import React from 'react';
import { Card } from '@/components/ui/card';
import { useAgendaInteligente } from '@/hooks/useAgendaInteligente';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgendaInteligentePanelProps {
  period: number;
}

export const AgendaInteligentePanel = ({ period }: AgendaInteligentePanelProps) => {
  const { data: sessoesInteligentes, isLoading } = useAgendaInteligente(period);

  const getStatusColor = (risco: string) => {
    switch (risco) {
      case 'baixo':
        return 'border-l-4 border-l-menta-dark';
      case 'moderado':
        return 'border-l-4 border-l-amber-500';
      case 'alto':
        return 'border-l-4 border-l-red-500';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Agenda com Previsão Inteligente</h3>
        <p className="text-sm text-muted-foreground">
          Visualização da agenda com indicadores de risco
        </p>
      </div>

      <div className="space-y-4">
        {sessoesInteligentes?.map(sessao => (
          <div 
            key={sessao.id}
            className={`bg-white rounded-lg p-4 shadow-sm ${getStatusColor(sessao.nivelRisco)}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">
                  {format(new Date(sessao.data), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(sessao.data), "HH:mm", { locale: ptBR })}
                </div>
                <div className="mt-1 font-medium">{sessao.pacienteNome}</div>
              </div>

              <div className="flex items-center gap-2">
                {sessao.modalidade === 'online' ? '💻' : '🏥'}
                {sessao.nivelRisco === 'alto' && '⚠️'}
                {sessao.alta_seguranca && '🟢'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
