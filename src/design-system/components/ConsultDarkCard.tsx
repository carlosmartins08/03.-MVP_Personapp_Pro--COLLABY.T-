import * as React from "react"

import { cn } from "@/lib/utils"
import { colors } from "../tokens"
import type { ConsultStatus } from "../types"

type ConsultDarkCardProps = {
  status: ConsultStatus
  title: string
  patientName: string
  timeLabel: string
  dateLabel?: string
  onAction?: () => void
  actionLabel?: string
  className?: string
}

type StatusConfig = {
  label: string
  accent: string
  buttonLabel: string
}

const statusConfig: Record<ConsultStatus, StatusConfig> = {
  pending: {
    label: "Pendente",
    accent: colors.semantic.warning,
    buttonLabel: "Confirmar",
  },
  confirmed: {
    label: "Confirmada",
    accent: colors.semantic.success,
    buttonLabel: "Iniciar",
  },
  active: {
    label: "Em andamento",
    accent: colors.primary[400],
    buttonLabel: "Entrar",
  },
  ended: {
    label: "Finalizada",
    accent: colors.neutral[300],
    buttonLabel: "Ver resumo",
  },
}

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "")
  const fullHex = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : normalized
  const intValue = Number.parseInt(fullHex, 16)
  const r = (intValue >> 16) & 255
  const g = (intValue >> 8) & 255
  const b = intValue & 255

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const ConsultDarkCard = ({
  status,
  title,
  patientName,
  timeLabel,
  dateLabel,
  onAction,
  actionLabel,
  className,
}: ConsultDarkCardProps) => {
  const config = statusConfig[status]
  const accentBg = hexToRgba(config.accent, 0.18)

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 text-white shadow-lg",
        className
      )}
      style={{ backgroundColor: colors.surface.dark }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/60">
            {dateLabel ?? "Consulta"}
          </p>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            status === "active" && "animate-pulse"
          )}
          style={{ backgroundColor: accentBg, color: config.accent }}
        >
          {config.label}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">Paciente</p>
          <p className="text-base font-semibold text-white">{patientName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-white/80">Horario</p>
          <p className="text-base font-semibold text-white">{timeLabel}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAction}
        className={cn(
          "mt-5 w-full rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
          status === "active" && "animate-pulse"
        )}
        style={{ backgroundColor: config.accent, color: colors.neutral[0] }}
      >
        {actionLabel ?? config.buttonLabel}
      </button>
    </div>
  )
}

export { ConsultDarkCard }
export type { ConsultDarkCardProps }
