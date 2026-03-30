import type { ApiRequestOptions } from './api';
import { getAccessToken } from './auth-storage';

type MockUser = {
  id: string;
  email: string;
  tipo: 'profissional' | 'paciente';
  emailVerificado?: boolean;
  idiomaPreferido?: 'pt' | 'en';
};

type MockProfissional = {
  id: string;
  nome: string;
  crp: string;
  especialidade: string;
  fotoPerfil: string;
  userId: string;
  cargo?: string;
};

type MockPaciente = {
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
  userId?: string | null;
};

type MockSessao = {
  id: string;
  pacienteId: string;
  profissionalId?: string | null;
  data?: string | null;
  duracao?: number | null;
  status?: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'faltou' | null;
  valor?: number | null;
  statusPagamento?: 'pendente' | 'pago' | 'cancelado' | null;
  anotacoes?: string | null;
  scoreClinico?: number | null;
  modalidade?: 'online' | 'presencial' | null;
};

type MockDiario = {
  id: string;
  texto: string;
  sentimento?: string | null;
  dataRegistro: string;
  pacienteId: string;
};

type MockAnamnese = {
  id: string;
  pacienteId: string;
  motivoConsulta?: string;
  expectativas?: string;
  historicoSaudeMental?: string;
  experienciasTraumaticas?: string;
  sintomasAtuais?: string;
  rotinaDiaria?: string;
  habitosSono?: string;
  dietaExercicio?: string;
  usoSubstancias?: string;
  dinamicaFamiliar?: string;
  apoioSocial?: string;
  indicadoresRisco?: string;
  consentimento?: boolean;
  abordagensRecomendadas?: string[];
  respostasPsicanalise?: Record<string, string>;
  respostasBehaviorismo?: Record<string, string>;
  respostasHumanismo?: Record<string, string>;
  respostasCognitivismo?: Record<string, string>;
  respostasPsicPositiva?: Record<string, string>;
  respostasNeuropsicologia?: Record<string, string>;
  respostasSistemica?: Record<string, string>;
  respostasTranspessoal?: Record<string, string>;
  status?: 'pendente' | 'parte1' | 'triagem' | 'parte2' | 'concluida';
  criadoEm: string;
  atualizadoEm: string;
};

type MockAlerta = {
  id: string;
  pacienteId: string;
  tipoAlerta: string;
  descricao?: string | null;
  nivelUrgencia?: string | null;
  dataCriacao: string;
  status?: string;
  termosRelacionados?: string[];
  tipoAlertaPrincipal?: string;
};

type MockMensagem = {
  id: string;
  pacienteId: string;
  dataEnvio: string;
  tipoMensagem: string;
  meio: 'whatsapp' | 'email';
  conteudo: string;
  mensagemEntregue: boolean;
};

type MockServico = {
  id: string;
  profissional_id: string;
  nome: string;
  descricao?: string;
  valor: number;
  tipo_cobranca: 'avulso' | 'pacote' | 'mensal';
  qtd_sessoes?: number;
  duracao_dias?: number;
  modalidade: 'online' | 'presencial' | 'hibrido';
  created_at: string;
};

type MockServicoContratado = {
  id: string;
  paciente_id: string;
  servico_id: string;
  data_inicio: string;
  qtd_total_sessoes: number;
  qtd_sessoes_realizadas: number;
  status: 'ativo' | 'encerrado' | 'suspenso';
  contrato_pdf?: string;
  created_at: string;
  paciente_nome?: string;
  servico_nome?: string;
};

type MockRecibo = {
  id: string;
  paciente: { nome: string };
  data_sessao: string;
  created_at: string;
  enviado: boolean;
  valor: number;
  forma_pagamento: string;
  pdf_url?: string | null;
};

type MockVinculo = {
  id: string;
  pacienteId: string;
  profissionalId: string;
  status: 'ATIVO' | 'INATIVO';
  criadoEm: string;
};

type MockPlanoTratamento = {
  id: string;
  pacienteId: string;
  profissionalId: string;
  objetivos: string;
  abordagem: string;
  frequencia: string;
  duracaoPrevista: string;
  tecnicas: string;
  indicadores: string;
  status: 'ativo' | 'encerrado' | 'pausado';
  criadoEm: string;
  atualizadoEm: string;
};

type MockNotificacao = {
  id: string;
  tipo: 'info' | 'alerta' | 'sessao' | 'sistema';
  titulo: string;
  mensagem: string;
  lida: boolean;
  criadoEm: string;
  userId?: string;
};

const sleep = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const daysFromNow = (days: number) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

// ─── Users ────────────────────────────────────────────────────────────────────

const mockUsers: MockUser[] = [
  { id: 'user-prof-1', email: 'psicologo@personapp.dev', tipo: 'profissional', emailVerificado: true, idiomaPreferido: 'pt' },
  { id: 'user-prof-2', email: 'terapeuta@personapp.dev', tipo: 'profissional', emailVerificado: true, idiomaPreferido: 'pt' },
  { id: 'user-prof-3', email: 'neuropsico@personapp.dev', tipo: 'profissional', emailVerificado: true, idiomaPreferido: 'pt' },
  { id: 'user-pac-1', email: 'paciente@personapp.dev', tipo: 'paciente', emailVerificado: true, idiomaPreferido: 'pt' },
  { id: 'user-pac-2', email: 'lucas@personapp.dev', tipo: 'paciente', emailVerificado: true, idiomaPreferido: 'pt' },
  { id: 'user-pac-3', email: 'carla@personapp.dev', tipo: 'paciente', emailVerificado: true, idiomaPreferido: 'pt' },
  { id: 'user-pac-4', email: 'roberto@personapp.dev', tipo: 'paciente', emailVerificado: true, idiomaPreferido: 'pt' },
  { id: 'user-pac-5', email: 'fernanda@personapp.dev', tipo: 'paciente', emailVerificado: true, idiomaPreferido: 'pt' },
  { id: 'user-pac-6', email: 'thiago@personapp.dev', tipo: 'paciente', emailVerificado: true, idiomaPreferido: 'pt' },
  { id: 'user-pac-7', email: 'beatriz@personapp.dev', tipo: 'paciente', emailVerificado: true, idiomaPreferido: 'pt' },
];

const tokensByUserId: Record<string, string> = {
  'user-prof-1': 'mock-token-prof',
  'user-prof-2': 'mock-token-prof-2',
  'user-prof-3': 'mock-token-prof-3',
  'user-pac-1': 'mock-token-pac',
  'user-pac-2': 'mock-token-pac-2',
  'user-pac-3': 'mock-token-pac-3',
  'user-pac-4': 'mock-token-pac-4',
  'user-pac-5': 'mock-token-pac-5',
  'user-pac-6': 'mock-token-pac-6',
  'user-pac-7': 'mock-token-pac-7',
};

const usersByToken: Record<string, MockUser> = Object.fromEntries(
  Object.entries(tokensByUserId).map(([uid, tok]) => [tok, mockUsers.find((u) => u.id === uid)!])
);

// ─── Profissionais ────────────────────────────────────────────────────────────

const profissionais: MockProfissional[] = [
  {
    id: 'prof-1',
    nome: 'Dr. Ana Lima',
    crp: 'CRP 06/123456',
    especialidade: 'TCC e Ansiedade',
    cargo: 'Psicóloga Clínica',
    fotoPerfil: 'https://i.pravatar.cc/150?img=47',
    userId: 'user-prof-1',
  },
  {
    id: 'prof-2',
    nome: 'Dr. Carlos Mendes',
    crp: 'CRP 06/789012',
    especialidade: 'Psicanálise e Trauma',
    cargo: 'Terapeuta',
    fotoPerfil: 'https://i.pravatar.cc/150?img=11',
    userId: 'user-prof-2',
  },
  {
    id: 'prof-3',
    nome: 'Dra. Roberta Alves',
    crp: 'CRP 06/345678',
    especialidade: 'TDAH e Cognição',
    cargo: 'Neuropsicóloga',
    fotoPerfil: 'https://i.pravatar.cc/150?img=16',
    userId: 'user-prof-3',
  },
];

// ─── Pacientes ────────────────────────────────────────────────────────────────

const pacientes: MockPaciente[] = [
  {
    id: 'pac-1',
    nome: 'Ana Costa',
    email: 'paciente@personapp.dev',
    telefone: '(11) 99999-1111',
    genero: 'Feminino',
    endereco: 'Rua das Flores, 123 — São Paulo, SP',
    observacoes: 'Paciente com histórico de ansiedade e episódios de insônia.',
    statusRanqueado: 'normal',
    totalFaltas: 1,
    fotoPerfil: 'https://i.pravatar.cc/150?img=5',
    dataNascimento: '1995-03-10',
    criadoEm: daysFromNow(-200),
    userId: 'user-pac-1',
  },
  {
    id: 'pac-2',
    nome: 'Lucas Ferreira',
    email: 'lucas@personapp.dev',
    telefone: '(11) 99999-2222',
    genero: 'Masculino',
    endereco: 'Avenida Paulista, 1500 — São Paulo, SP',
    observacoes: 'Estresse ocupacional intenso relacionado ao trabalho corporativo.',
    statusRanqueado: 'faltas_frequentes',
    totalFaltas: 4,
    fotoPerfil: 'https://i.pravatar.cc/150?img=12',
    dataNascimento: '1989-07-18',
    criadoEm: daysFromNow(-320),
    userId: 'user-pac-2',
  },
  {
    id: 'pac-3',
    nome: 'Carla Rodrigues',
    email: 'carla@personapp.dev',
    telefone: '(11) 99999-3333',
    genero: 'Feminino',
    endereco: 'Rua Augusta, 200 — São Paulo, SP',
    observacoes: 'Diagnóstico de transtorno de humor, em acompanhamento intensivo.',
    statusRanqueado: 'intensivo',
    totalFaltas: 0,
    fotoPerfil: 'https://i.pravatar.cc/150?img=21',
    dataNascimento: '1994-11-01',
    criadoEm: daysFromNow(-90),
    userId: 'user-pac-3',
  },
  {
    id: 'pac-4',
    nome: 'Roberto Almeida',
    email: 'roberto@personapp.dev',
    telefone: '(21) 98888-4444',
    genero: 'Masculino',
    endereco: 'Rua do Catete, 80 — Rio de Janeiro, RJ',
    observacoes: 'Fobia social com evitação de situações públicas.',
    statusRanqueado: 'normal',
    totalFaltas: 2,
    fotoPerfil: 'https://i.pravatar.cc/150?img=33',
    dataNascimento: '1978-04-22',
    criadoEm: daysFromNow(-150),
    userId: 'user-pac-4',
  },
  {
    id: 'pac-5',
    nome: 'Fernanda Lima',
    email: 'fernanda@personapp.dev',
    telefone: '(31) 97777-5555',
    genero: 'Feminino',
    endereco: 'Avenida Afonso Pena, 500 — Belo Horizonte, MG',
    observacoes: 'Síndrome do pânico com crises noturnas recorrentes.',
    statusRanqueado: 'inadimplente',
    totalFaltas: 1,
    fotoPerfil: 'https://i.pravatar.cc/150?img=44',
    dataNascimento: '1997-09-05',
    criadoEm: daysFromNow(-60),
    userId: 'user-pac-5',
  },
  {
    id: 'pac-6',
    nome: 'Thiago Mota',
    email: 'thiago@personapp.dev',
    telefone: '(41) 96666-6666',
    genero: 'Masculino',
    endereco: 'Rua XV de Novembro, 300 — Curitiba, PR',
    observacoes: 'TOC leve com rituais de verificação.',
    statusRanqueado: 'normal',
    totalFaltas: 0,
    fotoPerfil: 'https://i.pravatar.cc/150?img=57',
    dataNascimento: '1985-12-14',
    criadoEm: daysFromNow(-110),
    userId: 'user-pac-6',
  },
  {
    id: 'pac-7',
    nome: 'Beatriz Souza',
    email: 'beatriz@personapp.dev',
    telefone: '(51) 95555-7777',
    genero: 'Feminino',
    endereco: 'Rua da Praia, 100 — Porto Alegre, RS',
    observacoes: 'Ansiedade social em ambiente universitário.',
    statusRanqueado: 'normal',
    totalFaltas: 0,
    fotoPerfil: 'https://i.pravatar.cc/150?img=8',
    dataNascimento: '2001-06-30',
    criadoEm: daysFromNow(-40),
    userId: 'user-pac-7',
  },
];

// ─── Vínculos ─────────────────────────────────────────────────────────────────

const vinculos: MockVinculo[] = [
  { id: 'vinculo-1', pacienteId: 'pac-1', profissionalId: 'prof-1', status: 'ATIVO', criadoEm: daysFromNow(-200) },
  { id: 'vinculo-2', pacienteId: 'pac-2', profissionalId: 'prof-1', status: 'ATIVO', criadoEm: daysFromNow(-320) },
  { id: 'vinculo-3', pacienteId: 'pac-3', profissionalId: 'prof-2', status: 'ATIVO', criadoEm: daysFromNow(-90) },
  { id: 'vinculo-4', pacienteId: 'pac-4', profissionalId: 'prof-1', status: 'ATIVO', criadoEm: daysFromNow(-150) },
  { id: 'vinculo-5', pacienteId: 'pac-5', profissionalId: 'prof-2', status: 'ATIVO', criadoEm: daysFromNow(-60) },
  { id: 'vinculo-6', pacienteId: 'pac-6', profissionalId: 'prof-3', status: 'ATIVO', criadoEm: daysFromNow(-110) },
  { id: 'vinculo-7', pacienteId: 'pac-7', profissionalId: 'prof-3', status: 'ATIVO', criadoEm: daysFromNow(-40) },
];

// ─── Sessões ──────────────────────────────────────────────────────────────────

const sessoes: MockSessao[] = [
  // pac-1 (prof-1)
  { id: 'sess-1', pacienteId: 'pac-1', profissionalId: 'prof-1', data: daysFromNow(-28), duracao: 50, status: 'realizada', valor: 250, statusPagamento: 'pago', anotacoes: 'Paciente relatou melhora do sono após técnicas de relaxamento.', scoreClinico: 65, modalidade: 'presencial' },
  { id: 'sess-2', pacienteId: 'pac-1', profissionalId: 'prof-1', data: daysFromNow(-21), duracao: 50, status: 'realizada', valor: 250, statusPagamento: 'pago', anotacoes: 'Trabalhamos reestruturação cognitiva sobre pensamentos catastróficos.', scoreClinico: 70, modalidade: 'presencial' },
  { id: 'sess-3', pacienteId: 'pac-1', profissionalId: 'prof-1', data: daysFromNow(-14), duracao: 50, status: 'realizada', valor: 250, statusPagamento: 'pago', anotacoes: 'Evolução positiva no controle da ansiedade.', scoreClinico: 74, modalidade: 'presencial' },
  { id: 'sess-4', pacienteId: 'pac-1', profissionalId: 'prof-1', data: daysFromNow(-7), duracao: 50, status: 'realizada', valor: 250, statusPagamento: 'pago', anotacoes: 'Paciente demonstrou mais assertividade nas situações descritas.', scoreClinico: 78, modalidade: 'online' },
  { id: 'sess-5', pacienteId: 'pac-1', profissionalId: 'prof-1', data: daysFromNow(7), duracao: 50, status: 'agendada', valor: 250, statusPagamento: 'pendente', scoreClinico: null, modalidade: 'online' },
  // pac-2 (prof-1)
  { id: 'sess-6', pacienteId: 'pac-2', profissionalId: 'prof-1', data: daysFromNow(-30), duracao: 50, status: 'realizada', valor: 200, statusPagamento: 'pago', anotacoes: 'Identificação de gatilhos de estresse no ambiente de trabalho.', scoreClinico: 58, modalidade: 'online' },
  { id: 'sess-7', pacienteId: 'pac-2', profissionalId: 'prof-1', data: daysFromNow(-20), duracao: 50, status: 'faltou', valor: 200, statusPagamento: 'pendente', anotacoes: 'Paciente não compareceu e não avisou.', scoreClinico: null, modalidade: 'online' },
  { id: 'sess-8', pacienteId: 'pac-2', profissionalId: 'prof-1', data: daysFromNow(-10), duracao: 50, status: 'faltou', valor: 200, statusPagamento: 'pendente', anotacoes: 'Segunda falta consecutiva.', scoreClinico: null, modalidade: 'online' },
  { id: 'sess-9', pacienteId: 'pac-2', profissionalId: 'prof-1', data: daysFromNow(3), duracao: 50, status: 'confirmada', valor: 200, statusPagamento: 'pendente', scoreClinico: null, modalidade: 'online' },
  // pac-3 (prof-2)
  { id: 'sess-10', pacienteId: 'pac-3', profissionalId: 'prof-2', data: daysFromNow(-25), duracao: 60, status: 'realizada', valor: 300, statusPagamento: 'pago', anotacoes: 'Sessão de psicanálise com trabalho de associação livre.', scoreClinico: 52, modalidade: 'presencial' },
  { id: 'sess-11', pacienteId: 'pac-3', profissionalId: 'prof-2', data: daysFromNow(-18), duracao: 60, status: 'realizada', valor: 300, statusPagamento: 'pago', anotacoes: 'Emergência de material relevante sobre relação parental.', scoreClinico: 56, modalidade: 'presencial' },
  { id: 'sess-12', pacienteId: 'pac-3', profissionalId: 'prof-2', data: daysFromNow(-11), duracao: 60, status: 'realizada', valor: 300, statusPagamento: 'pago', anotacoes: 'Avanço na elaboração dos conflitos identificados.', scoreClinico: 62, modalidade: 'presencial' },
  { id: 'sess-13', pacienteId: 'pac-3', profissionalId: 'prof-2', data: daysFromNow(5), duracao: 60, status: 'agendada', valor: 300, statusPagamento: 'pendente', scoreClinico: null, modalidade: 'presencial' },
  // pac-4 (prof-1)
  { id: 'sess-14', pacienteId: 'pac-4', profissionalId: 'prof-1', data: daysFromNow(-22), duracao: 50, status: 'realizada', valor: 250, statusPagamento: 'pago', anotacoes: 'Exposição gradual a situações sociais com hierarquia de medos.', scoreClinico: 60, modalidade: 'presencial' },
  { id: 'sess-15', pacienteId: 'pac-4', profissionalId: 'prof-1', data: daysFromNow(-8), duracao: 50, status: 'realizada', valor: 250, statusPagamento: 'pago', anotacoes: 'Prática de roleplay para situações de interação social.', scoreClinico: 67, modalidade: 'presencial' },
  // pac-5 (prof-2)
  { id: 'sess-16', pacienteId: 'pac-5', profissionalId: 'prof-2', data: daysFromNow(-15), duracao: 50, status: 'realizada', valor: 280, statusPagamento: 'pendente', anotacoes: 'Técnica de respiração diafragmática para controle das crises.', scoreClinico: 55, modalidade: 'online' },
  { id: 'sess-17', pacienteId: 'pac-5', profissionalId: 'prof-2', data: daysFromNow(10), duracao: 50, status: 'agendada', valor: 280, statusPagamento: 'pendente', scoreClinico: null, modalidade: 'online' },
  // pac-6 (prof-3)
  { id: 'sess-18', pacienteId: 'pac-6', profissionalId: 'prof-3', data: daysFromNow(-20), duracao: 50, status: 'realizada', valor: 350, statusPagamento: 'pago', anotacoes: 'Avaliação neuropsicológica inicial. Identificados padrões de TOC leve.', scoreClinico: 72, modalidade: 'presencial' },
  { id: 'sess-19', pacienteId: 'pac-6', profissionalId: 'prof-3', data: daysFromNow(-6), duracao: 50, status: 'realizada', valor: 350, statusPagamento: 'pago', anotacoes: 'Treino de exposição e prevenção de resposta para rituais.', scoreClinico: 76, modalidade: 'presencial' },
  { id: 'sess-20', pacienteId: 'pac-6', profissionalId: 'prof-3', data: daysFromNow(14), duracao: 50, status: 'agendada', valor: 350, statusPagamento: 'pendente', scoreClinico: null, modalidade: 'presencial' },
  // pac-7 (prof-3)
  { id: 'sess-21', pacienteId: 'pac-7', profissionalId: 'prof-3', data: daysFromNow(-12), duracao: 50, status: 'realizada', valor: 200, statusPagamento: 'pago', anotacoes: 'Primeira sessão — levantamento de histórico e expectativas.', scoreClinico: 50, modalidade: 'online' },
  { id: 'sess-22', pacienteId: 'pac-7', profissionalId: 'prof-3', data: daysFromNow(2), duracao: 50, status: 'confirmada', valor: 200, statusPagamento: 'pendente', scoreClinico: null, modalidade: 'online' },
];

// ─── Diários ──────────────────────────────────────────────────────────────────

const diarios: MockDiario[] = [
  // pac-1
  { id: 'diario-1', pacienteId: 'pac-1', texto: 'Acordei com sensação de leveza. Consegui fazer a respiração antes do trabalho.', sentimento: 'calmo', dataRegistro: daysFromNow(-29) },
  { id: 'diario-2', pacienteId: 'pac-1', texto: 'Dia difícil no trabalho, muita cobrança. Senti o peito apertar na reunião.', sentimento: 'ansioso', dataRegistro: daysFromNow(-24) },
  { id: 'diario-3', pacienteId: 'pac-1', texto: 'Consegui conversar com meu chefe sem travar. Pequena vitória.', sentimento: 'motivado', dataRegistro: daysFromNow(-18) },
  { id: 'diario-4', pacienteId: 'pac-1', texto: 'Fiz exercício pela primeira vez em semanas. Me senti mais leve.', sentimento: 'feliz', dataRegistro: daysFromNow(-11) },
  { id: 'diario-5', pacienteId: 'pac-1', texto: 'Senti ansiedade ao acordar, mas consegui controlar usando as técnicas da sessão.', sentimento: 'ansioso', dataRegistro: daysFromNow(-5) },
  { id: 'diario-6', pacienteId: 'pac-1', texto: 'Tarde tranquila em casa, li um livro e não fiquei pensando nos problemas.', sentimento: 'calmo', dataRegistro: daysFromNow(-1) },
  // pac-3
  { id: 'diario-7', pacienteId: 'pac-3', texto: 'Hoje o peso no peito estava grande. Tive vontade de sumir.', sentimento: 'triste', dataRegistro: daysFromNow(-27) },
  { id: 'diario-8', pacienteId: 'pac-3', texto: 'Liguei para minha irmã e me senti menos sola. Bom dia, no geral.', sentimento: 'motivado', dataRegistro: daysFromNow(-20) },
  { id: 'diario-9', pacienteId: 'pac-3', texto: 'Discuti com minha mãe. Sentimento de raiva que não passa.', sentimento: 'irritado', dataRegistro: daysFromNow(-13) },
  { id: 'diario-10', pacienteId: 'pac-3', texto: 'Sessão com Dr. Carlos foi intensa mas boa. Algo foi liberado.', sentimento: 'calmo', dataRegistro: daysFromNow(-4) },
  // pac-6
  { id: 'diario-11', pacienteId: 'pac-6', texto: 'Consegui sair sem verificar as torneiras dez vezes. Só três vezes hoje!', sentimento: 'motivado', dataRegistro: daysFromNow(-19) },
  { id: 'diario-12', pacienteId: 'pac-6', texto: 'Dia de muita tensão no trabalho. Os rituais aumentaram à noite.', sentimento: 'ansioso', dataRegistro: daysFromNow(-7) },
  // pac-7
  { id: 'diario-13', pacienteId: 'pac-7', texto: 'Fui à festa da faculdade. Fiquei dois minutos e saí. Mas fui, isso já é algo.', sentimento: 'ansioso', dataRegistro: daysFromNow(-22) },
  { id: 'diario-14', pacienteId: 'pac-7', texto: 'Conversei com uma colega no corredor sem entrar em pânico. Pequena conquista.', sentimento: 'calmo', dataRegistro: daysFromNow(-9) },
  { id: 'diario-15', pacienteId: 'pac-7', texto: 'Primeira sessão foi ótima. Sinto que posso melhorar.', sentimento: 'feliz', dataRegistro: daysFromNow(-3) },
];

// ─── Anamneses (pré-populadas) ─────────────────────────────────────────────────

const anamnesesByPacienteId: Record<string, MockAnamnese> = {
  'pac-1': {
    id: 'anamnese-pac-1',
    pacienteId: 'pac-1',
    motivoConsulta: 'Ansiedade generalizada e dificuldades para dormir.',
    expectativas: 'Quero aprender a controlar minha ansiedade e ter uma rotina mais estável.',
    historicoSaudeMental: 'Episódio depressivo leve em 2020. Sem hospitalizações.',
    experienciasTraumaticas: 'Perda de emprego durante a pandemia. Relacionamento abusivo encerrado em 2021.',
    sintomasAtuais: 'Insônia, ruminação de pensamentos, tensão muscular.',
    rotinaDiaria: 'Trabalha em home office, sai pouco de casa.',
    habitosSono: 'Dorme em média 5 horas por noite, com dificuldade para adormecer.',
    dietaExercicio: 'Alimentação irregular, sem exercícios regulares.',
    usoSubstancias: 'Não usa.',
    dinamicaFamiliar: 'Boa relação com os pais. Pouco contato com irmãos.',
    apoioSocial: 'Poucos amigos próximos, mas com suporte.',
    indicadoresRisco: 'Sem ideação suicida.',
    consentimento: true,
    abordagensRecomendadas: ['TCC', 'Mindfulness'],
    status: 'concluida',
    criadoEm: daysFromNow(-200),
    atualizadoEm: daysFromNow(-30),
  },
  'pac-2': {
    id: 'anamnese-pac-2',
    pacienteId: 'pac-2',
    motivoConsulta: 'Burnout e dificuldades no relacionamento com colegas de trabalho.',
    expectativas: 'Melhorar o desempenho profissional e reduzir o estresse.',
    historicoSaudeMental: 'Sem histórico relevante.',
    experienciasTraumaticas: 'Demissão em massa que afetou sua equipe.',
    sintomasAtuais: 'Irritabilidade, dificuldade de concentração, cansaço crônico.',
    rotinaDiaria: 'Trabalha mais de 12 horas por dia.',
    habitosSono: 'Dorme 6 horas, mas o sono é superficial.',
    dietaExercicio: 'Alimentação rápida. Praticava musculação mas parou.',
    usoSubstancias: 'Café em excesso.',
    dinamicaFamiliar: 'Casado, um filho. Tensões conjugais por excesso de trabalho.',
    apoioSocial: 'Poucos amigos fora do ambiente de trabalho.',
    indicadoresRisco: 'Sem risco imediato.',
    consentimento: true,
    abordagensRecomendadas: ['TCC', 'ACT'],
    status: 'concluida',
    criadoEm: daysFromNow(-320),
    atualizadoEm: daysFromNow(-50),
  },
  'pac-3': {
    id: 'anamnese-pac-3',
    pacienteId: 'pac-3',
    motivoConsulta: 'Oscilações de humor intensas e dificuldade nos relacionamentos.',
    expectativas: 'Entender as origens do sofrimento e desenvolver estabilidade emocional.',
    historicoSaudeMental: 'Diagnóstico de transtorno de humor em 2022. Em uso de medicação.',
    experienciasTraumaticas: 'Infância com pai emocionalmente ausente. Abuso psicológico na adolescência.',
    sintomasAtuais: 'Instabilidade emocional, choro frequente, isolamento.',
    rotinaDiaria: 'Trabalha como freelancer, horários irregulares.',
    habitosSono: 'Hipersonia nos episódios depressivos.',
    dietaExercicio: 'Come pouco nos episódios depressivos.',
    usoSubstancias: 'Não usa.',
    dinamicaFamiliar: 'Relação conflituosa com a mãe.',
    apoioSocial: 'Uma amiga próxima que oferece suporte.',
    indicadoresRisco: 'Ideação passiva em episódios passados, mas sem plano.',
    consentimento: true,
    abordagensRecomendadas: ['Psicanálise', 'DBT'],
    status: 'concluida',
    criadoEm: daysFromNow(-90),
    atualizadoEm: daysFromNow(-15),
  },
};

// ─── Alertas ──────────────────────────────────────────────────────────────────

const alertas: MockAlerta[] = [
  {
    id: 'alerta-1',
    pacienteId: 'pac-2',
    tipoAlerta: 'Falta frequente',
    descricao: 'Lucas faltou duas sessões consecutivas sem avisar.',
    nivelUrgencia: 'alto',
    dataCriacao: daysFromNow(-8),
    status: 'novo',
    termosRelacionados: ['falta', 'desengajamento'],
    tipoAlertaPrincipal: 'comportamento',
  },
  {
    id: 'alerta-2',
    pacienteId: 'pac-1',
    tipoAlerta: 'Oscilação emocional',
    descricao: 'Mudança brusca no humor registrada no diário da semana.',
    nivelUrgencia: 'medio',
    dataCriacao: daysFromNow(-5),
    status: 'visto',
    termosRelacionados: ['humor', 'ansiedade'],
    tipoAlertaPrincipal: 'sentimento',
  },
  {
    id: 'alerta-3',
    pacienteId: 'pac-3',
    tipoAlerta: 'Risco emocional',
    descricao: 'Diário da paciente menciona sentimento de tristeza profunda.',
    nivelUrgencia: 'alto',
    dataCriacao: daysFromNow(-3),
    status: 'novo',
    termosRelacionados: ['tristeza', 'isolamento'],
    tipoAlertaPrincipal: 'sentimento',
  },
  {
    id: 'alerta-4',
    pacienteId: 'pac-5',
    tipoAlerta: 'Inadimplência',
    descricao: 'Fernanda possui sessão realizada há 15 dias sem pagamento.',
    nivelUrgencia: 'medio',
    dataCriacao: daysFromNow(-2),
    status: 'novo',
    termosRelacionados: ['pagamento', 'financeiro'],
    tipoAlertaPrincipal: 'financeiro',
  },
  {
    id: 'alerta-5',
    pacienteId: 'pac-4',
    tipoAlerta: 'Progresso lento',
    descricao: 'Score clínico de Roberto não avançou nas últimas 2 sessões.',
    nivelUrgencia: 'baixo',
    dataCriacao: daysFromNow(-6),
    status: 'visto',
    termosRelacionados: ['score', 'evolução'],
    tipoAlertaPrincipal: 'clinico',
  },
  {
    id: 'alerta-6',
    pacienteId: 'pac-6',
    tipoAlerta: 'Meta atingida',
    descricao: 'Thiago reduziu rituais de verificação — progresso registrado.',
    nivelUrgencia: 'baixo',
    dataCriacao: daysFromNow(-1),
    status: 'visto',
    termosRelacionados: ['TOC', 'progresso'],
    tipoAlertaPrincipal: 'clinico',
  },
];

// ─── Mensagens ────────────────────────────────────────────────────────────────

const mensagens: MockMensagem[] = [
  { id: 'msg-1', pacienteId: 'pac-1', dataEnvio: daysFromNow(-6), tipoMensagem: 'Lembrete de sessão', meio: 'whatsapp', conteudo: 'Sua sessão está confirmada para amanhã às 15h.', mensagemEntregue: true },
  { id: 'msg-2', pacienteId: 'pac-1', dataEnvio: daysFromNow(-1), tipoMensagem: 'Feedback semanal', meio: 'email', conteudo: 'Lembre-se de registrar seu diário de sentimentos.', mensagemEntregue: true },
  { id: 'msg-3', pacienteId: 'pac-2', dataEnvio: daysFromNow(-9), tipoMensagem: 'Alerta de falta', meio: 'whatsapp', conteudo: 'Notamos sua ausência. Deseja reagendar sua sessão?', mensagemEntregue: true },
  { id: 'msg-4', pacienteId: 'pac-3', dataEnvio: daysFromNow(-4), tipoMensagem: 'Lembrete de sessão', meio: 'email', conteudo: 'Sua sessão com Dr. Carlos está confirmada para sexta-feira.', mensagemEntregue: true },
  { id: 'msg-5', pacienteId: 'pac-5', dataEnvio: daysFromNow(-3), tipoMensagem: 'Cobrança', meio: 'email', conteudo: 'Há uma sessão pendente de pagamento. Por favor, regularize.', mensagemEntregue: true },
];

// ─── Serviços ─────────────────────────────────────────────────────────────────

const servicos: MockServico[] = [
  {
    id: 'serv-1',
    profissional_id: 'user-prof-1',
    nome: 'Psicoterapia Individual TCC',
    descricao: 'Sessão semanal com foco em reestruturação cognitiva e regulação emocional.',
    valor: 250,
    tipo_cobranca: 'avulso',
    qtd_sessoes: 1,
    duracao_dias: 7,
    modalidade: 'presencial',
    created_at: daysFromNow(-200),
  },
  {
    id: 'serv-2',
    profissional_id: 'user-prof-1',
    nome: 'Acompanhamento Mensal',
    descricao: 'Plano mensal com 4 sessões e suporte contínuo.',
    valor: 900,
    tipo_cobranca: 'mensal',
    qtd_sessoes: 4,
    duracao_dias: 30,
    modalidade: 'hibrido',
    created_at: daysFromNow(-150),
  },
  {
    id: 'serv-3',
    profissional_id: 'user-prof-2',
    nome: 'Psicanalítica Semanal',
    descricao: 'Sessão de psicanálise com 60 minutos.',
    valor: 300,
    tipo_cobranca: 'avulso',
    qtd_sessoes: 1,
    duracao_dias: 7,
    modalidade: 'presencial',
    created_at: daysFromNow(-90),
  },
  {
    id: 'serv-4',
    profissional_id: 'user-prof-3',
    nome: 'Avaliação Neuropsicológica',
    descricao: 'Avaliação completa com laudo. Múltiplas sessões.',
    valor: 350,
    tipo_cobranca: 'pacote',
    qtd_sessoes: 5,
    duracao_dias: 30,
    modalidade: 'presencial',
    created_at: daysFromNow(-110),
  },
];

const servicosContratados: MockServicoContratado[] = [
  {
    id: 'contrato-1',
    paciente_id: 'pac-1',
    servico_id: 'serv-1',
    data_inicio: daysFromNow(-60),
    qtd_total_sessoes: 12,
    qtd_sessoes_realizadas: 4,
    status: 'ativo',
    created_at: daysFromNow(-60),
    paciente_nome: 'Ana Costa',
    servico_nome: 'Psicoterapia Individual TCC',
  },
  {
    id: 'contrato-2',
    paciente_id: 'pac-3',
    servico_id: 'serv-3',
    data_inicio: daysFromNow(-90),
    qtd_total_sessoes: 16,
    qtd_sessoes_realizadas: 3,
    status: 'ativo',
    created_at: daysFromNow(-90),
    paciente_nome: 'Carla Rodrigues',
    servico_nome: 'Psicanalítica Semanal',
  },
];

// ─── Recibos ──────────────────────────────────────────────────────────────────

const recibos: MockRecibo[] = [
  { id: 'recibo-1', paciente: { nome: 'Ana Costa' }, data_sessao: daysFromNow(-28), created_at: daysFromNow(-27), enviado: true, valor: 250, forma_pagamento: 'Cartão', pdf_url: null },
  { id: 'recibo-2', paciente: { nome: 'Ana Costa' }, data_sessao: daysFromNow(-21), created_at: daysFromNow(-20), enviado: true, valor: 250, forma_pagamento: 'Pix', pdf_url: null },
  { id: 'recibo-3', paciente: { nome: 'Carla Rodrigues' }, data_sessao: daysFromNow(-25), created_at: daysFromNow(-24), enviado: false, valor: 300, forma_pagamento: 'Pix', pdf_url: null },
  { id: 'recibo-4', paciente: { nome: 'Thiago Mota' }, data_sessao: daysFromNow(-20), created_at: daysFromNow(-19), enviado: true, valor: 350, forma_pagamento: 'Transferência', pdf_url: null },
];

// ─── Planos de Tratamento ─────────────────────────────────────────────────────

const planosTratamento: MockPlanoTratamento[] = [
  {
    id: 'plano-1',
    pacienteId: 'pac-1',
    profissionalId: 'prof-1',
    objetivos: 'Reduzir sintomas de ansiedade, melhorar qualidade do sono e aumentar assertividade.',
    abordagem: 'Terapia Cognitivo-Comportamental (TCC)',
    frequencia: 'Semanal',
    duracaoPrevista: '6 meses',
    tecnicas: 'Reestruturação cognitiva, registro de pensamentos, exposição gradual, técnicas de relaxamento.',
    indicadores: 'Redução do GAD-7, melhora no diário de humor, aumento das interações sociais.',
    status: 'ativo',
    criadoEm: daysFromNow(-200),
    atualizadoEm: daysFromNow(-30),
  },
  {
    id: 'plano-2',
    pacienteId: 'pac-2',
    profissionalId: 'prof-1',
    objetivos: 'Reduzir burnout, melhorar equilíbrio trabalho-vida e habilidades de comunicação.',
    abordagem: 'TCC com elementos de ACT',
    frequencia: 'Semanal',
    duracaoPrevista: '8 meses',
    tecnicas: 'Identificação de valores, desfusão cognitiva, treinamento em assertividade.',
    indicadores: 'Redução MBI, melhora nas relações conjugais, retomada de atividades prazerosas.',
    status: 'ativo',
    criadoEm: daysFromNow(-320),
    atualizadoEm: daysFromNow(-50),
  },
  {
    id: 'plano-3',
    pacienteId: 'pac-3',
    profissionalId: 'prof-2',
    objetivos: 'Elaboração de conflitos inconscientes, estabilização emocional e melhora nos vínculos.',
    abordagem: 'Psicanálise com elementos de DBT',
    frequencia: 'Semanal',
    duracaoPrevista: '1 ano',
    tecnicas: 'Associação livre, interpretação de sonhos, regulação emocional DBT.',
    indicadores: 'Redução de oscilações de humor, melhora nos relacionamentos, menor isolamento.',
    status: 'ativo',
    criadoEm: daysFromNow(-90),
    atualizadoEm: daysFromNow(-15),
  },
  {
    id: 'plano-4',
    pacienteId: 'pac-4',
    profissionalId: 'prof-1',
    objetivos: 'Reduzir evitação social e aumentar participação em situações interpessoais.',
    abordagem: 'TCC com Terapia de Exposição',
    frequencia: 'Quinzenal',
    duracaoPrevista: '9 meses',
    tecnicas: 'Hierarquia de medos, exposição in vivo, roleplay, treinamento em habilidades sociais.',
    indicadores: 'Redução SPIN, aumento de interações sociais semanais, melhora da autoestima.',
    status: 'ativo',
    criadoEm: daysFromNow(-150),
    atualizadoEm: daysFromNow(-22),
  },
  {
    id: 'plano-5',
    pacienteId: 'pac-5',
    profissionalId: 'prof-2',
    objetivos: 'Controlar crises de pânico e reduzir comportamentos de evitação.',
    abordagem: 'TCC para Transtorno do Pânico',
    frequencia: 'Semanal',
    duracaoPrevista: '6 meses',
    tecnicas: 'Psicoeducação sobre pânico, respiração diafragmática, exposição interoceptiva.',
    indicadores: 'Redução PDSS, frequência e intensidade das crises, ampliação das atividades.',
    status: 'ativo',
    criadoEm: daysFromNow(-60),
    atualizadoEm: daysFromNow(-15),
  },
  {
    id: 'plano-6',
    pacienteId: 'pac-6',
    profissionalId: 'prof-3',
    objetivos: 'Reduzir rituais compulsivos e melhorar a tolerância à incerteza.',
    abordagem: 'Neuropsicologia com ERP',
    frequencia: 'Semanal',
    duracaoPrevista: '8 meses',
    tecnicas: 'Exposição e prevenção de resposta (ERP), psicoeducação sobre TOC, mindfulness.',
    indicadores: 'Redução Y-BOCS, diminuição do tempo em rituais, melhora da qualidade de vida.',
    status: 'ativo',
    criadoEm: daysFromNow(-110),
    atualizadoEm: daysFromNow(-6),
  },
  {
    id: 'plano-7',
    pacienteId: 'pac-7',
    profissionalId: 'prof-3',
    objetivos: 'Desenvolver habilidades sociais e reduzir ansiedade em contextos universitários.',
    abordagem: 'TCC com Treinamento em Habilidades Sociais',
    frequencia: 'Semanal',
    duracaoPrevista: '6 meses',
    tecnicas: 'Roleplay, exposição gradual, reestruturação de crenças sobre julgamento alheio.',
    indicadores: 'Aumento de interações sociais, redução LSAS, participação em atividades grupais.',
    status: 'ativo',
    criadoEm: daysFromNow(-40),
    atualizadoEm: daysFromNow(-12),
  },
];

// ─── Notificações ─────────────────────────────────────────────────────────────

const notificacoes: MockNotificacao[] = [
  { id: 'notif-1', tipo: 'sessao', titulo: 'Sessão confirmada', mensagem: 'Sua sessão com Dr. Ana Lima foi confirmada para amanhã às 15h.', lida: false, criadoEm: daysFromNow(-1), userId: 'user-pac-1' },
  { id: 'notif-2', tipo: 'alerta', titulo: 'Novo alerta clínico', mensagem: 'Lucas Ferreira faltou duas sessões consecutivas.', lida: false, criadoEm: daysFromNow(-8), userId: 'user-prof-1' },
  { id: 'notif-3', tipo: 'info', titulo: 'Plano de tratamento atualizado', mensagem: 'O plano de tratamento de Ana Costa foi atualizado.', lida: true, criadoEm: daysFromNow(-30), userId: 'user-prof-1' },
  { id: 'notif-4', tipo: 'sistema', titulo: 'Bem-vindo ao PersonApp Pro', mensagem: 'Sua conta está pronta. Explore os recursos disponíveis.', lida: true, criadoEm: daysFromNow(-200), userId: 'user-prof-1' },
  { id: 'notif-5', tipo: 'alerta', titulo: 'Pagamento pendente', mensagem: 'Fernanda Lima possui uma sessão sem pagamento há 15 dias.', lida: false, criadoEm: daysFromNow(-2), userId: 'user-prof-2' },
  { id: 'notif-6', tipo: 'sessao', titulo: 'Lembrete de sessão', mensagem: 'Você tem uma sessão com Carla Rodrigues em 5 dias.', lida: false, criadoEm: daysFromNow(-1), userId: 'user-prof-2' },
  { id: 'notif-7', tipo: 'info', titulo: 'Diário registrado', mensagem: 'Beatriz Souza registrou um novo diário de humor.', lida: true, criadoEm: daysFromNow(-3), userId: 'user-prof-3' },
  { id: 'notif-8', tipo: 'sistema', titulo: 'Relatório semanal disponível', mensagem: 'Seu relatório clínico da semana está pronto para revisão.', lida: false, criadoEm: daysFromNow(-2), userId: 'user-prof-3' },
  { id: 'notif-9', tipo: 'sessao', titulo: 'Próxima sessão agendada', mensagem: 'Sua sessão está marcada para daqui 7 dias.', lida: false, criadoEm: daysFromNow(-1), userId: 'user-pac-1' },
  { id: 'notif-10', tipo: 'info', titulo: 'Anamnese concluída', mensagem: 'Sua anamnese foi revisada pelo profissional.', lida: true, criadoEm: daysFromNow(-30), userId: 'user-pac-1' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ensureToken = (user: MockUser) => {
  const existing = tokensByUserId[user.id];
  if (existing) {
    usersByToken[existing] = user;
    return existing;
  }
  const token = `mock-token-${user.id}`;
  tokensByUserId[user.id] = token;
  usersByToken[token] = user;
  return token;
};

const getUserFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;
  return usersByToken[token] ?? null;
};

const getPacienteLogado = () => {
  const user = getUserFromToken();
  if (!user || user.tipo !== 'paciente') return null;
  return pacientes.find((item) => item.userId === user.id) ?? null;
};

const withSnakeCase = (data: MockAlerta | MockDiario) => {
  if ('dataCriacao' in data) {
    const alerta = data as MockAlerta;
    return {
      ...alerta,
      tipo_alerta: alerta.tipoAlerta,
      data_criacao: alerta.dataCriacao,
      nivel_urgencia: alerta.nivelUrgencia,
      termos_relacionados: alerta.termosRelacionados ?? [],
      tipo_alerta_principal: alerta.tipoAlertaPrincipal ?? 'sentimento',
    };
  }
  const diario = data as MockDiario;
  return {
    ...diario,
    data_registro: diario.dataRegistro,
  };
};

const filterByDateRange = (items: MockSessao[], from?: string, to?: string) => {
  if (!from && !to) return items;
  const fromTime = from ? new Date(from).getTime() : Number.NEGATIVE_INFINITY;
  const toTime = to ? new Date(to).getTime() : Number.POSITIVE_INFINITY;
  return items.filter((item) => {
    if (!item.data) return false;
    const time = new Date(item.data).getTime();
    return time >= fromTime && time <= toTime;
  });
};

// ─── Mock API Router ──────────────────────────────────────────────────────────

export async function mockApiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  await sleep();

  const method = options.method ?? 'GET';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const query = (options.query ?? {}) as Record<string, any>;
  const body = options.body as Record<string, unknown> | undefined;

  // ── Auth / Translations ──────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/traducoes') {
    return [] as T;
  }

  if (method === 'POST' && normalizedPath === '/auth/login') {
    const email = String(body?.email ?? '').toLowerCase();
    let user = mockUsers.find((item) => item.email.toLowerCase() === email);
    if (!user) {
      user = {
        id: `user-${mockUsers.length + 1}`,
        email,
        tipo: email.includes('paciente') ? 'paciente' : 'profissional',
        emailVerificado: true,
      };
      mockUsers.push(user);
    }
    const token = ensureToken(user);
    return { accessToken: token, user } as T;
  }

  if (method === 'POST' && normalizedPath === '/auth/signup') return { status: 'ok' } as T;
  if (method === 'POST' && normalizedPath === '/auth/verify-email') return { status: 'ok' } as T;
  if (method === 'POST' && normalizedPath === '/auth/request-reset') return { status: 'ok' } as T;
  if (method === 'POST' && normalizedPath === '/auth/reset') return { status: 'ok' } as T;

  if (method === 'GET' && normalizedPath === '/me') {
    const user = getUserFromToken();
    if (!user) throw new Error('Unauthorized');
    return user as T;
  }

  if (method === 'PATCH' && normalizedPath === '/me/preferences') {
    const user = getUserFromToken();
    if (user && body?.idiomaPreferido) {
      user.idiomaPreferido = body.idiomaPreferido as 'pt' | 'en';
    }
    return { status: 'ok' } as T;
  }

  // ── Profissionais ────────────────────────────────────────────────────────

  const profissionalUserMatch = normalizedPath.match(/^\/profissionais\/user\/([^/]+)$/);
  if (method === 'GET' && profissionalUserMatch) {
    const userId = profissionalUserMatch[1];
    const prof = profissionais.find((p) => p.userId === userId) ?? null;
    return prof as T;
  }

  const profissionalIdMatch = normalizedPath.match(/^\/profissionais\/([^/]+)$/);
  if (method === 'GET' && profissionalIdMatch) {
    const profId = profissionalIdMatch[1];
    const prof = profissionais.find((p) => p.id === profId) ?? null;
    return prof as T;
  }

  // ── Vínculos ─────────────────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/vinculos') {
    let result = [...vinculos];
    if (query.pacienteId) result = result.filter((v) => v.pacienteId === query.pacienteId);
    if (query.profissionalId) result = result.filter((v) => v.profissionalId === query.profissionalId);
    return result as T;
  }

  if (method === 'POST' && normalizedPath === '/vinculos') {
    const novo: MockVinculo = {
      id: `vinculo-${vinculos.length + 1}`,
      pacienteId: String(body?.pacienteId ?? ''),
      profissionalId: String(body?.profissionalId ?? ''),
      status: 'ATIVO',
      criadoEm: new Date().toISOString(),
    };
    vinculos.push(novo);
    return novo as T;
  }

  // ── Anamnese ─────────────────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/anamnese') {
    const paciente = getPacienteLogado();
    if (!paciente) throw new Error('Paciente nao encontrado');
    return (anamnesesByPacienteId[paciente.id] ?? null) as T;
  }

  if (method === 'POST' && normalizedPath === '/anamnese') {
    const paciente = getPacienteLogado();
    if (!paciente) throw new Error('Paciente nao encontrado');
    const now = new Date().toISOString();
    const atual = anamnesesByPacienteId[paciente.id];
    const next: MockAnamnese = {
      ...(atual ?? { id: `anamnese-${paciente.id}`, pacienteId: paciente.id, criadoEm: now, atualizadoEm: now }),
      ...(body ?? {}),
      pacienteId: paciente.id,
      criadoEm: atual?.criadoEm ?? now,
      atualizadoEm: now,
    };
    anamnesesByPacienteId[paciente.id] = next;
    return next as T;
  }

  if (method === 'PATCH' && normalizedPath === '/anamnese/triagem') {
    const paciente = getPacienteLogado();
    if (!paciente) throw new Error('Paciente nao encontrado');
    const abordagensRecomendadas = Array.isArray(body?.abordagensRecomendadas)
      ? body?.abordagensRecomendadas.map(String).slice(0, 2)
      : [];
    if (!abordagensRecomendadas.length) throw new Error('abordagensRecomendadas obrigatorio');
    const now = new Date().toISOString();
    const atual = anamnesesByPacienteId[paciente.id];
    const next: MockAnamnese = {
      ...(atual ?? { id: `anamnese-${paciente.id}`, pacienteId: paciente.id, criadoEm: now, atualizadoEm: now }),
      pacienteId: paciente.id,
      abordagensRecomendadas,
      status: 'triagem',
      criadoEm: atual?.criadoEm ?? now,
      atualizadoEm: now,
    };
    anamnesesByPacienteId[paciente.id] = next;
    return next as T;
  }

  // ── Diário ───────────────────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/diario/humor-hoje') {
    const pacienteId = String(query.pacienteId ?? '');
    const today = new Date().toDateString();
    const entry = diarios
      .filter((d) => d.pacienteId === pacienteId && new Date(d.dataRegistro).toDateString() === today)
      .sort((a, b) => new Date(b.dataRegistro).getTime() - new Date(a.dataRegistro).getTime())[0] ?? null;
    return (entry ? withSnakeCase(entry) : null) as T;
  }

  if (method === 'POST' && normalizedPath === '/diario/humor') {
    const paciente = getPacienteLogado();
    const pacienteId = paciente?.id ?? String(body?.pacienteId ?? '');
    const novo: MockDiario = {
      id: `diario-${diarios.length + 1}`,
      pacienteId,
      texto: String(body?.texto ?? ''),
      sentimento: body?.sentimento ? String(body.sentimento) : null,
      dataRegistro: new Date().toISOString(),
    };
    diarios.push(novo);
    return withSnakeCase(novo) as T;
  }

  if (method === 'GET' && normalizedPath === '/diario/registros') {
    const pacienteId = String(query.pacienteId ?? '');
    const result = diarios.filter((d) => !pacienteId || d.pacienteId === pacienteId).map((d) => withSnakeCase(d));
    return result as T;
  }

  if (method === 'POST' && normalizedPath === '/diario/registros') {
    const paciente = getPacienteLogado();
    const pacienteId = paciente?.id ?? String(body?.pacienteId ?? '');
    const novo: MockDiario = {
      id: `diario-${diarios.length + 1}`,
      pacienteId,
      texto: String(body?.texto ?? ''),
      sentimento: body?.sentimento ? String(body.sentimento) : null,
      dataRegistro: new Date().toISOString(),
    };
    diarios.push(novo);
    return withSnakeCase(novo) as T;
  }

  // ── Plano de Tratamento ──────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/plano-tratamento/meu') {
    const paciente = getPacienteLogado();
    if (!paciente) return null as T;
    const plano = planosTratamento.find((p) => p.pacienteId === paciente.id) ?? null;
    return plano as T;
  }

  if (method === 'GET' && normalizedPath === '/plano-tratamento') {
    let result = [...planosTratamento];
    if (query.pacienteId) result = result.filter((p) => p.pacienteId === query.pacienteId);
    if (query.profissionalId) result = result.filter((p) => p.profissionalId === query.profissionalId);
    return result as T;
  }

  if (method === 'POST' && normalizedPath === '/plano-tratamento') {
    const now = new Date().toISOString();
    const novo: MockPlanoTratamento = {
      id: `plano-${planosTratamento.length + 1}`,
      pacienteId: String(body?.pacienteId ?? ''),
      profissionalId: String(body?.profissionalId ?? ''),
      objetivos: String(body?.objetivos ?? ''),
      abordagem: String(body?.abordagem ?? ''),
      frequencia: String(body?.frequencia ?? 'Semanal'),
      duracaoPrevista: String(body?.duracaoPrevista ?? '6 meses'),
      tecnicas: String(body?.tecnicas ?? ''),
      indicadores: String(body?.indicadores ?? ''),
      status: 'ativo',
      criadoEm: now,
      atualizadoEm: now,
    };
    planosTratamento.push(novo);
    return novo as T;
  }

  const planoIdMatch = normalizedPath.match(/^\/plano-tratamento\/([^/]+)$/);
  if (method === 'PATCH' && planoIdMatch) {
    const planoId = planoIdMatch[1];
    const plano = planosTratamento.find((p) => p.id === planoId);
    if (!plano) throw new Error('Plano nao encontrado');
    Object.assign(plano, body ?? {}, { atualizadoEm: new Date().toISOString() });
    return plano as T;
  }

  // ── Notificações ─────────────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/notificacoes') {
    const user = getUserFromToken();
    let result = [...notificacoes];
    if (user) result = result.filter((n) => !n.userId || n.userId === user.id);
    return result as T;
  }

  const notifLidaMatch = normalizedPath.match(/^\/notificacoes\/([^/]+)\/lida$/);
  if (method === 'PATCH' && notifLidaMatch) {
    const notifId = notifLidaMatch[1];
    const notif = notificacoes.find((n) => n.id === notifId);
    if (notif) notif.lida = true;
    return { status: 'ok' } as T;
  }

  if (method === 'PATCH' && normalizedPath === '/notificacoes/lidas-todas') {
    const user = getUserFromToken();
    notificacoes.forEach((n) => { if (!n.userId || n.userId === user?.id) n.lida = true; });
    return { status: 'ok' } as T;
  }

  // ── Analytics ────────────────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath.startsWith('/analytics/')) {
    if (normalizedPath === '/analytics/dashboard') {
      const totalSessions = sessoes.length;
      const totalAbsences = sessoes.filter((item) => item.status === 'faltou').length;
      const today = new Date().toDateString();
      const todaySessions = sessoes.filter((item) => item.data && new Date(item.data).toDateString() === today).length;
      const weeklySessionsData = [
        { name: 'Sem 1', total: 4 },
        { name: 'Sem 2', total: 6 },
        { name: 'Sem 3', total: 3 },
        { name: 'Sem 4', total: 5 },
      ];
      const totalReceived = sessoes.filter((item) => item.statusPagamento === 'pago').reduce((sum, item) => sum + (item.valor ?? 0), 0);
      const totalPending = sessoes.filter((item) => item.statusPagamento === 'pendente').reduce((sum, item) => sum + (item.valor ?? 0), 0);
      const averageSessionValue = totalSessions > 0 ? (totalReceived + totalPending) / totalSessions : 0;
      return {
        totalSessions,
        totalAbsences,
        todaySessions,
        weeklySessionsData,
        totalReceived,
        totalPending,
        averageSessionValue,
        patientsWithFrequentAbsences: pacientes.filter((item) => item.statusRanqueado === 'faltas_frequentes').length,
        newPatientsThisMonth: 2,
        patientsWithoutSessionFor30Days: 1,
      } as T;
    }

    if (normalizedPath === '/analytics/agenda') {
      const agenda = sessoes
        .filter((s) => s.data && ['agendada', 'confirmada'].includes(s.status ?? ''))
        .map((s) => ({
          id: s.id,
          data: s.data as string,
          paciente: { nome: pacientes.find((p) => p.id === s.pacienteId)?.nome ?? 'Paciente' },
        }));
      return { agenda } as T;
    }

    if (normalizedPath === '/analytics/ocupacao') {
      return {
        ocupacaoMedia: 68,
        totalAgendadas: sessoes.filter((item) => item.status === 'agendada').length,
        totalConfirmadas: sessoes.filter((item) => item.status === 'confirmada').length,
        dias: [
          { dia: 'Seg', ocupacao: 70 },
          { dia: 'Ter', ocupacao: 55 },
          { dia: 'Qua', ocupacao: 80 },
          { dia: 'Qui', ocupacao: 60 },
          { dia: 'Sex', ocupacao: 75 },
        ],
      } as T;
    }

    if (normalizedPath === '/analytics/risco-faltas') {
      return [
        { periodo: '7d', risco: 12 },
        { periodo: '30d', risco: 28 },
      ] as T;
    }

    if (normalizedPath === '/analytics/pacientes-risco') {
      return pacientes.map((item, index) => ({
        id: item.id,
        nome: item.nome,
        status_risco: index % 2 === 0 ? 'alto' : 'moderado',
        score_atual: 70 - index * 5,
      })) as T;
    }

    if (normalizedPath === '/analytics/frequencia-faltas') {
      return [
        { semana: 'Sem 1', faltas: 2, reagendamentos: 1 },
        { semana: 'Sem 2', faltas: 1, reagendamentos: 2 },
        { semana: 'Sem 3', faltas: 3, reagendamentos: 1 },
        { semana: 'Sem 4', faltas: 2, reagendamentos: 0 },
      ] as T;
    }

    if (normalizedPath === '/analytics/distribuicao-riscos') {
      return [
        { categoria: 'Baixo', quantidade: 12 },
        { categoria: 'Moderado', quantidade: 6 },
        { categoria: 'Alto', quantidade: 3 },
      ] as T;
    }

    if (normalizedPath === '/analytics/sentimentos') {
      return [
        { name: 'Calmo', value: 35 },
        { name: 'Ansioso', value: 25 },
        { name: 'Motivado', value: 20 },
        { name: 'Cansado', value: 20 },
      ] as T;
    }

    if (normalizedPath === '/analytics/evolucao-score') {
      return [
        { semana: 'Sem 1', score: 62 },
        { semana: 'Sem 2', score: 68 },
        { semana: 'Sem 3', score: 71 },
        { semana: 'Sem 4', score: 74 },
      ] as T;
    }

    if (normalizedPath === '/analytics/resumo-profissional') {
      const ultimoDiario = diarios[diarios.length - 1];
      const ultimaSessao = sessoes
        .filter((sessao) => sessao.status === 'realizada')
        .sort((a, b) => new Date(b.data ?? 0).getTime() - new Date(a.data ?? 0).getTime())[0];
      const ultimoAlerta = alertas[0];
      return {
        ultimoDiario: ultimoDiario ? withSnakeCase(ultimoDiario) : null,
        ultimaSessao: ultimaSessao ?? null,
        ultimoAlerta: ultimoAlerta ? withSnakeCase(ultimoAlerta) : null,
      } as T;
    }
  }

  // ── Pacientes ────────────────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/pacientes') {
    let result = [...pacientes];
    if (query.status) result = result.filter((item) => item.statusRanqueado === query.status);
    return result as T;
  }

  const pacienteUserMatch = normalizedPath.match(/^\/pacientes\/user\/([^/]+)$/);
  if (method === 'GET' && pacienteUserMatch) {
    const userId = pacienteUserMatch[1];
    const paciente = pacientes.find((item) => item.userId === userId) ?? pacientes[0];
    return { id: paciente.id, nome: paciente.nome } as T;
  }

  const pacienteResumoMatch = normalizedPath.match(/^\/pacientes\/([^/]+)\/resumo$/);
  if (method === 'GET' && pacienteResumoMatch) {
    const pacienteId = pacienteResumoMatch[1];
    const pacienteSessoes = sessoes.filter((item) => item.pacienteId === pacienteId);
    const ultimaSessao = pacienteSessoes.sort((a, b) => new Date(b.data ?? 0).getTime() - new Date(a.data ?? 0).getTime())[0];
    const ultimoDiario = diarios
      .filter((item) => item.pacienteId === pacienteId)
      .sort((a, b) => new Date(b.dataRegistro).getTime() - new Date(a.dataRegistro).getTime())[0];
    const ultimoAlerta = alertas.find((item) => item.pacienteId === pacienteId);
    return { ultimaSessao: ultimaSessao ?? null, ultimoDiario: ultimoDiario ?? null, ultimoAlerta: ultimoAlerta ?? null } as T;
  }

  const pacienteIndicadoresMatch = normalizedPath.match(/^\/pacientes\/([^/]+)\/indicadores$/);
  if (method === 'GET' && pacienteIndicadoresMatch) {
    const pacienteId = pacienteIndicadoresMatch[1];
    return {
      sessoes: sessoes.filter((item) => item.pacienteId === pacienteId).map((item) => ({ id: item.id, data: item.data, scoreClinico: item.scoreClinico ?? 0 })),
      diarios: diarios.filter((item) => item.pacienteId === pacienteId),
    } as T;
  }

  const pacienteDiariosMatch = normalizedPath.match(/^\/pacientes\/([^/]+)\/diarios$/);
  if (method === 'GET' && pacienteDiariosMatch) {
    const pacienteId = pacienteDiariosMatch[1];
    return diarios.filter((item) => item.pacienteId === pacienteId) as T;
  }

  const pacienteMensagensMatch = normalizedPath.match(/^\/pacientes\/([^/]+)\/mensagens$/);
  if (method === 'GET' && pacienteMensagensMatch) {
    const pacienteId = pacienteMensagensMatch[1];
    return mensagens.filter((item) => item.pacienteId === pacienteId) as T;
  }

  const pacienteComportamentoMatch = normalizedPath.match(/^\/pacientes\/([^/]+)\/comportamento$/);
  if (method === 'GET' && pacienteComportamentoMatch) {
    const pacienteId = pacienteComportamentoMatch[1];
    return {
      sessoes: sessoes.filter((item) => item.pacienteId === pacienteId).map((item) => ({
        id: item.id,
        data: item.data ?? null,
        status: item.status ?? null,
        scoreClinico: item.scoreClinico ?? null,
        reagendadaEm: null,
        pacienteId: item.pacienteId,
      })),
      diarios: diarios.filter((item) => item.pacienteId === pacienteId).map((item) => ({
        id: item.id,
        texto: item.texto,
        dataRegistro: item.dataRegistro,
        pacienteId: item.pacienteId,
        sentimento: item.sentimento ?? undefined,
        tags: [],
        palavrasDisfuncionais: null,
      })),
      alertas: alertas.filter((item) => item.pacienteId === pacienteId).map((item) => ({
        id: item.id,
        tipoAlerta: item.tipoAlerta,
        descricao: item.descricao ?? null,
        nivelUrgencia: (item.nivelUrgencia as 'baixo' | 'medio' | 'alto') ?? null,
        dataCriacao: item.dataCriacao,
        pacienteId: item.pacienteId,
        status: item.status ?? 'novo',
        termosRelacionados: item.termosRelacionados ?? [],
        tipoAlertaPrincipal: item.tipoAlertaPrincipal ?? 'sentimento',
      })),
      avaliacoes: [],
    } as T;
  }

  const pacienteMatch = normalizedPath.match(/^\/pacientes\/([^/]+)$/);
  if (method === 'GET' && pacienteMatch) {
    const pacienteId = pacienteMatch[1];
    const paciente = pacientes.find((item) => item.id === pacienteId) ?? null;
    return paciente as T;
  }

  // ── Sessões ──────────────────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/sessoes') {
    let result = [...sessoes];
    if (query.pacienteId) result = result.filter((item) => item.pacienteId === query.pacienteId);
    if (query.profissionalId) result = result.filter((item) => item.profissionalId === query.profissionalId);
    if (query.dataInicio || query.dataFim) {
      result = filterByDateRange(result, String(query.dataInicio ?? ''), String(query.dataFim ?? ''));
    }
    return result as T;
  }

  const pagarSessaoMatch = normalizedPath.match(/^\/sessoes\/([^/]+)\/pagar$/);
  if (method === 'POST' && pagarSessaoMatch) {
    const sessaoId = pagarSessaoMatch[1];
    const sessao = sessoes.find((item) => item.id === sessaoId);
    if (sessao) sessao.statusPagamento = 'pago';
    return { status: 'ok' } as T;
  }

  // ── Alertas ──────────────────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/alertas') {
    let result = [...alertas].map((item) => withSnakeCase(item));
    if (query.pacienteId) result = result.filter((item) => item.pacienteId === query.pacienteId);
    if (query.from || query.to) {
      const fromTime = query.from ? new Date(String(query.from)).getTime() : Number.NEGATIVE_INFINITY;
      const toTime = query.to ? new Date(String(query.to)).getTime() : Number.POSITIVE_INFINITY;
      result = result.filter((item) => {
        const time = new Date(item.dataCriacao).getTime();
        return time >= fromTime && time <= toTime;
      });
    }
    return result as T;
  }

  // ── Serviços ─────────────────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/servicos') {
    let result = [...servicos];
    if (query.search) { const term = String(query.search).toLowerCase(); result = result.filter((item) => item.nome.toLowerCase().includes(term)); }
    if (query.modalidade) result = result.filter((item) => item.modalidade === query.modalidade);
    if (query.tipoCobranca) result = result.filter((item) => item.tipo_cobranca === query.tipoCobranca);
    return result as T;
  }

  if (method === 'POST' && normalizedPath === '/servicos') {
    const newServico: MockServico = {
      id: `serv-${servicos.length + 1}`,
      profissional_id: 'user-prof-1',
      nome: String(body?.nome ?? 'Novo Servico'),
      descricao: body?.descricao ? String(body.descricao) : undefined,
      valor: toNumber(body?.valor, 200),
      tipo_cobranca: (body?.tipo_cobranca as MockServico['tipo_cobranca']) ?? 'avulso',
      qtd_sessoes: toNumber(body?.qtd_sessoes, 1),
      duracao_dias: toNumber(body?.duracao_dias, 7),
      modalidade: (body?.modalidade as MockServico['modalidade']) ?? 'online',
      created_at: daysFromNow(0),
    };
    servicos.push(newServico);
    return newServico as T;
  }

  const updateServicoMatch = normalizedPath.match(/^\/servicos\/([^/]+)$/);
  if (method === 'PATCH' && updateServicoMatch) {
    const servicoId = updateServicoMatch[1];
    const servico = servicos.find((item) => item.id === servicoId);
    if (servico) { Object.assign(servico, body ?? {}); return servico as T; }
    throw new Error('Servico nao encontrado');
  }

  if (method === 'DELETE' && updateServicoMatch) {
    const servicoId = updateServicoMatch[1];
    const index = servicos.findIndex((item) => item.id === servicoId);
    if (index >= 0) servicos.splice(index, 1);
    return { status: 'ok' } as T;
  }

  // ── Serviços Contratados ──────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/servicos-contratados') {
    let result = [...servicosContratados];
    if (query.pacienteId) result = result.filter((item) => item.paciente_id === query.pacienteId);
    if (query.status) result = result.filter((item) => item.status === query.status);
    return result as T;
  }

  if (method === 'POST' && normalizedPath === '/servicos-contratados') {
    const newContrato: MockServicoContratado = {
      id: `contrato-${servicosContratados.length + 1}`,
      paciente_id: String(body?.paciente_id ?? pacientes[0].id),
      servico_id: String(body?.servico_id ?? servicos[0].id),
      data_inicio: body?.data_inicio ? String(body.data_inicio) : daysFromNow(0),
      qtd_total_sessoes: toNumber(body?.qtd_total_sessoes, 10),
      qtd_sessoes_realizadas: 0,
      status: 'ativo',
      created_at: daysFromNow(0),
    };
    const paciente = pacientes.find((item) => item.id === newContrato.paciente_id);
    const servico = servicos.find((item) => item.id === newContrato.servico_id);
    newContrato.paciente_nome = paciente?.nome;
    newContrato.servico_nome = servico?.nome;
    servicosContratados.push(newContrato);
    return newContrato as T;
  }

  const incrementarContratoMatch = normalizedPath.match(/^\/servicos-contratados\/([^/]+)\/incrementar$/);
  if (method === 'POST' && incrementarContratoMatch) {
    const contratoId = incrementarContratoMatch[1];
    const contrato = servicosContratados.find((item) => item.id === contratoId);
    if (contrato) contrato.qtd_sessoes_realizadas += 1;
    return { status: 'ok' } as T;
  }

  const statusContratoMatch = normalizedPath.match(/^\/servicos-contratados\/([^/]+)\/status$/);
  if (method === 'PATCH' && statusContratoMatch) {
    const contratoId = statusContratoMatch[1];
    const contrato = servicosContratados.find((item) => item.id === contratoId);
    if (contrato && body?.status) contrato.status = body.status as MockServicoContratado['status'];
    return { status: 'ok' } as T;
  }

  if (method === 'GET' && normalizedPath === '/servicos-contratados/alertas') {
    return servicosContratados.map((contrato) => ({
      contrato_id: contrato.id,
      paciente_id: contrato.paciente_id,
      servico_id: contrato.servico_id,
      nome_servico: contrato.servico_nome ?? 'Servico',
      nome_paciente: contrato.paciente_nome ?? 'Paciente',
      qtd_total_sessoes: contrato.qtd_total_sessoes,
      qtd_sessoes_realizadas: contrato.qtd_sessoes_realizadas,
      sessoes_restantes: contrato.qtd_total_sessoes - contrato.qtd_sessoes_realizadas,
      data_inicio: contrato.data_inicio,
      alerta_fim_sessoes: contrato.qtd_total_sessoes - contrato.qtd_sessoes_realizadas <= 2,
      alerta_fim_periodo: false,
      alerta_inatividade: false,
    })) as T;
  }

  // ── Recibos ──────────────────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/recibos') return recibos as T;

  if (method === 'POST' && normalizedPath === '/recibos') {
    const newRecibo: MockRecibo = {
      id: `recibo-${recibos.length + 1}`,
      paciente: { nome: String(body?.paciente_nome ?? pacientes[0].nome) },
      data_sessao: body?.data_sessao ? new Date(String(body.data_sessao)).toISOString() : daysFromNow(0),
      created_at: daysFromNow(0),
      enviado: false,
      valor: toNumber(body?.valor, 200),
      forma_pagamento: String(body?.forma_pagamento ?? 'Pix'),
      pdf_url: null,
    };
    recibos.push(newRecibo);
    return newRecibo as T;
  }

  const reciboMatch = normalizedPath.match(/^\/recibos\/([^/]+)$/);
  if (method === 'DELETE' && reciboMatch) {
    const reciboId = reciboMatch[1];
    const index = recibos.findIndex((item) => item.id === reciboId);
    if (index >= 0) recibos.splice(index, 1);
    return { status: 'ok' } as T;
  }

  const reciboSendMatch = normalizedPath.match(/^\/recibos\/([^/]+)\/send$/);
  if (method === 'POST' && reciboSendMatch) {
    const reciboId = reciboSendMatch[1];
    const recibo = recibos.find((item) => item.id === reciboId);
    if (recibo) recibo.enviado = true;
    return { status: 'ok' } as T;
  }

  // ── Financeiro ───────────────────────────────────────────────────────────

  if (method === 'GET' && normalizedPath === '/financeiro/resumo') {
    const total_received = sessoes.filter((item) => item.statusPagamento === 'pago').reduce((sum, item) => sum + (item.valor ?? 0), 0);
    const total_pending = sessoes.filter((item) => item.statusPagamento === 'pendente').reduce((sum, item) => sum + (item.valor ?? 0), 0);
    const transactions = sessoes.map((item) => ({
      id: item.id,
      sessaoId: item.id,
      pacienteId: item.pacienteId,
      pacienteNome: pacientes.find((p) => p.id === item.pacienteId)?.nome,
      valor: item.valor ?? 0,
      status: item.statusPagamento ?? 'pendente',
      dataSessao: item.data ?? undefined,
      dataPagamento: item.statusPagamento === 'pago' ? item.data ?? undefined : undefined,
      metodoPagamento: item.statusPagamento === 'pago' ? 'Pix' : undefined,
    }));
    return {
      total_received,
      total_pending,
      period: String(query.period ?? 'Mensal'),
      from: daysFromNow(-30),
      to: daysFromNow(0),
      transactions,
    } as T;
  }

  const financeChargePayMatch = normalizedPath.match(/^\/financeiro\/charges\/([^/]+)\/pay$/);
  if (method === 'POST' && financeChargePayMatch) {
    const chargeId = financeChargePayMatch[1];
    const sessao = sessoes.find((item) => item.id === chargeId);
    if (sessao) sessao.statusPagamento = 'pago';
    return { status: 'ok' } as T;
  }

  const financeChargeSendMatch = normalizedPath.match(/^\/financeiro\/charges\/([^/]+)\/send$/);
  if (method === 'POST' && financeChargeSendMatch) {
    return { status: 'ok' } as T;
  }

  throw new Error(`Mock API: rota nao implementada (${method} ${normalizedPath})`);
}
