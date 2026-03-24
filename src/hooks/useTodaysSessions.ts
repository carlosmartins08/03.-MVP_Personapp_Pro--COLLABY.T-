
import { useState } from 'react';
import { api } from '@/lib/api';

type TodaySession = {
  id: string;
  pacienteNome: string;
  horario: string;
  status: string;
};

export const useTodaysSessions = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchTodaysSessions = async (): Promise<TodaySession[]> => {
    try {
      setIsLoading(true);
      
      const agenda = await api.get<{ agenda: Array<{ id: string; data: string; paciente?: { nome: string } }> }>(
        '/analytics/agenda',
        { query: { periodo: 1 } }
      );

      const today = new Date().toDateString();

      return (agenda.agenda || [])
        .filter((item) => new Date(item.data).toDateString() === today)
        .map((item) => ({
          id: item.id,
          pacienteNome: item.paciente?.nome ?? 'Paciente',
          horario: item.data,
          status: 'agendada',
        }));
    } catch (error) {
      console.error('Error fetching today\'s sessions:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchTodaysSessions, isLoading };
};
