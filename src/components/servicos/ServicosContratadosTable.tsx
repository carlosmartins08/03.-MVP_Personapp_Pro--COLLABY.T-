
import React from 'react';
import { Check, Clock, AlertTriangle, Ban, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ServicoContratado, StatusServico } from '@/types/servicos';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Progress } from '@/components/ui/progress';
import { useServicosAlertas } from '@/hooks/useServicosAlertas';
import { ServicoAcoesFinalizacao } from './ServicoAcoesFinalizacao';

interface ServicosContratadosTableProps {
  servicos: ServicoContratado[];
  isLoading: boolean;
  showPaciente?: boolean;
  onIncrementarSessao: (id: string) => void;
  onAtualizarStatus: (id: string, status: StatusServico) => void;
  exibirProgresso?: boolean;
}

const getStatusBadge = (status: StatusServico) => {
  const styles: Record<StatusServico, { icon: React.ReactNode; className: string }> = {
    'ativo': { 
      icon: <Check className="h-3.5 w-3.5" />, 
      className: 'bg-green-100 text-green-800 border-green-200' 
    },
    'encerrado': { 
      icon: <Clock className="h-3.5 w-3.5" />, 
      className: 'bg-gray-100 text-gray-800 border-gray-200' 
    },
    'suspenso': { 
      icon: <Ban className="h-3.5 w-3.5" />, 
      className: 'bg-red-100 text-red-800 border-red-200' 
    }
  };
  return styles[status];
};

export const ServicosContratadosTable = ({ 
  servicos, 
  isLoading, 
  showPaciente = false,
  onIncrementarSessao,
  onAtualizarStatus,
  exibirProgresso = false 
}: ServicosContratadosTableProps) => {
  const { data: alertas } = useServicosAlertas();
  
  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Carregando serviços contratados...
      </div>
    );
  }

  if (!servicos?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhum serviço contratado encontrado.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showPaciente && <TableHead>Paciente</TableHead>}
          <TableHead>Serviço</TableHead>
          <TableHead>Início</TableHead>
          <TableHead>Sessões</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {servicos.map((servico) => {
          const alerta = alertas?.find(a => a.contrato_id === servico.id);
          const progresso = (servico.qtd_sessoes_realizadas / servico.qtd_total_sessoes) * 100;
          const statusBadge = getStatusBadge(servico.status);
          const isCompleted = servico.qtd_sessoes_realizadas >= servico.qtd_total_sessoes;
          
          return (
            <TableRow key={servico.id}>
              {showPaciente && (
                <TableCell className="font-medium">{servico.paciente_nome}</TableCell>
              )}
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {servico.servico_nome}
                  {alerta && <AlertCircle className="h-4 w-4 text-destructive" />}
                </div>
                {exibirProgresso && (
                  <div className="mt-2 space-y-1">
                    <Progress value={progresso} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {servico.qtd_sessoes_realizadas} de {servico.qtd_total_sessoes} sessões
                    </p>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(servico.data_inicio), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {servico.qtd_sessoes_realizadas} / {servico.qtd_total_sessoes}
                  </span>
                  {isCompleted && (
                    <span className="text-xs text-muted-foreground">Pacote concluído</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`flex w-fit items-center gap-1 ${statusBadge.className}`}>
                  {statusBadge.icon}
                  {servico.status === 'ativo' ? 'Ativo' : 
                   servico.status === 'encerrado' ? 'Encerrado' : 'Suspenso'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="space-y-4">
                  <div className="flex justify-end gap-2">
                  {servico.status === 'ativo' && !isCompleted && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onIncrementarSessao(servico.id)}
                    >
                      Registrar sessão
                    </Button>
                  )}
                  {servico.status === 'ativo' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAtualizarStatus(servico.id, 'suspenso')}
                    >
                      Suspender
                    </Button>
                  )}
                  {servico.status === 'suspenso' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAtualizarStatus(servico.id, 'ativo')}
                    >
                      Reativar
                    </Button>
                  )}
                  {(servico.status === 'ativo' || servico.status === 'suspenso') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAtualizarStatus(servico.id, 'encerrado')}
                    >
                      Encerrar
                    </Button>
                  )}
                </div>
                  
                  {/* Add the new finalization actions */}
                  {alerta && (
                    <ServicoAcoesFinalizacao
                      servico={servico}
                      alerta={alerta}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
