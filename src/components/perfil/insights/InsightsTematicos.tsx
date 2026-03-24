
import React from 'react';
import TemaPredominante from './TemaPredominante';
import RankingImpactoScore from './RankingImpactoScore';
import type { PerfilPacienteProps } from '@/types/analise-temas';

export const InsightsTematicos: React.FC<PerfilPacienteProps> = ({ pacienteId }) => {
  return (
    <div className="space-y-6">
      <TemaPredominante pacienteId={pacienteId} />
      <RankingImpactoScore 
        pacienteId={pacienteId}
        onVerSessoes={(sessaoIds) => {
          console.log('Ver sessões:', sessaoIds);
        }}
      />
    </div>
  );
};

export default InsightsTematicos;
