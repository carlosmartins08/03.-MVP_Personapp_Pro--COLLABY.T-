import { FastifyInstance } from "fastify";
import { z } from "zod";
import argon2 from "argon2";
import crypto from "crypto";
import { sendMail } from "../utils/mailer";

const signupSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8),
  tipo: z.enum(["profissional", "paciente"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

const requestResetSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string().min(10),
  senha: z.string().min(8),
});

const verifySchema = z.object({
  token: z.string().min(10),
});

const preferencesSchema = z.object({
  idiomaPreferido: z.enum(["pt", "en"]),
});

export async function authRoutes(app: FastifyInstance) {
  // Signup
  app.post("/auth/signup", { config: { auth: false } }, async (request, reply) => {
    const { email, senha, tipo } = signupSchema.parse(request.body);

    const existing = await app.prisma.usuario.findUnique({ where: { email } });
    if (existing) {
      return reply.code(409).send({ error: "Email já cadastrado" });
    }

    const senhaHash = await argon2.hash(senha);
    const user = await app.prisma.usuario.create({
      data: { email, senhaHash, tipo },
    });

    // gerar token de verificação
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
    await app.prisma.emailVerificationToken.create({
      data: { userId: user.id, token, expiresAt: expires },
    });

    void sendMail(
      email,
      "Verifique seu email",
      `Seu token: ${token}`,
      `<p>Seu token: <b>${token}</b></p>`
    );

    return reply.send({ ok: true });
  });

  // Login
  app.post("/auth/login", { config: { auth: false } }, async (request, reply) => {
    const { email, senha } = loginSchema.parse(request.body);
    const user = await app.prisma.usuario.findUnique({ where: { email } });
    if (!user) return reply.code(401).send({ error: "Credenciais inválidas" });

    const valid = await argon2.verify(user.senhaHash, senha);
    if (!valid) return reply.code(401).send({ error: "Credenciais inválidas" });

    const accessToken = app.signAccessToken({ sub: user.id, tipo: user.tipo });
    return reply.send({ accessToken, user: { id: user.id, email: user.email, tipo: user.tipo } });
  });

  // Solicitar reset
  app.post("/auth/request-reset", { config: { auth: false } }, async (request, reply) => {
    const { email } = requestResetSchema.parse(request.body);
    const user = await app.prisma.usuario.findUnique({ where: { email } });
    if (!user) return reply.send({ ok: true }); // não revela existência

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    await app.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });
    await app.prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt: expires },
    });

    void sendMail(
      email,
      "Redefinição de senha",
      `Seu token: ${token}`,
      `<p>Seu token: <b>${token}</b></p>`
    );

    return reply.send({ ok: true });
  });

  // Reset
  app.post("/auth/reset", { config: { auth: false } }, async (request, reply) => {
    const { token, senha } = resetSchema.parse(request.body);
    const record = await app.prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.expiresAt < new Date()) {
      return reply.code(400).send({ error: "Token inválido ou expirado" });
    }

    const hash = await argon2.hash(senha);
    await app.prisma.usuario.update({
      where: { id: record.userId },
      data: { senhaHash: hash },
    });
    await app.prisma.passwordResetToken.delete({ where: { token } });

    return reply.send({ ok: true });
  });

  // Verificar e-mail
  app.post("/auth/verify-email", { config: { auth: false } }, async (request, reply) => {
    const { token } = verifySchema.parse(request.body);
    const record = await app.prisma.emailVerificationToken.findUnique({ where: { token } });
    if (!record || record.expiresAt < new Date()) {
      return reply.code(400).send({ error: "Token inválido ou expirado" });
    }

    await app.prisma.usuario.update({
      where: { id: record.userId },
      data: { emailVerificado: true },
    });
    await app.prisma.emailVerificationToken.delete({ where: { token } });
    return reply.send({ ok: true });
  });

  // Me (rota protegida)
  app.get("/me", async (request, reply) => {
    if (!request.user) return reply.code(401).send({ error: "Unauthorized" });
    const user = await app.prisma.usuario.findUnique({
      where: { id: request.user.sub },
      select: { id: true, email: true, tipo: true, emailVerificado: true },
    });
    return reply.send(user);
  });

  app.patch("/me/preferences", async (request, reply) => {
    if (!request.user) return reply.code(401).send({ error: "Unauthorized" });
    const body = preferencesSchema.parse(request.body);

    const updated = await app.prisma.usuario.update({
      where: { id: request.user.sub },
      data: { idiomaPreferido: body.idiomaPreferido },
      select: { id: true, email: true, tipo: true, emailVerificado: true, idiomaPreferido: true },
    });

    return reply.send({
      ok: true,
      user: updated,
    });
  });
}
