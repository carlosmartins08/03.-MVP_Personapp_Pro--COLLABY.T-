import { AlertTriangle, Bell, Calendar, Info, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "@/contexts/AuthContext";
import { AppHeader, EmptyState, Skeleton } from "@/design-system/components";
import {
  type Notificacao,
  useMarcarLida,
  useMarcarTodasLidas,
  useNotificacoes,
} from "@/hooks/useNotificacoes";

const iconeConfig: Record<Notificacao["tipo"], { bg: string; icon: ReactNode }> = {
  info: {
    bg: "bg-ds-primary/10",
    icon: <Info className="w-4 h-4 text-ds-primary" />,
  },
  alerta: {
    bg: "bg-ds-warning/10",
    icon: <AlertTriangle className="w-4 h-4 text-ds-warning" />,
  },
  sessao: {
    bg: "bg-ds-success/10",
    icon: <Calendar className="w-4 h-4 text-ds-success" />,
  },
  sistema: {
    bg: "bg-neutral-100",
    icon: <Settings className="w-4 h-4 text-neutral-300" />,
  },
};

const dataRelativa = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);

  if (min < 1) return "agora";
  if (min < 60) return `há ${min}min`;
  if (h < 24) return `há ${h}h`;
  if (d === 1) return "ontem";
  return `há ${d} dias`;
};

export const Notificacoes = () => {
  const navigate = useNavigate();
  const { user, isLoadingUser } = useAuthContext();

  const { data: notificacoes = [], isLoading } = useNotificacoes({
    enabled: Boolean(user) && !isLoadingUser,
  });

  const marcarLida = useMarcarLida();
  const marcarTodas = useMarcarTodasLidas();

  if (isLoadingUser || !user) {
    return null;
  }

  const naoLidas = notificacoes.filter((notificacao) => !notificacao.lida).length;
  const variant = user.tipo === "profissional" ? "professional" : "patient";
  const backPath =
    user.tipo === "profissional"
      ? "/app/profissional/dashboard"
      : "/app/paciente/dashboard";

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="lg:max-w-3xl lg:mx-auto">
        <AppHeader
          variant={variant}
          title="Notificações"
          onBack={() => navigate(backPath)}
          className="lg:px-8"
          action={
            naoLidas > 0 ? (
              <button
                type="button"
                onClick={() => marcarTodas.mutate()}
                className={
                  variant === "professional"
                    ? "text-xs font-manrope font-semibold text-neutral-300 underline transition-all duration-200 hover:text-neutral-400"
                    : "text-xs font-manrope font-semibold text-white/80 underline transition-all duration-200 hover:text-white"
                }
              >
                Marcar todas como lidas
              </button>
            ) : undefined
          }
        />

        <div className="mt-4 px-4 pb-28 lg:px-8">
        {isLoading && [1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-20 rounded-3xl mb-3" />
        ))}

        {!isLoading && notificacoes.map((notificacao) => (
          <div
            key={notificacao.id}
            onClick={() => {
              if (!notificacao.lida) {
                marcarLida.mutate(notificacao.id);
              }
            }}
            className={`rounded-3xl p-4 mb-3 border shadow-ds-card transition-all duration-200 cursor-pointer hover:shadow-ds-md ${
              notificacao.lida
                ? "bg-white border-neutral-100"
                : "bg-ds-accent-sky/40 border-ds-primary/20"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${iconeConfig[notificacao.tipo].bg}`}
              >
                {iconeConfig[notificacao.tipo].icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm font-sora font-semibold ${
                      notificacao.lida ? "text-neutral-300" : "text-neutral-400"
                    }`}
                  >
                    {notificacao.titulo}
                  </p>
                  {!notificacao.lida && (
                    <div className="w-2 h-2 rounded-full bg-ds-primary shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-xs font-manrope text-neutral-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {notificacao.mensagem}
                </p>
                <p className="text-xs font-manrope text-neutral-200 mt-1.5">
                  {dataRelativa(notificacao.criadoEm)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && notificacoes.length === 0 && (
          <div className="bg-ds-accent-sky/30 rounded-3xl p-6">
            <EmptyState
              icon={<Bell className="w-8 h-8" />}
              title="Nenhuma notificação"
              description="Você está em dia. Novas notificações aparecerão aqui."
            />
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
