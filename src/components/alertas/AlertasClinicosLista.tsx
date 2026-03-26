import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/design-system/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AlertaClinico } from '@/types/queries';
import { api } from '@/lib/api';

type StatusBadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

interface AlertasClinicosListaProps {
  defaultPacienteId?: string;
}

export const AlertasClinicosLista: React.FC<AlertasClinicosListaProps> = ({ defaultPacienteId }) => {
  const [selectedPacienteId, setSelectedPacienteId] = React.useState<string | undefined>(defaultPacienteId);

  const { data: pacientes } = useQuery({
    queryKey: ['pacientes'],
    queryFn: async () => {
      return api.get<Array<{ id: string; nome: string }>>('/pacientes');
    },
  });

  const { data: alertas, isLoading } = useQuery({
    queryKey: ['alertas-clinicos', selectedPacienteId],
    queryFn: async () => {
      const data = await api.get<AlertaClinico[]>('/alertas', {
        query: selectedPacienteId ? { pacienteId: selectedPacienteId } : undefined,
      });
      return data;
    },
  });

  const getNivelUrgenciaVariant = (nivel: string | null | undefined): StatusBadgeVariant => {
    switch (nivel) {
      case 'alto':
      case 'urgent':
        return 'error';
      case 'medio':
      case 'moderado':
        return 'warning';
      case 'baixo':
      case 'leve':
        return 'success';
      default:
        return 'neutral';
    }
  };

  if (isLoading) {
    return <div>Carregando alertas...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Filtrar por paciente:</label>
        <Select value={selectedPacienteId} onValueChange={(value) => setSelectedPacienteId(value)}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Todos os pacientes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os pacientes</SelectItem>
            {pacientes?.map((paciente) => (
              <SelectItem key={paciente.id} value={paciente.id}>
                {paciente.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Descricao</TableHead>
            <TableHead>Urgencia</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alertas?.map((alerta) => (
            <TableRow key={alerta.id}>
              <TableCell>{alerta.tipoAlerta}</TableCell>
              <TableCell>{alerta.descricao}</TableCell>
              <TableCell>
                <Badge variant={getNivelUrgenciaVariant(alerta.nivelUrgencia)} size="sm">
                  {alerta.nivelUrgencia?.toUpperCase() || 'BAIXO'}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(alerta.dataCriacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </TableCell>
            </TableRow>
          ))}
          {(!alertas || alertas.length === 0) && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Nenhum alerta encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
