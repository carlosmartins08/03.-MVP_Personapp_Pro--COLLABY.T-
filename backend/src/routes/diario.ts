import { FastifyInstance } from "fastify";
import { z } from "zod";

const humorQuerySchema = z.object({
  pacienteId: z.string().uuid(),
});

export async function diarioRoutes(app: FastifyInstance) {
  app.get("/diario/humor-hoje", async (request, reply) => {
    const { pacienteId } = humorQuerySchema.parse(request.query);

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const entry = await app.prisma.diarioSentimento.findFirst({
      where: {
        pacienteId,
        dataRegistro: { gte: start, lte: end },
      },
      orderBy: { dataRegistro: "desc" },
    });

    return reply.send(entry ?? null);
  });
}
