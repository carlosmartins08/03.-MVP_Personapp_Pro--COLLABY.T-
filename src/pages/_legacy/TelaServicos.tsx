
import React from 'react';
import { Plus } from 'lucide-react';
import { Button, PageHeader } from '@/design-system/components';
import { Dialog } from '@/components/ui/dialog';
import { ServicosTable } from '@/components/servicos/ServicosTable';
import { ServicoForm } from '@/components/servicos/ServicoForm';
import { AlertaServicosBadge } from '@/components/servicos/AlertaServicosBadge';
import { AlertasServicosCard } from '@/components/servicos/AlertasServicosCard';
import { useServicos } from '@/hooks/useServicos';
import type { Servico } from '@/types/servicos';
import { toast } from '@/components/ui/use-toast';

const TelaServicos = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [servicoParaEditar, setServicoParaEditar] = React.useState<Servico | null>(null);
  const { servicos, isLoading, filters, setFilters, createServico, updateServico, deleteServico } = useServicos();

  const handleCreate = async (data: Omit<Servico, 'id' | 'profissional_id' | 'created_at'>) => {
    try {
      await createServico.mutateAsync(data);
      setDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar serviço",
        description: "Verifique os dados e tente novamente."
      });
    }
  };

  const handleUpdate = async (data: Servico) => {
    try {
      await updateServico.mutateAsync(data);
      setServicoParaEditar(null);
      setDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar serviço",
        description: "Verifique os dados e tente novamente."
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteServico.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir serviço",
        description: "Não foi possível excluir o serviço. Ele pode estar em uso."
      });
    }
  };

  return (
    <div className="container pb-16">
      <PageHeader
        title="Serviços"
        subtitle="Gerencie os serviços oferecidos"
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
            <AlertaServicosBadge />
          </Button>
        }
      />
      
      <div className="px-4 space-y-6">
        <AlertasServicosCard />
        
        <ServicosTable
          servicos={servicos || []}
          isLoading={isLoading}
          onEdit={(servico) => {
            setServicoParaEditar(servico);
            setDialogOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <ServicoForm
          onSubmit={servicoParaEditar ? handleUpdate : handleCreate}
          onClose={() => {
            setDialogOpen(false);
            setServicoParaEditar(null);
          }}
          servico={servicoParaEditar}
          isSubmitting={createServico.isPending || updateServico.isPending}
        />
      </Dialog>
    </div>
  );
};

export default TelaServicos;
