import React, { useEffect, useState } from 'react';
import { Button } from '@/design-system/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { useMonthlyFinancialSummary } from '@/hooks/useMonthlyFinancialSummary';
import { PeriodSelector } from '@/components/PeriodSelector';
import { useMarkChargeAsPaid } from '@/hooks/useMarkChargeAsPaid';
import { useSimulateChargeSend } from '@/hooks/useSimulateChargeSend';
import ExportFinanceiroButton from '@/components/financeiro/ExportFinanceiroButton';
import { FinancialSummaryCards } from '@/components/financeiro/FinancialSummaryCards';
import { TransactionList } from '@/components/financeiro/TransactionList';

const TelaFinanceiro = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState<string>('Este mÃªs');
  const {
    summary,
    periodLabel,
    transactions: allTransactions,
    receivedTransactions,
    pendingTransactions,
    fetchSummary,
    isLoading,
  } = useMonthlyFinancialSummary();
  const { markAsPaid, isLoading: isMarkingAsPaid, activeChargeId } = useMarkChargeAsPaid();
  const { simulateSend, isLoading: isSendingCharge } = useSimulateChargeSend();

  useEffect(() => {
    fetchSummary(periodoSelecionado).catch((error) => {
      console.error('Failed to load summary:', error);
    });
  }, [periodoSelecionado, fetchSummary]);

  const periodName = periodLabel ?? periodoSelecionado;

  const handleMarkAsPaid = async (chargeId: string) => {
    try {
      await markAsPaid(chargeId);
      await fetchSummary(periodoSelecionado);
    } catch (error) {
      console.error('Failed to mark as paid:', error);
    }
  };

  const handleSendCharge = async (chargeId: string) => {
    try {
      await simulateSend(chargeId);
    } catch (error) {
      console.error('Failed to send charge:', error);
    }
  };

  return (
    <div className="container pb-16">
      <PageHeader
        title="Financeiro"
        subtitle="Controle financeiro das sessÃµes"
        rightContent={
          <ExportFinanceiroButton
            financialData={allTransactions}
            summary={summary}
            period={periodName}
          />
        }
      />

      <div className="p-4">
        <div className="mb-4">
          <PeriodSelector
            value={periodoSelecionado}
            onValueChange={(newValue) => {
              if (typeof newValue === 'string') {
                setPeriodoSelecionado(newValue);
              } else if (typeof newValue === 'object' && newValue !== null) {
                setPeriodoSelecionado(newValue.label);
              }
            }}
          />
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground mb-4">Atualizando dados financeiros...</p>
        )}

        <FinancialSummaryCards summary={summary} />

        <Tabs defaultValue="todas" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="recebidas">Recebidas</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="mt-0">
            <TransactionList
              transactions={allTransactions}
              onMarkAsPaid={handleMarkAsPaid}
              onSendCharge={handleSendCharge}
              isMarkingAsPaid={isMarkingAsPaid}
              isSendingCharge={isSendingCharge}
              activeChargeId={activeChargeId}
            />
          </TabsContent>

          <TabsContent value="recebidas" className="mt-0">
            <TransactionList
              transactions={receivedTransactions}
              onMarkAsPaid={handleMarkAsPaid}
              onSendCharge={handleSendCharge}
              isMarkingAsPaid={isMarkingAsPaid}
              isSendingCharge={isSendingCharge}
              activeChargeId={activeChargeId}
            />
          </TabsContent>

          <TabsContent value="pendentes" className="mt-0">
            <TransactionList
              transactions={pendingTransactions}
              onMarkAsPaid={handleMarkAsPaid}
              onSendCharge={handleSendCharge}
              isMarkingAsPaid={isMarkingAsPaid}
              isSendingCharge={isSendingCharge}
              activeChargeId={activeChargeId}
            />

            <div className="mt-4">
              <Button 
                variant="primary"
                className="w-full flex items-center justify-center"
              >
                <Calendar size={16} className="mr-2" />
                Gerar RelatÃ³rio
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TelaFinanceiro;
