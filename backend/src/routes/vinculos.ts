import { FastifyInstance } from "fastify";
import { z } from "zod";

const vinculoBodySchema = z.object({
  pacienteId: z.string().uuid(),
  profissionalId: z.string().uuid(),
});

const vinculoQuerySchema = z.object({
  pacienteId: z.string().uuid().optional(),
  profissionalId: z.string().uuid().optional(),
});

export async function vinculosRoutes(app: FastifyInstance) {
  app.post("/vinculos", async (request, reply) => {
    const body = vinculoBodySchema.parse(request.body);

    const vinculo = await app.prisma.vinculo.create({
      data: body,
    });

    return reply.code(201).send(vinculo);
  });

  app.get("/vinculos", async (request, reply) => {
    const { pacienteId, profissionalId } = vinculoQuerySchema.parse(request.query);

    const vinculos = await app.prisma.vinculo.findMany({
      where: {
        pacienteId,
        profissionalId,
      },
      orderBy: { criadoEm: "desc" },
    });

    return reply.send(vinculos);
  });
}
