export type ReciboStatusFilter = "todos" | "enviado" | "pendente";

export type ReciboFilters = {
  paciente: string;
  dataInicio?: Date;
  dataFim?: Date;
  status?: ReciboStatusFilter;
};

export type Recibo = {
  id: string;
  paciente: {
    nome: string;
  };
  data_sessao: string;
  created_at: string;
  enviado: boolean;
  valor: number;
  forma_pagamento: string;
  pdf_url?: string | null;
};

export type ReciboFormValues = {
  paciente_id: string;
  data_sessao: Date;
  valor: string;
  forma_pagamento: string;
  observacoes: string;
};

export type ReciboCreatePayload = ReciboFormValues;
