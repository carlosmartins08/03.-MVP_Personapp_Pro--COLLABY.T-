import { FastifyInstance } from "fastify";
import { z } from "zod";

const createSchema = z.object({
  pacienteId: z.string().uuid(),
  tipoAlerta: z.string(),
  descricao: z.string().optional(),
  nivelUrgencia: z.string().optional(),
  status: z.string().optional(),
  termosRelacionados: z.array(z.string()).optional(),
});

export async function alertasRoutes(app: FastifyInstance) {
  app.get("/alertas", async (request, reply) => {
    const querySchema = z.object({
      pacienteId: z.string().uuid().optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    });
    const { pacienteId, from, to } = querySchema.parse(request.query);
    const alertas = await app.prisma.alertaClinico.findMany({
      where: {
        pacienteId,
        dataCriacao: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
      orderBy: { dataCriacao: "desc" },
    });
    return reply.send(alertas);
  });

  app.post("/alertas", async (request, reply) => {
    const body = createSchema.parse(request.body);
    const created = await app.prisma.alertaClinico.create({
      data: {
        pacienteId: body.pacienteId,
        tipoAlerta: body.tipoAlerta,
        descricao: body.descricao,
        nivelUrgencia: body.nivelUrgencia,
        status: body.status,
        termosRelacionados: body.termosRelacionados,
      },
    });
    return reply.code(201).send(created);
  });

  app.patch("/alertas/:id", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const body = createSchema.partial().parse(request.body);
    const updated = await app.prisma.alertaClinico.update({
      where: { id: params.id },
      data: {
        pacienteId: body.pacienteId,
        tipoAlerta: body.tipoAlerta,
        descricao: body.descricao,
        nivelUrgencia: body.nivelUrgencia,
        status: body.status,
        termosRelacionados: body.termosRelacionados,
      },
    });
    return reply.send(updated);
  });
}
