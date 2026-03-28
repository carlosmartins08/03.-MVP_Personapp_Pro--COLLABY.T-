import * as React from "react"

import { cn } from "@/lib/utils"
import type { MoodLabel, MoodLevel } from "../types"
import { colors } from "../tokens"

type MoodConfig = {
  label: MoodLabel
  background: string
  face: string
  accent: string
  mouthPath: string
  cheeks?: boolean
}

const moodConfig: Record<MoodLevel, MoodConfig> = {
  1: {
    label: "Muito mal",
    background: colors.moodBackground[1],
    face: colors.semantic.errorBg,
    accent: colors.semantic.error,
    mouthPath: "M48 98 Q70 88 92 98",
  },
  2: {
    label: "Ansioso",
    background: colors.moodBackground[2],
    face: colors.semantic.warningBg,
    accent: colors.semantic.warning,
    mouthPath: "M50 93 Q70 89 90 93",
  },
  3: {
    label: "Neutro",
    background: colors.moodBackground[3],
    face: colors.neutral[100],
    accent: colors.neutral[400],
    mouthPath: "M52 90 Q70 90 88 90",
  },
  4: {
    label: "Bem",
    background: colors.moodBackground[4],
    face: colors.semantic.successBg,
    accent: colors.semantic.success,
    mouthPath: "M48 88 Q70 102 92 88",
    cheeks: true,
  },
  5: {
    label: "Ótimo!",
    background: colors.moodBackground[5],
    face: colors.primary[50],
    accent: colors.primary[400],
    mouthPath: "M44 86 Q70 108 96 86",
    cheeks: true,
  },
}

interface MoodFaceProps {
  value: MoodLevel
  onChange?: (value: MoodLevel) => void
  onNext?: () => void
  showSkip?: boolean
  stepCurrent?: number
  stepTotal?: number
  className?: string
}

const MoodFace = ({
  value,
  onChange,
  onNext,
  showSkip = false,
  stepCurrent,
  stepTotal,
  className,
}: MoodFaceProps) => {
  const current = moodConfig[value]
  const levels = (Object.keys(moodConfig) as unknown as MoodLevel[]).map(
    (level) => ({
      value: level,
      ...moodConfig[level],
    })
  )

  return (
    <section
      className={cn(
        "w-full transition-colors duration-300",
        className
      )}
      style={{ backgroundColor: current.background }}
    >
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-6">
        {stepCurrent && stepTotal && (
          <div className="w-full text-right text-xs font-medium text-white/70">
            Passo {stepCurrent} de {stepTotal}
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <svg
            width={140}
            height={140}
            viewBox="0 0 140 140"
            className="transition-colors duration-300"
            role="img"
            aria-label={`Humor: ${current.label}`}
          >
            <circle cx="70" cy="70" r="52" fill={current.face} />
            <circle cx="52" cy="60" r="5" fill={current.accent} />
            <circle cx="88" cy="60" r="5" fill={current.accent} />
            {current.cheeks && (
              <>
                <circle cx="48" cy="78" r="6" fill={current.accent} opacity={0.25} />
                <circle cx="92" cy="78" r="6" fill={current.accent} opacity={0.25} />
              </>
            )}
            <path
              d={current.mouthPath}
              stroke={current.accent}
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-300"
            />
          </svg>
          <h2 className="text-lg font-semibold text-white">{current.label}</h2>
        </div>

        <div
          className="flex w-full gap-2 overflow-x-auto pb-1"
          role="radiogroup"
          aria-label="Nivel de humor"
        >
          {levels.map((level) => {
            const isActive = level.value === value
            return (
              <button
                key={level.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => onChange?.(level.value)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                  isActive
                    ? "border-transparent text-white"
                    : "border-white/20 text-white/80"
                )}
                style={
                  isActive
                    ? { backgroundColor: current.accent }
                    : { backgroundColor: "transparent" }
                }
              >
                {level.label}
              </button>
            )
          })}
        </div>

        {onNext && (
          <div className="flex w-full flex-col items-center gap-2">
            <button
              type="button"
              onClick={onNext}
              className="h-11 w-full rounded-lg text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: current.accent }}
            >
              Continuar
            </button>
            {showSkip && (
              <button
                type="button"
                onClick={onNext}
                className="text-xs font-medium text-white/70 hover:text-white"
              >
                Pular
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export { MoodFace }
export type { MoodFaceProps }
