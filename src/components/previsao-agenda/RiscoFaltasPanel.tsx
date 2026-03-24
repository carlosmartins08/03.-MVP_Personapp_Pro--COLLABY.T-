
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';
import { useRiscoFaltas } from '@/hooks/useRiscoFaltas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RiscoFaltasPanelProps {
  period: number;
}

export const RiscoFaltasPanel = ({ period }: RiscoFaltasPanelProps) => {
  const navigate = useNavigate();
  const { data: pacientesRisco, isLoading } = useRiscoFaltas(period);

  const getRiscoBadge = (risco: 'baixo' | 'moderado' | 'alto') => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (risco) {
      case 'baixo':
        return `${baseClasses} bg-menta-light text-menta-dark`;
      case 'moderado':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case 'alto':
        return `${baseClasses} bg-red-100 text-red-800`;
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
        <h3 className="text-lg font-semibold mb-2">Pacientes com Risco de Falta</h3>
        <p className="text-sm text-muted-foreground">
          Análise baseada no histórico de faltas e reagendamentos
        </p>
      </div>

      <div className="space-y-4">
        {pacientesRisco?.map(paciente => (
          <div 
            key={paciente.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{paciente.nome}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(paciente.proximaSessao), "dd 'de' MMMM 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={getRiscoBadge(paciente.nivelRisco)}>
                    Risco {paciente.nivelRisco}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {paciente.faltasRecentes} faltas em {paciente.totalAgendamentos} sessões
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => navigate(`/pacientes/${paciente.id}`)}
                >
                  Ver perfil
                </Button>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              {paciente.nivelRisco === 'alto' && (
                <Button variant="outline" size="sm" className="text-xs">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Enviar lembrete
                </Button>
              )}
              <Button variant="outline" size="sm" className="text-xs">
                <Clock className="h-4 w-4 mr-1" />
                Confirmar sessão
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
