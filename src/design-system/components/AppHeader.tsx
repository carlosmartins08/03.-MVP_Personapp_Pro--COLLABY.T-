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
  children,
  className,
}: AppHeaderProps) => {
  const dateLabel = formatDate(date ?? new Date())
  const showNotifications = variant !== "minimal"
  const hasNotifications = notificationCount > 0

  if (variant === "minimal") {
    return (
      <header className={cn("bg-transparent px-4 pt-4 pb-2", className)}>
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
            <h1 className="text-base font-semibold text-gray-900">{title}</h1>
          )}
        </div>
      </header>
    )
  }

  const isPatient = variant === "patient"

  return (
    <header
      className={cn(
        "relative overflow-hidden px-4 pt-4 pb-5",
        isPatient ? "bg-ds-primary text-white" : "bg-white border-b border-gray-200",
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className={cn("text-base font-semibold", isPatient ? "text-white" : "text-gray-900")}>
            {isPatient ? `Ola, ${name ?? ""} 👋` : `Dr/Dra. ${name ?? ""}`}
          </p>
          <p className={cn("text-sm capitalize", isPatient ? "text-white/80" : "text-gray-500")}>
            {dateLabel}
          </p>
        </div>
        {showNotifications && (
          <button
            type="button"
            onClick={onNotificationsClick}
            aria-label="Notificacoes"
            className={cn(
              "relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary focus-visible:ring-offset-2",
              isPatient
                ? "bg-white/15 text-white hover:bg-white/25"
                : "bg-gray-100 text-ds-primary hover:bg-gray-200"
            )}
          >
            <Bell className="h-4 w-4" />
            {hasNotifications && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-ds-error" />
            )}
          </button>
        )}
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
