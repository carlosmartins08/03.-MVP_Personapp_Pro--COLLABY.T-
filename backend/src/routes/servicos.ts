import { FastifyInstance } from "fastify";
import { z } from "zod";

const servicoSchema = z.object({
  nome: z.string(),
  descricao: z.string().optional(),
  modalidade: z.string().optional(),
  tipoCobranca: z.string().optional(),
  valor: z.number().optional(),
});

export async function servicosRoutes(app: FastifyInstance) {
  app.get("/servicos", async (request, reply) => {
    const querySchema = z.object({
      search: z.string().optional(),
      modalidade: z.string().optional(),
      tipoCobranca: z.string().optional(),
    });
    const { search, modalidade, tipoCobranca } = querySchema.parse(request.query);

    const servicos = await app.prisma.servico.findMany({
      where: {
        nome: search ? { contains: search, mode: "insensitive" } : undefined,
        modalidade: modalidade || undefined,
        tipoCobranca: tipoCobranca || undefined,
      },
      orderBy: { nome: "asc" },
    });
    return reply.send(servicos);
  });

  app.post("/servicos", async (request, reply) => {
    const body = servicoSchema.parse(request.body);
    const created = await app.prisma.servico.create({ data: body });
    return reply.code(201).send(created);
  });

  app.patch("/servicos/:id", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const body = servicoSchema.partial().parse(request.body);
    const updated = await app.prisma.servico.update({
      where: { id: params.id },
      data: body,
    });
    return reply.send(updated);
  });

  app.delete("/servicos/:id", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    await app.prisma.servico.delete({ where: { id: params.id } });
    return reply.code(204).send();
  });
}
