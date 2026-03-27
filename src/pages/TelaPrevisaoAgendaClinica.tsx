
import React from 'react';
import { PageHeader, Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components';
import { Calendar, FileText } from 'lucide-react';
import { PeriodSelector } from '@/components/PeriodSelector';
import { OcupacaoFuturaPanel } from '@/components/previsao-agenda/OcupacaoFuturaPanel';
import { RiscoFaltasPanel } from '@/components/previsao-agenda/RiscoFaltasPanel';
import { AgendaInteligentePanel } from '@/components/previsao-agenda/AgendaInteligentePanel';
import { ExportarPrevisaoButton } from '@/components/previsao-agenda/ExportarPrevisaoButton';

// Define the correct PeriodOption type based on the actual implementation
type PeriodOption = {
  value: number;
  label: string;
};

const TelaPrevisaoAgendaClinica = () => {
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodOption>({ value: 14, label: '14 dias' });

  const handlePeriodChange = (value: PeriodOption) => {
    setSelectedPeriod(value);
  };

  return (
    <div className="container pb-16">
      <PageHeader
        title="Previsão da Agenda"
        subtitle="Análise preditiva e insights sobre agendamentos futuros"
        action={
          <div className="flex items-center gap-2">
            <PeriodSelector
              selectedOption={selectedPeriod}
              onOptionChange={handlePeriodChange}
              options={[
                { value: 7, label: '7 dias' },
                { value: 14, label: '14 dias' },
                { value: 30, label: '30 dias' },
              ]}
            />
            <ExportarPrevisaoButton period={selectedPeriod.value} />
          </div>
        }
      />

      <div className="space-y-6 p-4">
        <Tabs defaultValue="ocupacao" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ocupacao">Ocupação Futura</TabsTrigger>
            <TabsTrigger value="riscos">Riscos de Faltas</TabsTrigger>
            <TabsTrigger value="agenda">Agenda Inteligente</TabsTrigger>
          </TabsList>

          <TabsContent value="ocupacao" className="mt-6">
            <OcupacaoFuturaPanel period={selectedPeriod.value} />
          </TabsContent>

          <TabsContent value="riscos" className="mt-6">
            <RiscoFaltasPanel period={selectedPeriod.value} />
          </TabsContent>

          <TabsContent value="agenda" className="mt-6">
            <AgendaInteligentePanel period={selectedPeriod.value} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TelaPrevisaoAgendaClinica;
