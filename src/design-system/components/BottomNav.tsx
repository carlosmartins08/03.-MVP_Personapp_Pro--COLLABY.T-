import * as React from "react"
import { Link, useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"

type BottomNavTab = {
  label: string
  path?: string
  icon: React.ReactNode
  onClick?: () => void
}

interface BottomNavProps {
  tabs: BottomNavTab[]
}

const BottomNav = ({ tabs }: BottomNavProps) => {
  const location = useLocation()

  const isActive = (path?: string) =>
    Boolean(path) && (location.pathname === path || location.pathname.startsWith(`${path}/`))

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-neutral-100 pb-[env(safe-area-inset-bottom,0px)] lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const active = isActive(tab.path)
          const content = (
            <>
              <div
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200",
                  active ? "bg-ds-primary scale-110 shadow-ds-sm" : "bg-transparent"
                )}
              >
                {React.cloneElement(tab.icon as React.ReactElement, {
                  className: cn("w-5 h-5", active ? "text-white" : "text-neutral-300"),
                })}
              </div>
              <span
                className={cn(
                  "text-[10px] font-manrope font-medium leading-none",
                  active ? "text-ds-primary" : "text-neutral-300"
                )}
              >
                {tab.label}
              </span>
            </>
          )

          if (tab.onClick && !tab.path) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={tab.onClick}
                className="flex flex-1 flex-col items-center gap-1 py-2 transition-all duration-200"
              >
                {content}
              </button>
            )
          }

          return (
            <Link
              key={tab.label}
              to={tab.path ?? ""}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-2 transition-all duration-200"
            >
              {content}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export { BottomNav }
export type { BottomNavProps, BottomNavTab }
