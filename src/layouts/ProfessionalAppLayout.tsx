import { Navigate, Outlet } from "react-router-dom"
import { Calendar, Home, Settings, Users } from "lucide-react"

import { useAuthContext } from "@/contexts/AuthContext"
import { BottomNav } from "@/design-system/components"

const professionalTabs = [
  { label: "Início",    path: "/app/profissional/dashboard",  icon: <Home /> },
  { label: "Agenda",    path: "/app/profissional/agenda",      icon: <Calendar /> },
  { label: "Pacientes", path: "/app/profissional/pacientes",   icon: <Users /> },
  { label: "Config",    path: "/app/profissional/configuracoes", icon: <Settings /> },
]

const ProfessionalAppLayout = () => {
  const { user, isLoadingUser } = useAuthContext()

  if (isLoadingUser) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.tipo !== "profissional") return <Navigate to="/app/paciente/dashboard" replace />

  return (
    <div className="flex min-h-[100dvh] flex-col bg-neutral-50 font-roboto">
      <main className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
        <Outlet />
      </main>
      <BottomNav tabs={professionalTabs} />
    </div>
  )
}

export default ProfessionalAppLayout
