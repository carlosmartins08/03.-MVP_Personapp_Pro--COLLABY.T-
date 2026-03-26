import * as React from "react"

import { cn } from "@/lib/utils"

type AvatarSize = "sm" | "md" | "lg" | "xl"

interface AvatarProps {
  size?: AvatarSize
  imageUrl?: string
  initials?: string
  fallbackColor?: string
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-[52px] w-[52px]",
  xl: "h-16 w-16",
}

const Avatar = ({
  size = "md",
  imageUrl,
  initials,
  fallbackColor,
  className,
}: AvatarProps) => {
  if (imageUrl) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-full bg-ds-primary-light",
          sizeClasses[size],
          className
        )}
      >
        <img
          src={imageUrl}
          alt={initials ? `Avatar ${initials}` : "Avatar"}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const fallbackStyle = fallbackColor
    ? { backgroundColor: fallbackColor }
    : undefined

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-ds-primary-light text-ds-primary",
        sizeClasses[size],
        className
      )}
      style={fallbackStyle}
      aria-label={initials ? `Avatar ${initials}` : "Avatar"}
    >
      {initials ?? ""}
    </div>
  )
}

export { Avatar }
export type { AvatarProps, AvatarSize }
