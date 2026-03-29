import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

export interface Vinculo {
  id: string;
  pacienteId: string;
  profissionalId: string;
  status: string;
  criadoEm: string;
}

export function useVinculoPaciente(pacienteId?: string) {
  return useQuery<Vinculo[]>({
    queryKey: ['vinculos', 'paciente', pacienteId],
    queryFn: async () => {
      if (!pacienteId) return [];
      return api.get<Vinculo[]>('/vinculos', {
        query: { pacienteId },
      });
    },
    enabled: Boolean(pacienteId),
  });
}

export function useVinculosProfissional(profissionalId?: string) {
  return useQuery<Vinculo[]>({
    queryKey: ['vinculos', 'profissional', profissionalId],
    queryFn: async () => {
      if (!profissionalId) return [];
      return api.get<Vinculo[]>('/vinculos', {
        query: { profissionalId },
      });
    },
    enabled: Boolean(profissionalId),
  });
}

export function useCriarVinculo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: {
      pacienteId: string;
      profissionalId: string;
    }) => {
      return api.post<Vinculo>('/vinculos', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vinculos'] });
    },
  });
}
