import { useState, useMemo } from "react";
import { BookOpen, Plus } from "lucide-react";
import { AppHeader, Badge, Button, EmptyState, Textarea } from "@/design-system/components";
import { usePatientDiary } from "@/hooks/personapp/usePatientDiary";

// altura da barra do mini gráfico por nível de humor (0 = sem registro)
const BARRA_ALTURA: Record<number, string> = {
  0: "h-2",
  1: "h-2",
  2: "h-4",
  3: "h-5",
  4: "h-7",
  5: "h-10",
};

// ── helpers ────────────────────────────────────────────────────────────────
function emojiPorHumor(n: number) {
  return ["😔", "😟", "😐", "🙂", "😊"][n - 1] ?? "😐";
}

function labelPorHumor(n: number) {
  return ["Muito mal", "Ansioso", "Neutro", "Bem", "Ótimo"][n - 1] ?? "Neutro";
}

function variantPorHumor(n: number) {
  if (n <= 2) return "error" as const;
  if (n === 3) return "neutral" as const;
  return "success" as const;
}

function dataFormatada(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

// ── componente ────────────────────────────────────────────────────────────
const DiaryPage = () => {
  const { registros, isLoading, isSaving, salvar } = usePatientDiary();
  const [modoEscrita, setModoEscrita] = useState(false);
  const [humorSelecionado, setHumorSelecionado] = useState(3);
  const [textoRegistro, setTextoRegistro] = useState("");

  const totalRegistros = registros.length;

  const ultimos7Dias = useMemo(() => {
    const hoje = Date.now();
    return Array.from({ length: 7 }, (_, i) => {
      const diaAlvo = new Date(hoje - (6 - i) * 86400000).toISOString().slice(0, 10);
      const reg = registros.find(r => r.dataRegistro.slice(0, 10) === diaAlvo);
      return reg?.humor ?? 0;
    });
  }, [registros]);

  const humorMaisFrequente = useMemo(() => {
    if (registros.length === 0) return "—";
    const contagem: Record<number, number> = {};
    registros.forEach(r => {
      if (r.humor != null) contagem[r.humor] = (contagem[r.humor] ?? 0) + 1;
    });
    const melhor = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0];
    return melhor ? labelPorHumor(Number(melhor[0])) : "—";
  }, [registros]);

  async function handleSalvar() {
    if (!textoRegistro.trim() || isSaving) return;
    await salvar({ texto: textoRegistro.trim(), humor: humorSelecionado });
    setTextoRegistro("");
    setHumorSelecionado(3);
    setModoEscrita(false);
  }

  return (
    <>
      <div className="max-w-lg mx-auto px-4 pb-24 font-roboto">
        <AppHeader
          variant="patient"
          title="Diário"
          action={
            <button
              type="button"
              onClick={() => setModoEscrita(true)}
              className="w-9 h-9 rounded-full bg-ds-primary/10 flex items-center justify-center"
              aria-label="Novo registro"
            >
              <Plus className="w-5 h-5 text-ds-primary" />
            </button>
          }
        />

        {/* Resumo do mês */}
        <div className="bg-ds-surface-dark rounded-2xl p-5 text-white mt-4">
          <p className="text-xs font-medium uppercase tracking-wider opacity-60">
            Este mês
          </p>
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-3xl font-bold">{totalRegistros}</p>
              <p className="text-sm opacity-75">registros</p>
            </div>
            {/* Mini gráfico de humor — 7 últimos dias */}
            <div className="flex items-end gap-1">
              {ultimos7Dias.map((humor, i) => (
                <div
                  key={i}
                  className={`w-3 rounded-full bg-white/30 ${BARRA_ALTURA[humor] ?? "h-2"}`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs opacity-60 mt-3">
            Humor mais frequente:{" "}
            <span className="opacity-100 font-medium">{humorMaisFrequente}</span>
          </p>
        </div>

        {/* Lista de registros */}
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-300 mt-6 mb-3">
          Registros recentes
        </p>

        {isLoading ? (
          <p className="text-sm text-neutral-300 text-center py-8">Carregando registros...</p>
        ) : registros.length > 0 ? (
          registros.map(registro => (
            <div
              key={registro.id}
              className="bg-white rounded-2xl p-4 border border-neutral-100 mb-3 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{emojiPorHumor(registro.humor ?? 3)}</span>
                  <p className="text-xs font-medium text-neutral-300">
                    {dataFormatada(registro.dataRegistro)}
                  </p>
                </div>
                <Badge variant={variantPorHumor(registro.humor ?? 3)}>
                  {labelPorHumor(registro.humor ?? 3)}
                </Badge>
              </div>
              <p className="text-sm text-neutral-400 line-clamp-3">{registro.texto}</p>
              {registro.tags && registro.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {registro.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-ds-primary/10 text-ds-primary px-2 py-0.5 rounded-full"
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
            description="Escrever sobre como você se sente ajuda no seu acompanhamento."
            action={
              <Button variant="primary" onClick={() => setModoEscrita(true)}>
                Fazer primeiro registro
              </Button>
            }
          />
        )}
      </div>

      {/* Modal de novo registro — overlay full-screen */}
      {modoEscrita && (
        <div className="fixed inset-0 bg-ds-surface-dark z-50 flex flex-col p-4 pt-12 font-roboto">
          {/* Header do modal */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => setModoEscrita(false)}
              className="text-white/60 text-sm"
            >
              Cancelar
            </button>
            <h2 className="text-white font-semibold">Novo registro</h2>
            <button
              type="button"
              onClick={handleSalvar}
              disabled={isSaving}
              className="text-ds-primary font-semibold text-sm bg-white px-4 py-1.5 rounded-full disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>

          {/* Seletor de humor */}
          <p className="text-white/60 text-sm mb-3">Como você está se sentindo?</p>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map(nivel => (
              <button
                type="button"
                key={nivel}
                onClick={() => setHumorSelecionado(nivel)}
                className={[
                  "flex-1 flex flex-col items-center py-3 rounded-2xl transition-all",
                  humorSelecionado === nivel ? "bg-white scale-105" : "bg-white/10",
                ].join(" ")}
              >
                <span className="text-2xl">{emojiPorHumor(nivel)}</span>
                <span
                  className={[
                    "text-xs mt-1 font-medium",
                    humorSelecionado === nivel ? "text-neutral-400" : "text-white/60",
                  ].join(" ")}
                >
                  {labelPorHumor(nivel)}
                </span>
              </button>
            ))}
          </div>

          {/* Área de texto */}
          <Textarea
            placeholder="O que está acontecendo com você hoje?"
            rows={8}
            value={textoRegistro}
            onChange={e => setTextoRegistro(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 resize-none flex-1 text-base leading-relaxed"
          />
        </div>
      )}
    </>
  );
};

export default DiaryPage;
