import { FastifyInstance } from "fastify";
import { z } from "zod";

const notificacaoParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function notificacoesRoutes(app: FastifyInstance) {
  app.post("/notificacoes/marcar-lida/:id", async (request, reply) => {
    const { id } = notificacaoParamsSchema.parse(request.params);

    const updated = await app.prisma.notificacao.update({
      where: { id },
      data: { lida: true },
    });

    return reply.send(updated);
  });
}
