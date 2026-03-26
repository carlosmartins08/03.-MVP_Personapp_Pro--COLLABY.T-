import React from "react"
import { useNavigate } from "react-router-dom"

import { Badge, Button, Card } from "@/design-system/components"
import { moodMeta, useMoodCheckIn } from "@/hooks/personapp/useMoodCheckIn"

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value))
  } catch {
    return ""
  }
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const { entry } = useMoodCheckIn()

  const moodLabel = entry ? moodMeta[entry.value].label : "Sem registro"
  const dateLabel = entry?.createdAt ? formatDate(entry.createdAt) : ""

  return (
    <div className="flex flex-col gap-4">
      <Card variant="default" className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Humor de hoje</p>
            <p className="text-xl font-semibold text-gray-900">{moodLabel}</p>
            {dateLabel && (
              <p className="text-xs text-gray-400">Registrado em {dateLabel}</p>
            )}
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate("/app/paciente/humor")}
          >
            Registrar
          </Button>
        </div>

        {entry?.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="neutral" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">Sem tags registradas.</p>
        )}

        {entry?.texto ? (
          <p className="mt-3 text-sm text-gray-700">{entry.texto}</p>
        ) : null}
      </Card>
    </div>
  )
}

export default DashboardPage
