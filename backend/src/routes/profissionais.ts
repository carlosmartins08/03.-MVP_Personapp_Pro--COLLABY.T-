import { FastifyInstance } from "fastify";
import { z } from "zod";

const profissionaisQuerySchema = z.object({
  abordagem: z.string().optional(),
  busca: z.string().optional(),
});

const profissionalParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function profissionaisRoutes(app: FastifyInstance) {
  app.get("/profissionais", async (request, reply) => {
    const { abordagem, busca } = profissionaisQuerySchema.parse(request.query);

    const profissionais = await app.prisma.profissional.findMany({
      where: {
        especialidade: abordagem
          ? { contains: abordagem, mode: "insensitive" }
          : undefined,
        OR: busca
          ? [
              { nome: { contains: busca, mode: "insensitive" } },
              { crp: { contains: busca, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: { nome: "asc" },
      select: {
        id: true,
        nome: true,
        crp: true,
        especialidade: true,
      },
    });
    return reply.send(profissionais);
  });

  app.get("/profissionais/:id/perfil", async (request, reply) => {
    const { id } = profissionalParamsSchema.parse(request.params);
    const profissional = await app.prisma.profissional.findUnique({
      where: { id },
    });

    if (!profissional) {
      return reply.code(404).send({ error: "Profissional nao encontrado" });
    }

    return reply.send({
      id: profissional.id,
      nome: profissional.nome,
      crp: profissional.crp ?? null,
      especialidade: profissional.especialidade ?? null,
      foto: null,
      modalidade: null,
      valor: null,
      criadoEm: profissional.criadoEm,
    });
  });

  app.get("/profissionais/:id", async (request, reply) => {
    const { id } = profissionalParamsSchema.parse(request.params);
    const profissional = await app.prisma.profissional.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        crp: true,
        especialidade: true,
      },
    });

    if (!profissional) {
      return reply.code(404).send({ error: "Profissional não encontrado" });
    }

    return reply.send(profissional);
  });
}
