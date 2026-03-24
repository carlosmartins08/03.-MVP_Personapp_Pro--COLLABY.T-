
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const TelaRecibosPaciente = () => {
  return (
    <div className="container pb-16">
      <PageHeader
        title="Meus Recibos"
        subtitle="Histórico de recibos e comprovantes"
      />
      
      <div className="space-y-6 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Documentos financeiros</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Acesse seus recibos e comprovantes de pagamento para fins de declaração de imposto de renda ou reembolso de plano de saúde.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelaRecibosPaciente;
