import * as React from "react"

import { cn } from "@/lib/utils"

type BadgeVariant = "primary" | "success" | "warning" | "error" | "neutral"
type BadgeSize = "sm" | "md"

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  children: React.ReactNode
  className?: string
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: "h-6 px-2 text-xs",
  md: "h-7 px-3 text-sm",
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-ds-primary text-white",
  success: "bg-ds-success text-white",
  warning: "bg-ds-warning text-white",
  error: "bg-ds-error text-white",
  neutral: "bg-gray-200 text-gray-700",
}

const dotClasses: Record<BadgeVariant, string> = {
  primary: "bg-white",
  success: "bg-white",
  warning: "bg-white",
  error: "bg-white",
  neutral: "bg-gray-500",
}

const Badge = ({
  variant = "primary",
  size = "md",
  dot = false,
  children,
  className,
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      sizeClasses[size],
      variantClasses[variant],
      className
    )}
  >
    {dot && (
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[variant])} />
    )}
    {children}
  </span>
)

export { Badge }
export type { BadgeProps, BadgeVariant, BadgeSize }
