
import React from 'react';
import ScoreClinicoChart from './ScoreClinicoChart';
import HumorIndicator from './HumorIndicator';
import { useVisualIndicatorsData } from '@/hooks/useVisualIndicatorsData';

const VisualIndicators = () => {
  const { 
    scoreChartData, 
    diarios, 
    isLoadingSessoes, 
    isLoadingDiarios 
  } = useVisualIndicatorsData();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Gráfico de Score Clínico */}
      <ScoreClinicoChart 
        scoreChartData={scoreChartData} 
        isLoading={isLoadingSessoes}
      />
      
      {/* Indicador de Humor Médio */}
      <HumorIndicator 
        diarios={diarios} 
        isLoading={isLoadingDiarios}
      />
    </div>
  );
};

export default VisualIndicators;
