
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/ui/PageHeader';
import { IndicadoresGerais } from '@/components/dashboard/IndicadoresGerais';
import { GraficosSentimentosEvolucao } from '@/components/dashboard/GraficosSentimentosEvolucao';
import { ListaPacientesRisco } from '@/components/dashboard/ListaPacientesRisco';
import { GraficosFrequencia } from '@/components/dashboard/GraficosFrequencia';

const DashboardPrincipalPsicologo = () => {
  return (
    <div className="container pb-16">
      <PageHeader
        title="Dashboard Principal"
        subtitle="Visão geral da sua prática clínica"
      />
      
      <div className="px-4 space-y-6">
        <IndicadoresGerais />
        
        <Tabs defaultValue="sentimentos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sentimentos">Sentimentos e Evolução</TabsTrigger>
            <TabsTrigger value="frequencia">Frequência e Risco</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sentimentos" className="mt-6">
            <GraficosSentimentosEvolucao />
          </TabsContent>
          
          <TabsContent value="frequencia" className="mt-6">
            <GraficosFrequencia />
          </TabsContent>
        </Tabs>
        
        <Card className="p-6">
          <ListaPacientesRisco />
        </Card>
      </div>
    </div>
  );
};

export default DashboardPrincipalPsicologo;
