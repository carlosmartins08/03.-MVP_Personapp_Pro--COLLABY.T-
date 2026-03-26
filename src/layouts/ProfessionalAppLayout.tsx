import { Outlet } from "react-router-dom"
import { Calendar, DollarSign, Home, Settings, Users } from "lucide-react"

import { BottomNav } from "@/design-system/components"

const professionalTabs = [
  { label: "Dashboard", path: "/profissional/dashboard", icon: <Home /> },
  { label: "Agenda", path: "/profissional/agenda", icon: <Calendar /> },
  { label: "Pacientes", path: "/profissional/pacientes", icon: <Users /> },
  { label: "Financeiro", path: "/profissional/financeiro", icon: <DollarSign /> },
  { label: "Config", path: "/profissional/configuracoes", icon: <Settings /> },
]

const ProfessionalAppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1 px-4 py-4 pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
        <Outlet />
      </main>

      <BottomNav tabs={professionalTabs} />
    </div>
  )
}

export { ProfessionalAppLayout }
