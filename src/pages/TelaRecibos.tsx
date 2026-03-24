
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/PageHeader';
import { RecibosForm } from '@/components/recibos/RecibosForm';
import { RecibosTable } from '@/components/recibos/RecibosTable';
import { RecibosFilter } from '@/components/recibos/RecibosFilter';
import { useRecibos } from '@/hooks/useRecibos';

const TelaRecibos = () => {
  const { 
    recibos, 
    isLoading, 
    filters, 
    setFilters,
    handleCreateRecibo,
    handleSendRecibo,
    handleDeleteRecibo
  } = useRecibos();

  return (
    <div className="container pb-16">
      <PageHeader
        title="Recibos"
        subtitle="Emita e gerencie recibos de sessões"
      />
      
      <div className="space-y-6 p-4">
        <RecibosForm onSubmit={handleCreateRecibo} />
        
        <div className="rounded-lg border bg-card">
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b">
            <RecibosFilter filters={filters} onFilterChange={setFilters} />
          </div>
          
          <RecibosTable 
            recibos={recibos}
            isLoading={isLoading}
            onSend={handleSendRecibo}
            onDelete={handleDeleteRecibo}
          />
        </div>
      </div>
    </div>
  );
};

export default TelaRecibos;
