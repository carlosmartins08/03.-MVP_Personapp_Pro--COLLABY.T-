import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import { DotGrid, ShapeBlob } from "@/design-system/decorations"
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

const moodLabel: Record<MoodLevel, string> = {
  1: "Muito mal",
  2: "Ansioso",
  3: "Neutro",
  4: "Bem",
  5: "Otimo",
}

const moodEmoji: Record<MoodLevel, string> = {
  1: "\u{1F614}",
  2: "\u{1F61F}",
  3: "\u{1F610}",
  4: "\u{1F642}",
  5: "\u{1F60A}",
}

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
        <div className="min-h-[calc(100dvh-64px)] bg-ds-surface-dark flex flex-col font-manrope">
          <div className="relative overflow-hidden px-6 pt-14 pb-8">
            <ShapeBlob
              color="currentColor"
              size={200}
              opacity={0.04}
              className="absolute -top-10 -right-10 pointer-events-none text-white"
            />
            <div className="relative z-10">
              <p className="text-white/50 font-manrope text-sm uppercase tracking-wider">
                Como voce esta?
              </p>
              <h1 className="text-white font-sora font-bold text-3xl mt-1 leading-tight">
                Registro de humor
              </h1>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
            <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-ds-card">
              <MoodFace
                value={value}
                className="min-h-[340px] [&_h2]:hidden [&_[role='radiogroup']]:hidden"
              />
            </div>

            <p className="text-white font-sora font-bold text-2xl mt-6 transition-all duration-200">
              {moodLabel[value]}
            </p>
            <p className="text-white/50 font-manrope text-sm mt-1">Toque para selecionar</p>

            <div className="w-full max-w-md px-2 pt-6">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((nivel) => {
                  const moodLevel = nivel as MoodLevel
                  const selected = value === moodLevel
                  return (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => setValue(moodLevel)}
                      className={`flex-1 flex flex-col items-center py-3 rounded-2xl transition-all duration-200 ${
                        selected ? "bg-white scale-105 shadow-ds-md" : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <span className="text-xl">{moodEmoji[moodLevel]}</span>
                      <span
                        className={`text-xs font-manrope font-medium mt-1 ${
                          selected ? "text-neutral-400" : "text-white/60"
                        }`}
                      >
                        {moodLabel[moodLevel]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="mt-6 w-full max-w-md h-14 rounded-2xl font-manrope font-semibold text-base bg-white text-ds-primary hover:bg-white/90 transition-all duration-200 shadow-ds-md"
            >
              Continuar
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader variant="minimal" />
      <div className="min-h-[calc(100dvh-64px)] bg-ds-surface-dark font-manrope">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 pb-10">
          <div className="flex items-center justify-between pt-6">
            <div className="text-sm font-manrope text-white/70">Passo {step} de 3</div>
            <DotGrid
              color="currentColor"
              opacity={0.08}
              cols={5}
              rows={2}
              className="pointer-events-none text-white"
            />
          </div>

          {step === 2 && (
            <Card
              variant="default"
              className="rounded-3xl p-5 bg-white border border-neutral-100 shadow-ds-card"
            >
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-sora font-bold text-neutral-400">O que contribuiu?</h1>
                <p className="text-sm font-manrope text-neutral-300">Selecione quantos quiser.</p>
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
                        "rounded-full border px-3 py-1 text-sm font-manrope font-medium transition-all duration-200",
                        isActive
                          ? "border-ds-primary bg-ds-accent-sky text-ds-primary shadow-ds-sm"
                          : "border-neutral-100 text-neutral-400 hover:bg-neutral-100"
                      )}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 flex gap-2">
                <Button
                  variant="secondary"
                  className="font-manrope transition-all duration-200"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </Button>
                <Button className="font-manrope transition-all duration-200" onClick={() => setStep(3)}>
                  Continuar
                </Button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <div className="rounded-3xl p-5 bg-white/10 border border-white/20 shadow-ds-card">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-sora font-bold text-white">Quer adicionar uma nota?</h1>
                <p className="text-sm font-manrope text-white/60">Opcional.</p>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="mood-note"
                  className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/60"
                >
                  Escreva livremente
                </label>
                <textarea
                  id="mood-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={5}
                  className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white font-manrope placeholder:text-white/30 text-sm leading-relaxed resize-none outline-none focus:border-white/40 transition-all duration-200"
                  placeholder="Como voce esta se sentindo? (opcional)"
                />
              </div>

              {error && <p className="mt-3 text-sm font-manrope text-ds-error">{error}</p>}

              <div className="mt-6 flex gap-2">
                <Button
                  variant="secondary"
                  className="font-manrope border-white/40 text-white hover:bg-white/10 transition-all duration-200"
                  onClick={() => setStep(2)}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleSubmit}
                  loading={isSaving}
                  disabled={isSaving}
                  className="w-full h-14 rounded-2xl font-manrope font-semibold text-base bg-white text-ds-primary hover:bg-white/90 transition-all duration-200 shadow-ds-md"
                >
                  Registrar humor
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MoodCheckInPage
