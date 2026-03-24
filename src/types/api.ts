export type PacienteApi = {
  id: string;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  genero?: string | null;
  endereco?: string | null;
  observacoes?: string | null;
  statusRanqueado?: 'normal' | 'faltas_frequentes' | 'inadimplente' | 'intensivo';
  totalFaltas?: number;
  fotoPerfil?: string | null;
  dataNascimento?: string | null;
  criadoEm?: string | null;
};

export type SessaoApi = {
  id: string;
  pacienteId: string;
  data?: string | null;
  duracao?: number | null;
  status?: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'faltou' | null;
  valor?: number | null;
  statusPagamento?: 'pendente' | 'pago' | 'cancelado' | null;
  anotacoes?: string | null;
};

export type DiarioApi = {
  id: string;
  texto: string;
  sentimento?: string | null;
  dataRegistro: string;
  pacienteId: string;
};

export type AlertaApi = {
  id: string;
  tipoAlerta: string;
  descricao?: string | null;
  nivelUrgencia?: string | null;
  dataCriacao: string;
  pacienteId: string;
};

export type ResumoPacienteApi = {
  ultimaSessao?: SessaoApi | null;
  ultimoDiario?: DiarioApi | null;
  ultimoAlerta?: AlertaApi | null;
};
