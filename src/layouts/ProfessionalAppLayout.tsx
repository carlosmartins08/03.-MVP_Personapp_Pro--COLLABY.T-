import React from "react"
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Bell, Calendar, Home, LogOut, Users } from "lucide-react"

import { useAuthContext } from "@/contexts/AuthContext"
import { NotificationBadgeProvider } from "@/contexts/NotificationBadgeContext"
import { BottomNav } from "@/design-system/components"
import { useNotificacoes } from "@/hooks/useNotificacoes"

const ProfessionalAppLayout = () => {
  const navigate = useNavigate()
  const { user, isLoadingUser, signOut } = useAuthContext()

  const professionalTabs = [
    { label: "Início",    path: "/app/profissional/dashboard",   icon: <Home /> },
    { label: "Agenda",    path: "/app/profissional/agenda",       icon: <Calendar /> },
    { label: "Pacientes", path: "/app/profissional/pacientes",    icon: <Users /> },
    { label: "Avisos",    path: "/app/profissional/notificacoes", icon: <Bell /> },
    { label: "Sair",      onClick: () => { signOut(); navigate("/login") }, icon: <LogOut /> },
  ]

  const { data: notificacoes = [] } = useNotificacoes({
    enabled: Boolean(user) && !isLoadingUser,
  })

  const naoLidas = notificacoes.filter((notificacao) => !notificacao.lida).length
  const location = useLocation()

  if (isLoadingUser) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.tipo !== "profissional") return <Navigate to="/app/paciente/dashboard" replace />

  return (
    <NotificationBadgeProvider
      value={{
        notificationCount: naoLidas,
        onNotificationPress: () => navigate("/app/profissional/notificacoes"),
      }}
    >
      <div className="flex min-h-[100dvh] font-manrope bg-white">
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 lg:bg-white lg:border-r lg:border-neutral-100 lg:z-20">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100">
            <div className="w-9 h-9 rounded-xl bg-ds-primary flex items-center justify-center">
              <span className="text-white font-sora font-bold text-sm">P</span>
            </div>
            <span className="font-sora font-semibold text-neutral-400">PersonApp</span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {professionalTabs.map((tab) => {
              const active = tab.path
                ? location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`)
                : false
              const baseClass =
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-manrope text-sm font-medium"
              const stateClass = active
                ? "bg-ds-primary text-white"
                : "text-neutral-300 hover:bg-neutral-50"

              if (tab.onClick && !tab.path) {
                return (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={tab.onClick}
                    className={`${baseClass} ${stateClass} w-full text-left`}
                  >
                    {React.cloneElement(tab.icon as React.ReactElement, {
                      className: "w-5 h-5 shrink-0",
                    })}
                    <span>{tab.label}</span>
                  </button>
                )
              }

              return (
                <Link key={tab.label} to={tab.path ?? ""} className={`${baseClass} ${stateClass}`}>
                  {React.cloneElement(tab.icon as React.ReactElement, {
                    className: "w-5 h-5 shrink-0",
                  })}
                  <span>{tab.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col lg:ml-64">
          <main className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom,0px))] lg:pb-0">
            <Outlet />
          </main>
          <div className="lg:hidden">
            <BottomNav tabs={professionalTabs} />
          </div>
        </div>
      </div>
    </NotificationBadgeProvider>
  )
}

export default ProfessionalAppLayout
