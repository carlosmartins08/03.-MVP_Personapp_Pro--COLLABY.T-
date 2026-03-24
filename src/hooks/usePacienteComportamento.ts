import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Sessao, DiarioSentimento, AlertaClinico, AvaliacaoSessao } from '@/types/queries';

export type PacienteComportamentoResponse = {
  sessoes: Sessao[];
  diarios: DiarioSentimento[];
  alertas: AlertaClinico[];
  avaliacoes: AvaliacaoSessao[];
};

export const usePacienteComportamento = (pacienteId?: string | null) => {
  return useQuery({
    queryKey: ['paciente-comportamento', pacienteId],
    enabled: !!pacienteId,
    queryFn: async () => {
      if (!pacienteId) return null;
      const data = await api.get<PacienteComportamentoResponse>(
        `/pacientes/${pacienteId}/comportamento`
      );

      return data;
    },
  });
};
