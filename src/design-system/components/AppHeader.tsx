import * as React from "react"
import { ArrowLeft, Bell } from "lucide-react"

import { cn } from "@/lib/utils"

type AppHeaderVariant = "patient" | "professional" | "minimal"

interface AppHeaderProps {
  variant?: AppHeaderVariant
  name?: string
  title?: string
  date?: Date
  notificationCount?: number
  onBack?: () => void
  onNotificationsClick?: () => void
  action?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d)

const AppHeader = ({
  variant = "patient",
  name,
  title,
  date,
  notificationCount = 0,
  onBack,
  onNotificationsClick,
  action,
  children,
  className,
}: AppHeaderProps) => {
  const dateLabel = formatDate(date ?? new Date())
  const showNotifications = variant !== "minimal"
  const hasNotifications = notificationCount > 0

  if (variant === "minimal") {
    return (
      <header className={cn("bg-transparent px-4 pt-4 pb-2", className)}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              aria-label="Voltar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ds-primary hover:bg-ds-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            {title && (
              <h1 className="text-base font-semibold text-neutral-500">{title}</h1>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </header>
    )
  }

  const isPatient = variant === "patient"

  return (
    <header
      className={cn(
        "relative overflow-hidden px-4 pt-4 pb-5",
        isPatient ? "bg-ds-primary text-white" : "bg-white border-b border-neutral-100",
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div>
          {title ? (
            <h1 className={cn(
              "text-xl font-bold",
              isPatient ? "text-white" : "text-neutral-500"
            )}>
              {isPatient && name ? `Olá, ${name} 👋` : title}
            </h1>
          ) : (
            <p className={cn(
              isPatient ? "text-2xl font-bold text-white" : "text-base font-semibold text-neutral-500"
            )}>
              {isPatient ? `Olá, ${name ?? ""} 👋` : `Dr/Dra. ${name ?? ""}`}
            </p>
          )}
          <p className={cn("text-sm capitalize", isPatient ? "text-white/70" : "text-neutral-300")}>
            {dateLabel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {action && <div>{action}</div>}
          {showNotifications && !action && (
            <button
              type="button"
              onClick={onNotificationsClick}
              aria-label="Notificações"
              className={cn(
                "relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary focus-visible:ring-offset-2",
                isPatient
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-neutral-100 text-ds-primary hover:bg-neutral-200"
              )}
            >
              <Bell className="h-4 w-4" />
              {hasNotifications && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-ds-error" />
              )}
            </button>
          )}
        </div>
      </div>

      {isPatient && (
        <div
          aria-hidden
          className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10"
        />
      )}
      {children && <div className="relative z-10 mt-4">{children}</div>}
    </header>
  )
}

export { AppHeader }
export type { AppHeaderProps, AppHeaderVariant }
