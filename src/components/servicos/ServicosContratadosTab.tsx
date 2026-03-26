
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ServicosContratadosTable } from '@/components/servicos/ServicosContratadosTable';
import { ContratarServicoForm } from '@/components/servicos/ContratarServicoForm';
import { useServicosContratados } from '@/hooks/useServicosContratados';
import { useServicos } from '@/hooks/useServicos';
import { StatusServico, ContratarServicoPayload } from '@/types/servicos';

interface ServicosContratadosTabProps {
  pacienteId: string;
}

export function ServicosContratadosTab({ pacienteId }: ServicosContratadosTabProps) {
  const { 
    servicosContratados, 
    isLoading, 
    criarServicoContratado, 
    incrementarSessoesRealizadas,
    atualizarStatusServico
  } = useServicosContratados(pacienteId);
  
  const { servicos } = useServicos();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [servicoId, setServicoId] = useState<string | null>(null);
  const [novoStatus, setNovoStatus] = useState<StatusServico | null>(null);

  const handleContratarServico = async (data: ContratarServicoPayload) => {
    try {
      await criarServicoContratado.mutateAsync({
        ...data,
        paciente_id: pacienteId,
        data_inicio: data.data_inicio.toISOString().split('T')[0],
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Erro ao contratar serviço:', error);
    }
  };

  const handleAtualizarStatus = (id: string, status: StatusServico) => {
    setServicoId(id);
    setNovoStatus(status);
    setStatusDialogOpen(true);
  };

  const confirmarAtualizarStatus = async () => {
    if (servicoId && novoStatus) {
      await atualizarStatusServico.mutateAsync({ 
        id: servicoId, 
        status: novoStatus 
      });
      setStatusDialogOpen(false);
      setServicoId(null);
      setNovoStatus(null);
    }
  };

  const servicosAtivos = servicosContratados?.filter(sc => sc.status === 'ativo') || [];
  const sessoesTotal = servicosAtivos.reduce((acc, s) => acc + s.qtd_total_sessoes, 0);
  const sessoesRealizadas = servicosAtivos.reduce((acc, s) => acc + s.qtd_sessoes_realizadas, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Serviços Ativos</CardDescription>
            <CardTitle>{servicosAtivos.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sessões Previstas</CardDescription>
            <CardTitle>{sessoesTotal}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sessões Realizadas</CardDescription>
            <CardTitle>{sessoesRealizadas} / {sessoesTotal}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Serviços Contratados</h3>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Contratar Serviço
        </Button>
      </div>

      <ServicosContratadosTable
        servicos={servicosContratados || []}
        isLoading={isLoading}
        onIncrementarSessao={incrementarSessoesRealizadas.mutate}
        onAtualizarStatus={handleAtualizarStatus}
        exibirProgresso={true}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contratar Serviço</DialogTitle>
          </DialogHeader>
          <ContratarServicoForm
            onSubmit={handleContratarServico}
            isSubmitting={criarServicoContratado.isPending}
            servicos={servicos}
            pacienteId={pacienteId}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {novoStatus === 'ativo' ? 'Reativar' : 
               novoStatus === 'suspenso' ? 'Suspender' : 'Encerrar'} serviço
            </AlertDialogTitle>
            <AlertDialogDescription>
              {novoStatus === 'ativo' && 'Deseja reativar este serviço? O paciente poderá continuar utilizando as sessões restantes.'}
              {novoStatus === 'suspenso' && 'Deseja suspender este serviço temporariamente? O paciente não poderá utilizar as sessões enquanto estiver suspenso.'}
              {novoStatus === 'encerrado' && 'Deseja encerrar este serviço definitivamente? Esta ação não pode ser desfeita.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarAtualizarStatus}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
