
// Tipos para o aplicativo PersonaClinic

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  fotoPerfil?: string;
};

export type Paciente = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  genero: string;
  cpf: string;
  endereco: string;
  observacoes?: string;
  dataCadastro: string;
  fotoPerfil?: string;
  statusRanqueado: 'normal' | 'faltas_frequentes' | 'inadimplente' | 'intensivo';
  totalFaltas: number;
};

export type StatusSessao = 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'faltou';

export type StatusPagamento = 'pendente' | 'pago' | 'cancelado';

export type ModalidadeSessao = 'presencial' | 'online';

export type PacoteSessao = 'semanal' | 'quinzenal' | 'mensal' | 'avulso';

export type Sessao = {
  id: string;
  pacienteId: string;
  pacienteNome?: string;
  data: string; // Formato ISO
  duracao: number; // Em minutos
  status: StatusSessao;
  anotacoes?: string;
  valor: number;
  statusPagamento: StatusPagamento;
  modalidade?: ModalidadeSessao;
  pacote?: PacoteSessao;
};

export type Financeiro = {
  id: string;
  sessaoId: string;
  pacienteId: string;
  valor: number;
  dataPagamento?: string;
  status: StatusPagamento;
  metodoPagamento?: string;
};
