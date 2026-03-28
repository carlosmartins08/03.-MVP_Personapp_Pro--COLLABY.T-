import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Video } from "lucide-react";
import { AppHeader, Avatar, Badge, Button, EmptyState } from "@/design-system/components";
import { useProfessionalDashboard } from "@/hooks/personapp/useProfessionalDashboard";
import { useProfessionalSchedule } from "@/hooks/personapp/useProfessionalSchedule";

const DIAS_ABREV = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "janeiro","fevereiro","março","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro",
];

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function segundaFeira(ref: Date): Date {
  const d = new Date(ref);
  const dia = d.getDay();
  d.setDate(d.getDate() + (dia === 0 ? -6 : 1 - dia));
  d.setHours(0, 0, 0, 0);
  return d;
}

function semanaIniciandoEm(segunda: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(segunda);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

const ScheduleProfessionalPage = () => {
  const navigate = useNavigate();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [semanaBase, setSemanaBase] = useState<Date>(() => segundaFeira(hoje));
  const [diaSelecionado, setDiaSelecionado] = useState<string>(isoDate(hoje));

  const { nextSession, isLoadingNextSession } = useProfessionalDashboard();
  const { sessoes, isLoading: isLoadingSessoes } = useProfessionalSchedule();

  const diasDaSemana = useMemo(() => semanaIniciandoEm(semanaBase), [semanaBase]);

  const isosSessoes = useMemo(
    () => new Set(sessoes.map(s => s.data?.slice(0, 10)).filter(Boolean)),
    [sessoes]
  );

  const sessoesDoDia = useMemo(
    () => sessoes.filter(s => s.data && s.data.slice(0, 10) === diaSelecionado),
    [diaSelecionado, sessoes]
  );

  const diaAtual = diasDaSemana.find(d => isoDate(d) === diaSelecionado) ?? hoje;
  const nomeDia = DIAS_ABREV[diaAtual.getDay()];
  const numeroDia = diaAtual.getDate();
  const mes = MESES[diaAtual.getMonth()];

  return (
    <div className="max-w-lg mx-auto font-roboto pb-24">
      <AppHeader variant="professional" title="Agenda" name="Rafael" />

      <div className="px-4 mt-4">
        {/* Próxima sessão rápida */}
        {!isLoadingNextSession && nextSession && (
          <div className="bg-ds-primary rounded-2xl p-4 text-white mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs opacity-70 uppercase tracking-wider">Próxima sessão</p>
              <p className="font-semibold mt-0.5">{nextSession.patientName}</p>
              <p className="text-xs opacity-80 mt-0.5">{nextSession.timeLabel}</p>
            </div>
            <Button
              variant="ghost"
              className="text-white border border-white/30 rounded-xl px-3 py-1.5 text-xs font-semibold"
              onClick={() => navigate(`/app/profissional/sala/${nextSession.title}`)}
            >
              <Video className="w-3.5 h-3.5 mr-1" />
              Iniciar
            </Button>
          </div>
        )}

        {/* Navegação de semana */}
        <div className="flex items-center justify-between mb-2">
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
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
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
                <span className="text-xs font-medium uppercase">{DIAS_ABREV[dia.getDay()]}</span>
                <span className="text-lg font-bold mt-0.5">{dia.getDate()}</span>
                {isosSessoes.has(iso) && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${selecionado ? "bg-white" : "bg-ds-primary"}`} />
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
        {isLoadingSessoes ? (
          <p className="text-sm text-neutral-300 text-center py-6">Carregando agenda...</p>
        ) : sessoesDoDia.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sessoesDoDia.map(sessao => {
              const horario = sessao.data
                ? new Date(sessao.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                : "--:--";
              return (
                <div key={sessao.id} className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-ds-primary font-bold text-lg">{horario}</span>
                    <Badge variant={sessao.status === "agendada" || sessao.status === "confirmada" ? "info" : sessao.status === "realizada" ? "success" : "error"}>
                      {{ agendada: "Agendada", confirmada: "Confirmada", realizada: "Realizada", cancelada: "Cancelada", faltou: "Faltou" }[sessao.status ?? "agendada"] ?? "Agendada"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar fallback={iniciais(sessao.paciente?.nome ?? "?")} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-neutral-500">{sessao.paciente?.nome ?? "Paciente"}</p>
                        <p className="text-xs text-neutral-300">
                          {sessao.modalidade === "online" ? "📹 Online" : "🏥 Presencial"}{sessao.duracao ? ` · ${sessao.duracao}min` : ""}
                        </p>
                      </div>
                    </div>
                    {sessao.status === "agendada" && (
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/app/profissional/sala/${sessao.id}`)}
                      >
                        Iniciar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma sessão neste dia"
            description="Você não tem sessões agendadas para esta data."
          />
        )}
      </div>
    </div>
  );
};

export default ScheduleProfessionalPage;
