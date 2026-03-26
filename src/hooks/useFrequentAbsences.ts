
import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

type FrequentAbsence = {
  id: string;
  nome: string;
  totalFaltas: number;
};

export const useFrequentAbsences = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchFrequentAbsences = useCallback(async (): Promise<FrequentAbsence[]> => {
    try {
      setIsLoading(true);
      
      const data = await api.get<FrequentAbsence[]>('/pacientes', {
        query: { status: 'faltas_frequentes' },
      });

      return data;
    } catch (error) {
      console.error('Error fetching frequent absences:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchFrequentAbsences, isLoading };
};
