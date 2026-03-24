import { FastifyInstance } from "fastify";
import { z } from "zod";

const createSchema = z.object({
  sessaoId: z.string().uuid(),
  pacienteId: z.string().uuid(),
  dataSessao: z.string().datetime().optional(),
});

export async function recibosRoutes(app: FastifyInstance) {
  app.get("/recibos", async (request, reply) => {
    const querySchema = z.object({
      paciente: z.string().uuid().optional(),
    });
    const { paciente } = querySchema.parse(request.query);
    const recibos = await app.prisma.recibo.findMany({
      where: {
        pacienteId: paciente,
      },
      include: {
        paciente: { select: { id: true, nome: true } },
        sessao: { select: { id: true, data: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return reply.send(recibos);
  });

  app.post("/recibos", async (request, reply) => {
    const body = createSchema.parse(request.body);
    const created = await app.prisma.recibo.create({
      data: {
        sessaoId: body.sessaoId,
        pacienteId: body.pacienteId,
        dataSessao: body.dataSessao ? new Date(body.dataSessao) : undefined,
      },
    });
    return reply.code(201).send(created);
  });

  app.post("/recibos/:id/send", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const updated = await app.prisma.recibo.update({
      where: { id: params.id },
      data: { enviado: true },
    });
    return reply.send(updated);
  });

  app.delete("/recibos/:id", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    await app.prisma.recibo.delete({ where: { id: params.id } });
    return reply.code(204).send();
  });
}

