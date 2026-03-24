
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface ServicoAlerta {
  contrato_id: string;
  paciente_id: string;
  servico_id: string;
  nome_servico: string;
  nome_paciente: string;
  qtd_total_sessoes: number;
  qtd_sessoes_realizadas: number;
  sessoes_restantes: number;
  data_inicio: string;
  alerta_fim_sessoes: boolean;
  alerta_fim_periodo: boolean;
  alerta_inatividade: boolean;
}

export const useServicosAlertas = () => {
  return useQuery({
    queryKey: ['servicos-alertas'],
    queryFn: async () => {
      const data = await api.get<ServicoAlerta[]>('/servicos-contratados/alertas');
      return data;
    },
  });
};
