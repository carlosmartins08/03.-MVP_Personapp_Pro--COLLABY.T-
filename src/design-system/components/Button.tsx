import * as React from "react"

import { cn } from "@/lib/utils"

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "sos"
type ButtonSize = "sm" | "md" | "lg" | "full"

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled" | "type" | "onClick"
>

type BaseProps = NativeButtonProps & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  className?: string
}

type NonSosProps = BaseProps & {
  variant?: Exclude<ButtonVariant, "sos">
  disabled?: boolean
}

type SosProps = BaseProps & {
  variant: "sos"
  disabled?: never
}

export type ButtonProps = NonSosProps | SosProps

const baseClasses =
  "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary focus-visible:ring-offset-2"

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-[52px] px-5 text-base",
  full: "h-[52px] w-full px-5 text-base",
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-ds-primary text-white hover:bg-blue-800 active:scale-[0.98]",
  secondary: "border border-ds-primary text-ds-primary hover:bg-ds-primary-light",
  ghost: "text-ds-primary hover:bg-ds-primary-light",
  danger: "bg-ds-error text-white hover:opacity-90",
  sos: "bg-ds-sos text-white cursor-pointer",
}

const nonSosDisabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      type = "button",
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const isSos = variant === "sos"
    const isDisabled = !isSos && (disabled || loading)

    const disabledProps = isSos ? {} : { disabled: isDisabled }

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        aria-busy={loading || undefined}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          !isSos && nonSosDisabledClasses,
          className
        )}
        {...disabledProps}
        {...props}
      >
        {loading && (
          <svg
            className="absolute h-5 w-5 animate-spin text-current"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        )}
        <span className={cn("transition-opacity", loading ? "opacity-0" : "opacity-100")}>
          {children}
        </span>
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
