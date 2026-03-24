import { FastifyInstance } from "fastify";
import { z } from "zod";

const sessaoBaseSchema = z.object({
  pacienteId: z.string().uuid().optional(),
  profissionalId: z.string().uuid().optional(),
  data: z.string().datetime().optional(),
  duracao: z.number().int().optional(),
  status: z
    .enum(["agendada", "confirmada", "realizada", "cancelada", "faltou"])
    .optional(),
  anotacoes: z.string().optional(),
  valor: z.number().optional(),
  statusPagamento: z.enum(["pendente", "pago", "cancelado"]).optional(),
  modalidade: z.string().optional(),
  pacote: z.string().optional(),
  scoreClinico: z.number().int().optional(),
  reagendadaEm: z.string().datetime().optional(),
});

export async function sessoesRoutes(app: FastifyInstance) {
  app.get("/sessoes", async (request, reply) => {
    const querySchema = z.object({
      pacienteId: z.string().uuid().optional(),
      profissionalId: z.string().uuid().optional(),
      status: z
        .enum(["agendada", "confirmada", "realizada", "cancelada", "faltou"])
        .optional(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    });
    const { pacienteId, profissionalId, status, from, to, order } =
      querySchema.parse(request.query);

    const sessoes = await app.prisma.sessao.findMany({
      where: {
        pacienteId,
        profissionalId,
        status,
        data: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
      orderBy: { data: order ?? "desc" },
    });
    return reply.send(sessoes);
  });

  app.post("/sessoes", async (request, reply) => {
    const body = sessaoBaseSchema.parse(request.body);
    const created = await app.prisma.sessao.create({
      data: {
        ...body,
        data: body.data ? new Date(body.data) : undefined,
        reagendadaEm: body.reagendadaEm ? new Date(body.reagendadaEm) : undefined,
      },
    });
    return reply.code(201).send(created);
  });

  app.patch("/sessoes/:id", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const body = sessaoBaseSchema.partial().parse(request.body);
    const updated = await app.prisma.sessao.update({
      where: { id: params.id },
      data: {
        ...body,
        data: body.data ? new Date(body.data) : undefined,
        reagendadaEm: body.reagendadaEm ? new Date(body.reagendadaEm) : undefined,
      },
    });
    return reply.send(updated);
  });

  app.post("/sessoes/:id/pagar", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const updated = await app.prisma.sessao.update({
      where: { id: params.id },
      data: { statusPagamento: "pago" },
    });
    return reply.send(updated);
  });
}
