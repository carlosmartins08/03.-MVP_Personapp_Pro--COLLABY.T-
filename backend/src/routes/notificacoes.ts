import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const notificacaoParamsSchema = z.object({
  id: z.string().uuid(),
});

const notFoundResponse = {
  error: "Notificacao nao encontrada",
};

const getAuthenticatedUserId = (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = request.user?.sub;

  if (!userId) {
    reply.code(401).send({ error: "Unauthorized" });
    return null;
  }

  return userId;
};

const mapNotificacao = (notificacao: {
  id: string;
  titulo: string;
  corpo: string;
  tipo: string;
  lida: boolean;
  criadoEm: Date;
}) => ({
  id: notificacao.id,
  titulo: notificacao.titulo,
  mensagem: notificacao.corpo,
  tipo: notificacao.tipo,
  lida: notificacao.lida,
  criadoEm: notificacao.criadoEm,
});

export async function notificacoesRoutes(app: FastifyInstance) {
  app.get("/notificacoes", async (request, reply) => {
    const userId = getAuthenticatedUserId(request, reply);
    if (!userId) return;

    const notificacoes = await app.prisma.notificacao.findMany({
      where: { usuarioId: userId },
      orderBy: { criadoEm: "desc" },
      select: {
        id: true,
        titulo: true,
        corpo: true,
        tipo: true,
        lida: true,
        criadoEm: true,
      },
    });

    return reply.send(notificacoes.map(mapNotificacao));
  });

  app.patch("/notificacoes/:id/lida", async (request, reply) => {
    const userId = getAuthenticatedUserId(request, reply);
    if (!userId) return;

    const { id } = notificacaoParamsSchema.parse(request.params);

    const updatedResult = await app.prisma.notificacao.updateMany({
      where: { id, usuarioId: userId },
      data: { lida: true },
    });

    if (updatedResult.count === 0) {
      return reply.code(404).send(notFoundResponse);
    }

    const notificacao = await app.prisma.notificacao.findFirst({
      where: { id, usuarioId: userId },
      select: {
        id: true,
        titulo: true,
        corpo: true,
        tipo: true,
        lida: true,
        criadoEm: true,
      },
    });

    if (!notificacao) {
      return reply.code(404).send(notFoundResponse);
    }

    return reply.send(mapNotificacao(notificacao));
  });

  app.patch("/notificacoes/lidas-todas", async (request, reply) => {
    const userId = getAuthenticatedUserId(request, reply);
    if (!userId) return;

    const updated = await app.prisma.notificacao.updateMany({
      where: { usuarioId: userId, lida: false },
      data: { lida: true },
    });

    return reply.send({ updatedCount: updated.count });
  });
}
