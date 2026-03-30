import * as React from "react";
import { ArrowLeft, Bell } from "lucide-react";

import { useNotificationBadge } from "@/contexts/NotificationBadgeContext";
import { cn } from "@/lib/utils";

type AppHeaderVariant = "patient" | "professional" | "minimal";

interface AppHeaderProps {
  variant?: AppHeaderVariant;
  name?: string;
  title?: string;
  date?: Date;
  notificationCount?: number;
  onBack?: () => void;
  onNotificationsClick?: () => void;
  onNotificationPress?: () => void;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);

const AppHeader = ({
  variant = "patient",
  name,
  title,
  date,
  notificationCount,
  onBack,
  onNotificationsClick,
  onNotificationPress,
  action,
  children,
  className,
}: AppHeaderProps) => {
  const dateLabel = formatDate(date ?? new Date());
  const showNotifications = variant !== "minimal";
  const notificationBadge = useNotificationBadge();

  const resolvedNotificationCount =
    notificationCount ?? notificationBadge?.notificationCount ?? 0;
  const resolvedNotificationPress =
    onNotificationPress
    ?? onNotificationsClick
    ?? notificationBadge?.onNotificationPress;
  const hasNotifications = resolvedNotificationCount > 0;

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
    );
  }

  const isPatient = variant === "patient";

  if (isPatient) {
    return (
      <header className={cn("bg-ds-primary px-4 pt-12 pb-6 lg:pt-8", className)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-sora font-bold text-white leading-tight">
              {title ?? `Olá, ${name ?? "você"} 👋`}
            </h1>
            <p className="text-sm font-manrope text-white/60 mt-1">{dateLabel}</p>
          </div>

          <div className="flex items-start gap-2">
            {action && <div>{action}</div>}
            {showNotifications && !action && (
              <button
                type="button"
                onClick={resolvedNotificationPress}
                aria-label="Notificações"
                className="relative w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mt-1 transition-all duration-200 hover:bg-white/25"
              >
                <Bell className="w-5 h-5 text-white" />
                {hasNotifications && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-ds-error flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">
                      {resolvedNotificationCount > 9 ? "9+" : resolvedNotificationCount}
                    </span>
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
      </header>
    );
  }

  return (
    <header className={cn("bg-white border-b border-neutral-100 px-4 pt-12 pb-4 lg:pt-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-sora font-bold text-neutral-400">
            {title ?? `Olá, Dr. ${name ?? ""}`}
          </h1>
          <p className="text-sm font-manrope text-neutral-300 mt-0.5">{dateLabel}</p>
        </div>

        <div className="flex items-center gap-2">
          {action && <div>{action}</div>}
          {showNotifications && !action && (
            <button
              type="button"
              onClick={resolvedNotificationPress}
                aria-label="Notificações"
              className="relative w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center transition-all duration-200 hover:bg-neutral-200"
            >
              <Bell className="w-5 h-5 text-neutral-400" />
              {hasNotifications && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-ds-error flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">
                    {resolvedNotificationCount > 9 ? "9+" : resolvedNotificationCount}
                  </span>
                </span>
              )}
            </button>
          )}
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
};

export { AppHeader };
export type { AppHeaderProps, AppHeaderVariant };

