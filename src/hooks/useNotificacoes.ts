import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'alerta' | 'sessao' | 'sistema';
  lida: boolean;
  criadoEm: string;
}

type UseNotificacoesOptions = {
  enabled?: boolean;
};

const mapTipo = (tipo: string): Notificacao['tipo'] => {
  if (tipo === 'info' || tipo === 'alerta' || tipo === 'sessao' || tipo === 'sistema') {
    return tipo;
  }

  return 'sistema';
};

export function useNotificacoes(options: UseNotificacoesOptions = {}) {
  return useQuery<Notificacao[]>({
    queryKey: ['notificacoes'],
    queryFn: async () => {
      const data = await api.get<Array<Omit<Notificacao, 'tipo'> & { tipo: string }>>('/notificacoes');
      return data.map((notificacao) => ({
        ...notificacao,
        tipo: mapTipo(notificacao.tipo),
      }));
    },
    refetchInterval: 30000,
    enabled: options.enabled ?? true,
  });
}

export function useMarcarLida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notificacoes/${id}/lida`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    },
  });
}

export function useMarcarTodasLidas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.patch('/notificacoes/lidas-todas');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    },
  });
}
