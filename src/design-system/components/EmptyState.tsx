import * as React from "react"

import { cn } from "@/lib/utils"
import { colors } from "../tokens"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3 py-12 text-center", className)}
    >
      {icon && (
        <div
          className="flex h-12 w-12 items-center justify-center"
          style={{ color: colors.neutral[200] }}
        >
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium" style={{ color: colors.neutral[400] }}>
        {title}
      </h3>
      {description && (
        <p className="text-sm" style={{ color: colors.neutral[300] }}>
          {description}
        </p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
