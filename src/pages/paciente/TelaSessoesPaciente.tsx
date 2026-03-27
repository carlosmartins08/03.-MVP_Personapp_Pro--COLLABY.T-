
import React from 'react';
import { Card, PageHeader } from '@/design-system/components';
import { CalendarCheck } from 'lucide-react';

const TelaSessoesPaciente = () => {
  return (
    <div className="container pb-16">
      <PageHeader
        title="Minhas Sessões"
        subtitle="Histórico e agendamentos"
      />
      
      <div className="space-y-6 px-4">
        <Card>
          <div className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CalendarCheck className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Histórico de sessões</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Aqui você poderá visualizar suas sessões passadas e agendamentos futuros com seu terapeuta.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TelaSessoesPaciente;
