import React from "react"
import { useNavigate } from "react-router-dom"

import {
  AppHeader,
  ApproachCard,
  Avatar,
  Badge,
  Button,
  Card,
  ConsultDarkCard,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonText,
} from "@/design-system/components"
import { useProfessionalDashboard } from "@/hooks/personapp/useProfessionalDashboard"

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const {
    metrics,
    approachCards,
    recentPatients,
    nextSession,
    isLoadingMetrics,
    isLoadingApproaches,
    isLoadingNextSession,
    isLoadingPatients,
  } = useProfessionalDashboard()

  return (
    <div className="flex flex-col gap-6">
      <div className="-mx-4">
        <AppHeader variant="professional" name="Profissional">
          <div className="grid gap-3 px-4 pb-2 md:grid-cols-3">
            {isLoadingMetrics ? (
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={`metric-${index}`} className="h-20" />
              ))
            ) : (
              <>
                <Card variant="default" className="p-4">
                  <p className="text-xs text-gray-500">Total pacientes</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {metrics.totalPatients}
                  </p>
                </Card>
                <Card variant="default" className="p-4">
                  <p className="text-xs text-gray-500">Sessoes esta semana</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {metrics.sessionsThisWeek}
                  </p>
                </Card>
                <Card variant="default" className="p-4">
                  <p className="text-xs text-gray-500">Sessoes hoje</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {metrics.sessionsToday}
                  </p>
                </Card>
              </>
            )}
          </div>
        </AppHeader>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Abordagens</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {isLoadingApproaches
            ? Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={`approach-${index}`} className="h-24 w-48" />
              ))
            : approachCards.map((item) => (
                <ApproachCard
                  key={item.approach}
                  approach={item.approach}
                  patientsCount={item.patientsCount}
                  size="sm"
                  className="min-w-[180px]"
                />
              ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-gray-900">Proxima sessao</h2>
        {isLoadingNextSession ? (
          <SkeletonCard className="h-36" />
        ) : nextSession ? (
          <ConsultDarkCard
            status={nextSession.status}
            title={nextSession.title}
            patientName={nextSession.patientName}
            timeLabel={nextSession.timeLabel}
            dateLabel={nextSession.dateLabel}
            onAction={() => navigate("/app/profissional/agenda")}
          />
        ) : (
          <Card variant="default" className="p-4">
            <p className="text-sm text-gray-600">Nenhuma sessao agendada.</p>
          </Card>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Pacientes recentes</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/app/profissional/pacientes")}> 
            Ver todos
          </Button>
        </div>

        <Card variant="default" className="p-4">
          {isLoadingPatients ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`patient-skeleton-${index}`} className="flex items-center gap-3">
                  <SkeletonAvatar />
                  <div className="flex flex-1 flex-col gap-2">
                    <SkeletonText className="h-4 w-40" />
                    <SkeletonText className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentPatients.length === 0 ? (
            <p className="text-sm text-gray-600">Nenhum paciente encontrado.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center gap-3">
                  <Avatar size="sm" initials={getInitials(patient.nome)} />
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-semibold text-gray-900">{patient.nome}</p>
                    <p className="text-xs text-gray-500">{patient.sessionLabel}</p>
                  </div>
                  <Badge variant={patient.status.variant} size="sm">
                    {patient.status.label}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

export default DashboardPage
