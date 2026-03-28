import { Navigate, Outlet } from "react-router-dom"
import { BookOpen, CalendarCheck, Home, MessageCircle, User } from "lucide-react"

import { useAuthContext } from "@/contexts/AuthContext"
import { BottomNav, SOSButton } from "@/design-system/components"

const patientTabs = [
  { label: "Início",  path: "/app/paciente/dashboard",    icon: <Home /> },
  { label: "Agenda",  path: "/app/paciente/agenda",        icon: <CalendarCheck /> },
  { label: "Diário",  path: "/app/paciente/diario",        icon: <BookOpen /> },
  { label: "Chat",    path: "/app/paciente/chat",          icon: <MessageCircle /> },
  { label: "Perfil",  path: "/app/paciente/anamnese",      icon: <User /> },
]

const PatientAppLayout = () => {
  const { user, isLoadingUser } = useAuthContext()

  if (isLoadingUser) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.tipo !== "paciente") return <Navigate to="/app/profissional/dashboard" replace />

  return (
    <div className="flex min-h-[100dvh] flex-col bg-neutral-50 font-roboto">
      <main className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
        <Outlet />
      </main>
      <BottomNav tabs={patientTabs} />
      <SOSButton variant="floating" contacts={[]} />
    </div>
  )
}

export default PatientAppLayout
