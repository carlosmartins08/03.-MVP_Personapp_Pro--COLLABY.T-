import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppHeader } from '@/design-system/components';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRecentDataSummary } from '@/hooks/useRecentDataSummary';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import DiarioSummaryCard from './DiarioSummaryCard';
import AlertaSummaryCard from './AlertaSummaryCard';
import { CalendarPlus, BookPlus, AlertCircle, ChevronRight, Search } from 'lucide-react';

type DashboardPacienteMobileProps = {
  allowLegacyHeader?: boolean;
};

const DashboardPacienteMobile = ({ allowLegacyHeader = false }: DashboardPacienteMobileProps) => {
  const navigate = useNavigate();
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
  const headerName = userName || 'Paciente';

  const handleNovoDiario = () => {
    navigate('/paciente/diario');
  };

  const handleNovaSessao = () => {
    navigate('/paciente/sessoes');
    toast({
      title: 'Solicitar sessão',
      description: 'Entre em contato com seu profissional para agendar',
    });
  };

  const handleNovoAlerta = () => {
    navigate('/paciente/perfil');
    toast({
      title: 'Reportar situação',
      description: 'Informe seu profissional sobre qualquer situação importante',
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      {allowLegacyHeader ? (
        <div className="pt-2 pb-4">
          <h1 className="text-2xl font-bold">
            {isLoadingUser ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <>
                Olá, {userName || 'Paciente'}!
              </>
            )}
          </h1>
          <p className="text-muted-foreground">Como você está hoje?</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AppHeader variant="patient" name={headerName} />
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                Como você está hoje?
              </p>
              <button
                className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                aria-label="Ajuda"
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="relative">
              <div className="flex items-center p-4 pl-5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-muted-foreground">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm">Buscar sessões, profissionais...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {(ultimaSessao || isLoadingSessao) && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertTitle>Próxima sessão</AlertTitle>
          <AlertDescription>
            {isLoadingSessao ? (
              <Skeleton className="h-4 w-full" />
            ) : ultimaSessao ? (
              <>
                {formatDate(ultimaSessao.data)} {formatTime(ultimaSessao.data)}
              </>
            ) : (
              'Sem sessões agendadas'
            )}
          </AlertDescription>
          <Button
            variant="link"
            size="sm"
            className="text-blue-700 p-0 h-auto"
            onClick={() => navigate('/paciente/sessoes')}
          >
            Ver detalhes <ChevronRight className="h-3 w-3 ml-1" />
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
        <h2 className="text-lg font-semibold mb-3">Ações rápidas</h2>
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="h-auto py-3 flex flex-col items-center justify-center"
            onClick={handleNovoDiario}
          >
            <BookPlus className="h-5 w-5 mb-1" />
            <span className="text-xs">Novo registro</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-3 flex flex-col items-center justify-center"
            onClick={handleNovaSessao}
          >
            <CalendarPlus className="h-5 w-5 mb-1" />
            <span className="text-xs">Nova sessão</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-3 flex flex-col items-center justify-center"
            onClick={handleNovoAlerta}
          >
            <AlertCircle className="h-5 w-5 mb-1" />
            <span className="text-xs">Reportar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPacienteMobile;
