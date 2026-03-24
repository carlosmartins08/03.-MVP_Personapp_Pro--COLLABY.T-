
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card className="bg-menta-light border-none">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <ArrowUpCircle size={16} className="mr-1" />
            Recebido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">R$ {summary.total_received}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-lavanda-light border-none">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <ArrowDownCircle size={16} className="mr-1" />
            Pendente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">R$ {summary.total_pending}</p>
        </CardContent>
      </Card>
    </div>
  );
};
