import { FastifyInstance } from "fastify";
import { z } from "zod";

import { pagamentoService } from "../services/pagamento.service";

const criarPagamentoSchema = z.object({
  sessaoId: z.string().uuid(),
  valor: z.number().positive(),
});

const pagamentoParamsSchema = z.object({
  id: z.string().uuid(),
});

type PagamentoComSessao = {
  id: string;
  sessaoId: string;
  pacienteId: string;
  valor: number;
  status: string;
  metodo: string;
  transactionId: string | null;
  boletoUrl: string | null;
  boletoVencimento: Date | null;
  provider: string;
  criadoEm: Date;
  atualizadoEm: Date;
  sessao: {
    data: Date | null;
    profissional: {
      nome: string;
    } | null;
  };
};

const mapPagamentoResponse = (pagamento: PagamentoComSessao) => ({
  id: pagamento.id,
  sessaoId: pagamento.sessaoId,
  pacienteId: pagamento.pacienteId,
  valor: pagamento.valor,
  status: pagamento.status,
  metodo: pagamento.metodo,
  transactionId: pagamento.transactionId,
  boletoUrl: pagamento.boletoUrl,
  boletoVencimento: pagamento.boletoVencimento,
  provider: pagamento.provider,
  criadoEm: pagamento.criadoEm,
  atualizadoEm: pagamento.atualizadoEm,
  sessao: {
    dataHora: pagamento.sessao?.data ?? null,
    profissional: pagamento.sessao?.profissional
      ? {
          usuario: {
            nome: pagamento.sessao.profissional.nome,
          },
        }
      : undefined,
  },
});

export async function pagamentosRoutes(app: FastifyInstance) {
  app.get("/pagamentos", async (request, reply) => {
    const userId = request.user?.sub;
    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const paciente = await app.prisma.paciente.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!paciente) {
      return reply.code(404).send({ error: "Paciente nao encontrado" });
    }

    const pagamentos = await app.prisma.pagamento.findMany({
      where: { pacienteId: paciente.id },
      include: {
        sessao: {
          select: {
            data: true,
            profissional: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: { criadoEm: "desc" },
    });

    return reply.send(pagamentos.map((pagamento) => mapPagamentoResponse(pagamento as PagamentoComSessao)));
  });

  app.post("/pagamentos", async (request, reply) => {
    const userId = request.user?.sub;
    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const { sessaoId, valor } = criarPagamentoSchema.parse(request.body);

    const paciente = await app.prisma.paciente.findFirst({
      where: { userId },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        telefone: true,
      },
    });

    if (!paciente) {
      return reply.code(404).send({ error: "Paciente nao encontrado" });
    }

    const sessao = await app.prisma.sessao.findUnique({
      where: { id: sessaoId },
      select: {
        id: true,
        pacienteId: true,
      },
    });

    if (!sessao) {
      return reply.code(404).send({ error: "Sessao nao encontrada" });
    }

    if (sessao.pacienteId !== paciente.id) {
      return reply.code(403).send({ error: "Sessao nao pertence ao paciente" });
    }

    const pagamentoExistente = await app.prisma.pagamento.findFirst({
      where: {
        sessaoId,
        pacienteId: paciente.id,
        status: { in: ["pendente", "pago"] },
      },
      include: {
        sessao: {
          select: {
            data: true,
            profissional: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    if (pagamentoExistente) {
      return reply.send(mapPagamentoResponse(pagamentoExistente as PagamentoComSessao));
    }

    let resultado: {
      provider: "pagarme" | "fallback";
      status: "pago" | "pendente";
      transactionId?: string | null;
      boletoUrl?: string | null;
      boletoVencimento?: Date | null;
    };

    try {
      resultado = await pagamentoService.processPagarmePayment({
        sessaoId,
        amount: valor,
        customer: {
          name: paciente.nome,
          email: paciente.email ?? null,
          cpf: paciente.cpf ?? null,
          phone: paciente.telefone ?? null,
        },
        splitPercent: 80,
      });
    } catch {
      resultado = {
        provider: "fallback",
        status: "pendente",
      };
    }

    const pagamento = await app.prisma.pagamento.create({
      data: {
        sessaoId,
        pacienteId: paciente.id,
        valor,
        status: resultado.status,
        metodo: "boleto",
        transactionId: resultado.transactionId ?? null,
        boletoUrl: resultado.boletoUrl ?? null,
        boletoVencimento: resultado.boletoVencimento ?? null,
        provider: resultado.provider,
      },
      include: {
        sessao: {
          select: {
            data: true,
            profissional: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    await app.prisma.sessao.update({
      where: { id: sessaoId },
      data: {
        statusPagamento: resultado.status === "pago" ? "pago" : "pendente",
      },
    });

    return reply.code(201).send(mapPagamentoResponse(pagamento as PagamentoComSessao));
  });

  app.get("/pagamentos/:id", async (request, reply) => {
    const userId = request.user?.sub;
    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const { id } = pagamentoParamsSchema.parse(request.params);

    const paciente = await app.prisma.paciente.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!paciente) {
      return reply.code(404).send({ error: "Paciente nao encontrado" });
    }

    const pagamento = await app.prisma.pagamento.findFirst({
      where: {
        id,
        pacienteId: paciente.id,
      },
      include: {
        sessao: {
          select: {
            data: true,
            profissional: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    if (!pagamento) {
      return reply.code(404).send({ error: "Pagamento nao encontrado" });
    }

    return reply.send(mapPagamentoResponse(pagamento as PagamentoComSessao));
  });
}
