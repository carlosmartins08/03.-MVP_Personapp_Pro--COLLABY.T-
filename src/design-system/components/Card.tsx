import * as React from "react"

import { cn } from "@/lib/utils"
import { colors } from "../tokens"

type CardVariant = "default" | "clinical" | "dark" | "alert"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

const baseClasses = "rounded-lg border p-4 shadow-sm"

const variantClasses: Record<CardVariant, string> = {
  default: "",
  clinical: "border-l-4",
  dark: "text-white",
  alert: "",
}

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    backgroundColor: colors.surface.card,
    borderColor: colors.neutral[100],
  },
  clinical: {
    backgroundColor: colors.surface.card,
    borderColor: colors.neutral[100],
    borderLeftColor: colors.primary[400],
  },
  dark: {
    backgroundColor: colors.surface.dark,
    borderColor: colors.surface.dark,
    color: colors.neutral[0],
  },
  alert: {
    backgroundColor: colors.semantic.warningBg,
    borderColor: colors.semantic.warning,
  },
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className, style, ...props }, ref) => {
    const mergedStyle = {
      ...variantStyles[variant],
      ...style,
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        style={mergedStyle}
        {...props}
      />
    )
  }
)

Card.displayName = "Card"

export { Card }
export type { CardProps, CardVariant }
