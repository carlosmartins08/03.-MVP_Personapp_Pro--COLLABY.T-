import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, Badge } from '@/design-system/components';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type PacienteRisco = {
  id: string;
  nome: string;
  status_risco: 'alto' | 'moderado' | 'baixo' | string;
  score_atual: number;
};

type StatusBadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

const statusVariants: Record<string, StatusBadgeVariant> = {
  alto: 'error',
  moderado: 'warning',
  baixo: 'success',
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
};

export const ListaPacientesRisco = () => {
  const navigate = useNavigate();
  
  const { data: pacientes = [], isLoading } = useQuery<PacienteRisco[]>({
    queryKey: ['pacientes-risco'],
    queryFn: async () => {
      return api.get<PacienteRisco[]>('/analytics/pacientes-risco');
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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Pacientes em Acompanhamento</h3>
      <div className="space-y-4">
        {pacientes.map((paciente) => (
          <div key={paciente.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-4">
              <Avatar size="md" initials={getInitials(paciente.nome)} />
              <div>
                <h4 className="font-medium">{paciente.nome}</h4>
                <div className="flex gap-2 mt-1">
                  <Badge variant={statusVariants[paciente.status_risco] ?? 'neutral'} size="sm">
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
