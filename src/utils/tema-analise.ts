import { differenceInDays, parseISO } from 'date-fns';
import type { DiarioSentimento } from '@/types/queries';
import type { TemaAnaliseDetalhada } from '@/types/analise-temas';

const DEFAULT_ICONES: Record<string, string> = {
  Ansiedade: 'AN',
  Trabalho: 'TR',
  Relacionamento: 'RL',
  Luto: 'LU',
};

const getIcone = (tema: string) => {
  return DEFAULT_ICONES[tema] || 'TM';
};

const sentimentoScores: Record<string, number> = {
  feliz: 5,
  alegria: 5,
  contente: 4,
  satisfeito: 4,
  animado: 4,
  calmo: 3.5,
  tranquilo: 3.5,
  neutro: 3,
  normal: 3,
  triste: 2,
  desanimado: 2,
  cansado: 2.5,
  ansioso: 2,
  preocupado: 2,
  stress: 1.5,
  raiva: 1,
  irritado: 1.5,
};

const getSentimentoScore = (sentimento?: string) => {
  if (!sentimento) return 3;
  const normalized = sentimento.toLowerCase();
  const entry = Object.entries(sentimentoScores).find(([key]) => normalized.includes(key));
  return entry ? entry[1] : 3;
};

const getSequenciaMaxima = (datas: string[]) => {
  if (datas.length === 0) return 0;
  const sorted = datas
    .map((data) => parseISO(data))
    .sort((a, b) => a.getTime() - b.getTime());

  let maxSeq = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInDays(sorted[i], sorted[i - 1]);
    if (diff <= 7) {
      current += 1;
      maxSeq = Math.max(maxSeq, current);
    } else {
      current = 1;
    }
  }

  return maxSeq;
};

export const buildTemaAnaliseFromDiarios = (diarios: DiarioSentimento[]): TemaAnaliseDetalhada[] => {
  const mapa = new Map<
    string,
    { datas: string[]; scores: number[]; total: number; sessoesIds: string[] }
  >();

  diarios.forEach((entrada) => {
    if (!entrada.tags || entrada.tags.length === 0) return;
    entrada.tags.forEach((tagBruta) => {
      const tag = tagBruta.trim();
      if (!tag) return;
      if (!mapa.has(tag)) {
        mapa.set(tag, { datas: [], scores: [], total: 0, sessoesIds: [] });
      }
      const bucket = mapa.get(tag)!;
      bucket.datas.push(entrada.dataRegistro);
      bucket.scores.push(getSentimentoScore(entrada.sentimento));
      bucket.total += 1;
    });
  });

  return Array.from(mapa.entries())
    .map(([tema, bucket]) => {
      const scoreMedio =
        bucket.scores.length > 0
          ? bucket.scores.reduce((acc, curr) => acc + curr, 0) / bucket.scores.length
          : 0;
      const scoreMaximo = bucket.scores.length > 0 ? Math.max(...bucket.scores) : 0;
      const scoreMinimo = bucket.scores.length > 0 ? Math.min(...bucket.scores) : 0;
      const sequenciaMaxima = getSequenciaMaxima(bucket.datas);
      const tendencia =
        bucket.scores.length > 1
          ? bucket.scores[bucket.scores.length - 1] - bucket.scores[0] > 0
            ? 'positiva'
            : bucket.scores[bucket.scores.length - 1] - bucket.scores[0] < 0
            ? 'negativa'
            : 'estavel'
          : 'estavel';

      return {
        tema,
        icone: getIcone(tema),
        scoreMedio,
        scoreMaximo,
        scoreMinimo,
        totalSessoes: bucket.total,
        tendencia,
        correlacaoTemporal: 0,
        intensidadeCorrelacao: 'neutra',
        datasOrdenadas: bucket.datas,
        scoresOrdenados: bucket.scores,
        sessoesIds: bucket.sessoesIds,
        sequenciaMaxima,
        requerAtencao: scoreMedio < 55,
      } as TemaAnaliseDetalhada;
    })
    .sort((a, b) => a.scoreMedio - b.scoreMedio);
};
