
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { DiarioSentimento, Sessao, AlertaClinico } from '@/types/paciente';

export const useRecentDataSummary = () => {
  const { idioma } = useLocalizacao();
  const dateLocale = idioma === 'en' ? enUS : ptBR;
  
  const { user } = useAuthContext();
  
  // Fetch paciente ID
  const { data: pacienteId, isLoading: isLoadingPacienteId } = useQuery({
    queryKey: ['paciente-id-recent', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;

      const paciente = await api.get<{ id: string }>(`/pacientes/user/${user.id}`);
      return paciente.id;
    },
  });
  
  const { data: resumo, isLoading: isLoadingResumo } = useQuery({
    queryKey: ['paciente-resumo', pacienteId],
    enabled: !!pacienteId,
    queryFn: async () => {
      if (!pacienteId) return null;
      const data = await api.get<{
        ultimaSessao: Sessao | null;
        ultimoDiario: DiarioSentimento | null;
        ultimoAlerta: AlertaClinico | null;
      }>(`/pacientes/${pacienteId}/resumo`);
      return data;
    },
  });
  
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 
        idioma === 'en' ? 'MMM d, yyyy' : 'd MMM yyyy', 
        { locale: dateLocale }
      );
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr;
    }
  };
  
  const formatTime = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'HH:mm');
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };
  
  return {
    ultimoDiario: resumo?.ultimoDiario ?? null,
    ultimaSessao: resumo?.ultimaSessao ?? null,
    ultimoAlerta: resumo?.ultimoAlerta ?? null,
    isLoadingDiario: isLoadingResumo,
    isLoadingSessao: isLoadingResumo,
    isLoadingAlerta: isLoadingResumo,
    formatDate,
    formatTime,
  };
};
