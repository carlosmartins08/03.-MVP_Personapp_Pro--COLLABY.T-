import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRecentDataSummary } from '@/hooks/useRecentDataSummary';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import DiarioSummaryCard from './DiarioSummaryCard';
import SessaoSummaryCard from './SessaoSummaryCard';
import AlertaSummaryCard from './AlertaSummaryCard';
import { CalendarPlus, BookPlus, AlertCircle, ChevronRight } from 'lucide-react';

const DashboardPacienteMobile = () => {
  const navigate = useNavigate();
  const { getTexto } = useLocalizacao();
  const { user } = useAuthContext();

  const {
    ultimoDiario,
    ultimaSessao,
    ultimoAlerta,
    isLoadingDiario,
    isLoadingSessao,
    isLoadingAlerta,
    formatDate,
    formatTime,
  } = useRecentDataSummary();

  const { data: paciente, isLoading: isLoadingUser } = useQuery({
    queryKey: ['paciente-info', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;
      const data = await api.get<{ nome: string }>(`/pacientes/user/${user.id}`);
      return data;
    },
  });

  const userName = paciente?.nome || '';

  const handleNovoDiario = () => {
    navigate('/paciente/diario');
  };

  const handleNovaSessao = () => {
    navigate('/paciente/sessoes');
    toast({
      title: getTexto('solicitar_sessao') || 'Solicitar Sessao',
      description: getTexto('solicitar_sessao_desc') || 'Entre em contato com seu profissional para agendar',
    });
  };

  const handleNovoAlerta = () => {
    navigate('/paciente/perfil');
    toast({
      title: getTexto('reportar_alerta') || 'Reportar Situacao',
      description: getTexto('reportar_alerta_desc') || 'Informe seu profissional sobre qualquer situacao importante',
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="pt-2 pb-4">
        <h1 className="text-2xl font-bold">
          {isLoadingUser ? (
            <Skeleton className="h-8 w-3/4" />
          ) : (
            <>
              {getTexto('ola') || 'Ola'}, {userName || getTexto('paciente') || 'Paciente'}!
            </>
          )}
        </h1>
        <p className="text-muted-foreground">{getTexto('bem_vindo_dashboard') || 'Bem-vindo ao seu dashboard'}</p>
      </div>

      {(ultimaSessao || isLoadingSessao) && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertTitle>{getTexto('proxima_sessao') || 'Proxima Sessao'}</AlertTitle>
          <AlertDescription>
            {isLoadingSessao ? (
              <Skeleton className="h-4 w-full" />
            ) : ultimaSessao ? (
              <>
                {formatDate(ultimaSessao.data)} {formatTime(ultimaSessao.data)}
              </>
            ) : (
              getTexto('sem_sessoes_agendadas') || 'Sem sessoes agendadas'
            )}
          </AlertDescription>
          <Button
            variant="link"
            size="sm"
            className="text-blue-700 p-0 h-auto"
            onClick={() => navigate('/paciente/sessoes')}
          >
            {getTexto('ver_detalhes') || 'Ver detalhes'} <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DiarioSummaryCard
          diario={ultimoDiario}
          isLoading={isLoadingDiario}
          formatDate={formatDate}
          formatTime={formatTime}
        />

        <AlertaSummaryCard alerta={ultimoAlerta} isLoading={isLoadingAlerta} formatDate={formatDate} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">{getTexto('acoes_rapidas') || 'Acoes Rapidas'}</h2>
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="h-auto py-3 flex flex-col items-center justify-center"
            onClick={handleNovoDiario}
          >
            <BookPlus className="h-5 w-5 mb-1" />
            <span className="text-xs">{getTexto('novo_diario') || 'Novo Diario'}</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-3 flex flex-col items-center justify-center"
            onClick={handleNovaSessao}
          >
            <CalendarPlus className="h-5 w-5 mb-1" />
            <span className="text-xs">{getTexto('nova_sessao') || 'Nova Sessao'}</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-3 flex flex-col items-center justify-center"
            onClick={handleNovoAlerta}
          >
            <AlertCircle className="h-5 w-5 mb-1" />
            <span className="text-xs">{getTexto('reportar') || 'Reportar'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPacienteMobile;
