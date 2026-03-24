import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { env } from "./env";
import prismaPlugin from "./plugins/prisma";
import authPlugin from "./plugins/auth";
import { registerRoutes } from "./routes/registerRoutes";

const buildApp = async () => {
  const app = fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
  });

  await app.register(prismaPlugin);
  await app.register(authPlugin);
  await registerRoutes(app, {
    filter: (entry) =>
      entry.name !== "analytics" || env.enableAnalyticsRoutes,
  });

  app.get("/health", { config: { auth: false } }, async () => {
    return { status: "ok" };
  });

  return app;
};

const start = async () => {
  let app: FastifyInstance | undefined;
  try {
    app = await buildApp();
    await app.listen({ port: env.port, host: "0.0.0.0" });
    app.log.info(`API running on port ${env.port}`);
  } catch (err) {
    app?.log.error(err);
    process.exit(1);
  }
};

start();
