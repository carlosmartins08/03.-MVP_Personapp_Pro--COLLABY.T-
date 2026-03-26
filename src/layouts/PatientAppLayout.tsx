import { Outlet } from "react-router-dom"
import { BookOpen, CalendarCheck, CreditCard, Home, User } from "lucide-react"

import { BottomNav, SOSButton } from "@/design-system/components"

const patientTabs = [
  { label: "Resumo", path: "/paciente/dashboard", icon: <Home /> },
  { label: "Sessoes", path: "/paciente/sessoes", icon: <CalendarCheck /> },
  { label: "Diario", path: "/paciente/diario", icon: <BookOpen /> },
  { label: "Pagamentos", path: "/paciente/pagamentos", icon: <CreditCard /> },
  { label: "Perfil", path: "/paciente/perfil", icon: <User /> },
]

const PatientAppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1 px-4 py-4 pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
        <Outlet />
      </main>

      <BottomNav tabs={patientTabs} />
      <SOSButton variant="floating" contacts={[]} />
    </div>
  )
}

export { PatientAppLayout }
