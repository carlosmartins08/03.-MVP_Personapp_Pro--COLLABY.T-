
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { useRecentDataSummary } from '@/hooks/useRecentDataSummary';
import DiarioSummaryCard from './DiarioSummaryCard';
import SessaoSummaryCard from './SessaoSummaryCard';
import AlertaSummaryCard from './AlertaSummaryCard';
import { Card } from '@/components/ui/card';

// New component to handle section titles consistently
const SectionTitle = ({ title, viewAllPath }: { title: string, viewAllPath?: string }) => {
  const { getTexto } = useLocalizacao();
  
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {viewAllPath && (
        <a 
          href={viewAllPath} 
          className="text-sm text-lavanda hover:text-lavanda-dark flex items-center"
        >
          {getTexto('ver_todos') || 'Ver todos'} 
          <ArrowRight className="h-3 w-3 ml-1" />
        </a>
      )}
    </div>
  );
};

// Main component with restructured layout
const RecentDataSummary = () => {
  const { getTexto } = useLocalizacao();
  const { 
    ultimoDiario, 
    ultimaSessao, 
    ultimoAlerta, 
    isLoadingDiario, 
    isLoadingSessao, 
    isLoadingAlerta,
    formatDate,
    formatTime 
  } = useRecentDataSummary();
  
  return (
    <div className="mb-8 space-y-6">
      <SectionTitle 
        title={getTexto('resumo_recente') || 'Resumo Recente'} 
        viewAllPath="/paciente/resumo" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DiarioSummaryCard 
          diario={ultimoDiario} 
          isLoading={isLoadingDiario}
          formatDate={formatDate}
          formatTime={formatTime}
        />
        
        <SessaoSummaryCard 
          sessao={ultimaSessao} 
          isLoading={isLoadingSessao}
          formatDate={formatDate}
          formatTime={formatTime}
        />
        
        <AlertaSummaryCard 
          alerta={ultimoAlerta} 
          isLoading={isLoadingAlerta}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
};

export default RecentDataSummary;
