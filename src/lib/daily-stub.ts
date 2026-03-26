export const createDailyRoom = async (consultaId: string) => {
  return `https://daily.stub/${consultaId}`
}

export const getDailyToken = async (roomUrl: string, userId: string) => {
  return `stub-token-${userId}-${roomUrl}`
}
