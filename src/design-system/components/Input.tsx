import * as React from "react"

import { cn } from "@/lib/utils"
import { colors } from "../tokens"

type InputState = "default" | "error" | "success"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: InputState
  status?: InputState
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

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, status, disabled, style, ...props }, ref) => {
    const resolvedState: InputState = status ?? state ?? "default"
    const isDisabled = Boolean(disabled)

    const borderColor = isDisabled
      ? colors.neutral[100]
      : resolvedState === "error"
        ? colors.semantic.error
        : resolvedState === "success"
          ? colors.semantic.success
          : colors.neutral[200]

    const borderFocusColor = isDisabled
      ? borderColor
      : resolvedState === "error"
        ? colors.semantic.error
        : colors.primary[400]

    const backgroundColor = isDisabled
      ? colors.neutral[50]
      : resolvedState === "error"
        ? colors.semantic.errorBg
        : colors.neutral[0]

    const ringColor = isDisabled
      ? "transparent"
      : resolvedState === "error"
        ? hexToRgba(colors.semantic.error, 0.15)
        : hexToRgba(colors.primary[400], 0.18)

    const styleVars = {
      borderColor,
      backgroundColor,
      "--ds-input-border-focus": borderFocusColor,
      "--ds-input-ring": ringColor,
      ...style,
    } as React.CSSProperties

    const ariaInvalid =
      props["aria-invalid"] ?? (resolvedState === "error" ? true : undefined)

    return (
      <input
        {...props}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-md border-[1.5px] px-3 text-base text-slate-900 placeholder:text-slate-400 transition-colors transition-shadow focus-visible:outline-none focus-visible:border-[color:var(--ds-input-border-focus)] focus-visible:shadow-[0_0_0_3px_var(--ds-input-ring)] disabled:cursor-not-allowed disabled:opacity-100 md:h-11",
          className
        )}
        aria-invalid={ariaInvalid}
        disabled={disabled}
        style={styleVars}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
export type { InputProps, InputState }
