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
            <h1
              className={cn(
                isPatient
                  ? "text-2xl font-bold font-sora text-white leading-tight"
                  : "text-xl font-bold text-neutral-500"
              )}
            >
              {isPatient && name ? `Ol\u00E1, ${name} \u{1F44B}` : title}
            </h1>
          ) : (
            <p
              className={cn(
                isPatient
                  ? "text-2xl font-bold font-sora text-white leading-tight"
                  : "text-base font-semibold text-neutral-500"
              )}
            >
              {isPatient ? `Ol\u00E1, ${name ?? ""} \u{1F44B}` : `Dr/Dra. ${name ?? ""}`}
            </p>
          )}
          <p
            className={cn(
              isPatient
                ? "text-sm font-manrope text-white/70 mt-0.5"
                : "text-sm capitalize text-neutral-300"
            )}
          >
            {dateLabel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {action && <div>{action}</div>}
          {showNotifications && !action && (
            <button
              type="button"
              onClick={resolvedNotificationPress}
              aria-label="Notifica\u00E7\u00F5es"
              className={cn(
                "relative w-9 h-9 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary focus-visible:ring-offset-2",
                isPatient ? "bg-white/20" : "bg-neutral-100"
              )}
            >
              <Bell className={cn("w-5 h-5", isPatient ? "text-white" : "text-neutral-400")} />
              {hasNotifications && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-ds-error flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold leading-none">
                    {resolvedNotificationCount > 9 ? "9+" : resolvedNotificationCount}
                  </span>
                </span>
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
  );
};

export { AppHeader };
export type { AppHeaderProps, AppHeaderVariant };

