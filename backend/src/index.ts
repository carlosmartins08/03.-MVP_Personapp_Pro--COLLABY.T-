import fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./env";
import prismaPlugin from "./plugins/prisma";
import authPlugin from "./plugins/auth";
import { authRoutes } from "./routes/auth";
import { pacientesRoutes } from "./routes/pacientes";
import { sessoesRoutes } from "./routes/sessoes";
import { servicosRoutes } from "./routes/servicos";
import { servicosContratadosRoutes } from "./routes/servicos-contratados";
import { recibosRoutes } from "./routes/recibos";
import { alertasRoutes } from "./routes/alertas";
import { analyticsRoutes } from "./routes/analytics";
import { financeiroRoutes } from "./routes/financeiro";
import { traducoesRoutes } from "./routes/traducoes";

const buildApp = async () => {
  const app = fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
  });

  await app.register(prismaPlugin);
  await app.register(authPlugin);
  await app.register(authRoutes);
  await app.register(pacientesRoutes);
  await app.register(sessoesRoutes);
  await app.register(servicosRoutes);
  await app.register(servicosContratadosRoutes);
  await app.register(recibosRoutes);
  await app.register(alertasRoutes);
  await app.register(analyticsRoutes);
  await app.register(financeiroRoutes);
  await app.register(traducoesRoutes);

  app.get("/health", { config: { auth: false } }, async () => {
    return { status: "ok" };
  });

  return app;
};

const start = async () => {
  try {
    const app = await buildApp();
    await app.listen({ port: env.port, host: "0.0.0.0" });
    app.log.info(`API running on port ${env.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
