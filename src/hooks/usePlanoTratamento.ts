import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface PlanoTratamento {
  id: string;
  pacienteId: string;
  profissionalId: string;
  objetivos: string;
  abordagem: string;
  frequencia: string;
  duracaoPrevista?: string | null;
  tecnicas?: string | null;
  indicadores?: string | null;
  observacoes?: string | null;
  status: string;
  criadoEm: string;
  atualizadoEm: string;
  profissional?: {
    id: string;
    nome: string;
  } | null;
}

export type PlanoTratamentoInput = {
  pacienteId: string;
  objetivos: string;
  abordagem: string;
  frequencia: string;
  duracaoPrevista?: string;
  tecnicas?: string;
  indicadores?: string;
  observacoes?: string;
};

export type PlanoTratamentoUpdateInput = Partial<
  Omit<PlanoTratamentoInput, "pacienteId">
> & {
  id: string;
  status?: "ativo" | "pausado" | "concluido";
};

export function useMeuPlano() {
  return useQuery<PlanoTratamento | null>({
    queryKey: ["plano-tratamento", "meu"],
    queryFn: async () => api.get<PlanoTratamento | null>("/plano-tratamento/meu"),
  });
}

export function usePlanoPaciente(pacienteId?: string) {
  return useQuery<PlanoTratamento | null>({
    queryKey: ["plano-tratamento", "paciente", pacienteId],
    queryFn: async () =>
      api.get<PlanoTratamento | null>("/plano-tratamento", {
        query: { pacienteId },
      }),
    enabled: Boolean(pacienteId),
  });
}

export function useCriarPlano() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: PlanoTratamentoInput) =>
      api.post<PlanoTratamento>("/plano-tratamento", body),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["plano-tratamento"] }),
        queryClient.invalidateQueries({
          queryKey: ["plano-tratamento", "paciente", variables.pacienteId],
        }),
      ]);
    },
  });
}

export function useAtualizarPlano() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...body }: PlanoTratamentoUpdateInput) =>
      api.patch<PlanoTratamento>(`/plano-tratamento/${id}`, body),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["plano-tratamento"] }),
        queryClient.invalidateQueries({
          queryKey: ["plano-tratamento", "paciente", data.pacienteId],
        }),
      ]);
    },
  });
}
