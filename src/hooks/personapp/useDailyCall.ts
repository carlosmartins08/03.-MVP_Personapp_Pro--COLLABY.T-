import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import DailyIframe, { type DailyCall } from "@daily-co/daily-js"

type UseDailyCallOptions = {
  roomUrl?: string | null
  token?: string | null
  autoJoin?: boolean
}

export type DailyCallState = {
  containerRef: RefObject<HTMLDivElement>
  callFrame: DailyCall | null
  isConnected: boolean
  isMuted: boolean
  isCameraOff: boolean
  isSharingScreen: boolean
  participantCount: number
  join: () => Promise<void>
  leave: () => Promise<void>
  toggleMute: () => void
  toggleCamera: () => void
  toggleScreenShare: () => void
}

export const useDailyCall = ({ roomUrl, token, autoJoin = false }: UseDailyCallOptions = {}): DailyCallState => {
  const containerRef = useRef<HTMLDivElement>(null)
  const callFrameRef = useRef<DailyCall | null>(null)

  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isSharingScreen, setIsSharingScreen] = useState(false)
  const [participantCount, setParticipantCount] = useState(1)

  const updateParticipants = useCallback(() => {
    const callFrame = callFrameRef.current
    if (!callFrame) return
    const participants = callFrame.participants()
    setParticipantCount(Object.keys(participants).length)
  }, [])

  const join = useCallback(async () => {
    const callFrame = callFrameRef.current
    if (!callFrame || !roomUrl) return
    await callFrame.join({ url: roomUrl, token: token ?? undefined })
  }, [roomUrl, token])

  const leave = useCallback(async () => {
    const callFrame = callFrameRef.current
    if (!callFrame) return
    await callFrame.leave()
  }, [])

  const toggleMute = useCallback(() => {
    const callFrame = callFrameRef.current
    if (!callFrame) return
    callFrame.setLocalAudio(isMuted)
  }, [isMuted])

  const toggleCamera = useCallback(() => {
    const callFrame = callFrameRef.current
    if (!callFrame) return
    callFrame.setLocalVideo(isCameraOff)
  }, [isCameraOff])

  const toggleScreenShare = useCallback(() => {
    const callFrame = callFrameRef.current
    if (!callFrame) return
    if (isSharingScreen) {
      callFrame.stopScreenShare()
    } else {
      callFrame.startScreenShare()
    }
  }, [isSharingScreen])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!containerRef.current || callFrameRef.current || !roomUrl) return

    const callFrame = DailyIframe.createFrame(containerRef.current, {
      showLeaveButton: false,
      iframeStyle: {
        width: "100%",
        height: "100%",
        border: "0",
        borderRadius: "16px",
      },
    })

    callFrameRef.current = callFrame

    callFrame.on("joined-meeting", () => setIsConnected(true))
    callFrame.on("left-meeting", () => setIsConnected(false))
    callFrame.on("participant-joined", updateParticipants)
    callFrame.on("participant-left", updateParticipants)
    callFrame.on("local-audio-changed", (event) => setIsMuted(!event.audio))
    callFrame.on("local-video-changed", (event) => setIsCameraOff(!event.video))
    callFrame.on("screen-share-started", () => setIsSharingScreen(true))
    callFrame.on("screen-share-stopped", () => setIsSharingScreen(false))

    updateParticipants()

    if (autoJoin) {
      callFrame.join({ url: roomUrl, token: token ?? undefined })
    }

    return () => {
      callFrame.destroy()
      callFrameRef.current = null
    }
  }, [roomUrl, token, autoJoin, updateParticipants])

  return {
    containerRef,
    callFrame: callFrameRef.current,
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
  }
}
