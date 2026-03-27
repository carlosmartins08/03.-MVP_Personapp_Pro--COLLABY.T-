import * as React from "react"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { colors } from "../tokens"

interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  action?: React.ReactNode
  className?: string
}

const PageHeader = ({ title, subtitle, backHref, action, className }: PageHeaderProps) => {
  return (
    <header
      className={cn("flex items-center justify-between px-4 border-b h-16 md:h-14", className)}
      style={{
        backgroundColor: colors.surface.card,
        borderBottomColor: colors.neutral[100],
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        {backHref && (
          <a
            href={backHref}
            aria-label="Voltar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--ds-pageheader-focus)]"
            style={
              {
                color: colors.neutral[400],
                "--ds-pageheader-focus": colors.primary[400],
              } as React.CSSProperties
            }
          >
            <ChevronLeft className="h-5 w-5" />
          </a>
        )}
        <div className="min-w-0">
          <h1
            className="truncate text-lg font-semibold"
            style={{ color: colors.neutral[400] }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-sm" style={{ color: colors.neutral[300] }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}

export { PageHeader }
export type { PageHeaderProps }
