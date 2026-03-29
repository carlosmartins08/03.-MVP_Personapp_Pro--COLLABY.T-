import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { AppHeader, Badge, Button, Card } from "@/design-system/components"
import { DotGrid } from "@/design-system/decorations"
import { useAuthContext } from "@/contexts/AuthContext"
import { useDailyCall } from "@/hooks/personapp/useDailyCall"
import { createDailyRoom, getDailyToken } from "@/lib/daily"
import { cn } from "@/lib/utils"

type RoomState = "waiting" | "active" | "ending" | "ended"

const statusLabel: Record<RoomState, string> = {
  waiting: "Aguardando",
  active: "Em atendimento",
  ending: "Encerrando",
  ended: "Finalizada",
}

const ConsultationRoomPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuthContext()
  const [roomState, setRoomState] = useState<RoomState>("waiting")
  const [roomUrl, setRoomUrl] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const agendaPath = user?.tipo === "paciente" ? "/app/paciente/agenda" : "/app/profissional/agenda"

  const {
    containerRef,
    isConnected,
    isMuted,
    isCameraOff,
    isSharingScreen,
    participantCount,
    join,
    leave,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
  } = useDailyCall({ roomUrl, token, autoJoin: roomState === "active" })

  useEffect(() => {
    const setupRoom = async () => {
      if (!id || !user?.id) return
      const url = await createDailyRoom(id)
      const nextToken = await getDailyToken(id)
      setRoomUrl(url)
      setToken(nextToken)
    }

    setupRoom()
  }, [id, user?.id])

  const handleStart = async () => {
    setRoomState("active")
    await join()
  }

  const handleEnd = async () => {
    await leave()
    setRoomState("ending")
  }

  return (
    <div className="flex flex-col gap-5 max-w-lg mx-auto px-4 pb-24 font-manrope">
      <div className="-mx-4">
        <AppHeader
          variant="minimal"
          title="Sala de consulta"
          onBack={() => navigate(-1)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-manrope font-semibold uppercase tracking-wide text-neutral-300">
              Consulta #{id ?? "--"}
            </p>
            <h1 className="text-lg font-sora font-semibold text-neutral-500">Atendimento online</h1>
          </div>
          <Badge
            variant={
              roomState === "active"
                ? "success"
                : roomState === "ending"
                  ? "warning"
                  : roomState === "ended"
                    ? "neutral"
                    : "primary"
            }
            size="sm"
          >
            {statusLabel[roomState]}
          </Badge>
        </div>

        {roomState === "waiting" && (
          <Card variant="default" className="p-5 rounded-3xl border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md">
            <p className="text-sm font-manrope text-neutral-400 leading-relaxed">
              {user?.tipo === "paciente"
                ? "Aguardando profissional entrar na sala."
                : "Aguardando paciente entrar na sala."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button className="rounded-2xl font-manrope font-semibold transition-all duration-200" onClick={handleStart}>
                Iniciar chamada
              </Button>
              <Button
                variant="ghost"
                className="rounded-2xl font-manrope font-semibold transition-all duration-200"
                onClick={() => setRoomState("ended")}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {roomState === "active" && (
          <div className="flex flex-col gap-4">
            <Card variant="default" className="relative h-[360px] overflow-hidden bg-ds-surface-dark text-white rounded-3xl shadow-ds-lg">
              <DotGrid
                color="currentColor"
                opacity={0.08}
                cols={8}
                rows={4}
                className="absolute top-2 right-2 pointer-events-none text-white"
              />
              <div ref={containerRef} className="absolute inset-0" />
              {!isConnected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="h-16 w-16 rounded-full bg-white/10" />
                  <p className="text-sm font-manrope text-white/80">Conectando...</p>
                </div>
              )}
              <div className="absolute bottom-3 left-3 rounded-md bg-white/10 px-2 py-1 text-xs font-manrope">
                Participantes: {participantCount}
              </div>
            </Card>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={toggleMute}
                className={cn(
                  "rounded-full h-11 font-manrope font-semibold transition-all duration-200",
                  isMuted && "border border-ds-primary"
                )}
              >
                {isMuted ? "Ativar audio" : "Silenciar"}
              </Button>
              <Button
                variant="ghost"
                onClick={toggleCamera}
                className={cn(
                  "rounded-full h-11 font-manrope font-semibold transition-all duration-200",
                  isCameraOff && "border border-ds-primary"
                )}
              >
                {isCameraOff ? "Ligar camera" : "Desligar camera"}
              </Button>
              <Button
                variant="ghost"
                onClick={toggleScreenShare}
                className={cn(
                  "rounded-full h-11 font-manrope font-semibold transition-all duration-200",
                  isSharingScreen && "border border-ds-primary"
                )}
              >
                {isSharingScreen ? "Parar compartilhamento" : "Compartilhar tela"}
              </Button>
              <Button
                variant="danger"
                className="rounded-full h-11 font-manrope font-semibold transition-all duration-200"
                onClick={handleEnd}
              >
                Encerrar
              </Button>
            </div>
          </div>
        )}

        {roomState === "ending" && (
          <Card variant="default" className="p-5 rounded-3xl border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md">
            <p className="text-sm font-manrope text-neutral-400">Encerrando atendimento...</p>
            <div className="mt-4 flex gap-2">
              <Button className="rounded-2xl font-manrope font-semibold transition-all duration-200" onClick={() => setRoomState("ended")}>
                Finalizar agora
              </Button>
              <Button
                variant="ghost"
                className="rounded-2xl font-manrope font-semibold transition-all duration-200"
                onClick={() => setRoomState("active")}
              >
                Voltar
              </Button>
            </div>
          </Card>
        )}

        {roomState === "ended" && (
          <Card variant="default" className="p-5 rounded-3xl border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md">
            <p className="text-sm font-manrope text-neutral-400 leading-relaxed">
              Consulta encerrada. O registro ficara disponivel no prontuario.
            </p>
            <div className="mt-4 flex gap-2">
              <Button className="rounded-2xl font-manrope font-semibold transition-all duration-200" onClick={() => navigate(agendaPath)}>
                Voltar para agenda
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Card variant="default" className="p-4 rounded-3xl border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md">
        <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">Sala</p>
        <p className="text-sm font-manrope text-neutral-400">{roomUrl ?? "Criando sala..."}</p>
        <p className="mt-2 text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">Token</p>
        <p className="text-sm font-manrope text-neutral-400 break-all">{token ?? "Gerando token..."}</p>
      </Card>
    </div>
  )
}

export default ConsultationRoomPage
