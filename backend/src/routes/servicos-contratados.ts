import { FastifyInstance } from "fastify";
import { z } from "zod";

const createSchema = z.object({
  pacienteId: z.string().uuid(),
  servicoId: z.string().uuid(),
  dataInicio: z.string().datetime(),
  qtdTotalSessoes: z.number().int().optional(),
});

export async function servicosContratadosRoutes(app: FastifyInstance) {
  app.get("/servicos-contratados", async (request, reply) => {
    const querySchema = z.object({
      pacienteId: z.string().uuid().optional(),
      status: z.enum(["ativo", "encerrado", "suspenso"]).optional(),
    });
    const { pacienteId, status } = querySchema.parse(request.query);

    const result = await app.prisma.servicoContratado.findMany({
      where: {
        pacienteId,
        status,
      },
      include: {
        paciente: { select: { id: true, nome: true } },
        servico: { select: { id: true, nome: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return reply.send(result);
  });

  app.get("/servicos-contratados/alertas", async (_request, reply) => {
    const contratos = await app.prisma.servicoContratado.findMany({
      include: {
        paciente: { select: { id: true, nome: true } },
        servico: { select: { id: true, nome: true } },
      },
    });

    const alertas = contratos.map((contrato) => {
      const total = contrato.qtdTotalSessoes ?? 0;
      const realizadas = contrato.qtdSessoesRealizadas ?? 0;
      const sessoesRestantes = Math.max(total - realizadas, 0);

      return {
        contrato_id: contrato.id,
        paciente_id: contrato.pacienteId,
        servico_id: contrato.servicoId,
        nome_servico: contrato.servico?.nome ?? "Serviço",
        nome_paciente: contrato.paciente?.nome ?? "Paciente",
        qtd_total_sessoes: total,
        qtd_sessoes_realizadas: realizadas,
        sessoes_restantes: sessoesRestantes,
        data_inicio: contrato.dataInicio,
        alerta_fim_sessoes: total > 0 ? sessoesRestantes <= 2 : false,
        alerta_fim_periodo: false,
        alerta_inatividade: false,
      };
    });

    return reply.send(alertas);
  });

  app.post("/servicos-contratados", async (request, reply) => {
    const body = createSchema.parse(request.body);
    const created = await app.prisma.servicoContratado.create({
      data: {
        pacienteId: body.pacienteId,
        servicoId: body.servicoId,
        dataInicio: new Date(body.dataInicio),
        qtdTotalSessoes: body.qtdTotalSessoes,
      },
    });
    return reply.code(201).send(created);
  });

  app.post("/servicos-contratados/:id/incrementar", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const contrato = await app.prisma.servicoContratado.findUnique({
      where: { id: params.id },
      select: { qtdSessoesRealizadas: true, qtdTotalSessoes: true },
    });
    if (!contrato) return reply.code(404).send({ error: "Contrato não encontrado" });

    const novoTotal = (contrato.qtdSessoesRealizadas || 0) + 1;
    const status =
      contrato.qtdTotalSessoes && novoTotal >= contrato.qtdTotalSessoes
        ? "encerrado"
        : "ativo";

    const updated = await app.prisma.servicoContratado.update({
      where: { id: params.id },
      data: { qtdSessoesRealizadas: novoTotal, status },
    });
    return reply.send(updated);
  });

  app.patch("/servicos-contratados/:id/status", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const body = z.object({ status: z.enum(["ativo", "encerrado", "suspenso"]) }).parse(request.body);
    const updated = await app.prisma.servicoContratado.update({
      where: { id: params.id },
      data: { status: body.status },
    });
    return reply.send(updated);
  });
}
