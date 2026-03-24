
export interface UserProfile {
  id: string;
  tipo: 'profissional' | 'paciente';
  user_id: string;
}

export interface Sessao {
  id: string;
  data: string | null;
  status: string | null;
  scoreClinico: number | null;
  reagendadaEm: string | null;
  pacienteId: string | null;
}

export interface DiarioSentimento {
  id: string;
  texto: string;
  dataRegistro: string;
  pacienteId: string;
  sentimento?: string;
  tags?: string[];
  palavrasDisfuncionais?: string[] | null;
}

export interface AlertaClinico {
  id: string;
  tipoAlerta: string;
  descricao: string | null;
  nivelUrgencia: 'baixo' | 'medio' | 'alto' | null;
  dataCriacao: string;
  pacienteId: string;
  status?: string;
  termosRelacionados?: string[];
  tipoAlertaPrincipal?: string;
}

export interface AvaliacaoSessao {
  id: string;
  sessaoId: string | null;
  nota: number;
  comentario: string | null;
  dataAvaliacao: string | null;
  pacienteId: string | null;
}

export type QueryResponse<T> = {
  data: T[] | null;
  error: Error | null;
};
