import { FastifyInstance } from "fastify";
import { z } from "zod";
import { startOfMonth, subDays } from "date-fns";

export async function financeiroRoutes(app: FastifyInstance) {
  app.get("/financeiro/resumo", async (request, reply) => {
    const query = z
      .object({
        period: z.string().optional(), // texto livre, ex: "Este mês" ou "30"
      })
      .parse(request.query);

    // Interpretação simples do período: se for número, dias; senão, mês atual.
    const dias = Number(query.period);
    const from =
      Number.isFinite(dias) && dias > 0 ? subDays(new Date(), dias) : startOfMonth(new Date());

    const [data, transactionsSource] = await Promise.all([
      app.prisma.sessao.groupBy({
        by: ["statusPagamento"],
        _sum: { valor: true },
        where: {
          data: { gte: from },
        },
      }),
      app.prisma.sessao.findMany({
        where: {
          data: { gte: from },
        },
        select: {
          id: true,
          pacienteId: true,
          data: true,
          valor: true,
          statusPagamento: true,
          modalidade: true,
          paciente: {
            select: { id: true, nome: true },
          },
        },
        orderBy: { data: "desc" },
      }),
    ]);

    const total_received = data.find((d) => d.statusPagamento === "pago")?._sum.valor ?? 0;
    const total_pending = data.find((d) => d.statusPagamento === "pendente")?._sum.valor ?? 0;

    const transactions = transactionsSource.map((sessao) => ({
      id: sessao.id,
      sessaoId: sessao.id,
      pacienteId: sessao.pacienteId,
      pacienteNome: sessao.paciente?.nome,
      valor: Number(sessao.valor ?? 0),
      status: sessao.statusPagamento ?? "pendente",
      dataSessao: sessao.data,
      dataPagamento: sessao.statusPagamento === "pago" ? sessao.data : undefined,
      metodoPagamento: sessao.modalidade ?? undefined,
    }));

    return reply.send({
      total_received: Number(total_received),
      total_pending: Number(total_pending),
      period: query.period ?? "mes_atual",
      from,
      to: new Date(),
      transactions,
    });
  });

  app.post("/financeiro/charges/:id/send", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    // In a future iteration this could trigger an integration (e.g., WhatsApp).
    return reply.send({
      ok: true,
      chargeId: params.id,
      sentAt: new Date().toISOString(),
    });
  });
}
