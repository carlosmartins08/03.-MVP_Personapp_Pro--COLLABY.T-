import fp from "fastify-plugin";
import jwt, { type SignOptions, type Secret } from "jsonwebtoken";
import { env } from "../env";

type TokenPayload = {
  sub: string;
  tipo: "profissional" | "paciente";
};

declare module "fastify" {
  interface FastifyContextConfig {
    auth?: boolean;
  }

  interface FastifyInstance {
    signAccessToken(payload: TokenPayload, expiresIn?: SignOptions["expiresIn"]): string;
    verifyAccessToken<T = TokenPayload>(token: string): T;
  }

  interface FastifyRequest {
    user?: TokenPayload;
  }
}

export default fp(async (app) => {
  app.decorate(
    "signAccessToken",
    (payload: TokenPayload, expiresIn: SignOptions["expiresIn"] = "15m") =>
      jwt.sign(payload, env.jwtSecret as Secret, { expiresIn })
  );

  app.decorate("verifyAccessToken", <T = TokenPayload>(token: string): T =>
    jwt.verify(token, env.jwtSecret) as T
  );

  app.addHook("preHandler", async (request, reply) => {
    const isPublic = request.routeOptions.config?.auth === false;
    if (isPublic) return;

    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      reply.code(401).send({ error: "Unauthorized" });
      return;
    }

    try {
      const token = header.replace("Bearer ", "");
      request.user = app.verifyAccessToken(token);
    } catch {
      reply.code(401).send({ error: "Invalid token" });
    }
  });
});
