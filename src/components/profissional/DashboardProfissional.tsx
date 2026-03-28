import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader, Badge, Card } from '@/design-system/components';
import { CalendarPlus, BellPlus } from 'lucide-react';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { format, parseISO } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthContext } from '@/contexts/AuthContext';

type DashboardProfissionalProps = {
  allowLegacyHeader?: boolean;
};

export default function DashboardProfissional({ allowLegacyHeader = false }: DashboardProfissionalProps) {
  const navigate = useNavigate();
  const { idioma } = useLocalizacao();
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

  const formatStatus = (status?: string | null) => {
    switch (status) {
      case 'realizada':
        return 'Realizada';
      case 'agendada':
        return 'Agendada';
      case 'cancelada':
        return 'Cancelada';
      case 'confirmada':
        return 'Confirmada';
      case 'faltou':
        return 'Faltou';
      default:
        return status ?? '-';
    }
  };

  const statusVariant = (status?: string | null) => {
    switch (status) {
      case 'realizada':
        return 'success';
      case 'agendada':
        return 'info';
      case 'cancelada':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const alertUrgency =
    data?.ultimoAlerta?.nivel_urgencia ?? (data?.ultimoAlerta as { nivelUrgencia?: string } | undefined)?.nivelUrgencia;
  const alertBorderClass =
    alertUrgency === 'alto'
      ? 'border-ds-error'
      : alertUrgency === 'medio'
        ? 'border-ds-warning'
        : alertUrgency
          ? 'border-ds-primary'
          : 'border-transparent';

  const headerName = user?.email ? user.email.split('@')[0] : '';

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {allowLegacyHeader ? (
        <h1 className="text-2xl font-bold">
          {`Bem-vindo${user?.email ? `, ${user.email}` : ''}`} 👨‍⚕️
        </h1>
      ) : (
        <AppHeader variant="professional" name={headerName || user?.email || ''} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="default" className={`p-6 border-l-4 ${alertBorderClass}`}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">Último registro</h3>
            {data?.ultimoDiario?.sentimento && (
              <Badge variant="neutral" size="sm">
                {data.ultimoDiario.sentimento}
              </Badge>
            )}
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : data?.ultimoDiario ? (
            <div>
              <p className="text-sm mb-1 line-clamp-2">{data.ultimoDiario.texto}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(data.ultimoDiario.data_registro)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sem entradas recentes no diário
            </p>
          )}
        </Card>

        <Card variant="default" className="p-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">Última sessão</h3>
            {data?.ultimaSessao?.status && (
              <Badge variant={statusVariant(data.ultimaSessao.status)} size="sm">
                {formatStatus(data.ultimaSessao.status)}
              </Badge>
            )}
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : data?.ultimaSessao ? (
            <div>
              <p className="text-sm font-medium">Status: {formatStatus(data.ultimaSessao.status)}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(data.ultimaSessao.data)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma sessão registrada
            </p>
          )}
        </Card>

        <Card variant="default" className="p-6">
          <h3 className="text-lg font-semibold mb-3">
            Alerta recente
          </h3>
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
              Sem alertas recentes
            </p>
          )}
        </Card>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p className="font-medium">Erro ao carregar dados</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-6">
        <Button onClick={() => navigate('/profissional/sessoes')} className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          Nova sessão
        </Button>
        <Button onClick={() => navigate('/profissional/alertas')} variant="outline" className="gap-2">
          <BellPlus className="h-4 w-4" />
          Novo alerta
        </Button>
        <Button onClick={() => navigate('/profissional/financeiro')} variant="ghost" className="gap-2">
          Financeiro
        </Button>
      </div>
    </div>
  );
}
