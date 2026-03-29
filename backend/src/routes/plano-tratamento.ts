import { FastifyInstance } from "fastify";
import { z } from "zod";

const planoSchema = z.object({
  pacienteId: z.string().uuid(),
  objetivos: z.string().min(1),
  abordagem: z.string().min(1),
  frequencia: z.string().min(1),
  duracaoPrevista: z.string().optional(),
  tecnicas: z.string().optional(),
  indicadores: z.string().optional(),
  observacoes: z.string().optional(),
});

const planoUpdateSchema = planoSchema
  .omit({ pacienteId: true })
  .partial()
  .extend({
    status: z.enum(["ativo", "pausado", "concluido"]).optional(),
  });

export async function planoTratamentoRoutes(app: FastifyInstance) {
  app.get("/plano-tratamento", async (request, reply) => {
    const query = z.object({ pacienteId: z.string().uuid().optional() }).parse(request.query);
    const userId = request.user?.sub;

    if (!userId) {
      return reply.code(401).send({ error: "Nao autenticado" });
    }

    const profissional = await app.prisma.profissional.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!profissional) {
      return reply.code(403).send({ error: "Acesso negado" });
    }

    if (query.pacienteId) {
      const vinculo = await app.prisma.vinculo.findFirst({
        where: {
          profissionalId: profissional.id,
          pacienteId: query.pacienteId,
          status: "ATIVO",
        },
        select: { id: true },
      });

      if (!vinculo) {
        return reply.code(403).send({ error: "Paciente nao vinculado" });
      }
    }

    const plano = await app.prisma.planoTratamento.findFirst({
      where: {
        profissionalId: profissional.id,
        status: "ativo",
        ...(query.pacienteId ? { pacienteId: query.pacienteId } : {}),
      },
      orderBy: { criadoEm: "desc" },
      include: {
        profissional: { select: { id: true, nome: true } },
      },
    });

    return reply.send(plano ?? null);
  });

  app.get("/plano-tratamento/meu", async (request, reply) => {
    const userId = request.user?.sub;

    if (!userId) {
      return reply.code(401).send({ error: "Nao autenticado" });
    }

    const paciente = await app.prisma.paciente.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!paciente) {
      return reply.code(404).send({ error: "Paciente nao encontrado" });
    }

    const plano = await app.prisma.planoTratamento.findFirst({
      where: {
        pacienteId: paciente.id,
        status: "ativo",
      },
      orderBy: { criadoEm: "desc" },
      include: {
        profissional: { select: { id: true, nome: true } },
      },
    });

    return reply.send(plano ?? null);
  });

  app.post("/plano-tratamento", async (request, reply) => {
    const userId = request.user?.sub;

    if (!userId) {
      return reply.code(401).send({ error: "Nao autenticado" });
    }

    const body = planoSchema.parse(request.body);

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
        pacienteId: body.pacienteId,
        status: "ATIVO",
      },
      select: { id: true },
    });

    if (!vinculo) {
      return reply.code(403).send({ error: "Paciente nao vinculado" });
    }

    await app.prisma.planoTratamento.updateMany({
      where: {
        profissionalId: profissional.id,
        pacienteId: body.pacienteId,
        status: "ativo",
      },
      data: { status: "pausado" },
    });

    const plano = await app.prisma.planoTratamento.create({
      data: {
        ...body,
        profissionalId: profissional.id,
      },
      include: {
        profissional: { select: { id: true, nome: true } },
      },
    });

    return reply.code(201).send(plano);
  });

  app.patch("/plano-tratamento/:id", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const userId = request.user?.sub;

    if (!userId) {
      return reply.code(401).send({ error: "Nao autenticado" });
    }

    const body = planoUpdateSchema.parse(request.body);

    const profissional = await app.prisma.profissional.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!profissional) {
      return reply.code(403).send({ error: "Acesso negado" });
    }

    const planoExistente = await app.prisma.planoTratamento.findUnique({
      where: { id: params.id },
      select: { id: true, profissionalId: true },
    });

    if (!planoExistente) {
      return reply.code(404).send({ error: "Plano nao encontrado" });
    }

    if (planoExistente.profissionalId !== profissional.id) {
      return reply.code(403).send({ error: "Acesso negado" });
    }

    const plano = await app.prisma.planoTratamento.update({
      where: { id: params.id },
      data: body,
      include: {
        profissional: { select: { id: true, nome: true } },
      },
    });

    return reply.send(plano);
  });
}
