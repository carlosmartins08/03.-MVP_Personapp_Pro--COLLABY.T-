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
  SkeletonAvatar,
  SkeletonCard,
  SkeletonText,
} from "@/design-system/components"
import { DotGrid, ShapeBlob } from "@/design-system/decorations"
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
    <div className="flex flex-col gap-6 max-w-lg mx-auto px-4 pb-24 font-manrope">
      <div className="-mx-4">
        <AppHeader variant="professional" name="Rafael Souza">
          <div className="grid gap-3 px-4 pb-2 md:grid-cols-3">
            {isLoadingMetrics ? (
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={`metric-${index}`} className="h-24 rounded-3xl" />
              ))
            ) : (
              <>
                <Card
                  variant="default"
                  className="rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md cursor-pointer"
                >
                  <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
                    Total pacientes
                  </p>
                  <p className="mt-2 text-4xl font-sora font-bold text-neutral-500">
                    {metrics.totalPatients}
                  </p>
                </Card>
                <Card
                  variant="default"
                  className="rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md cursor-pointer"
                >
                  <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
                    Sessoes esta semana
                  </p>
                  <p className="mt-2 text-4xl font-sora font-bold text-neutral-500">
                    {metrics.sessionsThisWeek}
                  </p>
                </Card>
                <Card
                  variant="default"
                  className="rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md cursor-pointer"
                >
                  <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
                    Sessoes hoje
                  </p>
                  <p className="mt-2 text-4xl font-sora font-bold text-neutral-500">
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
          <h2 className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
            Abordagens
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {isLoadingApproaches
            ? Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={`approach-${index}`} className="h-24 w-48 rounded-3xl" />
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
        <h2 className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
          Proxima sessao
        </h2>
        {isLoadingNextSession ? (
          <SkeletonCard className="h-36 rounded-3xl" />
        ) : nextSession ? (
          <div className="relative overflow-hidden bg-ds-primary rounded-3xl shadow-ds-lg">
            <ShapeBlob
              color="currentColor"
              size={150}
              opacity={0.06}
              className="absolute -top-8 -right-8 z-20 pointer-events-none text-white"
            />
            <DotGrid
              color="currentColor"
              opacity={0.08}
              cols={6}
              rows={3}
              className="absolute bottom-2 right-3 z-20 pointer-events-none text-white"
            />
            <ConsultDarkCard
              status={nextSession.status}
              title={nextSession.title}
              patientName={nextSession.patientName}
              timeLabel={nextSession.timeLabel}
              dateLabel={nextSession.dateLabel}
              onAction={() => navigate("/app/profissional/agenda")}
              className="relative z-10 rounded-3xl shadow-none"
            />
          </div>
        ) : (
          <Card
            variant="default"
            className="rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md cursor-pointer"
          >
            <p className="text-sm font-manrope text-neutral-400 leading-relaxed">
              Nenhuma sessao agendada.
            </p>
          </Card>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
            Pacientes recentes
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-2xl h-11 font-manrope font-medium transition-all duration-200"
            onClick={() => navigate("/app/profissional/pacientes")}
          >
            Ver todos
          </Button>
        </div>

        <Card
          variant="default"
          className="rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md cursor-pointer"
        >
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
            <p className="text-sm font-manrope text-neutral-400 leading-relaxed">
              Nenhum paciente encontrado.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center gap-3">
                  <Avatar size="sm" initials={getInitials(patient.nome)} />
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-manrope font-semibold text-neutral-500">{patient.nome}</p>
                    <p className="text-xs font-manrope text-neutral-300">{patient.sessionLabel}</p>
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
