import { FastifyInstance } from "fastify";
import { z } from "zod";

const vinculoBodySchema = z.object({
  pacienteId: z.string(),
  profissionalId: z.string(),
});

const vinculoQuerySchema = z.object({
  pacienteId: z.string().optional(),
  profissionalId: z.string().optional(),
});

export async function vinculosRoutes(app: FastifyInstance) {
  app.post("/vinculos", async (request, reply) => {
    const body = vinculoBodySchema.parse(request.body);

    const existing = await app.prisma.vinculo.findFirst({
      where: {
        pacienteId: body.pacienteId,
        profissionalId: body.profissionalId,
        status: "ATIVO",
      },
      orderBy: { criadoEm: "desc" },
    });

    if (existing) {
      return reply.send(existing);
    }

    const vinculo = await app.prisma.vinculo.create({
      data: {
        pacienteId: body.pacienteId,
        profissionalId: body.profissionalId,
        status: "ATIVO",
      },
    });

    return reply.code(201).send(vinculo);
  });

  app.get("/vinculos", async (request, reply) => {
    const { pacienteId, profissionalId } = vinculoQuerySchema.parse(request.query);

    const vinculos = await app.prisma.vinculo.findMany({
      where: {
        ...(pacienteId ? { pacienteId } : {}),
        ...(profissionalId ? { profissionalId } : {}),
      },
      orderBy: { criadoEm: "desc" },
    });

    return reply.send(vinculos);
  });
}
