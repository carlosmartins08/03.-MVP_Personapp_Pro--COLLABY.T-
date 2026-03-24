import { FastifyInstance } from "fastify";

export async function traducoesRoutes(app: FastifyInstance) {
  app.get("/traducoes", { config: { auth: false } }, async (_request, reply) => {
    const items = await app.prisma.traducao.findMany({
      orderBy: { chave: "asc" },
    });
    return reply.send(items);
  });
}
