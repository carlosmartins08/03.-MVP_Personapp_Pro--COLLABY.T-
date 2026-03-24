
export type TipoCobranca = 'avulso' | 'pacote' | 'mensal';
export type Modalidade = 'online' | 'presencial' | 'hibrido';
export type StatusServico = 'ativo' | 'encerrado' | 'suspenso';

export interface Servico {
  id: string;
  profissional_id: string;
  nome: string;
  descricao?: string;
  valor: number;
  tipo_cobranca: TipoCobranca;
  qtd_sessoes?: number;
  duracao_dias?: number;
  modalidade: Modalidade;
  created_at: string;
}

export interface ServicoContratado {
  id: string;
  paciente_id: string;
  servico_id: string;
  data_inicio: string;
  qtd_total_sessoes: number;
  qtd_sessoes_realizadas: number;
  status: StatusServico;
  contrato_pdf?: string;
  created_at: string;
  
  // Joined fields
  paciente_nome?: string;
  servico_nome?: string;
}
