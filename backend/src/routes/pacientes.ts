import { FastifyInstance } from "fastify";
import { z } from "zod";
import { subDays, format } from "date-fns";

const pacienteSchema = z.object({
  nome: z.string(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  dataNascimento: z.string().datetime().optional(),
  genero: z.string().optional(),
  cpf: z.string().optional(),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
  statusRanqueado: z
    .enum(["normal", "faltas_frequentes", "inadimplente", "intensivo"])
    .optional(),
  totalFaltas: z.number().int().optional(),
  fotoPerfil: z.string().optional(),
});

export async function pacientesRoutes(app: FastifyInstance) {
  app.get("/pacientes", async (request, reply) => {
    const querySchema = z.object({
      search: z.string().optional(),
      status: z
        .enum(["normal", "faltas_frequentes", "inadimplente", "intensivo"])
        .optional(),
    });
    const { search, status } = querySchema.parse(request.query);

    const pacientes = await app.prisma.paciente.findMany({
      where: {
        statusRanqueado: status,
        OR: search
          ? [
              { nome: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { telefone: { contains: search, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: { criadoEm: "desc" },
    });

    return reply.send(pacientes);
  });

  app.get("/pacientes/:id", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const paciente = await app.prisma.paciente.findUnique({
      where: { id: params.id },
    });
    if (!paciente) return reply.code(404).send({ error: "Paciente não encontrado" });
    return reply.send(paciente);
  });

  app.get("/pacientes/user/:userId", async (request, reply) => {
    const params = z.object({ userId: z.string().uuid() }).parse(request.params);
    const paciente = await app.prisma.paciente.findFirst({
      where: { userId: params.userId },
    });
    if (!paciente) {
      return reply.code(404).send({ error: "Paciente não encontrado" });
    }
    return reply.send(paciente);
  });

  app.get("/pacientes/:id/indicadores", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);

    const sessoes = await app.prisma.sessao.findMany({
      where: {
        pacienteId: params.id,
        status: "realizada",
        scoreClinico: { not: null },
      },
      select: { id: true, data: true, scoreClinico: true },
      orderBy: { data: "desc" },
      take: 5,
    });

    const seteDiasAtras = subDays(new Date(), 7);
    const diarios = await app.prisma.diarioSentimento.findMany({
      where: {
        pacienteId: params.id,
        dataRegistro: { gte: seteDiasAtras },
      },
      select: {
        id: true,
        texto: true,
        dataRegistro: true,
        sentimento: true,
      },
      orderBy: { dataRegistro: "asc" },
    });

    return reply.send({
      sessoes,
      diarios,
    });
  });

  app.get("/pacientes/:id/resumo", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);

    const [ultimaSessao] = await app.prisma.sessao.findMany({
      where: { pacienteId: params.id },
      orderBy: { data: "desc" },
      take: 1,
    });

    const [ultimoDiario] = await app.prisma.diarioSentimento.findMany({
      where: { pacienteId: params.id },
      orderBy: { dataRegistro: "desc" },
      take: 1,
    });

    const [ultimoAlerta] = await app.prisma.alertaClinico.findMany({
      where: { pacienteId: params.id },
      orderBy: { dataCriacao: "desc" },
      take: 1,
    });

    return reply.send({
      ultimaSessao,
      ultimoDiario,
      ultimoAlerta,
    });
  });

  app.get("/pacientes/:id/comportamento", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);

    const [sessoes, diarios, alertas] = await Promise.all([
      app.prisma.sessao.findMany({
        where: { pacienteId: params.id },
        orderBy: { data: "desc" },
      }),
      app.prisma.diarioSentimento.findMany({
        where: { pacienteId: params.id },
        orderBy: { dataRegistro: "desc" },
        take: 50,
      }),
      app.prisma.alertaClinico.findMany({
        where: { pacienteId: params.id },
        orderBy: { dataCriacao: "desc" },
        take: 20,
      }),
    ]);

    const avaliacoes = sessoes
      .filter((sessao) => sessao.scoreClinico !== null || sessao.anotacoes)
      .slice(0, 20)
      .map((sessao) => ({
        id: `${sessao.id}-avaliacao`,
        sessaoId: sessao.id,
        pacienteId: sessao.pacienteId,
        dataAvaliacao: sessao.data,
        nota: Math.min(
          5,
          Math.max(
            1,
            Math.round(((sessao.scoreClinico ?? 70) as number) / 20)
          )
        ),
        comentario:
          sessao.anotacoes ??
          `Avaliação registrada em ${
            sessao.data ? format(sessao.data, "dd/MM/yyyy") : "data não informada"
          }`,
      }));

    return reply.send({
      sessoes,
      diarios,
      alertas,
      avaliacoes,
    });
  });

  app.get("/pacientes/:id/diarios", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const query = z
      .object({
        limit: z.coerce.number().int().positive().max(200).optional(),
      })
      .parse(request.query);

    const diarios = await app.prisma.diarioSentimento.findMany({
      where: { pacienteId: params.id },
      orderBy: { dataRegistro: "desc" },
      take: query.limit ?? 100,
    });

    return reply.send(diarios);
  });

  app.get("/pacientes/:id/mensagens", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);

    const [proximasSessoes, alertas] = await Promise.all([
      app.prisma.sessao.findMany({
        where: {
          pacienteId: params.id,
          data: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        orderBy: { data: "asc" },
        take: 5,
      }),
      app.prisma.alertaClinico.findMany({
        where: { pacienteId: params.id },
        orderBy: { dataCriacao: "desc" },
        take: 5,
      }),
    ]);

    const mensagens = [
      ...proximasSessoes.map((sessao) => ({
        id: `sessao-${sessao.id}`,
        dataEnvio: new Date().toISOString(),
        tipoMensagem: "confirmacao",
        meio: "whatsapp" as const,
        conteudo: sessao.data
          ? `Lembrete: sessão marcada para ${format(
              sessao.data,
              "dd/MM/yyyy 'às' HH:mm"
            )}.`
          : "Lembrete de sessão agendada.",
        mensagemEntregue: true,
      })),
      ...alertas.map((alerta) => ({
        id: `alerta-${alerta.id}`,
        dataEnvio: alerta.dataCriacao.toISOString(),
        tipoMensagem: "cobranca_falta",
        meio: "email" as const,
        conteudo: alerta.descricao
          ? alerta.descricao
          : `Alerta clínico: ${alerta.tipoAlerta}.`,
        mensagemEntregue: true,
      })),
    ]
      .filter((mensagem) => mensagem.conteudo)
      .slice(0, 8);

    if (mensagens.length === 0) {
      mensagens.push({
        id: `mensagem-${params.id}`,
        dataEnvio: new Date().toISOString(),
        tipoMensagem: "lembrete",
        meio: "whatsapp",
        conteudo:
          "Lembre-se de manter o diário atualizado para obter recomendações personalizadas.",
        mensagemEntregue: true,
      });
    }

    return reply.send(mensagens);
  });

  app.post("/pacientes", async (request, reply) => {
    const body = pacienteSchema.parse(request.body);
    const created = await app.prisma.paciente.create({
      data: {
        ...body,
        dataNascimento: body.dataNascimento
          ? new Date(body.dataNascimento)
          : undefined,
      },
    });
    return reply.code(201).send(created);
  });

  app.put("/pacientes/:id", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const body = pacienteSchema.partial().parse(request.body);
    const updated = await app.prisma.paciente.update({
      where: { id: params.id },
      data: {
        ...body,
        dataNascimento: body.dataNascimento
          ? new Date(body.dataNascimento)
          : undefined,
      },
    });
    return reply.send(updated);
  });

  app.delete("/pacientes/:id", async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    await app.prisma.paciente.delete({ where: { id: params.id } });
    return reply.code(204).send();
  });
}
