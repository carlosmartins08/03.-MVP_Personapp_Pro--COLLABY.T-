import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { Calendar, Home, Settings, Users } from "lucide-react"

import { useAuthContext } from "@/contexts/AuthContext"
import { NotificationBadgeProvider } from "@/contexts/NotificationBadgeContext"
import { BottomNav } from "@/design-system/components"
import { useNotificacoes } from "@/hooks/useNotificacoes"

const professionalTabs = [
  { label: "Início",    path: "/app/profissional/dashboard",  icon: <Home /> },
  { label: "Agenda",    path: "/app/profissional/agenda",      icon: <Calendar /> },
  { label: "Pacientes", path: "/app/profissional/pacientes",   icon: <Users /> },
  { label: "Config",    path: "/app/profissional/configuracoes", icon: <Settings /> },
]

const ProfessionalAppLayout = () => {
  const navigate = useNavigate()
  const { user, isLoadingUser } = useAuthContext()

  const { data: notificacoes = [] } = useNotificacoes({
    enabled: Boolean(user) && !isLoadingUser,
  })

  const naoLidas = notificacoes.filter((notificacao) => !notificacao.lida).length

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
      <div className="flex min-h-[100dvh] flex-col bg-neutral-50 font-roboto">
        <main className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
          <Outlet />
        </main>
        <BottomNav tabs={professionalTabs} />
      </div>
    </NotificationBadgeProvider>
  )
}

export default ProfessionalAppLayout
