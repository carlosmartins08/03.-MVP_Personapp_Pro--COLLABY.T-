import argon2 from "argon2";
import {
  PrismaClient,
  StatusPagamento,
  StatusSessao,
  TipoUsuario,
} from "@prisma/client";

const prisma = new PrismaClient();

const PROFESSIONAL_EMAIL = "psicologo@personapp.dev";
const PATIENT_EMAIL = "paciente@personapp.dev";

async function seedCredentials() {
  const [professionalHash, patientHash] = await Promise.all([
    argon2.hash("Senha123!"),
    argon2.hash("Paciente123!"),
  ]);

  const professionalUser = await prisma.usuario.upsert({
    where: { email: PROFESSIONAL_EMAIL },
    update: {
      senhaHash: professionalHash,
      tipo: TipoUsuario.profissional,
      emailVerificado: true,
    },
    create: {
      email: PROFESSIONAL_EMAIL,
      senhaHash: professionalHash,
      tipo: TipoUsuario.profissional,
      emailVerificado: true,
    },
  });

  const profissional = await prisma.profissional.upsert({
    where: { userId: professionalUser.id },
    update: {
      nome: "Dr. Marina Pessoa",
      crp: "06/123456",
      especialidade: "Psicologia Clínica",
    },
    create: {
      userId: professionalUser.id,
      nome: "Dr. Marina Pessoa",
      crp: "06/123456",
      especialidade: "Psicologia Clínica",
    },
  });

  const patientUser = await prisma.usuario.upsert({
    where: { email: PATIENT_EMAIL },
    update: {
      senhaHash: patientHash,
      tipo: TipoUsuario.paciente,
      emailVerificado: true,
      idiomaPreferido: "pt",
    },
    create: {
      email: PATIENT_EMAIL,
      senhaHash: patientHash,
      tipo: TipoUsuario.paciente,
      emailVerificado: true,
      idiomaPreferido: "pt",
    },
  });

  await prisma.paciente.upsert({
    where: { userId: patientUser.id },
    update: {
      nome: "Ana Costa",
      statusRanqueado: "normal",
      totalFaltas: 1,
      telefone: "+5511999999999",
      observacoes: "Paciente engajada com atividades domiciliares.",
    },
    create: {
      userId: patientUser.id,
      nome: "Ana Costa",
      email: "ana.costa@exemplo.com",
      telefone: "+5511999999999",
      statusRanqueado: "normal",
      totalFaltas: 1,
      observacoes: "Paciente engajada com atividades domiciliares.",
    },
  });

  return {
    professionalId: profissional.id,
    patientUserId: patientUser.id,
  };
}

async function seedOperationalData({
  professionalId,
  patientUserId,
}: {
  professionalId: string;
  patientUserId: string;
}) {
  const profissionalId = professionalId;
  const paciente = await prisma.paciente.findFirst({
    where: { userId: patientUserId },
    select: { id: true },
  });
  if (!paciente) {
    throw new Error("Paciente não encontrado.");
  }

  const servico = await prisma.servico.upsert({
    where: { id: "servico-psicoterapia" },
    update: {
      nome: "Psicoterapia Individual",
      valor: 250,
      modalidade: "Online",
      tipoCobranca: "Sessão",
      descricao: "Sessões semanais focadas em regulação emocional.",
    },
    create: {
      id: "servico-psicoterapia",
      nome: "Psicoterapia Individual",
      valor: 250,
      modalidade: "Online",
      tipoCobranca: "Sessão",
      descricao: "Sessões semanais focadas em regulação emocional.",
    },
  });

  await prisma.servicoContratado.upsert({
    where: { id: "contrato-anacosta" },
    update: {
      pacienteId: paciente.id,
      servicoId: servico.id,
      dataInicio: new Date(),
      qtdTotalSessoes: 12,
      status: "ativo",
    },
    create: {
      id: "contrato-anacosta",
      pacienteId: paciente.id,
      servicoId: servico.id,
      dataInicio: new Date(),
      qtdTotalSessoes: 12,
      status: "ativo",
    },
  });

  const [sessaoFutura, sessaoRealizada] = await Promise.all([
    prisma.sessao.upsert({
      where: { id: "sessao-1" },
      update: {
        pacienteId: paciente.id,
        profissionalId,
        data: new Date(Date.now() + 3 * 86400000),
        status: StatusSessao.agendada,
        valor: 250,
        statusPagamento: StatusPagamento.pendente,
        modalidade: "Online",
      },
      create: {
        id: "sessao-1",
        pacienteId: paciente.id,
        profissionalId,
        data: new Date(Date.now() + 3 * 86400000),
        status: StatusSessao.agendada,
        valor: 250,
        statusPagamento: StatusPagamento.pendente,
        modalidade: "Online",
      },
    }),
    prisma.sessao.upsert({
      where: { id: "sessao-2" },
      update: {
        pacienteId: paciente.id,
        profissionalId,
        data: new Date(Date.now() - 7 * 86400000),
        status: StatusSessao.realizada,
        valor: 250,
        statusPagamento: StatusPagamento.pago,
        modalidade: "Presencial",
        anotacoes: "Sessão focada em práticas de respiração e sono.",
      },
      create: {
        id: "sessao-2",
        pacienteId: paciente.id,
        profissionalId,
        data: new Date(Date.now() - 7 * 86400000),
        status: StatusSessao.realizada,
        valor: 250,
        statusPagamento: StatusPagamento.pago,
        modalidade: "Presencial",
        anotacoes: "Sessão focada em práticas de respiração e sono.",
      },
    }),
  ]);

  await prisma.recibo.upsert({
    where: { id: "recibo-sessao-2" },
    update: {
      sessaoId: sessaoRealizada.id,
      pacienteId: paciente.id,
      enviado: true,
      dataSessao: sessaoRealizada.data ?? new Date(),
    },
    create: {
      id: "recibo-sessao-2",
      sessaoId: sessaoRealizada.id,
      pacienteId: paciente.id,
      enviado: true,
      dataSessao: sessaoRealizada.data ?? new Date(),
    },
  });

  await prisma.alertaClinico.upsert({
    where: { id: "alerta-anacosta-1" },
    update: {
      pacienteId: paciente.id,
      tipoAlerta: "Falta frequente",
      descricao: "Paciente anotou duas faltas, reforçar engajamento.",
      nivelUrgencia: "moderado",
      status: "aberto",
    },
    create: {
      id: "alerta-anacosta-1",
      pacienteId: paciente.id,
      tipoAlerta: "Falta frequente",
      descricao: "Paciente anotou duas faltas, reforçar engajamento.",
      nivelUrgencia: "moderado",
      status: "aberto",
    },
  });

  await prisma.diarioSentimento.upsert({
    where: { id: "diario-anacosta-1" },
    update: {
      pacienteId: paciente.id,
      texto: "Hoje me senti mais tranquilo após a sessão presencial.",
      sentimento: "calmo",
    },
    create: {
      id: "diario-anacosta-1",
      pacienteId: paciente.id,
      texto: "Hoje me senti mais tranquilo após a sessão presencial.",
      sentimento: "calmo",
    },
  });

  return { sessaoFutura, sessaoRealizada };
}

async function main() {
  console.log("Seed em andamento...");
  const credentials = await seedCredentials();
  await seedOperationalData(credentials);
  console.log("Seed finalizada com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
