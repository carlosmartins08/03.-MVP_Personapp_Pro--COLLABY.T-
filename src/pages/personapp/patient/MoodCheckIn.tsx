import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import type { MoodLevel } from "@/design-system/types"
import { AppHeader, Button, Card, MoodFace } from "@/design-system/components"
import { cn } from "@/lib/utils"
import { useMoodCheckIn } from "@/hooks/personapp/useMoodCheckIn"

const tagOptions = [
  "Trabalho",
  "Familia",
  "Saude",
  "Sono",
  "Relacionamentos",
  "Financeiro",
  "Estudos",
  "Lazer",
  "Terapia",
  "Autocuidado",
]

const MoodCheckInPage = () => {
  const navigate = useNavigate()
  const { saveMood, isSaving } = useMoodCheckIn()

  const [step, setStep] = useState(1)
  const [value, setValue] = useState<MoodLevel>(3)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async () => {
    setError(null)
    try {
      await saveMood({ value, texto: note, tags: selectedTags })
      navigate("/app/paciente/dashboard")
    } catch (err) {
      console.error(err)
      setError("Nao foi possivel salvar agora.")
    }
  }

  if (step === 1) {
    return (
      <>
        <AppHeader variant="minimal" />
        <div className="-mx-4">
          <MoodFace
            value={value}
            onChange={setValue}
            onNext={() => setStep(2)}
            stepCurrent={1}
            stepTotal={3}
            className="min-h-[calc(100dvh-64px)]"
          />
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader variant="minimal" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <div className="text-sm font-medium text-gray-500">
          Passo {step} de 3
        </div>

      {step === 2 && (
        <Card variant="default" className="p-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">O que contribuiu?</h1>
            <p className="text-sm text-gray-500">Selecione quantos quiser.</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tagOptions.map((tag) => {
              const isActive = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                    isActive
                      ? "border-ds-primary bg-ds-primary text-white"
                      : "border-gray-200 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {tag}
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button onClick={() => setStep(3)}>Continuar</Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card variant="default" className="p-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">Quer adicionar uma nota?</h1>
            <p className="text-sm text-gray-500">Opcional.</p>
          </div>

          <div className="mt-4">
            <label htmlFor="mood-note" className="text-sm font-medium text-gray-700">
              Escreva livremente
            </label>
            <textarea
              id="mood-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-ds-primary"
              placeholder="Opcional"
            />
          </div>

          {error && <p className="mt-3 text-sm text-ds-error">{error}</p>}

          <div className="mt-6 flex gap-2">
            <Button variant="secondary" onClick={() => setStep(2)}>
              Voltar
            </Button>
            <Button onClick={handleSubmit} loading={isSaving} disabled={isSaving}>
              Salvar
            </Button>
          </div>
        </Card>
      )}
      </div>
    </>
  )
}

export default MoodCheckInPage
