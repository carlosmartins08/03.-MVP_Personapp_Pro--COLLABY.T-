import { Card } from '@/design-system/components';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface FinancialSummaryCardsProps {
  summary: {
    total_received: number;
    total_pending: number;
  };
}

export const FinancialSummaryCards = ({ summary }: FinancialSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card variant="default" className="bg-menta-light border-none p-4">
        <div className="pb-2">
          <h3 className="text-sm font-medium text-gray-600 flex items-center">
            <ArrowUpCircle size={16} className="mr-1" />
            Recebido
          </h3>
        </div>
        <div>
          <p className="text-2xl font-bold">R$ {summary.total_received}</p>
        </div>
      </Card>
      
      <Card variant="default" className="bg-lavanda-light border-none p-4">
        <div className="pb-2">
          <h3 className="text-sm font-medium text-gray-600 flex items-center">
            <ArrowDownCircle size={16} className="mr-1" />
            Pendente
          </h3>
        </div>
        <div>
          <p className="text-2xl font-bold">R$ {summary.total_pending}</p>
        </div>
      </Card>
    </div>
  );
};
