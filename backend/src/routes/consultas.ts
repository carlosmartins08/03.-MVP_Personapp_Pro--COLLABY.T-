import { FastifyInstance } from "fastify";
import { z } from "zod";

import { env } from "../env";

type DailyRoomResponse = {
  id: string;
  name: string;
  url: string;
};

type DailyTokenResponse = {
  token: string;
};

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const tokenBodySchema = z
  .object({
    userName: z.string().optional(),
    isOwner: z.boolean().optional(),
  })
  .optional();

const buildDailyHeaders = () => {
  if (!env.dailyApiKey) {
    throw new Error("DAILY_API_KEY nao configurada");
  }

  return {
    Authorization: `Bearer ${env.dailyApiKey}`,
    "Content-Type": "application/json",
  };
};

const getRoomName = (consultaId: string) => `consulta-${consultaId}`;

const fetchDailyRoom = async (roomName: string) => {
  const response = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
    headers: buildDailyHeaders(),
  });

  if (!response.ok) {
    throw new Error("Falha ao buscar sala Daily");
  }

  return (await response.json()) as DailyRoomResponse;
};

const createDailyRoom = async (consultaId: string) => {
  const roomName = getRoomName(consultaId);

  const response = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: buildDailyHeaders(),
    body: JSON.stringify({
      name: roomName,
      properties: {
        enable_chat: true,
        enable_knocking: true,
      },
    }),
  });

  if (response.status === 409) {
    return fetchDailyRoom(roomName);
  }

  if (!response.ok) {
    throw new Error("Falha ao criar sala Daily");
  }

  return (await response.json()) as DailyRoomResponse;
};

export async function consultasRoutes(app: FastifyInstance) {
  app.post("/consultas/:id/create-room", async (request, reply) => {
    const { id } = paramsSchema.parse(request.params);

    const sessao = await app.prisma.sessao.findUnique({
      where: { id },
    });

    if (!sessao) {
      return reply.code(404).send({ error: "Sessao nao encontrada" });
    }

    if (sessao.dailyRoomUrl) {
      return reply.send({ roomUrl: sessao.dailyRoomUrl });
    }

    try {
      const dailyRoom = await createDailyRoom(id);
      const updated = await app.prisma.sessao.update({
        where: { id },
        data: { dailyRoomUrl: dailyRoom.url },
      });

      return reply.send({ roomUrl: updated.dailyRoomUrl });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Falha ao criar sala" });
    }
  });

  app.post("/consultas/:id/token", async (request, reply) => {
    const { id } = paramsSchema.parse(request.params);
    const body = tokenBodySchema.parse(request.body ?? {});

    const sessao = await app.prisma.sessao.findUnique({
      where: { id },
    });

    if (!sessao) {
      return reply.code(404).send({ error: "Sessao nao encontrada" });
    }

    let roomUrl = sessao.dailyRoomUrl;

    if (!roomUrl) {
      try {
        const dailyRoom = await createDailyRoom(id);
        const updated = await app.prisma.sessao.update({
          where: { id },
          data: { dailyRoomUrl: dailyRoom.url },
        });
        roomUrl = updated.dailyRoomUrl;
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Falha ao criar sala" });
      }
    }

    if (!roomUrl) {
      return reply.code(500).send({ error: "Sala Daily nao encontrada" });
    }

    const roomName = new URL(roomUrl).pathname.replace("/", "");

    try {
      const response = await fetch("https://api.daily.co/v1/meeting-tokens", {
        method: "POST",
        headers: buildDailyHeaders(),
        body: JSON.stringify({
          properties: {
            room_name: roomName,
            user_name: body?.userName ?? request.user?.sub ?? "Participante",
            is_owner: body?.isOwner ?? false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar token Daily");
      }

      const data = (await response.json()) as DailyTokenResponse;
      return reply.send({ token: data.token });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Falha ao gerar token" });
    }
  });
}
