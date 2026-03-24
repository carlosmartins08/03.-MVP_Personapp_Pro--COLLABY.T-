import { Paciente, Sessao, Usuario, Financeiro } from '@/types';

// Usuário Profissional
export const usuarioMock: Usuario = {
  id: 'usr_123',
  nome: 'Dr. João Silva',
  email: 'joao.silva@example.com',
  telefone: '(11) 98765-4321',
  especialidade: 'Psicólogo Clínico',
  fotoPerfil: 'https://i.pravatar.cc/150?img=12'
};

// Pacientes de exemplo
export const pacientesMock: Paciente[] = [
  {
    id: 'pac_001',
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    telefone: '(11) 98765-4321',
    dataNascimento: '1990-05-15',
    genero: 'Feminino',
    cpf: '123.456.789-00',
    endereco: 'Rua das Flores, 123',
    observacoes: 'Paciente com histórico de ansiedade',
    dataCadastro: '2023-01-15',
    fotoPerfil: 'https://i.pravatar.cc/150?img=1',
    statusRanqueado: 'normal',
    totalFaltas: 0
  },
  {
    id: 'pac_002',
    nome: 'Pedro Santos',
    email: 'pedro.santos@example.com',
    telefone: '(11) 98765-4322',
    dataNascimento: '1985-08-22',
    genero: 'Masculino',
    cpf: '987.654.321-00',
    endereco: 'Avenida Principal, 456',
    observacoes: 'Primeiro atendimento em 15/01/2023',
    dataCadastro: '2023-01-10',
    fotoPerfil: 'https://i.pravatar.cc/150?img=3',
    statusRanqueado: 'normal',
    totalFaltas: 0
  },
  {
    id: 'pac_003',
    nome: 'Ana Silva',
    email: 'ana.silva@example.com',
    telefone: '(11) 98765-4323',
    dataNascimento: '1995-03-10',
    genero: 'Feminino',
    cpf: '456.789.123-00',
    endereco: 'Rua do Comércio, 789',
    dataCadastro: '2023-02-01',
    fotoPerfil: 'https://i.pravatar.cc/150?img=5',
    statusRanqueado: 'normal',
    totalFaltas: 0
  }
];

// Data atual para referência nas sessões
const hoje = new Date();
const amanha = new Date(hoje);
amanha.setDate(hoje.getDate() + 1);
const ontem = new Date(hoje);
ontem.setDate(hoje.getDate() - 1);

// Sessões de exemplo
export const sessoesMock: Sessao[] = [
  {
    id: '1',
    pacienteId: '1',
    data: hoje.toISOString(),
    duracao: 50,
    status: 'agendada',
    valor: 150,
    statusPagamento: 'pendente',
  },
  {
    id: '2',
    pacienteId: '2',
    data: hoje.toISOString(),
    duracao: 50,
    status: 'confirmada',
    valor: 150,
    statusPagamento: 'pendente',
  },
  {
    id: '3',
    pacienteId: '3',
    data: amanha.toISOString(),
    duracao: 50,
    status: 'agendada',
    valor: 150,
    statusPagamento: 'pendente',
  },
  {
    id: '4',
    pacienteId: '1',
    data: ontem.toISOString(),
    duracao: 50,
    status: 'realizada',
    anotacoes: 'Paciente relatou melhora dos sintomas de ansiedade após início da medicação.',
    valor: 150,
    statusPagamento: 'pago',
  },
];

// Dados financeiros de exemplo
export const financeiroMock: Financeiro[] = [
  {
    id: '1',
    sessaoId: '4',
    pacienteId: '1',
    valor: 150,
    dataPagamento: ontem.toISOString(),
    status: 'pago',
    metodoPagamento: 'Cartão de Crédito',
  },
  {
    id: '2',
    sessaoId: '1',
    pacienteId: '1',
    valor: 150,
    status: 'pendente',
  },
  {
    id: '3',
    sessaoId: '2',
    pacienteId: '2',
    valor: 150,
    status: 'pendente',
  },
];
