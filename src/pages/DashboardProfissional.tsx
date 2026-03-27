import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { AppHeader, Card, Skeleton } from '@/design-system/components';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { api } from '@/lib/api';

type ResumoProfissional = {
  diarios: Array<{
    id: string;
    texto: string;
    sentimento: string | null;
    dataRegistro: string;
    paciente: { id: string; nome: string } | null;
  }>;
  sessoes: Array<{
    id: string;
    data: string | null;
    status: string | null;
    paciente: { id: string; nome: string } | null;
  }>;
  alertas: Array<{
    id: string;
    tipoAlerta: string;
    descricao: string | null;
    nivelUrgencia: string | null;
    dataCriacao: string;
    paciente: { id: string; nome: string } | null;
  }>;
};

interface DashboardProfissionalProps {
  allowLegacyHeader?: boolean;
}

const DashboardProfissional = ({ allowLegacyHeader = false }: DashboardProfissionalProps) => {
  const { idioma, getTexto } = useLocalizacao();
  const locale = idioma === 'en' ? enUS : ptBR;

  const { data, isLoading } = useQuery({
    queryKey: ['resumo-profissional'],
    queryFn: async () => {
      const resumo = await api.get<ResumoProfissional>('/analytics/resumo-profissional');
      return resumo;
    },
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), idioma === 'en' ? 'MMM d, yyyy' : "d 'de' MMM yyyy", {
        locale,
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), idioma === 'en' ? 'MMM d, yyyy HH:mm' : "d 'de' MMM yyyy HH:mm", {
        locale,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {allowLegacyHeader ? (
        <h1 className="text-2xl font-bold">{getTexto('bem_vindo') || 'Bem-vindo'}!</h1>
      ) : (
        <AppHeader variant="professional" name="Profissional" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card variant="default" className="p-6">
          <h3 className="text-lg font-semibold mb-4">{getTexto('diarios_recentes') || 'Ultimos Diarios'}</h3>
          <div className="space-y-4">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))
            ) : data?.diarios?.length === 0 ? (
              <p className="text-muted-foreground">{getTexto('sem_diarios') || 'Nenhum diario disponivel.'}</p>
            ) : (
              data?.diarios?.map((diario) => (
                <div key={diario.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <p className="font-medium">{diario.sentimento || getTexto('sem_sentimento') || 'Sem sentimento'}</p>
                  <p className="text-sm">{diario.texto}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(diario.dataRegistro)}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card variant="default" className="p-6">
          <h3 className="text-lg font-semibold mb-4">{getTexto('proximas_sessoes') || 'Proximas Sessoes'}</h3>
          <div className="space-y-4">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))
            ) : data?.sessoes?.length === 0 ? (
              <p className="text-muted-foreground">
                {getTexto('sem_sessoes') || 'Nenhuma sessao agendada.'}
              </p>
            ) : (
              data?.sessoes?.map((sessao) => (
                <div key={sessao.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <p className="font-medium">
                    {getTexto('status') || 'Status'}: <span className="capitalize">{sessao.status}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(sessao.data)}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card variant="default" className="p-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">{getTexto('alertas_clinicos') || 'Alertas Clinicos'}</h3>
          <div className="space-y-4">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))
            ) : data?.alertas?.length === 0 ? (
              <p className="text-muted-foreground">{getTexto('sem_alertas') || 'Nenhum alerta ativo.'}</p>
            ) : (
              data?.alertas?.map((alerta) => {
                const nivel = alerta.nivelUrgencia;
                const borderColor =
                  nivel === 'alto' ? 'border-red-500' : nivel === 'medio' ? 'border-yellow-500' : 'border-blue-500';
                return (
                  <div key={alerta.id} className={`border-l-4 ${borderColor} pl-3 py-2`}>
                    <p className="font-medium">
                      {alerta.tipoAlerta} - <span className="capitalize">{alerta.nivelUrgencia}</span>
                    </p>
                    <p className="text-sm">{alerta.descricao}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(alerta.dataCriacao)}</p>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardProfissional;
