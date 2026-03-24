
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
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
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CreditCard className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Sistema de pagamentos</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Visualize suas faturas pendentes, realize pagamentos e consulte seu histórico financeiro.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelaPagamentosPaciente;
