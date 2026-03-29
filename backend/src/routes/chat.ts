import { FastifyInstance } from "fastify";
import { z } from "zod";

const paramsSchema = z.object({
  vinculoId: z.string().uuid(),
});

const enviarMensagemSchema = z.object({
  texto: z.string().trim().min(1).max(2000),
});

type ResultadoAcesso =
  | { ok: true }
  | { ok: false; status: 403 | 404; payload: { error: string } };

const obterVinculoDoUsuario = async (
  app: FastifyInstance,
  vinculoId: string,
  userId: string
): Promise<ResultadoAcesso> => {
  const vinculo = await app.prisma.vinculo.findUnique({
    where: { id: vinculoId },
    include: {
      paciente: { select: { userId: true } },
      profissional: { select: { userId: true } },
    },
  });

  if (!vinculo) {
    return { ok: false, status: 404, payload: { error: "Vinculo nao encontrado" } };
  }

  const pertence =
    vinculo.paciente.userId === userId
    || vinculo.profissional.userId === userId;

  if (!pertence) {
    return { ok: false, status: 403, payload: { error: "Acesso negado" } };
  }

  return { ok: true };
};

export async function chatRoutes(app: FastifyInstance) {
  app.get("/chat/:vinculoId", async (request, reply) => {
    const { vinculoId } = paramsSchema.parse(request.params);
    const userId = request.user?.sub;

    if (!userId) {
      return reply.code(401).send({ error: "Nao autenticado" });
    }

    const acesso = await obterVinculoDoUsuario(app, vinculoId, userId);
    if (!acesso.ok) {
      return reply.code(acesso.status).send(acesso.payload);
    }

    const mensagens = await app.prisma.mensagem.findMany({
      where: { vinculoId },
      include: {
        autor: { select: { id: true, email: true, tipo: true } },
      },
      orderBy: { criadoEm: "asc" },
      take: 100,
    });

    return reply.send(mensagens);
  });

  app.post("/chat/:vinculoId", async (request, reply) => {
    const { vinculoId } = paramsSchema.parse(request.params);
    const userId = request.user?.sub;

    if (!userId) {
      return reply.code(401).send({ error: "Nao autenticado" });
    }

    const { texto } = enviarMensagemSchema.parse(request.body);

    const acesso = await obterVinculoDoUsuario(app, vinculoId, userId);
    if (!acesso.ok) {
      return reply.code(acesso.status).send(acesso.payload);
    }

    const mensagem = await app.prisma.mensagem.create({
      data: { vinculoId, autorId: userId, texto },
      include: {
        autor: { select: { id: true, email: true, tipo: true } },
      },
    });

    return reply.code(201).send(mensagem);
  });

  app.patch("/chat/:vinculoId/lidas", async (request, reply) => {
    const { vinculoId } = paramsSchema.parse(request.params);
    const userId = request.user?.sub;

    if (!userId) {
      return reply.code(401).send({ error: "Nao autenticado" });
    }

    const acesso = await obterVinculoDoUsuario(app, vinculoId, userId);
    if (!acesso.ok) {
      return reply.code(acesso.status).send(acesso.payload);
    }

    await app.prisma.mensagem.updateMany({
      where: {
        vinculoId,
        lida: false,
        autorId: { not: userId },
      },
      data: { lida: true },
    });

    return reply.send({ ok: true });
  });
}
