import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const abordagemSchema = z.enum([
  "psicanalise",
  "behaviorismo",
  "humanismo",
  "cognitivismo",
  "psicPositiva",
  "neuropsicologia",
  "sistemica",
  "transpessoal",
]);

const statusSchema = z.enum(["pendente", "parte1", "triagem", "parte2", "concluida"]);

const jsonRespostaSchema = z.record(z.string(), z.string());

const anamneseBodySchema = z.object({
  motivoConsulta: z.string().optional(),
  expectativas: z.string().optional(),
  historicoSaudeMental: z.string().optional(),
  experienciasTraumaticas: z.string().optional(),
  sintomasAtuais: z.string().optional(),
  rotinaDiaria: z.string().optional(),
  habitosSono: z.string().optional(),
  dietaExercicio: z.string().optional(),
  usoSubstancias: z.string().optional(),
  dinamicaFamiliar: z.string().optional(),
  apoioSocial: z.string().optional(),
  indicadoresRisco: z.string().optional(),
  consentimento: z.boolean().optional(),
  abordagensRecomendadas: z.array(abordagemSchema).max(2).optional(),
  respostasPsicanalise: jsonRespostaSchema.optional(),
  respostasBehaviorismo: jsonRespostaSchema.optional(),
  respostasHumanismo: jsonRespostaSchema.optional(),
  respostasCognitivismo: jsonRespostaSchema.optional(),
  respostasPsicPositiva: jsonRespostaSchema.optional(),
  respostasNeuropsicologia: jsonRespostaSchema.optional(),
  respostasSistemica: jsonRespostaSchema.optional(),
  respostasTranspessoal: jsonRespostaSchema.optional(),
  status: statusSchema.optional(),
});

const triagemBodySchema = z.object({
  abordagensRecomendadas: z.array(abordagemSchema).min(1).max(2),
});

const anamneseQuerySchema = z.object({
  pacienteId: z.string().uuid().optional(),
});

const getPacienteByAuthUser = async (
  app: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = request.user?.sub;
  if (!userId) {
    reply.code(401).send({ error: "Unauthorized" });
    return null;
  }

  const paciente = await app.prisma.paciente.findUnique({
    where: { userId },
  });

  if (!paciente) {
    reply.code(404).send({ error: "Paciente nao encontrado" });
    return null;
  }

  return paciente;
};

export async function anamneseRoutes(app: FastifyInstance) {
  app.get("/anamnese", async (request, reply) => {
    const { pacienteId } = anamneseQuerySchema.parse(request.query);
    const userId = request.user?.sub;

    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    if (pacienteId) {
      const profissional = await app.prisma.profissional.findFirst({
        where: { userId },
        select: { id: true },
      });

      if (!profissional) {
        return reply.code(403).send({ error: "Acesso negado" });
      }

      const vinculo = await app.prisma.vinculo.findFirst({
        where: {
          profissionalId: profissional.id,
          pacienteId,
          status: "ATIVO",
        },
        select: { id: true },
      });

      if (!vinculo) {
        return reply.code(403).send({ error: "Paciente nao vinculado" });
      }

      const anamneseProfissional = await app.prisma.anamnese.findUnique({
        where: { pacienteId },
      });

      return reply.send(anamneseProfissional ?? null);
    }

    const paciente = await getPacienteByAuthUser(app, request, reply);
    if (!paciente) return;

    const anamnesePaciente = await app.prisma.anamnese.findUnique({
      where: { pacienteId: paciente.id },
    });

    return reply.send(anamnesePaciente ?? null);
  });

  app.post("/anamnese", async (request, reply) => {
    const paciente = await getPacienteByAuthUser(app, request, reply);
    if (!paciente) return;

    const body = anamneseBodySchema.parse(request.body);

    const anamnese = await app.prisma.anamnese.upsert({
      where: { pacienteId: paciente.id },
      update: {
        ...body,
        atualizadoEm: new Date(),
      },
      create: {
        pacienteId: paciente.id,
        ...body,
      },
    });

    return reply.send(anamnese);
  });

  app.patch("/anamnese/triagem", async (request, reply) => {
    const paciente = await getPacienteByAuthUser(app, request, reply);
    if (!paciente) return;

    const { abordagensRecomendadas } = triagemBodySchema.parse(request.body);

    const anamnese = await app.prisma.anamnese.upsert({
      where: { pacienteId: paciente.id },
      update: {
        abordagensRecomendadas,
        status: "triagem",
        atualizadoEm: new Date(),
      },
      create: {
        pacienteId: paciente.id,
        abordagensRecomendadas,
        status: "triagem",
      },
    });

    return reply.send(anamnese);
  });
}
