
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { FinancialTransaction } from '@/hooks/useMonthlyFinancialSummary';
import { ArrowUpCircle, ArrowDownCircle, Check, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

interface TransactionListProps {
  transactions: FinancialTransaction[];
  onMarkAsPaid: (chargeId: string) => Promise<void>;
  onSendCharge: (chargeId: string) => Promise<void>;
  isMarkingAsPaid: boolean;
  isSendingCharge: boolean;
}

export const TransactionList = ({
  transactions,
  onMarkAsPaid,
  onSendCharge,
  isMarkingAsPaid,
  isSendingCharge
}: TransactionListProps) => {
  const renderTransacao = (item: FinancialTransaction) => {
    const pacienteNome = item.pacienteNome || 'Paciente';
    
    const dataFormatada = item.dataPagamento 
      ? format(new Date(item.dataPagamento), "dd/MM/yyyy", { locale: ptBR })
      : 'Pendente';
    
    return (
      <Card key={item.id} className="persona-card mb-3">
        <div className="flex items-center p-3">
          <div className="flex-shrink-0 mr-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              item.status === 'pago' 
                ? 'bg-menta-light text-menta-dark'
                : item.status === 'pendente'
                  ? 'bg-azul-light text-azul'
                  : 'bg-red-100 text-red-500'
            }`}>
              {item.status === 'pago' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold">{pacienteNome}</h3>
            <p className="text-sm text-muted-foreground">
              {dataFormatada}
              {item.metodoPagamento && ` • ${item.metodoPagamento}`}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className={`font-semibold ${
              item.status === 'pago'
                ? 'text-menta-dark'
                : item.status === 'pendente'
                  ? 'text-azul'
                  : 'text-red-500'
            }`}>
              {currencyFormatter.format(item.valor ?? 0)}
            </p>
            <div className="flex gap-2">
              {item.status !== 'pago' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsPaid(item.id)}
                    disabled={isMarkingAsPaid}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Pago
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSendCharge(item.id)}
                    disabled={isSendingCharge}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Cobrar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-1">
      {transactions.map(renderTransacao)}
    </div>
  );
};
