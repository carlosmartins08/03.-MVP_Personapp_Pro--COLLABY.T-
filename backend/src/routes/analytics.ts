import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  subDays,
  startOfMonth,
  startOfWeek,
  subWeeks,
  addDays,
  format,
} from "date-fns";

export async function analyticsRoutes(app: FastifyInstance) {
  app.get("/analytics/dashboard", async (_request, reply) => {
    const now = new Date();
    const weekConfig = { weekStartsOn: 1 as const };
    const firstWeekToConsider = startOfWeek(subWeeks(now, 3), weekConfig);

    const [totalSessions, totalAbsences, todaySessions, financial, patients, recentSessions] =
      await Promise.all([
        app.prisma.sessao.count(),
        app.prisma.sessao.count({ where: { status: "faltou" } }),
        app.prisma.sessao.count({
          where: {
            data: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        }),
        app.prisma.sessao.groupBy({
          by: ["statusPagamento"],
          _sum: { valor: true },
        }),
        app.prisma.paciente.findMany({
          select: { id: true, criadoEm: true, statusRanqueado: true },
        }),
        app.prisma.sessao.findMany({
          select: { data: true },
          where: {
            data: {
              gte: firstWeekToConsider,
            },
          },
        }),
      ]);

    const totalReceived =
      financial.find((f) => f.statusPagamento === "pago")?._sum.valor ?? 0;
    const totalPending =
      financial.find((f) => f.statusPagamento === "pendente")?._sum.valor ?? 0;
    const averageSessionValue = totalSessions > 0 ? Number(totalReceived) / totalSessions : 0;

    const patientsWithFrequentAbsences = patients.filter(
      (p) => p.statusRanqueado === "faltas_frequentes"
    ).length;

    const monthStart = startOfMonth(new Date());
    const newPatientsThisMonth = patients.filter(
      (p) => p.criadoEm >= monthStart
    ).length;

    const thirtyDaysAgo = subDays(new Date(), 30);
    const patientsWithoutSessionFor30Days = await app.prisma.paciente.count({
      where: {
        NOT: {
          sessoes: {
            some: {
              data: { gte: thirtyDaysAgo },
              status: "realizada",
            },
          },
        },
      },
    });

    const weeklyMap = recentSessions.reduce<Map<string, number>>((acc, session) => {
      if (!session.data) return acc;
      const weekStart = startOfWeek(session.data, weekConfig).toISOString();
      acc.set(weekStart, (acc.get(weekStart) ?? 0) + 1);
      return acc;
    }, new Map());

    const weeklySessionsData = Array.from({ length: 4 }).map((_, index) => {
      const weekStart = startOfWeek(subWeeks(now, 3 - index), weekConfig);
      const weekKey = weekStart.toISOString();
      const weekEnd = addDays(weekStart, 6);
      return {
        name: `Semana ${index + 1} (${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")})`,
        total: weeklyMap.get(weekKey) ?? 0,
      };
    });

    return reply.send({
      totalSessions,
      totalAbsences,
      todaySessions,
      weeklySessionsData,
      totalReceived,
      totalPending,
      averageSessionValue,
      patientsWithFrequentAbsences,
      newPatientsThisMonth,
      patientsWithoutSessionFor30Days,
    });
  });

  app.get("/analytics/agenda", async (request, reply) => {
    const query = z
      .object({ periodo: z.coerce.number().int().positive().default(30) })
      .parse(request.query);
    const now = new Date();
    const end = addDays(now, query.periodo);
    const agenda = await app.prisma.sessao.findMany({
      where: {
        data: {
          gte: now,
          lte: end,
        },
      },
      orderBy: { data: "asc" },
      include: {
        paciente: { select: { id: true, nome: true } },
        profissional: { select: { id: true, nome: true } },
      },
    });
    return reply.send({ periodo: query.periodo, agenda });
  });

  app.get("/analytics/ocupacao", async (request, reply) => {
    const query = z
      .object({ periodo: z.coerce.number().int().positive().default(30) })
      .parse(request.query);
    const now = new Date();
    const end = addDays(now, query.periodo);
    const total = await app.prisma.sessao.count({
      where: {
        data: {
          gte: now,
          lte: end,
        },
        status: { in: ["agendada", "confirmada"] },
      },
    });
    return reply.send({ periodo: query.periodo, total });
  });

  app.get("/analytics/risco-faltas", async (request, reply) => {
    const query = z
      .object({ periodo: z.coerce.number().int().positive().default(30) })
      .parse(request.query);

    const pacientes = await app.prisma.paciente.findMany({
      select: {
        id: true,
        nome: true,
        totalFaltas: true,
        statusRanqueado: true,
      },
      orderBy: { totalFaltas: "desc" },
      take: 10,
    });

    return reply.send({
      periodo: query.periodo,
      pacientes,
    });
  });

  app.get("/analytics/sentimentos", async (_request, reply) => {
    const resultados = await app.prisma.diarioSentimento.groupBy({
      by: ["sentimento"],
      _count: { _all: true },
    });

    const data = resultados.map((item) => ({
      name: item.sentimento || "Indefinido",
      value: item._count._all,
    }));

    return reply.send(data);
  });

  app.get("/analytics/evolucao-score", async (_request, reply) => {
    const sessoes = await app.prisma.sessao.findMany({
      where: { scoreClinico: { not: null } },
      select: { id: true, data: true, scoreClinico: true },
      orderBy: { data: "asc" },
      take: 20,
    });

    const data = sessoes.map((sessao) => ({
      semana: sessao.data ? format(new Date(sessao.data), "dd/MM") : "",
      score: sessao.scoreClinico ?? 0,
    }));

    return reply.send(data);
  });

  app.get("/analytics/frequencia-faltas", async (_request, reply) => {
    const start = subWeeks(new Date(), 4);
    const sessoes = await app.prisma.sessao.findMany({
      where: { data: { gte: start } },
      select: { data: true, status: true },
    });

    const byWeek = new Map<string, { faltas: number; reagendamentos: number }>();
    for (const sessao of sessoes) {
      if (!sessao.data) continue;
      const weekLabel = `Semana ${format(startOfWeek(sessao.data, { weekStartsOn: 1 }), "dd/MM")}`;
      const bucket =
        byWeek.get(weekLabel) || { faltas: 0, reagendamentos: 0 };
      if (sessao.status === "faltou") {
        bucket.faltas += 1;
      } else if (sessao.status === "cancelada") {
        bucket.reagendamentos += 1;
      }
      byWeek.set(weekLabel, bucket);
    }

    const data = Array.from(byWeek.entries()).map(([semana, valores]) => ({
      semana,
      ...valores,
    }));

    return reply.send(data);
  });

  app.get("/analytics/distribuicao-riscos", async (_request, reply) => {
    const pacientes = await app.prisma.paciente.groupBy({
      by: ["statusRanqueado"],
      _count: { _all: true },
    });

    const data = pacientes.map((item) => ({
      categoria: item.statusRanqueado || "sem_status",
      quantidade: item._count._all,
    }));

    return reply.send(data);
  });

  app.get("/analytics/pacientes-risco", async (_request, reply) => {
    const pacientes = await app.prisma.paciente.findMany({
      select: { id: true, nome: true, statusRanqueado: true, totalFaltas: true },
      orderBy: { totalFaltas: "desc" },
      take: 8,
    });

    const data = pacientes.map((paciente) => ({
      id: paciente.id,
      nome: paciente.nome,
      status_risco: paciente.statusRanqueado ?? "normal",
      score_atual: paciente.totalFaltas ?? 0,
    }));

    return reply.send(data);
  });

  app.get("/analytics/resumo-profissional", async (_request, reply) => {
    const [diarios, sessoes, alertas] = await Promise.all([
      app.prisma.diarioSentimento.findMany({
        orderBy: { dataRegistro: "desc" },
        take: 5,
        include: { paciente: { select: { id: true, nome: true } } },
      }),
      app.prisma.sessao.findMany({
        where: {
          data: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        orderBy: { data: "asc" },
        take: 5,
        include: { paciente: { select: { id: true, nome: true } } },
      }),
      app.prisma.alertaClinico.findMany({
        orderBy: { dataCriacao: "desc" },
        take: 5,
        include: { paciente: { select: { id: true, nome: true } } },
      }),
    ]);

    return reply.send({
      diarios,
      sessoes,
      alertas,
    });
  });
}
