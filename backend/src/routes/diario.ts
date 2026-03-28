import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function diarioRoutes(app: FastifyInstance) {
  // Humor registrado hoje
  app.get("/diario/humor-hoje", async (request, reply) => {
    const { pacienteId } = z.object({ pacienteId: z.string().uuid() }).parse(request.query);

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const entry = await app.prisma.diarioSentimento.findFirst({
      where: { pacienteId, dataRegistro: { gte: start, lte: end } },
      orderBy: { dataRegistro: "desc" },
    });

    return reply.send(entry ?? null);
  });

  // Lista de registros do diário
  app.get("/diario/registros", async (request, reply) => {
    const { pacienteId, limit, offset } = z.object({
      pacienteId: z.string().uuid(),
      limit: z.coerce.number().int().min(1).max(100).default(20),
      offset: z.coerce.number().int().min(0).default(0),
    }).parse(request.query);

    const registros = await app.prisma.diarioSentimento.findMany({
      where: { pacienteId },
      orderBy: { dataRegistro: "desc" },
      take: limit,
      skip: offset,
    });

    return reply.send(registros);
  });

  // Criar registro no diário
  app.post("/diario/registros", async (request, reply) => {
    const body = z.object({
      pacienteId: z.string().uuid(),
      texto: z.string().min(1),
      humor: z.number().int().min(1).max(5).optional(),
      sentimento: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }).parse(request.body);

    const criado = await app.prisma.diarioSentimento.create({
      data: {
        pacienteId: body.pacienteId,
        texto: body.texto,
        humor: body.humor,
        sentimento: body.sentimento,
        tags: body.tags ?? [],
      },
    });

    return reply.code(201).send(criado);
  });
}
