import * as React from "react"
import { Link, useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"

type BottomNavTab = {
  label: string
  path: string
  icon: React.ReactNode
}

interface BottomNavProps {
  tabs: BottomNavTab[]
}

const BottomNav = ({ tabs }: BottomNavProps) => {
  const location = useLocation()

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`)

  const renderIcon = (icon: React.ReactNode, active: boolean) => {
    if (!React.isValidElement(icon)) return icon

    const existingClassName = (icon.props as { className?: string }).className

    return React.cloneElement(icon as React.ReactElement, {
      className: cn("h-5 w-5", existingClassName),
      stroke: "currentColor",
      fill: active ? "currentColor" : "none",
    })
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-gray-200 bg-white">
      <div className="flex h-full items-center justify-around">
        {tabs.map((tab) => {
          const active = isActive(tab.path)

          return (
            <Link
              key={tab.path}
              to={tab.path}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-full flex-1 flex-col items-center justify-center gap-1",
                active ? "text-ds-primary" : "text-gray-500"
              )}
            >
              {renderIcon(tab.icon, active)}
              <span className="text-[11px] font-medium">{tab.label}</span>
              <span
                aria-hidden
                className={cn(
                  "h-[3px] w-4 rounded-full",
                  active ? "bg-ds-primary" : "bg-transparent"
                )}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export { BottomNav }
export type { BottomNavProps, BottomNavTab }
