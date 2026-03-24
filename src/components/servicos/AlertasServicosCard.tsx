
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Clock, Calendar } from 'lucide-react';
import { useServicosAlertas } from '@/hooks/useServicosAlertas';

export const AlertasServicosCard = () => {
  const navigate = useNavigate();
  const { data: alertas } = useServicosAlertas();

  if (!alertas?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Alertas de Serviços
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alertas.map((alerta) => (
          <div key={alerta.contrato_id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{alerta.nome_paciente}</h4>
                <p className="text-sm text-muted-foreground">{alerta.nome_servico}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/pacientes/${alerta.paciente_id}`)}
              >
                Ver
              </Button>
            </div>
            
            <Progress 
              value={(alerta.qtd_sessoes_realizadas / alerta.qtd_total_sessoes) * 100}
              className="h-2"
            />
            
            <div className="flex gap-2 text-sm">
              {alerta.alerta_fim_sessoes && (
                <span className="flex items-center text-destructive">
                  <Calendar className="h-4 w-4 mr-1" />
                  {alerta.sessoes_restantes} sessões restantes
                </span>
              )}
              {alerta.alerta_inatividade && (
                <span className="flex items-center text-destructive">
                  <Clock className="h-4 w-4 mr-1" />
                  Inativo há +30 dias
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
