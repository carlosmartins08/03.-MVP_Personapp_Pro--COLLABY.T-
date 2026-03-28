import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { AppHeader, Avatar, Button } from "@/design-system/components";

interface Mensagem {
  id: string;
  texto: string;
  de: "paciente" | "profissional";
  hora: string;
}

function horaAgora() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const mockMensagens: Mensagem[] = [
  { id: "1", texto: "Olá! Como você está se sentindo hoje?", de: "profissional", hora: "09:00" },
  { id: "2", texto: "Oi Dra. Ana! Estou um pouco ansioso, mas melhor que ontem.", de: "paciente", hora: "09:02" },
  { id: "3", texto: "Fico feliz em saber que melhorou. Lembre-se dos exercícios de respiração que conversamos.", de: "profissional", hora: "09:03" },
  { id: "4", texto: "Sim, tenho feito todos os dias. Estão ajudando bastante!", de: "paciente", hora: "09:05" },
];

const ChatPage = () => {
  const [mensagens, setMensagens] = useState<Mensagem[]>(mockMensagens);
  const [texto, setTexto] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  function enviar() {
    const t = texto.trim();
    if (!t) return;
    setMensagens(prev => [
      ...prev,
      { id: String(Date.now()), texto: t, de: "paciente", hora: horaAgora() },
    ]);
    setTexto("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] max-w-lg mx-auto font-roboto">
      <div className="flex-shrink-0">
        <AppHeader variant="patient" title="Chat" />
        <div className="bg-white border-b border-neutral-100 px-4 py-3 flex items-center gap-3">
          <Avatar fallback="DA" size="sm" />
          <div>
            <p className="text-sm font-semibold text-neutral-500">Dra. Ana Lima</p>
            <p className="text-xs text-neutral-300">Psicóloga · Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-2 flex flex-col gap-3 bg-neutral-50">
        {mensagens.map(msg => {
          const isPaciente = msg.de === "paciente";
          return (
            <div key={msg.id} className={`flex ${isPaciente ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[78%]">
                <div className={[
                  "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  isPaciente
                    ? "bg-ds-primary text-white rounded-br-sm"
                    : "bg-white border border-neutral-100 text-neutral-500 rounded-bl-sm shadow-sm",
                ].join(" ")}>
                  {msg.texto}
                </div>
                <p className={`text-[11px] text-neutral-200 mt-1 ${isPaciente ? "text-right" : "text-left"}`}>
                  {msg.hora}
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
            onChange={e => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva uma mensagem..."
            className="flex-1 resize-none rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-500 placeholder:text-neutral-200 focus:outline-none focus:border-ds-primary max-h-28"
          />
          <Button
            variant="primary"
            className="h-10 w-10 rounded-full p-0 flex-shrink-0"
            onClick={enviar}
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
