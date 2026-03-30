import React from "react"
import { useQuery } from "@tanstack/react-query"
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
import { useAuthContext } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
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
  const { user } = useAuthContext()

  const { data: profissional } = useQuery({
    queryKey: ["profissional-perfil", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => api.get<{ id: string; nome: string }>(`/profissionais/user/${user!.id}`),
    staleTime: 10 * 60 * 1000,
  })

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
    <div className="min-h-screen bg-white font-manrope lg:max-w-2xl lg:mx-auto">
      <AppHeader variant="professional" name={profissional?.nome ?? ""}>
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
                  <p className="text-xs font-manrope font-semibold uppercase tracking-widest text-neutral-300">
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
                  <p className="text-xs font-manrope font-semibold uppercase tracking-widest text-neutral-300">
                    Sessões esta semana
                  </p>
                  <p className="mt-2 text-4xl font-sora font-bold text-neutral-500">
                    {metrics.sessionsThisWeek}
                  </p>
                </Card>
                <Card
                  variant="default"
                  className="rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md cursor-pointer"
                >
                  <p className="text-xs font-manrope font-semibold uppercase tracking-widest text-neutral-300">
                    Sessões hoje
                  </p>
                  <p className="mt-2 text-4xl font-sora font-bold text-neutral-500">
                    {metrics.sessionsToday}
                  </p>
                </Card>
              </>
            )}
        </div>
      </AppHeader>

      <div className="px-4 pb-28 flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-manrope font-semibold uppercase tracking-widest text-neutral-300">
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
          <h2 className="text-xs font-manrope font-semibold uppercase tracking-widest text-neutral-300">
            Próxima sessão
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
                Nenhuma sessão agendada.
              </p>
            </Card>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-manrope font-semibold uppercase tracking-widest text-neutral-300">
              Pacientes recentes
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-12 rounded-2xl font-manrope font-semibold shadow-ds-sm transition-all duration-200"
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
    </div>
  )
}

export default DashboardPage
