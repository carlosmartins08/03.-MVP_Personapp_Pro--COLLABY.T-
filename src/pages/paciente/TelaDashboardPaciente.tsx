
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import WelcomeMessage from '@/components/paciente/WelcomeMessage';
import RecentDataSummary from '@/components/paciente/RecentDataSummary';
import VisualIndicators from '@/components/paciente/VisualIndicators';

const TelaDashboardPaciente = () => {
  const { getTexto } = useLocalizacao();
  
  return (
    <div className="container pb-16">
      <div className="px-4 py-6 bg-gradient-to-b from-lavanda-light/50 to-transparent rounded-b-3xl mb-6">
        <PageHeader 
          title={getTexto('dashboard')}
          subtitle={getTexto('visao_geral_saude')}
        />
        
        <WelcomeMessage />
      </div>
      
      <div className="px-4">
        <RecentDataSummary />
        
        <VisualIndicators />
      </div>
    </div>
  );
};

export default TelaDashboardPaciente;
