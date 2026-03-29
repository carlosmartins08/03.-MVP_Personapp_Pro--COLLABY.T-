import type { ApiRequestOptions } from './api';
import { getAccessToken } from './auth-storage';

type MockUser = {
  id: string;
  email: string;
  tipo: 'profissional' | 'paciente';
  emailVerificado?: boolean;
  idiomaPreferido?: 'pt' | 'en';
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
  data?: string | null;
  duracao?: number | null;
  status?: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'faltou' | null;
  valor?: number | null;
  statusPagamento?: 'pendente' | 'pago' | 'cancelado' | null;
  anotacoes?: string | null;
  scoreClinico?: number | null;
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

const sleep = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const daysFromNow = (days: number) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mockUsers: MockUser[] = [
  {
    id: 'user-prof-1',
    email: 'psicologo@personapp.dev',
    tipo: 'profissional',
    emailVerificado: true,
    idiomaPreferido: 'pt',
  },
  {
    id: 'user-pac-1',
    email: 'paciente@personapp.dev',
    tipo: 'paciente',
    emailVerificado: true,
    idiomaPreferido: 'pt',
  },
];

const tokensByUserId: Record<string, string> = {
  'user-prof-1': 'mock-token-prof',
  'user-pac-1': 'mock-token-pac',
};

const usersByToken: Record<string, MockUser> = {
  'mock-token-prof': mockUsers[0],
  'mock-token-pac': mockUsers[1],
};

const pacientes: MockPaciente[] = [
  {
    id: 'pac-1',
    nome: 'Ana Costa',
    email: 'ana.costa@example.com',
    telefone: '(11) 99999-1111',
    genero: 'Feminino',
    endereco: 'Rua das Flores, 123',
    observacoes: 'Paciente com historico de ansiedade.',
    statusRanqueado: 'normal',
    totalFaltas: 1,
    fotoPerfil: 'https://i.pravatar.cc/150?img=5',
    dataNascimento: '1995-03-10',
    criadoEm: daysFromNow(-200),
    userId: 'user-pac-1',
  },
  {
    id: 'pac-2',
    nome: 'Pedro Santos',
    email: 'pedro.santos@example.com',
    telefone: '(11) 99999-2222',
    genero: 'Masculino',
    endereco: 'Avenida Central, 456',
    observacoes: 'Acompanhamento regular desde 2023.',
    statusRanqueado: 'faltas_frequentes',
    totalFaltas: 4,
    fotoPerfil: 'https://i.pravatar.cc/150?img=12',
    dataNascimento: '1988-08-22',
    criadoEm: daysFromNow(-320),
  },
  {
    id: 'pac-3',
    nome: 'Marina Souza',
    email: 'marina.souza@example.com',
    telefone: '(11) 99999-3333',
    genero: 'Feminino',
    endereco: 'Rua do Comercio, 789',
    observacoes: 'Plano de cuidado intensivo.',
    statusRanqueado: 'intensivo',
    totalFaltas: 0,
    fotoPerfil: 'https://i.pravatar.cc/150?img=21',
    dataNascimento: '1992-11-01',
    criadoEm: daysFromNow(-90),
  },
];

const sessoes: MockSessao[] = [
  {
    id: 'sess-1',
    pacienteId: 'pac-1',
    data: daysFromNow(-7),
    duracao: 50,
    status: 'realizada',
    valor: 250,
    statusPagamento: 'pago',
    anotacoes: 'Paciente relatou melhora do sono.',
    scoreClinico: 72,
  },
  {
    id: 'sess-2',
    pacienteId: 'pac-1',
    data: daysFromNow(3),
    duracao: 50,
    status: 'agendada',
    valor: 250,
    statusPagamento: 'pendente',
    scoreClinico: 74,
  },
  {
    id: 'sess-3',
    pacienteId: 'pac-2',
    data: daysFromNow(1),
    duracao: 50,
    status: 'confirmada',
    valor: 180,
    statusPagamento: 'pendente',
    scoreClinico: 65,
  },
  {
    id: 'sess-4',
    pacienteId: 'pac-3',
    data: daysFromNow(-14),
    duracao: 50,
    status: 'faltou',
    valor: 200,
    statusPagamento: 'pendente',
    anotacoes: 'Paciente nao compareceu.',
    scoreClinico: 58,
  },
];

const diarios: MockDiario[] = [
  {
    id: 'diario-1',
    pacienteId: 'pac-1',
    texto: 'Hoje foi um dia melhor do que o anterior.',
    sentimento: 'calmo',
    dataRegistro: daysFromNow(-2),
  },
  {
    id: 'diario-2',
    pacienteId: 'pac-1',
    texto: 'Senti ansiedade ao acordar, mas consegui controlar.',
    sentimento: 'ansioso',
    dataRegistro: daysFromNow(-1),
  },
];

const anamnesesByPacienteId: Record<string, MockAnamnese> = {};

const alertas: MockAlerta[] = [
  {
    id: 'alerta-1',
    pacienteId: 'pac-2',
    tipoAlerta: 'Falta frequente',
    descricao: 'Paciente faltou duas vezes seguidas.',
    nivelUrgencia: 'alto',
    dataCriacao: daysFromNow(-3),
    status: 'novo',
    termosRelacionados: ['falta', 'desengajamento'],
    tipoAlertaPrincipal: 'comportamento',
  },
  {
    id: 'alerta-2',
    pacienteId: 'pac-1',
    tipoAlerta: 'Oscilacao emocional',
    descricao: 'Mudanca brusca no humor registrada.',
    nivelUrgencia: 'medio',
    dataCriacao: daysFromNow(-5),
    status: 'visto',
    termosRelacionados: ['humor', 'ansiedade'],
    tipoAlertaPrincipal: 'sentimento',
  },
];

const mensagens: MockMensagem[] = [
  {
    id: 'msg-1',
    pacienteId: 'pac-1',
    dataEnvio: daysFromNow(-6),
    tipoMensagem: 'Lembrete de sessao',
    meio: 'whatsapp',
    conteudo: 'Sua sessao esta confirmada para amanha as 15h.',
    mensagemEntregue: true,
  },
  {
    id: 'msg-2',
    pacienteId: 'pac-1',
    dataEnvio: daysFromNow(-1),
    tipoMensagem: 'Feedback semanal',
    meio: 'email',
    conteudo: 'Lembre-se de registrar seu diario de sentimentos.',
    mensagemEntregue: true,
  },
];

const servicos: MockServico[] = [
  {
    id: 'serv-1',
    profissional_id: 'user-prof-1',
    nome: 'Psicoterapia Individual',
    descricao: 'Sessao semanal com foco em regulacao emocional.',
    valor: 250,
    tipo_cobranca: 'avulso',
    qtd_sessoes: 1,
    duracao_dias: 7,
    modalidade: 'online',
    created_at: daysFromNow(-200),
  },
  {
    id: 'serv-2',
    profissional_id: 'user-prof-1',
    nome: 'Acompanhamento Mensal',
    descricao: 'Plano mensal com suporte continuo.',
    valor: 900,
    tipo_cobranca: 'mensal',
    qtd_sessoes: 4,
    duracao_dias: 30,
    modalidade: 'hibrido',
    created_at: daysFromNow(-150),
  },
];

const servicosContratados: MockServicoContratado[] = [
  {
    id: 'contrato-1',
    paciente_id: 'pac-1',
    servico_id: 'serv-1',
    data_inicio: daysFromNow(-30),
    qtd_total_sessoes: 12,
    qtd_sessoes_realizadas: 4,
    status: 'ativo',
    created_at: daysFromNow(-30),
    paciente_nome: 'Ana Costa',
    servico_nome: 'Psicoterapia Individual',
  },
];

const recibos: MockRecibo[] = [
  {
    id: 'recibo-1',
    paciente: { nome: 'Ana Costa' },
    data_sessao: daysFromNow(-7),
    created_at: daysFromNow(-6),
    enviado: true,
    valor: 250,
    forma_pagamento: 'Cartao',
    pdf_url: null,
  },
  {
    id: 'recibo-2',
    paciente: { nome: 'Pedro Santos' },
    data_sessao: daysFromNow(-14),
    created_at: daysFromNow(-13),
    enviado: false,
    valor: 180,
    forma_pagamento: 'Pix',
    pdf_url: null,
  },
];

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

export async function mockApiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  await sleep();

  const method = options.method ?? 'GET';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const query = (options.query ?? {}) as Record<string, any>;
  const body = options.body as Record<string, unknown> | undefined;

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

  if (method === 'POST' && normalizedPath === '/auth/signup') {
    return { status: 'ok' } as T;
  }

  if (method === 'POST' && normalizedPath === '/auth/verify-email') {
    return { status: 'ok' } as T;
  }

  if (method === 'POST' && normalizedPath === '/auth/request-reset') {
    return { status: 'ok' } as T;
  }

  if (method === 'POST' && normalizedPath === '/auth/reset') {
    return { status: 'ok' } as T;
  }

  if (method === 'GET' && normalizedPath === '/me') {
    const user = getUserFromToken();
    if (!user) {
      throw new Error('Unauthorized');
    }
    return user as T;
  }

  if (method === 'PATCH' && normalizedPath === '/me/preferences') {
    const user = getUserFromToken();
    if (user && body?.idiomaPreferido) {
      user.idiomaPreferido = body.idiomaPreferido as 'pt' | 'en';
    }
    return { status: 'ok' } as T;
  }

  if (method === 'GET' && normalizedPath === '/anamnese') {
    const paciente = getPacienteLogado();
    if (!paciente) {
      throw new Error('Paciente nao encontrado');
    }
    return (anamnesesByPacienteId[paciente.id] ?? null) as T;
  }

  if (method === 'POST' && normalizedPath === '/anamnese') {
    const paciente = getPacienteLogado();
    if (!paciente) {
      throw new Error('Paciente nao encontrado');
    }

    const now = new Date().toISOString();
    const atual = anamnesesByPacienteId[paciente.id];
    const next: MockAnamnese = {
      ...(atual ?? {
        id: `anamnese-${paciente.id}`,
        pacienteId: paciente.id,
        criadoEm: now,
        atualizadoEm: now,
      }),
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
    if (!paciente) {
      throw new Error('Paciente nao encontrado');
    }

    const abordagensRecomendadas = Array.isArray(body?.abordagensRecomendadas)
      ? body?.abordagensRecomendadas.map(String).slice(0, 2)
      : [];

    if (!abordagensRecomendadas.length) {
      throw new Error('abordagensRecomendadas obrigatorio');
    }

    const now = new Date().toISOString();
    const atual = anamnesesByPacienteId[paciente.id];

    const next: MockAnamnese = {
      ...(atual ?? {
        id: `anamnese-${paciente.id}`,
        pacienteId: paciente.id,
        criadoEm: now,
        atualizadoEm: now,
      }),
      pacienteId: paciente.id,
      abordagensRecomendadas,
      status: 'triagem',
      criadoEm: atual?.criadoEm ?? now,
      atualizadoEm: now,
    };

    anamnesesByPacienteId[paciente.id] = next;
    return next as T;
  }

  if (method === 'GET' && normalizedPath.startsWith('/analytics/')) {
    if (normalizedPath === '/analytics/dashboard') {
      const totalSessions = sessoes.length;
      const totalAbsences = sessoes.filter((item) => item.status === 'faltou').length;
      const today = new Date().toDateString();
      const todaySessions = sessoes.filter(
        (item) => item.data && new Date(item.data).toDateString() === today
      ).length;
      const weeklySessionsData = [
        { name: 'Sem 1', total: 4 },
        { name: 'Sem 2', total: 6 },
        { name: 'Sem 3', total: 3 },
        { name: 'Sem 4', total: 5 },
      ];
      const totalReceived = sessoes
        .filter((item) => item.statusPagamento === 'pago')
        .reduce((sum, item) => sum + (item.valor ?? 0), 0);
      const totalPending = sessoes
        .filter((item) => item.statusPagamento === 'pendente')
        .reduce((sum, item) => sum + (item.valor ?? 0), 0);
      const averageSessionValue =
        totalSessions > 0 ? (totalReceived + totalPending) / totalSessions : 0;

      return {
        totalSessions,
        totalAbsences,
        todaySessions,
        weeklySessionsData,
        totalReceived,
        totalPending,
        averageSessionValue,
        patientsWithFrequentAbsences: pacientes.filter(
          (item) => item.statusRanqueado === 'faltas_frequentes'
        ).length,
        newPatientsThisMonth: 2,
        patientsWithoutSessionFor30Days: 1,
      } as T;
    }

    if (normalizedPath === '/analytics/agenda') {
      const agenda = sessoes
        .filter((sessao) => sessao.data && ['agendada', 'confirmada'].includes(sessao.status ?? ''))
        .map((sessao) => ({
          id: sessao.id,
          data: sessao.data as string,
          paciente: { nome: pacientes.find((p) => p.id === sessao.pacienteId)?.nome ?? 'Paciente' },
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

  if (method === 'GET' && normalizedPath === '/pacientes') {
    let result = [...pacientes];
    if (query.status) {
      result = result.filter((item) => item.statusRanqueado === query.status);
    }
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
    const ultimaSessao = pacienteSessoes.sort(
      (a, b) => new Date(b.data ?? 0).getTime() - new Date(a.data ?? 0).getTime()
    )[0];
    const ultimoDiario = diarios
      .filter((item) => item.pacienteId === pacienteId)
      .sort((a, b) => new Date(b.dataRegistro).getTime() - new Date(a.dataRegistro).getTime())[0];
    const ultimoAlerta = alertas.find((item) => item.pacienteId === pacienteId);

    return {
      ultimaSessao: ultimaSessao ?? null,
      ultimoDiario: ultimoDiario ?? null,
      ultimoAlerta: ultimoAlerta ?? null,
    } as T;
  }

  const pacienteIndicadoresMatch = normalizedPath.match(/^\/pacientes\/([^/]+)\/indicadores$/);
  if (method === 'GET' && pacienteIndicadoresMatch) {
    const pacienteId = pacienteIndicadoresMatch[1];
    return {
      sessoes: sessoes
        .filter((item) => item.pacienteId === pacienteId)
        .map((item) => ({
          id: item.id,
          data: item.data,
          scoreClinico: item.scoreClinico ?? 0,
        })),
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
      sessoes: sessoes
        .filter((item) => item.pacienteId === pacienteId)
        .map((item) => ({
          id: item.id,
          data: item.data ?? null,
          status: item.status ?? null,
          scoreClinico: item.scoreClinico ?? null,
          reagendadaEm: null,
          pacienteId: item.pacienteId,
        })),
      diarios: diarios
        .filter((item) => item.pacienteId === pacienteId)
        .map((item) => ({
          id: item.id,
          texto: item.texto,
          dataRegistro: item.dataRegistro,
          pacienteId: item.pacienteId,
          sentimento: item.sentimento ?? undefined,
          tags: [],
          palavrasDisfuncionais: null,
        })),
      alertas: alertas
        .filter((item) => item.pacienteId === pacienteId)
        .map((item) => ({
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

  if (method === 'GET' && normalizedPath === '/sessoes') {
    let result = [...sessoes];
    if (query.pacienteId) {
      result = result.filter((item) => item.pacienteId === query.pacienteId);
    }
    if (query.dataInicio || query.dataFim) {
      result = filterByDateRange(result, String(query.dataInicio ?? ''), String(query.dataFim ?? ''));
    }
    return result as T;
  }

  const pagarSessaoMatch = normalizedPath.match(/^\/sessoes\/([^/]+)\/pagar$/);
  if (method === 'POST' && pagarSessaoMatch) {
    const sessaoId = pagarSessaoMatch[1];
    const sessao = sessoes.find((item) => item.id === sessaoId);
    if (sessao) {
      sessao.statusPagamento = 'pago';
    }
    return { status: 'ok' } as T;
  }

  if (method === 'GET' && normalizedPath === '/alertas') {
    let result = [...alertas].map((item) => withSnakeCase(item));
    if (query.pacienteId) {
      result = result.filter((item) => item.pacienteId === query.pacienteId);
    }
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

  if (method === 'GET' && normalizedPath === '/servicos') {
    let result = [...servicos];
    if (query.search) {
      const term = String(query.search).toLowerCase();
      result = result.filter((item) => item.nome.toLowerCase().includes(term));
    }
    if (query.modalidade) {
      result = result.filter((item) => item.modalidade === query.modalidade);
    }
    if (query.tipoCobranca) {
      result = result.filter((item) => item.tipo_cobranca === query.tipoCobranca);
    }
    return result as T;
  }

  if (method === 'POST' && normalizedPath === '/servicos') {
    const newServico: MockServico = {
      id: `serv-${servicos.length + 1}`,
      profissional_id: 'user-prof-1',
      nome: String(body?.nome ?? 'Novo Servico'),
      descricao: body?.descricao ? String(body?.descricao) : undefined,
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
    if (servico) {
      Object.assign(servico, body ?? {});
      return servico as T;
    }
    throw new Error('Servico nao encontrado');
  }

  if (method === 'DELETE' && updateServicoMatch) {
    const servicoId = updateServicoMatch[1];
    const index = servicos.findIndex((item) => item.id === servicoId);
    if (index >= 0) {
      servicos.splice(index, 1);
    }
    return { status: 'ok' } as T;
  }

  if (method === 'GET' && normalizedPath === '/servicos-contratados') {
    let result = [...servicosContratados];
    if (query.pacienteId) {
      result = result.filter((item) => item.paciente_id === query.pacienteId);
    }
    if (query.status) {
      result = result.filter((item) => item.status === query.status);
    }
    return result as T;
  }

  if (method === 'POST' && normalizedPath === '/servicos-contratados') {
    const newContrato: MockServicoContratado = {
      id: `contrato-${servicosContratados.length + 1}`,
      paciente_id: String(body?.paciente_id ?? pacientes[0].id),
      servico_id: String(body?.servico_id ?? servicos[0].id),
      data_inicio: body?.data_inicio ? String(body?.data_inicio) : daysFromNow(0),
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
    if (contrato) {
      contrato.qtd_sessoes_realizadas += 1;
    }
    return { status: 'ok' } as T;
  }

  const statusContratoMatch = normalizedPath.match(/^\/servicos-contratados\/([^/]+)\/status$/);
  if (method === 'PATCH' && statusContratoMatch) {
    const contratoId = statusContratoMatch[1];
    const contrato = servicosContratados.find((item) => item.id === contratoId);
    if (contrato && body?.status) {
      contrato.status = body.status as MockServicoContratado['status'];
    }
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

  if (method === 'GET' && normalizedPath === '/recibos') {
    return recibos as T;
  }

  if (method === 'POST' && normalizedPath === '/recibos') {
    const newRecibo: MockRecibo = {
      id: `recibo-${recibos.length + 1}`,
      paciente: { nome: String(body?.paciente_nome ?? pacientes[0].nome) },
      data_sessao: body?.data_sessao ? new Date(String(body?.data_sessao)).toISOString() : daysFromNow(0),
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
    if (index >= 0) {
      recibos.splice(index, 1);
    }
    return { status: 'ok' } as T;
  }

  const reciboSendMatch = normalizedPath.match(/^\/recibos\/([^/]+)\/send$/);
  if (method === 'POST' && reciboSendMatch) {
    const reciboId = reciboSendMatch[1];
    const recibo = recibos.find((item) => item.id === reciboId);
    if (recibo) {
      recibo.enviado = true;
    }
    return { status: 'ok' } as T;
  }

  if (method === 'GET' && normalizedPath === '/financeiro/resumo') {
    const total_received = sessoes
      .filter((item) => item.statusPagamento === 'pago')
      .reduce((sum, item) => sum + (item.valor ?? 0), 0);
    const total_pending = sessoes
      .filter((item) => item.statusPagamento === 'pendente')
      .reduce((sum, item) => sum + (item.valor ?? 0), 0);
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

  const financeChargeMatch = normalizedPath.match(/^\/financeiro\/charges\/([^/]+)\/send$/);
  if (method === 'POST' && financeChargeMatch) {
    return { status: 'ok' } as T;
  }

  throw new Error(`Mock API: rota nao implementada (${method} ${normalizedPath})`);
}
