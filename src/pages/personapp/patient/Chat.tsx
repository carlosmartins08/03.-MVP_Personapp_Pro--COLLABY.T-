import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "@/contexts/AuthContext";
import { AppHeader, Avatar, Button, EmptyState, Skeleton } from "@/design-system/components";
import { useVinculoPaciente } from "@/hooks/useVinculo";
import { api } from "@/lib/api";

type Mensagem = {
  id: string;
  texto: string;
  lida: boolean;
  criadoEm: string;
  autorId: string;
  autor: {
    id: string;
    email: string;
    tipo: "paciente" | "profissional";
  };
};

type ProfissionalResumo = {
  id: string;
  nome: string;
};

const formatHora = (value: string) => {
  try {
    return new Date(value).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const ChatPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const [texto, setTexto] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: pacienteId } = useQuery({
    queryKey: ["paciente-id", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return null;
      const paciente = await api.get<{ id: string }>(`/pacientes/user/${user.id}`);
      return paciente.id;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: vinculos = [] } = useVinculoPaciente(pacienteId ?? undefined);

  const vinculoAtivo = useMemo(
    () => vinculos.find((vinculo) => vinculo.status === "ATIVO") ?? vinculos[0],
    [vinculos]
  );

  const vinculoId = vinculoAtivo?.id;

  const { data: profissionalVinculado } = useQuery({
    queryKey: ["chat-profissional-vinculado", vinculoAtivo?.profissionalId],
    enabled: Boolean(vinculoAtivo?.profissionalId),
    queryFn: async () => {
      if (!vinculoAtivo?.profissionalId) return null;
      return api.get<ProfissionalResumo>(`/profissionais/${vinculoAtivo.profissionalId}`);
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: mensagens = [], isLoading } = useQuery({
    queryKey: ["chat", vinculoId],
    queryFn: async () => {
      if (!vinculoId) return [];
      return api.get<Mensagem[]>(`/chat/${vinculoId}`);
    },
    enabled: Boolean(vinculoId),
    refetchInterval: 5000,
  });

  const enviarMensagem = useMutation({
    mutationFn: async (conteudo: string) => {
      if (!vinculoId) {
        throw new Error("Vinculo nao encontrado");
      }

      return api.post<Mensagem>(`/chat/${vinculoId}`, { texto: conteudo });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chat", vinculoId] });
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  useEffect(() => {
    if (!vinculoId) return;
    api.patch(`/chat/${vinculoId}/lidas`).catch(() => {});
  }, [vinculoId]);

  const handleEnviar = async () => {
    if (!vinculoId) return;

    const conteudo = texto.trim();
    if (!conteudo) return;

    setTexto("");
    await enviarMensagem.mutateAsync(conteudo);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleEnviar();
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-lg mx-auto font-manrope">
      <div className="flex-shrink-0">
        <AppHeader variant="patient" title="Chat" />
        <div className="bg-white border-b border-neutral-100 px-4 py-3 flex items-center gap-3 shadow-ds-sm">
          <Avatar initials={profissionalVinculado?.nome?.slice(0, 2).toUpperCase() || "PR"} size="sm" />
          <div>
            <p className="text-sm font-manrope font-semibold text-neutral-500">
              {profissionalVinculado?.nome ?? "Profissional"}
            </p>
            <p className="text-xs font-manrope text-neutral-300">Psicologo · Online</p>
          </div>
        </div>
      </div>

      {!vinculoId && (
        <div className="flex-1 flex items-center justify-center bg-neutral-50 px-4">
          <EmptyState
            icon={<MessageCircle className="w-8 h-8" />}
            title="Nenhum profissional vinculado"
            description="Vincule-se a um profissional para iniciar a conversa."
            action={
              <Button variant="primary" onClick={() => navigate("/app/paciente/profissionais")}>
                Encontrar profissional
              </Button>
            }
          />
        </div>
      )}

      {vinculoId && isLoading && (
        <div className="flex-1 flex items-center justify-center bg-neutral-50">
          <Skeleton className="w-full h-20 rounded-3xl mx-4" />
        </div>
      )}

      {vinculoId && !isLoading && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 pb-2 flex flex-col gap-3 bg-neutral-50">
            {mensagens.map((mensagem) => {
              const isPaciente =
                mensagem.autor?.id === user?.id || mensagem.autor?.tipo === "paciente";

              return (
                <div
                  key={mensagem.id}
                  className={`flex ${isPaciente ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[78%]">
                    <div
                      className={[
                        "px-4 py-2.5 text-sm font-manrope leading-relaxed transition-all duration-200",
                        isPaciente
                          ? "bg-ds-primary text-white rounded-3xl rounded-br-sm shadow-ds-sm"
                          : "bg-neutral-100 text-neutral-500 rounded-3xl rounded-bl-sm shadow-ds-sm",
                      ].join(" ")}
                    >
                      {mensagem.texto}
                    </div>
                    <p
                      className={`text-[11px] font-manrope text-neutral-200 mt-1 ${isPaciente ? "text-right" : "text-left"}`}
                    >
                      {formatHora(mensagem.criadoEm)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="flex-shrink-0 bg-white border-t border-neutral-100 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))]">
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={texto}
                onChange={(event) => setTexto(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escreva uma mensagem..."
                className="flex-1 resize-none rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-sm font-manrope text-neutral-500 placeholder:text-neutral-200 focus:outline-none focus:border-ds-primary max-h-28 transition-all duration-200"
              />
              <Button
                variant="primary"
                className="h-10 w-10 rounded-full p-0 flex-shrink-0 transition-all duration-200 shadow-ds-sm hover:shadow-ds-md"
                onClick={() => void handleEnviar()}
                aria-label="Enviar mensagem"
                disabled={!texto.trim() || enviarMensagem.isPending}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;

