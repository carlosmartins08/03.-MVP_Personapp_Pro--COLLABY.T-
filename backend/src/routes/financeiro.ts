import { FastifyInstance } from "fastify";
import { z } from "zod";
import { startOfMonth, subDays } from "date-fns";

import { pagamentoService } from "../services/pagamento.service";
import { env } from "../env";

export async function financeiroRoutes(app: FastifyInstance) {
  app.get("/financeiro/resumo", async (request, reply) => {
    const query = z
      .object({
        period: z.string().optional(), // texto livre, ex: "Este mÃªs" ou "30"
      })
      .parse(request.query);

    // InterpretaÃ§Ã£o simples do perÃ­odo: se for nÃºmero, dias; senÃ£o, mÃªs atual.
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

  app.post("/financeiro/charges/:id/pay", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);

    const sessao = await app.prisma.sessao.findUnique({
      where: { id: params.id },
      include: { paciente: true },
    });

    if (!sessao) {
      return reply.code(404).send({ error: "Sessao nao encontrada" });
    }

    const valor = Number(sessao.valor ?? 0);
    if (!valor) {
      return reply.code(400).send({ error: "Sessao sem valor definido" });
    }

    if (!env.pagarMeApiKey) {
      const updated = await app.prisma.sessao.update({
        where: { id: sessao.id },
        data: { statusPagamento: "pago" },
      });
      return reply.send({
        status: updated.statusPagamento ?? "pago",
        provider: "fallback",
      });
    }

    try {
      const splitPercent = sessao.pacote ? 0 : 8;
      const result = await pagamentoService.processPagarmePayment({
        sessaoId: sessao.id,
        amount: valor,
        splitPercent,
        customer: {
          name: sessao.paciente?.nome ?? "Paciente",
          email: sessao.paciente?.email ?? undefined,
          cpf: sessao.paciente?.cpf ?? undefined,
          phone: sessao.paciente?.telefone ?? undefined,
        },
      });

      const nextStatus = result.status === "pago" ? "pago" : "pendente";
      await app.prisma.sessao.update({
        where: { id: sessao.id },
        data: { statusPagamento: nextStatus },
      });

      return reply.send({
        status: nextStatus,
        provider: result.provider,
        transactionId: result.transactionId ?? null,
      });
    } catch (error) {
      request.log.error(error);
      return reply
        .code(502)
        .send({ error: "Nao foi possivel processar o pagamento no momento" });
    }
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
