
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { DiarioSentimento, Sessao } from '@/types/paciente';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export interface ScoreChartData {
  data: string;
  score: number;
  dataCompleta: string;
}

export const useVisualIndicatorsData = () => {
  const { idioma } = useLocalizacao();
  const dateLocale = idioma === 'en' ? enUS : ptBR;
  
  const { user } = useAuthContext();

  // Fetch paciente ID
  const { data: pacienteId } = useQuery({
    queryKey: ['paciente-id-indicators', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;

      const paciente = await api.get<{ id: string }>(`/pacientes/user/${user.id}`);
      return paciente.id;
    },
  });
  
  // Fetch sessões data
  const { data: indicadores, isLoading: isLoadingIndicadores } = useQuery({
    queryKey: ['ultimas-sessoes-score', pacienteId],
    enabled: !!pacienteId,
    queryFn: async () => {
      if (!pacienteId) return [];
      const data = await api.get<{
        sessoes: Array<{ id: string; data: string; scoreClinico: number }>;
        diarios: DiarioSentimento[];
      }>(`/pacientes/${pacienteId}/indicadores`);

      return data;
    },
  });
  
  // Transform sessões data for the chart
  const scoreChartData: ScoreChartData[] =
    indicadores?.sessoes
      ?.slice()
      .reverse()
      .map((sessao) => ({
        data: format(
          parseISO(sessao.data),
          idioma === 'en' ? 'MMM d' : 'd MMM',
          { locale: dateLocale }
        ),
        score: sessao.scoreClinico ?? 0,
        dataCompleta: sessao.data,
      })) ?? [];
  
  return {
    scoreChartData,
    diarios: indicadores?.diarios ?? [],
    isLoadingSessoes: isLoadingIndicadores,
    isLoadingDiarios: isLoadingIndicadores,
  };
};
