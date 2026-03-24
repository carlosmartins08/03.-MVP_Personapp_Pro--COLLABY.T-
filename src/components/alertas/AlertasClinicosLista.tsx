import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AlertaClinico } from '@/types/queries';
import { api } from '@/lib/api';

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

  const getNivelUrgenciaBadge = (nivel: string) => {
    const styles = {
      alto: 'bg-red-100 text-red-800 border-red-200',
      medio: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      baixo: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    return styles[nivel as keyof typeof styles] || 'bg-gray-100 text-gray-800';
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
                <Badge className={getNivelUrgenciaBadge(alerta.nivelUrgencia || 'baixo')}>
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
