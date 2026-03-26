import { api } from "@/lib/api"

type CreateRoomResponse = {
  roomUrl: string
}

type TokenResponse = {
  token: string
}

export const createDailyRoom = async (consultaId: string) => {
  const data = await api.post<CreateRoomResponse>(`/consultas/${consultaId}/create-room`)
  return data.roomUrl
}

export const getDailyToken = async (consultaId: string) => {
  const data = await api.post<TokenResponse>(`/consultas/${consultaId}/token`)
  return data.token
}
