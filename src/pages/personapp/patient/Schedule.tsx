import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AppHeader, Avatar, Badge, Button, EmptyState } from "@/design-system/components";
import { usePatientSchedule, type SessaoComRelacoes } from "@/hooks/personapp/usePatientSchedule";

// ── tipos ──────────────────────────────────────────────────────────────────
type Sessao = SessaoComRelacoes;

// ── helpers ────────────────────────────────────────────────────────────────
const DIAS_ABREV = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "janeiro","fevereiro","março","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro",
];

function iniciais(nome?: string) {
  if (!nome) return "?";
  return nome.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function isHoje(iso: string) {
  return iso === isoDate(new Date());
}

function semanaIniciandoEm(segunda: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(segunda);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function segundaFeira(ref: Date): Date {
  const d = new Date(ref);
  const dia = d.getDay();
  const diff = dia === 0 ? -6 : 1 - dia;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ── componente ────────────────────────────────────────────────────────────
const SchedulePage = () => {
  const navigate = useNavigate();
  const { sessoes, isLoading } = usePatientSchedule();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [semanaBase, setSemanaBase] = useState<Date>(() => segundaFeira(hoje));
  const [diaSelecionado, setDiaSelecionado] = useState<string>(isoDate(hoje));

  const diasDaSemana = useMemo(() => semanaIniciandoEm(semanaBase), [semanaBase]);

  const sessoesDoDia = useMemo(
    () => sessoes.filter(s => s.data && s.data.slice(0, 10) === diaSelecionado),
    [diaSelecionado, sessoes]
  );

  const isosSessoes = useMemo(
    () => new Set(sessoes.map(s => s.data?.slice(0, 10)).filter(Boolean)),
    [sessoes]
  );

  const diaAtual = diasDaSemana.find(d => isoDate(d) === diaSelecionado) ?? hoje;
  const nomeDia = DIAS_ABREV[diaAtual.getDay()];
  const numeroDia = diaAtual.getDate();
  const mes = MESES[diaAtual.getMonth()];

  function badgeVariant(status: Sessao["status"]) {
    if (status === "agendada" || status === "confirmada") return "info" as const;
    if (status === "realizada") return "success" as const;
    return "error" as const;
  }

  const statusLabel: Record<string, string> = {
    agendada: "Agendada",
    confirmada: "Confirmada",
    realizada: "Realizada",
    cancelada: "Cancelada",
    faltou: "Faltou",
  };

  if (isLoading) return (
    <div className="max-w-lg mx-auto px-4 pb-24 font-roboto">
      <AppHeader variant="patient" title="Agenda" />
      <div className="mt-8 text-center text-neutral-300 text-sm">Carregando agenda...</div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 font-roboto">
      <AppHeader variant="patient" title="Agenda" />

      {/* Navegação de semana */}
      <div className="flex items-center justify-between mt-4 mb-1">
        <button
          type="button"
          onClick={() => {
            const prev = new Date(semanaBase);
            prev.setDate(prev.getDate() - 7);
            setSemanaBase(prev);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400"
          aria-label="Semana anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-neutral-400 capitalize">
          {MESES[semanaBase.getMonth()]} {semanaBase.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => {
            const next = new Date(semanaBase);
            next.setDate(next.getDate() + 7);
            setSemanaBase(next);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400"
          aria-label="Próxima semana"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Strip de dias */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 mt-2">
        {diasDaSemana.map(dia => {
          const iso = isoDate(dia);
          const selecionado = diaSelecionado === iso;
          const ehHoje = iso === isoDate(hoje);
          return (
            <button
              type="button"
              key={iso}
              onClick={() => setDiaSelecionado(iso)}
              className={[
                "flex flex-col items-center min-w-[48px] rounded-2xl py-3 px-2 transition-colors",
                selecionado
                  ? "bg-ds-primary text-white"
                  : ehHoje
                  ? "bg-ds-primary/10 text-ds-primary"
                  : "bg-neutral-50 text-neutral-400",
              ].join(" ")}
            >
              <span className="text-xs font-medium uppercase">
                {DIAS_ABREV[dia.getDay()]}
              </span>
              <span className="text-lg font-bold mt-0.5">{dia.getDate()}</span>
              {isosSessoes.has(iso) && (
                <div
                  className={[
                    "w-1.5 h-1.5 rounded-full mt-1",
                    selecionado ? "bg-white" : "bg-ds-primary",
                  ].join(" ")}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Título do dia */}
      <p className="text-sm font-medium text-neutral-300 mt-6 mb-3 capitalize">
        {nomeDia}, {numeroDia} de {mes}
      </p>

      {/* Sessões do dia */}
      {sessoesDoDia.length > 0 ? (
        <div className="flex flex-col gap-3">
          {sessoesDoDia.map(sessao => {
            const horario = sessao.data
              ? new Date(sessao.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
              : "--:--";
            return (
              <div
                key={sessao.id}
                className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-ds-primary font-bold text-lg">{horario}</span>
                  <Badge variant={badgeVariant(sessao.status)}>
                    {statusLabel[sessao.status ?? "agendada"] ?? "Agendada"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={sessao.profissional?.avatarUrl ?? undefined}
                    fallback={iniciais(sessao.profissional?.nome)}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-400">
                      {sessao.profissional?.nome ?? "Profissional"}
                    </p>
                    <p className="text-xs text-neutral-300">
                      {sessao.modalidade === "online" ? "📹 Online" : "🏥 Presencial"}
                      {sessao.duracao && ` · ${sessao.duracao}min`}
                    </p>
                  </div>
                </div>
                {sessao.status === "agendada" && isHoje(diaSelecionado) && (
                  <Button
                    variant="primary"
                    className="w-full mt-3"
                    onClick={() => navigate(`/app/profissional/sala/${sessao.id}`)}
                  >
                    Entrar na sessão
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Calendar className="w-8 h-8" />}
          title="Nenhuma sessão neste dia"
          description="Você não tem sessões agendadas para esta data."
          action={
            <Button
              variant="secondary"
              onClick={() => navigate("/app/paciente/profissionais")}
            >
              Agendar sessão
            </Button>
          }
        />
      )}

      {/* FAB agendar */}
      <button
        type="button"
        onClick={() => navigate("/app/paciente/profissionais")}
        className="fixed bottom-20 right-4 z-10 bg-ds-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label="Agendar nova sessão"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SchedulePage;
