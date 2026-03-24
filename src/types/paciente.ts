
export interface Paciente {
  id: string;
  nome: string;
  idiomaPreferido?: string;
}

export interface DiarioSentimento {
  id: string;
  texto: string;
  sentimento: string;
  dataRegistro: string;
  pacienteId: string;
}

export interface Sessao {
  id: string;
  data: string;
  status: string;
  scoreClinico: number;
  pacienteId: string;
}

export interface AlertaClinico {
  id: string;
  tipoAlerta: string;
  descricao: string;
  nivelUrgencia: string;
  dataCriacao: string;
  pacienteId: string;
  status: string;
}

export interface ChartThemeConfig {
  theme: {
    light: string;
    dark: string;
  };
}
