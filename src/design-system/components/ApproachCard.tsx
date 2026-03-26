import * as React from "react"

import { cn } from "@/lib/utils"
import { colors } from "../tokens"
import type { ApproachKey } from "../tokens"

type ApproachSize = "sm" | "md"

interface ApproachCardProps {
  approach: ApproachKey
  patientsCount: number
  size?: ApproachSize
  title?: string
  className?: string
}

const labelMap: Record<ApproachKey, string> = {
  psicanalise: "Psicanalise",
  behaviorismo: "Behaviorismo",
  humanismo: "Humanismo",
  cognitivismo: "Cognitivismo",
  psicPositiva: "Psicologia Positiva",
  neuropsicologia: "Neuropsicologia",
  sistemica: "Sistemica",
  transpessoal: "Transpessoal",
}

const sizeClasses: Record<ApproachSize, string> = {
  sm: "p-4",
  md: "p-6",
}

const ApproachCard = ({
  approach,
  patientsCount,
  size = "md",
  title,
  className,
}: ApproachCardProps) => {
  const palette = colors.approach[approach]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: palette.bg, color: palette.text }}
    >
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30"
        style={{ backgroundColor: palette.accent }}
      />

      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
        {title ?? labelMap[approach]}
      </p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-bold" style={{ color: palette.accent }}>
          {patientsCount}
        </span>
        <span className="text-sm font-medium opacity-70">pacientes</span>
      </div>
    </div>
  )
}

export { ApproachCard }
export type { ApproachCardProps, ApproachSize }
