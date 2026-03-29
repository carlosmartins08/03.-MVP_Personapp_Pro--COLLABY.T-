import { useMemo, useState } from "react"
import { BookOpen, Plus } from "lucide-react"

import { AppHeader, Badge, Button, EmptyState } from "@/design-system/components"
import { DotGrid, ShapeBlob } from "@/design-system/decorations"
import { usePatientDiary } from "@/hooks/personapp/usePatientDiary"

const BARRA_ALTURA: Record<number, string> = {
  0: "h-2",
  1: "h-2",
  2: "h-4",
  3: "h-5",
  4: "h-7",
  5: "h-10",
}

function emojiPorHumor(n: number) {
  return ["\u{1F614}", "\u{1F61F}", "\u{1F610}", "\u{1F642}", "\u{1F60A}"][n - 1] ?? "\u{1F610}"
}

function labelPorHumor(n: number) {
  return ["Muito mal", "Ansioso", "Neutro", "Bem", "Otimo"][n - 1] ?? "Neutro"
}

function variantPorHumor(n: number) {
  if (n <= 2) return "error" as const
  if (n === 3) return "neutral" as const
  return "success" as const
}

function dataFormatada(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

const DiaryPage = () => {
  const { registros, isLoading, isSaving, salvar } = usePatientDiary()
  const [modoEscrita, setModoEscrita] = useState(false)
  const [humorSelecionado, setHumorSelecionado] = useState(3)
  const [textoRegistro, setTextoRegistro] = useState("")

  const totalRegistros = registros.length

  const ultimos7Dias = useMemo(() => {
    const hoje = Date.now()
    return Array.from({ length: 7 }, (_, i) => {
      const diaAlvo = new Date(hoje - (6 - i) * 86400000).toISOString().slice(0, 10)
      const reg = registros.find((r) => r.dataRegistro.slice(0, 10) === diaAlvo)
      return reg?.humor ?? 0
    })
  }, [registros])

  const humorMaisFrequente = useMemo(() => {
    if (registros.length === 0) return "-"
    const contagem: Record<number, number> = {}
    registros.forEach((r) => {
      if (r.humor != null) contagem[r.humor] = (contagem[r.humor] ?? 0) + 1
    })
    const melhor = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0]
    return melhor ? labelPorHumor(Number(melhor[0])) : "-"
  }, [registros])

  async function handleSalvar() {
    if (!textoRegistro.trim() || isSaving) return
    await salvar({ texto: textoRegistro.trim(), humor: humorSelecionado })
    setTextoRegistro("")
    setHumorSelecionado(3)
    setModoEscrita(false)
  }

  return (
    <>
      <div className="max-w-lg mx-auto px-4 pb-24 font-manrope">
        <AppHeader
          variant="patient"
          title="Diario"
          action={
            <button
              type="button"
              onClick={() => setModoEscrita(true)}
              className="w-9 h-9 rounded-full bg-ds-primary/10 flex items-center justify-center transition-all duration-200 hover:bg-ds-primary/20"
              aria-label="Novo registro"
            >
              <Plus className="w-5 h-5 text-ds-primary" />
            </button>
          }
        />

        <div className="relative overflow-hidden bg-ds-surface-dark rounded-3xl p-5 text-white mt-4 shadow-ds-lg">
          <DotGrid
            color="currentColor"
            opacity={0.05}
            cols={6}
            rows={3}
            className="absolute top-2 right-2 pointer-events-none text-white"
          />
          <ShapeBlob
            color="currentColor"
            size={120}
            opacity={0.04}
            className="absolute -bottom-6 -right-6 pointer-events-none text-white"
          />
          <div className="relative z-10">
            <p className="text-xs font-manrope font-medium uppercase tracking-wider text-white/60">
              Este mes
            </p>
            <div className="flex items-end justify-between mt-2">
              <div>
                <p className="text-4xl font-sora font-bold">{totalRegistros}</p>
                <p className="text-white/60 font-manrope text-sm">registros este mes</p>
              </div>
              <div className="flex items-end gap-1">
                {ultimos7Dias.map((humor, i) => (
                  <div
                    key={i}
                    className={`w-3 rounded-full bg-white/30 ${BARRA_ALTURA[humor] ?? "h-2"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-white/60 font-manrope mt-3">
              Humor mais frequente:{" "}
              <span className="text-white font-manrope font-semibold">{humorMaisFrequente}</span>
            </p>
          </div>
        </div>

        <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mt-6 mb-3">
          Registros recentes
        </p>

        {isLoading ? (
          <p className="text-sm font-manrope text-neutral-300 text-center py-8">
            Carregando registros...
          </p>
        ) : registros.length > 0 ? (
          registros.map((registro) => (
            <div
              key={registro.id}
              className="bg-white rounded-3xl p-4 border border-neutral-100 mb-3 shadow-ds-card transition-all duration-200 hover:shadow-ds-md cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{emojiPorHumor(registro.humor ?? 3)}</span>
                  <p className="text-xs font-manrope text-neutral-300">
                    {dataFormatada(registro.dataRegistro)}
                  </p>
                </div>
                <Badge variant={variantPorHumor(registro.humor ?? 3)}>
                  {labelPorHumor(registro.humor ?? 3)}
                </Badge>
              </div>
              <p className="text-sm font-manrope text-neutral-400 leading-relaxed line-clamp-3 mt-1">
                {registro.texto}
              </p>
              {registro.tags && registro.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {registro.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-manrope bg-ds-accent-sky text-ds-primary px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <EmptyState
            icon={<BookOpen className="w-8 h-8" />}
            title="Nenhum registro ainda"
            description="Escrever sobre como voce se sente ajuda no seu acompanhamento."
            action={
              <Button
                variant="primary"
                className="font-manrope transition-all duration-200"
                onClick={() => setModoEscrita(true)}
              >
                Fazer primeiro registro
              </Button>
            }
          />
        )}
      </div>

      {modoEscrita && (
        <div className="fixed inset-0 bg-ds-surface-dark z-50 flex flex-col font-manrope p-4 pt-12">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => setModoEscrita(false)}
              className="text-white/60 font-manrope text-sm transition-colors hover:text-white/90"
            >
              Cancelar
            </button>
            <h2 className="text-white font-sora font-semibold">Novo registro</h2>
            <button
              type="button"
              onClick={handleSalvar}
              disabled={isSaving}
              className="text-ds-primary font-manrope font-semibold text-sm bg-white px-4 py-1.5 rounded-full shadow-ds-sm transition-all duration-200 hover:shadow-ds-md disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>

          <p className="text-white/60 font-manrope text-sm mb-3">Como voce esta se sentindo?</p>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((nivel) => (
              <button
                type="button"
                key={nivel}
                onClick={() => setHumorSelecionado(nivel)}
                className={`flex-1 flex flex-col items-center py-3 rounded-2xl transition-all duration-200 ${
                  humorSelecionado === nivel ? "bg-white scale-105 shadow-ds-md" : "bg-white/10"
                }`}
              >
                <span className="text-2xl">{emojiPorHumor(nivel)}</span>
                <span
                  className={`text-xs font-manrope font-medium mt-1 ${
                    humorSelecionado === nivel ? "text-neutral-400" : "text-white/60"
                  }`}
                >
                  {labelPorHumor(nivel)}
                </span>
              </button>
            ))}
          </div>

          <textarea
            placeholder="O que esta acontecendo com voce hoje?"
            rows={8}
            value={textoRegistro}
            onChange={(e) => setTextoRegistro(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-2xl p-4 text-white font-manrope text-base placeholder:text-white/30 resize-none outline-none leading-relaxed flex-1 focus:border-white/40 transition-all duration-200"
          />
        </div>
      )}
    </>
  )
}

export default DiaryPage
