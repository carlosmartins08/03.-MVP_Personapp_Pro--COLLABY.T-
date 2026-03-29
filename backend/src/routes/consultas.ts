import { FastifyInstance } from "fastify";
import { z } from "zod";

import { dailyService } from "../services/daily.service";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function consultasRoutes(app: FastifyInstance) {
  app.post("/consultas/:id/create-room", async (request, reply) => {
    const { id } = paramsSchema.parse(request.params);
    const userId = request.user?.sub;

    if (!userId) {
      return reply.code(401).send({ error: "Nao autenticado" });
    }

    const sessao = await app.prisma.sessao.findUnique({
      where: { id },
      include: {
        paciente: { select: { userId: true } },
        profissional: { select: { userId: true } },
      },
    });

    if (!sessao) {
      return reply.code(404).send({ error: "Sessao nao encontrada" });
    }

    const pertenceAoPaciente = sessao.paciente?.userId === userId;
    const pertenceAoProfissional = sessao.profissional?.userId === userId;

    if (!pertenceAoPaciente && !pertenceAoProfissional) {
      return reply.code(403).send({ error: "Acesso negado para esta sessao" });
    }

    if (sessao.dailyRoomUrl) {
      return reply.send({ roomUrl: sessao.dailyRoomUrl });
    }

    try {
      const roomUrl = await dailyService.criarSala(id);
      const updated = await app.prisma.sessao.update({
        where: { id },
        data: { dailyRoomUrl: roomUrl },
      });

      return reply.send({ roomUrl: updated.dailyRoomUrl });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Falha ao criar sala" });
    }
  });

  app.post("/consultas/:id/token", async (request, reply) => {
    const { id } = paramsSchema.parse(request.params);
    const userId = request.user?.sub;

    if (!userId) {
      return reply.code(401).send({ error: "Nao autenticado" });
    }

    const sessao = await app.prisma.sessao.findUnique({
      where: { id },
      include: {
        paciente: { select: { userId: true } },
        profissional: { select: { userId: true } },
      },
    });

    if (!sessao) {
      return reply.code(404).send({ error: "Sessao nao encontrada" });
    }

    const pertenceAoPaciente = sessao.paciente?.userId === userId;
    const pertenceAoProfissional = sessao.profissional?.userId === userId;

    if (!pertenceAoPaciente && !pertenceAoProfissional) {
      return reply.code(403).send({ error: "Acesso negado para esta sessao" });
    }

    if (!sessao.dailyRoomUrl) {
      return reply.code(400).send({ error: "Sala ainda nao criada" });
    }

    try {
      const token = await dailyService.gerarToken(
        sessao.dailyRoomUrl,
        userId,
        pertenceAoProfissional
      );
      return reply.send({ token });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Falha ao gerar token" });
    }
  });
}
