
export interface TemaAnaliseDetalhada {
  tema: string;
  icone: string;
  scoreMedio: number;
  scoreMaximo: number;
  scoreMinimo: number;
  totalSessoes: number;
  tendencia: 'positiva' | 'negativa' | 'estavel';
  correlacaoTemporal: number;
  intensidadeCorrelacao: 'forte_positiva' | 'forte_negativa' | 'neutra' | 'leve_positiva' | 'leve_negativa';
  datasOrdenadas: string[];
  scoresOrdenados: number[];
  sessoesIds: string[];
  sequenciaMaxima: number;
  requerAtencao: boolean;
}

export interface PerfilPacienteProps {
  pacienteId: string;
}
