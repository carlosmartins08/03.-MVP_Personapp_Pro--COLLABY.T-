
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const ListaPacientesRisco = () => {
  const navigate = useNavigate();
  
  const { data: pacientes, isLoading } = useQuery({
    queryKey: ['pacientes-risco'],
    queryFn: async () => {
      return api.get('/analytics/pacientes-risco');
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alto': return 'destructive';
      case 'moderado': return 'default';
      case 'baixo': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Pacientes em Acompanhamento</h3>
      <div className="space-y-4">
        {pacientes?.map((paciente: any) => (
          <div key={paciente.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                <User className="text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">{paciente.nome}</h4>
                <div className="flex gap-2 mt-1">
                  <Badge variant={getStatusColor(paciente.status_risco)}>
                    {paciente.status_risco}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Score: {paciente.score_atual}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/pacientes/${paciente.id}`)}
            >
              Ver perfil
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
