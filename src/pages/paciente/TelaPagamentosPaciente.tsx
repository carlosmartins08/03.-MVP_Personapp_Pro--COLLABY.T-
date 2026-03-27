
import React from 'react';
import { Card, PageHeader } from '@/design-system/components';
import { CreditCard } from 'lucide-react';

const TelaPagamentosPaciente = () => {
  return (
    <div className="container pb-16">
      <PageHeader
        title="Pagamentos"
        subtitle="Gerencie seus pagamentos e faturas"
      />
      
      <div className="space-y-6 px-4">
        <Card>
          <div className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CreditCard className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Sistema de pagamentos</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Visualize suas faturas pendentes, realize pagamentos e consulte seu histórico financeiro.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TelaPagamentosPaciente;
