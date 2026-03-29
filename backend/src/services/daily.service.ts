import { env } from "../env";

const DAILY_API_URL = "https://api.daily.co/v1";
const DAILY_ROOM_DOMAIN = "https://personapp.daily.co";

type DailyCreateRoomResponse = {
  url: string;
};

type DailyTokenResponse = {
  token: string;
};

const dailyHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${env.dailyApiKey}`,
});

const getRoomNameFromUrl = (roomUrl: string) => {
  try {
    const url = new URL(roomUrl);
    return url.pathname.replace(/^\/+/, "");
  } catch {
    return roomUrl.split("/").pop() ?? roomUrl;
  }
};

export const dailyService = {
  async criarSala(sessaoId: string): Promise<string> {
    if (!env.dailyApiKey) {
      return `${DAILY_ROOM_DOMAIN}/stub-${sessaoId}`;
    }

    const roomName = `sessao-${sessaoId}`;
    const roomPayload = {
      name: roomName,
      privacy: "private",
      properties: {
        enable_screenshare: false,
        enable_chat: true,
        max_participants: 2,
        exp: Math.floor(Date.now() / 1000) + 7200,
      },
    };

    const response = await fetch(`${DAILY_API_URL}/rooms`, {
      method: "POST",
      headers: dailyHeaders(),
      body: JSON.stringify(roomPayload),
    });

    if (response.status === 409) {
      const existingRoom = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
        headers: dailyHeaders(),
      });

      if (existingRoom.ok) {
        const data = (await existingRoom.json()) as DailyCreateRoomResponse;
        return data.url;
      }
    }

    if (!response.ok) {
      console.error("Daily.co erro ao criar sala:", await response.text());
      return `${DAILY_ROOM_DOMAIN}/fallback-${sessaoId}`;
    }

    const data = (await response.json()) as DailyCreateRoomResponse;
    return data.url;
  },

  async gerarToken(
    roomUrl: string,
    userId: string,
    isProfissional = false
  ): Promise<string> {
    if (!env.dailyApiKey) {
      return `stub-token-${userId}`;
    }

    const roomName = getRoomNameFromUrl(roomUrl);

    const response = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
      method: "POST",
      headers: dailyHeaders(),
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_id: userId,
          is_owner: isProfissional,
          exp: Math.floor(Date.now() / 1000) + 7200,
        },
      }),
    });

    if (!response.ok) {
      console.error("Daily.co erro ao gerar token:", await response.text());
      return `fallback-token-${userId}`;
    }

    const data = (await response.json()) as DailyTokenResponse;
    return data.token;
  },
};
