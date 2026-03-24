
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarPlus, BellPlus } from 'lucide-react';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { format, parseISO } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthContext } from '@/contexts/AuthContext';

export default function DashboardProfissional() {
  const navigate = useNavigate();
  const { getTexto, idioma } = useLocalizacao();
  const { user } = useAuthContext();
  const { data, isLoading, error } = useQuery({
    queryKey: ['resumo-profissional'],
    queryFn: () => api.get<{
      ultimoDiario: DiarioSentimento | null;
      ultimaSessao: Sessao | null;
      ultimoAlerta: AlertaClinico | null;
    }>('/analytics/resumo-profissional'),
  });
  
  const dateLocale = idioma === 'en' ? enUS : ptBR;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 
        idioma === 'en' ? 'MMM d, yyyy' : 'd MMM yyyy', 
        { locale: dateLocale }
      );
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">
        {(getTexto("bem_vindo") || "Bem-vindo") + (user?.email ? `, ${user.email}` : '')} 👨‍⚕️
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {getTexto("ultimo_diario") || "Último Diário"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : data?.ultimoDiario ? (
              <div>
                <p className="text-sm mb-1">{data.ultimoDiario.texto}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(data.ultimoDiario.data_registro)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {getTexto("sem_diarios") || "Sem entradas recentes no diário"}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {getTexto("ultima_sessao") || "Última Sessão"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : data?.ultimaSessao ? (
              <div>
                <p className="text-sm font-medium">
                  {getTexto("status") || "Status"}: {data.ultimaSessao.status}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(data.ultimaSessao.data)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {getTexto("sem_sessoes") || "Nenhuma sessão registrada"}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {getTexto("ultimo_alerta") || "Último Alerta"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : data?.ultimoAlerta ? (
              <div>
                <p className="text-sm font-medium">{data.ultimoAlerta.tipo_alerta}</p>
                <p className="text-sm mb-1">{data.ultimoAlerta.descricao}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(data.ultimoAlerta.data_criacao)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {getTexto("sem_alertas") || "Sem alertas recentes"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p className="font-medium">{getTexto("erro_carregar") || "Erro ao carregar dados"}</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-6">
        <Button onClick={() => navigate('/profissional/sessoes')} className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          {getTexto("nova_sessao") || "Nova Sessão"}
        </Button>
        <Button onClick={() => navigate('/profissional/alertas')} variant="outline" className="gap-2">
          <BellPlus className="h-4 w-4" />
          {getTexto("novo_alerta") || "Novo Alerta"}
        </Button>
        <Button onClick={() => navigate('/profissional/financeiro')} variant="ghost" className="gap-2">
          {getTexto("financeiro") || "Financeiro"}
        </Button>
      </div>
    </div>
  );
}
