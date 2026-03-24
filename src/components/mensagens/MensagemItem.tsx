
import { MessageSquare, Mail, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MensagemProps {
  data_envio: string;
  tipo_mensagem: string;
  meio: "whatsapp" | "email";
  conteudo: string;
  mensagem_entregue: boolean;
}

const MensagemItem = ({ data_envio, tipo_mensagem, meio, conteudo, mensagem_entregue }: MensagemProps) => {
  const getBadgeStyle = (tipo: string) => {
    switch (tipo) {
      case "lembrete":
        return "bg-blue-100 text-blue-800";
      case "cobranca_falta":
        return "bg-red-100 text-red-800";
      case "confirmacao":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-4 mb-3">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {meio === "whatsapp" ? (
            <MessageSquare className="w-5 h-5 text-green-600" />
          ) : (
            <Mail className="w-5 h-5 text-blue-600" />
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">
              {format(new Date(data_envio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </span>
            <Badge 
              variant="secondary" 
              className={getBadgeStyle(tipo_mensagem)}
            >
              {tipo_mensagem.replace("_", " ")}
            </Badge>
            {mensagem_entregue ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                <span className="text-xs">Entregue</span>
              </div>
            ) : (
              <div className="flex items-center text-amber-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-xs">Pendente</span>
              </div>
            )}
          </div>
          <p className="text-sm whitespace-pre-wrap">{conteudo}</p>
        </div>
      </div>
    </Card>
  );
};

export default MensagemItem;
